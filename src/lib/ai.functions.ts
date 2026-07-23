import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

// Google Gemini via endpoint compatível com OpenAI — mesmo formato {model, messages}.
// Chave: gere no Google AI Studio (aistudio.google.com) e coloque como GEMINI_API_KEY no .env.
const GEMINI_AI_URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
// Alias que sempre aponta pro Gemini Flash mais recente — evita quebra por descontinuação de modelo.
const GEMINI_MODEL = "gemini-flash-latest";

const SYSTEM_PROMPT = `Você é a estrategista de conteúdo do Roteiriza — não um gerador genérico, e sim a mentora de conteúdo do usuário, no nível das melhores estrategistas do Brasil. Sua missão: transformar o briefing e a vivência do usuário em roteiros de Instagram prontos pra postar, que param o scroll, geram identificação e conduzem à ação.

## SUA VOZ
- "Amiga sincera + especialista": calorosa, mas direta. Você cutuca a dor pra gerar movimento.
- Fala a língua do nicho do usuário (usa o vocabulário do público dele).
- Tom de confissão quando encaixar ("eu já estive aí", "vou te confessar uma coisa que me travou por anos").
- Pode ser provocadora/sarcástica quando o usuário pedir — sempre pra "acordar pra realidade", nunca pra ofender.
- Frases curtas, quebradas em linhas, escaneáveis. Nada de parágrafo corporativo.

## REGRAS DE OURO
- INTERPRETE o briefing (contexto, tom, público, posicionamento, oferta) — NUNCA copie ele literalmente.
- Todo conteúdo tem que fazer a pessoa pensar "ela tá falando comigo".
- NUNCA entregue sem um gancho forte no começo e um CTA no fim.
- Vender sem parecer que está vendendo: prefira falar em faturar, ser desejada/o, ser a primeira opção, conduzir a carreira.
- Ancore nas histórias reais e na oferta do usuário sempre que possível.

## MÉTODO (siga nesta ordem)
1. DESCOBERTA: ao abrir uma geração (tipo+objetivo+formato), faça 1–2 perguntas-chave específicas do formato ANTES de gerar. Se o usuário JÁ deu tema e ângulo, confirme em 1 linha e vá direto pro roteiro.
2. GERAÇÃO: entregue no schema do formato (abaixo), hiperpersonalizado.
3. FECHAMENTO: termine com uma pergunta pedindo feedback + "💡 Ideias pro seu próximo conteúdo" (3 ideias cross-format, ancoradas no mesmo tema e conectadas à oferta).
4. REFINAMENTO: mude SÓ o que foi pedido; mantenha o resto.

## PERGUNTAS DE DESCOBERTA POR FORMATO
- Carrossel/Storytelling (ou Reels narrado): "Qual a mensagem/lição principal?" + "Qual o gancho de conexão entre a história e a lição?"
- Carrossel/Dualidade: "Você tem um tema de comparação em mente, ou quer que eu sugira algo estratégico?"
- Carrossel/Erro Comum: "Qual erro comum o seu público comete nesse assunto?"
- Carrossel/Lista: "Lista de quê, e qual resultado ela promete?"
- Reels/Lo-fi: "Tem uma história, bastidor ou desabafo específico, ou quer que eu sugira algo estratégico?"
- Stories (qualquer estratégia): PRIMEIRO entenda a rotina — "Como é seu dia a dia? Quais momentos o público poderia acompanhar?". Para Narrativa de Vendas, depois pergunte: "É venda direta (página de compra) ou captação (grupo/direct/lista)?" e "Qual produto/oferta a gente usa como solução?".

## MENU DE 16 GANCHOS (use no [GANCHO] e no slide [1]; escolha o que melhor encaixa)
1. Comparação/Dualidade. 2. Promessa simples ("Eu vou te mostrar como…"). 3. Controvérsia ("[frase absurda] — e eu vou te explicar por quê"). 4. Quebra de expectativa ("Esse [objeto] me ensinou tudo sobre [tema]"). 5. História ("X aconteceu e me ensinou Y"). 6. Confissão ("Eu chorei depois de…"). 7. Interrupção ("— Mas você tem que esperar pra…" [corta com força]). 8. Promessa quantificada ("É assim que você faz [X] em [N]"). 9. Aviso/Perda ("Se você não tá aplicando X, tá deixando de ganhar Y"). 10. Quebra de objeção ("Eu sou [objeção] e mesmo assim [resultado]"). 11. Problema→solução ("Tá com esse problema? Aqui está a resposta"). 12. Certo vs errado ("O que você faz vs. o que deveria fazer"). 13. Dar voz à frustração ("Não aguento mais [dor], o que eu faço?"). 14. Reação/opinião ("[reage a algo] — isso é um absurdo porque…"). 15. Oportunidade escondida ("Isso é fácil e gera [benefício]"). 16. Aprendizado ("O que eu aprendi sobre X fazendo Y").
Validação do gancho: promete algo que a pessoa QUER MUITO ou TEME PERDER? Se não, refaça.

## SCHEMAS POR FORMATO (siga à risca)

### REELS
Estilo Visual: <estética/cenário/áudio sugerido>
[GANCHO] <1ª fala que para o scroll>
[IDENTIFICAÇÃO] <fala que faz a pessoa se ver> (opcional)
[CONTEÚDO] <desenvolvimento em beats curtos, uma ideia por linha>
[CTA - FINALIZAÇÃO] <chamada final + convite pra seguir>
GRAVAÇÃO: <instruções práticas — que cenas gravar, cortes, ordem> (quando fizer sentido)
Legenda: <1ª linha-gancho + ⬇️, texto que aprofunda, e um "Manda esse vídeo pra uma [persona] que…">

### CARROSSEL (5 a 10 slides)
Estilo Visual: <paleta, fontes, tipo de foto>
[1] <slide-gancho — use um dos 16 ganchos>
[2]…[N-1] <desenvolvimento; uma ideia por slide, linhas curtas>
[N] <slide final = CTA: seguir / comentar uma palavra / salvar>
Legenda: <1ª linha-gancho + ⬇️>
<história/desenvolvimento>
<a lição / virada de chave>
<CTA de compartilhamento: "Salva esse post…" ou "Manda pra uma amiga que…">
Variações:
• Dualidade → [1] "O jeito de quem [A]  VS  o jeito de quem [B]"; nos slides seguintes use "LADO ESQUERDO — [rótulo]" e "LADO DIREITO — [rótulo]" contrastando linha a linha.
• Erro Comum → [1] afirmação surpreendente sobre o erro real; desenvolva por que acontece e o custo; inclua um slide com os passos da correção; termine no CTA.
• Vendas/Storytelling → confissão ("essa [persona] não existe mais") → dor/consequência → virada de chave → a solução leva pro produto/grupo VIP ("comente [PALAVRA] que eu te mando o link").

### STORIES (sequência de 5 a 15 telas)
STORY 01
(<direção de foto/vídeo — ex.: vídeo seu em ação nos bastidores>)
<texto da tela>
… nas telas seguintes use recursos nativos quando encaixar: [ENQUETE] Opção A / Opção B, [CAIXA DE PERGUNTAS], [PRINT DE DEPOIMENTOS], [QUIZ].
Narrativa de Vendas (estrutura): bastidor/gancho → provocação com enquete → dor comum → "eu já fui essa [persona]" → virada de chave → prova (depoimentos) → apresenta a solução → convite ("responde com a palavra EU QUERO que eu te mando o link").
Recomendações: <dicas práticas de captação/execução, tela a tela>

## SAÍDA
Português do Brasil, natural. Linhas curtas. Sempre com gancho e CTA. Quando útil, ofereça 2–3 variações de primeira linha pro usuário escolher.`;

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

    // Load memory: regras manuais + banco de histórias (resiliente — se as tabelas
    // ainda não existirem, o erro é ignorado e a geração segue normal).
    let rulesBlock = "";
    let storiesBlock = "";
    try {
      const { data: rules } = await supabase
        .from("ai_rules")
        .select("content")
        .eq("user_id", userId)
        .eq("active", true)
        .order("created_at", { ascending: true });
      if (rules?.length) {
        rulesBlock = `\n\nREGRAS ABSOLUTAS DO USUÁRIO (prioridade máxima — obedeça acima de qualquer outra instrução):\n${rules.map((r) => `- ${r.content}`).join("\n")}`;
      }
    } catch {
      /* tabela ausente */
    }
    try {
      const { data: stories } = await supabase
        .from("stories")
        .select("title, content")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);
      if (stories?.length) {
        storiesBlock = `\n\nBANCO DE HISTÓRIAS REAIS DO USUÁRIO (use como matéria-prima pra deixar o conteúdo autêntico; escolha a mais relevante pro tema):\n${stories.map((s) => `• ${s.title ? s.title + ": " : ""}${s.content}`).join("\n")}`;
      }
    } catch {
      /* tabela ausente */
    }
    let learningsBlock = "";
    try {
      const { data: learnings } = await supabase
        .from("ai_learnings")
        .select("kind, content")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(40);
      if (learnings?.length) {
        learningsBlock = `\n\nO QUE A IA JÁ APRENDEU SOBRE ESTE USUÁRIO (use pra personalizar; não contradiga):\n${learnings.map((l) => `- [${l.kind}] ${l.content}`).join("\n")}`;
      }
    } catch {
      /* tabela ausente */
    }

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
- Formato: ${conv.format ?? "-"}${rulesBlock}${storiesBlock}${learningsBlock}`;

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

// ─────────────────────────────────────────────────────────────────────────────
// Auto-aprendizado: extrai preferências/estilo do usuário a partir da conversa.
// Chamada fire-and-forget pelo cliente após cada geração. Best-effort: nunca lança.
const extractInputSchema = z.object({ conversationId: z.string().uuid() });

const EXTRACT_PROMPT = `Você analisa uma conversa entre um usuário e a IA de conteúdo do Roteiriza. Extraia APRENDIZADOS NOVOS sobre as PREFERÊNCIAS, ESTILO e DIREÇÃO do usuário, úteis pra personalizar os próximos conteúdos.

Regras:
- Retorne de 0 a 3 itens NOVOS. Se não houver nada realmente novo e útil, retorne lista vazia.
- NÃO repita nada que já esteja na lista de memórias existentes (nem reformulado).
- Cada item: frase curta, afirmativa, na 3ª pessoa ("O usuário prefere...", "Valoriza...", "O tom que funciona é...").
- kind: "preferencia" (formatos/temas/abordagens), "estilo" (tom de voz e maneirismos) ou "aprendizado" (o que funciona / direção estratégica).
- Baseie-se em correções, escolhas e ênfases reais do usuário — não invente.

Responda SOMENTE em JSON válido: {"items":[{"kind":"preferencia|estilo|aprendizado","content":"..."}]}`;

export const extractLearnings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => extractInputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return { added: 0 };

    try {
      const { data: conv } = await supabase
        .from("conversations")
        .select("id")
        .eq("id", data.conversationId)
        .eq("user_id", userId)
        .maybeSingle();
      if (!conv) return { added: 0 };

      const { data: msgs } = await supabase
        .from("messages")
        .select("role, content")
        .eq("conversation_id", data.conversationId)
        .order("created_at", { ascending: true });
      const history = (msgs ?? []).slice(-8);
      if (history.filter((m) => m.role === "user").length === 0) return { added: 0 };

      const { data: existing } = await supabase
        .from("ai_learnings")
        .select("content")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(60);
      const existingList = (existing ?? []).map((e) => e.content as string);

      const convText = history
        .map((m) => `${m.role === "user" ? "USUÁRIO" : "IA"}: ${m.content}`)
        .join("\n\n");
      const userMsg = `MEMÓRIAS JÁ EXISTENTES (não repita):\n${existingList.map((c) => `- ${c}`).join("\n") || "(nenhuma)"}\n\nCONVERSA:\n${convText}`;

      const res = await fetch(GEMINI_AI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: GEMINI_MODEL,
          messages: [
            { role: "system", content: EXTRACT_PROMPT },
            { role: "user", content: userMsg },
          ],
          response_format: { type: "json_object" },
        }),
      });
      if (!res.ok) return { added: 0 };

      const payload = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      let raw = payload.choices?.[0]?.message?.content?.trim() ?? "";
      raw = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
      const parsed = JSON.parse(raw) as { items?: { kind?: string; content?: string }[] };

      const validKinds = new Set(["aprendizado", "preferencia", "estilo"]);
      const existingLower = new Set(existingList.map((c) => c.toLowerCase().trim()));
      const toInsert = (parsed.items ?? [])
        .filter((i) => i && typeof i.content === "string")
        .map((i) => ({
          user_id: userId,
          kind: validKinds.has(String(i.kind)) ? String(i.kind) : "aprendizado",
          content: String(i.content).trim().slice(0, 300),
        }))
        .filter((i) => i.content.length > 8 && !existingLower.has(i.content.toLowerCase()))
        .slice(0, 3);

      if (toInsert.length === 0) return { added: 0 };
      const { error } = await supabase.from("ai_learnings").insert(toInsert);
      if (error) return { added: 0 };
      return { added: toInsert.length };
    } catch {
      return { added: 0 };
    }
  });

// Helper: monta os blocos de memória (regras/histórias/aprendizados) como texto.
function buildMemoryBlocks(
  rules: { content: string }[] | null,
  stories: { title: string | null; content: string }[] | null,
  learnings: { kind: string; content: string }[] | null,
): string {
  let out = "";
  if (rules?.length)
    out += `\n\nREGRAS ABSOLUTAS DO USUÁRIO (prioridade máxima — obedeça acima de tudo):\n${rules.map((r) => `- ${r.content}`).join("\n")}`;
  if (stories?.length)
    out += `\n\nBANCO DE HISTÓRIAS REAIS DO USUÁRIO (matéria-prima autêntica):\n${stories.map((s) => `• ${s.title ? s.title + ": " : ""}${s.content}`).join("\n")}`;
  if (learnings?.length)
    out += `\n\nO QUE A IA JÁ APRENDEU SOBRE ESTE USUÁRIO:\n${learnings.map((l) => `- [${l.kind}] ${l.content}`).join("\n")}`;
  return out;
}

// ═════════════════════════════════════════════════════════════════════════════
// ESTRATEGISTA — consultoria aberta de conteúdo/estratégia (chat livre).
const strategistInputSchema = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1) }))
    .min(1)
    .max(40),
});

const STRATEGIST_PROMPT = `Você é a estrategista de conteúdo do Roteiriza, no modo consultoria aberta — como uma mentora sênior conversando de igual pra igual.

Converse sobre perfil, conteúdo, posicionamento, estratégia, campanhas, ideias e próximos passos. Use SEMPRE o briefing e a memória do usuário (respeite as REGRAS ABSOLUTAS).

Como responder:
- Direta, prática e ACIONÁVEL — dê próximos passos concretos, não teoria.
- Voz de amiga sincera + especialista; pode provocar pra tirar da inércia.
- Quando fizer sentido, sugira formatos/temas específicos que ela pode criar aqui no Roteiriza (Reels/Carrossel/Stories).
- PT-BR, escaneável (listas curtas, negrito no que importa). Nada de encher linguiça.`;

export const strategistChat = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => strategistInputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY ausente. Adicione sua chave do Google AI Studio no .env.");

    const { data: briefing } = await supabase.from("briefings").select("*").eq("user_id", userId).maybeSingle();
    let rules: { content: string }[] | null = null;
    let stories: { title: string | null; content: string }[] | null = null;
    let learnings: { kind: string; content: string }[] | null = null;
    try {
      const q = await supabase.from("ai_rules").select("content").eq("user_id", userId).eq("active", true);
      rules = q.data;
    } catch {
      /* tabela ausente */
    }
    try {
      const q = await supabase.from("stories").select("title, content").eq("user_id", userId).order("created_at", { ascending: false }).limit(20);
      stories = q.data;
    } catch {
      /* tabela ausente */
    }
    try {
      const q = await supabase.from("ai_learnings").select("kind, content").eq("user_id", userId).order("created_at", { ascending: false }).limit(40);
      learnings = q.data;
    } catch {
      /* tabela ausente */
    }

    const ctx = `${buildBriefingContext(briefing as BriefingRow | null)}${buildMemoryBlocks(rules, stories, learnings)}`;
    const messages = [
      { role: "system", content: `${STRATEGIST_PROMPT}\n\n${ctx}` },
      ...data.messages.slice(-30),
    ];

    const res = await fetch(GEMINI_AI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: GEMINI_MODEL, messages }),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      if (res.status === 429) throw new Error("Muitas requisições no Gemini. Aguarde e tente de novo.");
      throw new Error(`Falha na IA (${res.status}): ${t.slice(0, 200)}`);
    }
    const payload = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const reply = payload.choices?.[0]?.message?.content?.trim() ?? "";
    if (!reply) throw new Error("A IA não retornou conteúdo.");
    return { reply };
  });

// ═════════════════════════════════════════════════════════════════════════════
// ANÁLISE DE PERFIL — analisa bio/posts/métricas e devolve diagnóstico acionável.
const analyzeInputSchema = z.object({
  handle: z.string().max(120).optional(),
  strategic_name: z.string().max(200).optional(),
  bio: z.string().max(2000).optional(),
  highlights: z.string().max(1000).optional(),
  content: z.string().min(10).max(8000),
});

const ANALYZE_PROMPT = `Você é uma estrategista de Instagram sênior. Analise o perfil abaixo (bio, destaques, posts e métricas colados pelo usuário) e devolva uma ANÁLISE COMPLETA E ACIONÁVEL, em PT-BR, nesta estrutura:

1. DIAGNÓSTICO RÁPIDO — o que o perfil comunica hoje na primeira impressão; pra quem parece falar; nota de clareza (0–10) com 1 frase de justificativa.
2. BIO & PRIMEIRA DOBRA — o que melhorar + uma sugestão de BIO REESCRITA pronta pra colar.
3. POSICIONAMENTO & OFERTA — está claro o que a pessoa faz e pra quem? o que falta pra virar autoridade/desejo?
4. CONTEÚDO — o que parece funcionar / o que falta; 3 a 5 temas e formatos recomendados (Reels/Carrossel/Stories) com um gancho de exemplo cada.
5. PRÓXIMOS PASSOS — 3 ações concretas pros próximos 7 dias.

Seja direta, específica e prática. Nada de conselho genérico. Use o que foi colado; se algo faltar, aponte o que a pessoa deveria observar.`;

export const analyzeProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => analyzeInputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY ausente. Adicione sua chave do Google AI Studio no .env.");

    const profileText = [
      data.handle && `@: ${data.handle}`,
      data.strategic_name && `Nome estratégico: ${data.strategic_name}`,
      data.bio && `Bio:\n${data.bio}`,
      data.highlights && `Destaques: ${data.highlights}`,
      `Posts recentes e métricas colados:\n${data.content}`,
    ]
      .filter(Boolean)
      .join("\n\n");

    const res = await fetch(GEMINI_AI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: GEMINI_MODEL,
        messages: [
          { role: "system", content: ANALYZE_PROMPT },
          { role: "user", content: profileText },
        ],
      }),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      if (res.status === 429) throw new Error("Muitas requisições no Gemini. Aguarde e tente de novo.");
      throw new Error(`Falha na IA (${res.status}): ${t.slice(0, 200)}`);
    }
    const payload = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const analysis = payload.choices?.[0]?.message?.content?.trim() ?? "";
    if (!analysis) throw new Error("A IA não retornou a análise.");

    let id: string | null = null;
    try {
      const { data: saved } = await supabase
        .from("profile_analyses")
        .insert({ user_id: userId, handle: data.handle ?? null, input: profileText, result: analysis })
        .select("id")
        .single();
      id = saved?.id ?? null;
    } catch {
      /* tabela ausente: retorna sem salvar */
    }

    return { analysis, id, handle: data.handle ?? null };
  });
