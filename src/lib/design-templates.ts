// Templates de Design — designs que abrem no Canva.
//
// COMO ADICIONAR OS SEUS:
// 1) Crie/abra seu template no Canva e pegue o link de "Usar modelo" (Share → template link).
// 2) (Opcional) Salve uma miniatura em /public/templates/NOME.jpg e referencie em `thumb`.
//    Sem `thumb`, mostramos um placeholder com gradiente + número.
// 3) Adicione um objeto no array abaixo.
//
// Obs.: NÃO reutilize os designs de outros criadores — use os seus próprios ou
// modelos públicos do Canva. Os exemplos abaixo apontam pra categorias públicas do Canva.

export type DesignTemplate = {
  id: number;
  title?: string;
  thumb?: string; // ex.: "/templates/1.jpg"
  url: string; // link do Canva
};

export const DESIGN_TEMPLATES: DesignTemplate[] = [
  { id: 1, title: "Carrossel de Instagram", url: "https://www.canva.com/instagram-posts/templates/carousel/" },
  { id: 2, title: "Stories para Instagram", url: "https://www.canva.com/instagram-stories/templates/" },
  { id: 3, title: "Capa de Reels", url: "https://www.canva.com/templates/s/reels-cover/" },
  { id: 4, title: "Post educativo", url: "https://www.canva.com/instagram-posts/templates/" },
  { id: 5, title: "Antes e depois", url: "https://www.canva.com/templates/s/before-and-after/" },
  { id: 6, title: "Citação / frase", url: "https://www.canva.com/templates/s/quotes/" },
];

// Gradiente determinístico pro placeholder (quando não há miniatura).
export function templateGradient(id: number): string {
  const gradients = [
    "from-violet-500/80 to-fuchsia-400/70",
    "from-slate-700 to-slate-500",
    "from-amber-400/80 to-rose-400/70",
    "from-emerald-500/80 to-teal-400/70",
    "from-indigo-500/80 to-violet-400/70",
    "from-rose-400/80 to-orange-300/70",
  ];
  return gradients[id % gradients.length];
}
