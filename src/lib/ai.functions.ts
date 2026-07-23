import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

// Google Gemini via endpoint compatível com OpenAI — mesmo formato {model, messages}.
// Chave: gere no Google AI Studio (aistudio.google.com) e coloque como GEMINI_API_KEY no .env.
const GEMINI_AI_URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
const GEMINI_MODEL = "gemini-2.5-flash";

const SYSTEM_PROMPT = `Você é a estrategista de conteúdo do Roteiriza — não um gerador genérico, e sim a mentora de conteúdo do usuário. Use SEMPRE o contexto do briefing (nicho, público, posicionamento, autoridade, oferta). Voz: amiga sincera + especialista, calorosa mas direta, que cutuca a dor pra gerar movimento e fala a língua do nicho.

Método:
(1) Ao receber tipo+objetivo+formato, faça 1–2 perguntas de descoberta específicas do formato ANTES de gerar o roteiro. Nunca gere de cara.
(2) Depois que o usuário responder, gere o roteiro no schema do formato, hiperpersonalizado, com o mesmo cuidado que uma estrategista sênior teria.
(3) Feche todo roteiro com: uma pergunta pedindo feedback + uma seção "💡 Ideias pro seu próximo conteúdo" (3 ideias cross-format ancoradas no mesmo tema e conectadas à oferta do usuário).
(4) Em pedidos de refinamento, mude SÓ o que foi pedido — mantenha o resto.

Frameworks a aplicar sempre: gancho que para o scroll, identificação, tensão por contraste (desejo×realidade, antes×depois), gatilhos mentais, CTA em camadas (seguir/salvar/enviar/comentar), fechamento com próximo passo.

Schemas por formato (siga à risca):

REELS:
Estilo Visual: <descrição da estética/cenário>
[GANCHO] <fala/legenda inicial que para o scroll>
[IDENTIFICAÇÃO] <fala que faz a pessoa se ver>
[CONTEÚDO] <desenvolvimento em beats curtos>
[CTA] <chamada em camadas>
Legenda: <legenda pronta pra postar>

CARROSSEL:
Estilo Visual: <descrição>
[1] <slide 1 — gancho>
[2] ...
...
[N] <último slide = CTA>
Legenda: <1ª linha-gancho + ⬇️>
<história>
<lição>
salva/envia esse post

STORIES:
STORY 01 (direção de foto/vídeo)
<texto do story>
[Desejos subconscientes: ...] ou [ENQUETE] A/B
STORY 02 ...
...
Recomendações: <observações estratégicas finais>

Regras: linhas curtas, PT-BR natural do Brasil, NUNCA sem gancho e sem CTA, sempre ancorado no briefing do usuário.`;

const inputSchema = z.object({
  conversationId: z.string().uuid(),
  userMessage: z.string().optional(),
});

type BriefingRow = {
  handle: string | null;
  niche: string | null;
  subniche: string | null;
  about: string | null;
  audience_who: string | null;
  audience_pains: string | null;
  audience_desires: string | null;
  differential: string | null;
  tone_of_voice: string | null;
  story: string | null;
  results: string | null;
  offer: string | null;
};

function buildBriefingContext(b: BriefingRow | null) {
  if (!b) return "O usuário ainda não preencheu o briefing. Trabalhe de forma genérica mas educada.";
  const lines = [
    b.handle && `@: ${b.handle}`,
    b.niche && `Nicho: ${b.niche}`,
    b.subniche && `Subnicho: ${b.subniche}`,
    b.about && `Sobre o criador: ${b.about}`,
    b.audience_who && `Público: ${b.audience_who}`,
    b.audience_pains && `Dores: ${b.audience_pains}`,
    b.audience_desires && `Desejos: ${b.audience_desires}`,
    b.differential && `Diferencial: ${b.differential}`,
    b.tone_of_voice && `Tom de voz: ${b.tone_of_voice}`,
    b.story && `História: ${b.story}`,
    b.results && `Resultados/prova: ${b.results}`,
    b.offer && `Oferta/produto: ${b.offer}`,
  ].filter(Boolean);
  return `BRIEFING DO USUÁRIO:\n${lines.join("\n")}`;
}

export const chatGenerate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY ausente. Adicione sua chave do Google AI Studio no .env.");

    // Load conversation
    const { data: conv, error: convErr } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", data.conversationId)
      .eq("user_id", userId)
      .maybeSingle();
    if (convErr || !conv) throw new Error("Conversa não encontrada.");

    // Load briefing
    const { data: briefing } = await supabase
      .from("briefings")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    // Load existing messages
    const { data: existing } = await supabase
      .from("messages")
      .select("role, content, id")
      .eq("conversation_id", data.conversationId)
      .order("created_at", { ascending: true });

    const history = existing ?? [];

    // If user sent a message, persist it first
    if (data.userMessage && data.userMessage.trim()) {
      const { error } = await supabase.from("messages").insert({
        conversation_id: data.conversationId,
        user_id: userId,
        role: "user",
        content: data.userMessage.trim(),
      });
      if (error) throw new Error(error.message);
      history.push({ id: "temp", role: "user", content: data.userMessage.trim() });
    }

    const contextBlock = `${buildBriefingContext(briefing as BriefingRow | null)}

CONFIGURAÇÃO DESTA GERAÇÃO:
- Tipo: ${conv.content_type}
- Objetivo: ${conv.objective ?? "estrategia"}
- Formato: ${conv.format ?? "-"}`;

    // Build messages — junta os dois blocos de sistema num só (mais robusto no Gemini).
    const chatMessages: { role: string; content: string }[] = [
      { role: "system", content: `${SYSTEM_PROMPT}\n\n${contextBlock}` },
    ];

    if (history.length === 0) {
      chatMessages.push({
        role: "user",
        content:
          "Estou começando essa geração agora. Antes de criar o roteiro, faça 1 ou 2 perguntas de descoberta específicas para esse formato e objetivo. Não gere o roteiro ainda.",
      });
    } else {
      for (const m of history) {
        chatMessages.push({ role: m.role, content: m.content });
      }
    }

    const res = await fetch(GEMINI_AI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GEMINI_MODEL,
        messages: chatMessages,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      if (res.status === 429) throw new Error("Muitas requisições no Gemini. Aguarde um instante e tente de novo.");
      if (res.status === 401 || res.status === 403)
        throw new Error("Chave do Gemini inválida ou sem permissão. Confira a GEMINI_API_KEY no .env.");
      throw new Error(`Falha na IA (${res.status}): ${text.slice(0, 200)}`);
    }

    const payload = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const reply = payload.choices?.[0]?.message?.content?.trim() ?? "";
    if (!reply) throw new Error("A IA não retornou conteúdo.");

    const { data: inserted, error: insErr } = await supabase
      .from("messages")
      .insert({
        conversation_id: data.conversationId,
        user_id: userId,
        role: "assistant",
        content: reply,
      })
      .select("id, role, content, created_at")
      .single();
    if (insErr) throw new Error(insErr.message);

    // Update conversation title if empty
    if (!conv.title) {
      const firstLine = reply.split("\n").find((l) => l.trim().length > 0) ?? "";
      const title = firstLine.replace(/^[#*\->\s]+/, "").slice(0, 80);
      await supabase.from("conversations").update({ title: title || null }).eq("id", conv.id);
    }

    // Save as generated_contents if it looks like a full roteiro (has GANCHO, STORY 01, or [1])
    if (/\[GANCHO\]|STORY\s?01|\[1\]/i.test(reply)) {
      await supabase.from("generated_contents").insert({
        user_id: userId,
        conversation_id: conv.id,
        title: conv.title,
        content_type: conv.content_type,
        format: conv.format,
        body: reply,
      });
    }

    return { message: inserted };
  });
