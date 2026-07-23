export const CONTENT_TYPES = [
  { id: "reels", label: "Reels", desc: "Vídeos curtos que param o scroll" },
  { id: "carrossel", label: "Carrossel", desc: "Sequência de slides pra ensinar ou emocionar" },
  { id: "stories", label: "Stories", desc: "Estratégia diária de conexão e vendas" },
] as const;

export const OBJECTIVES = [
  { id: "crescimento", label: "Crescimento", desc: "Alcançar novas pessoas" },
  { id: "engajamento", label: "Engajamento", desc: "Ativar quem já te segue" },
  { id: "vendas", label: "Vendas", desc: "Converter em cliente" },
] as const;

export const FORMATS: Record<string, { id: string; label: string; desc?: string }[]> = {
  reels: [
    { id: "lo-fi", label: "Lo-fi", desc: "Baixa produção, alta identificação" },
    { id: "leia-legenda", label: "Leia a Legenda" },
    { id: "fala-dinamica", label: "Fala Dinâmica" },
    { id: "serie", label: "Série" },
    { id: "sketch", label: "Sketch" },
    { id: "rotina", label: "Rotina" },
    { id: "pauta-quente", label: "Pauta Quente" },
    { id: "narrado", label: "Narrado" },
    { id: "outro", label: "Outro" },
  ],
  carrossel: [
    { id: "storytelling", label: "Storytelling" },
    { id: "dualidade", label: "Dualidade" },
    { id: "erro-comum", label: "Erro Comum" },
    { id: "pauta-quente", label: "Pauta Quente" },
    { id: "jeito-certo-errado", label: "Jeito Certo / Errado" },
    { id: "lista", label: "Lista" },
    { id: "outro", label: "Outro" },
  ],
  stories: [
    { id: "conexao", label: "Story de Conexão" },
    { id: "desejo", label: "Story de Desejo" },
    { id: "narrativa-vendas", label: "Narrativa de Vendas" },
    { id: "conteudo-premium", label: "Conteúdo Premium" },
  ],
};

export function labelOf(list: readonly { id: string; label: string }[], id: string) {
  return list.find((x) => x.id === id)?.label ?? id;
}

export function formatLabel(type: string, format: string) {
  const f = FORMATS[type]?.find((x) => x.id === format);
  return f?.label ?? format;
}
