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

// Desafio Content Sprint — arco de 15 dias: atrair → conectar → vender.
export type SprintDay = { day: number; title: string; objective: string; focus: string };

export const SPRINT_DAYS: SprintDay[] = [
  { day: 1, title: "Manifesto de abertura", objective: "Crescimento", focus: "Quem você é, pra quem você fala e por que seguir você. Um conteúdo de posicionamento forte." },
  { day: 2, title: "O erro comum do seu nicho", objective: "Crescimento", focus: "Aponte um erro que o seu público comete — gera autoridade técnica e atrai o público certo." },
  { day: 3, title: "Bastidor da sua rotina", objective: "Engajamento", focus: "Mostre um momento real do seu dia a dia. Humaniza e cria conexão." },
  { day: 4, title: "Sua história de superação", objective: "Crescimento", focus: "O contraste antes × depois. Prova que a transformação é real porque você viveu." },
  { day: 5, title: "Mito × Verdade", objective: "Crescimento", focus: "Quebre uma crença comum do seu nicho. Didático e compartilhável." },
  { day: 6, title: "Dica prática rápida", objective: "Engajamento", focus: "Uma dica acionável que a pessoa aplica hoje. Alto valor, fácil de salvar." },
  { day: 7, title: "Pergunta que gera conversa", objective: "Engajamento", focus: "Provoque uma resposta: enquete, caixa de perguntas ou pergunta nos comentários." },
  { day: 8, title: "Prova social / caso real", objective: "Vendas", focus: "Um depoimento, resultado ou caso de cliente. Constrói desejo e confiança." },
  { day: 9, title: "Jeito certo × jeito errado", objective: "Crescimento", focus: "Contraste o que funciona e o que não funciona. Posiciona você como quem sabe." },
  { day: 10, title: "Conteúdo de desejo", objective: "Vendas", focus: "Desperte aspiração: mostre a vida/resultado que o seu método proporciona." },
  { day: 11, title: "Quebra de objeção", objective: "Vendas", focus: "Antecipe e derrube a maior desculpa do seu público ('não tenho tempo/dinheiro/etc.')." },
  { day: 12, title: "Conteúdo premium", objective: "Vendas", focus: "Ensine algo valioso de leve — gera autoridade e percepção de profundidade da sua oferta." },
  { day: 13, title: "Bastidor do seu método/oferta", objective: "Vendas", focus: "Mostre como funciona por dentro o que você entrega. Aproxima da compra." },
  { day: 14, title: "Chamada pra captação", objective: "Vendas", focus: "Convide pra sua lista/grupo/direct. Prepare o terreno pra oferta." },
  { day: 15, title: "Oferta / convite direto", objective: "Vendas", focus: "A oferta clara: o que é, pra quem, e o próximo passo pra entrar." },
];
