// Templates de Design — designs que abrem no Canva.
//
// COMO ADICIONAR MAIS:
// 1) No Canva → Compartilhar → "Link do modelo" (ou "Usar modelo").
// 2) (Opcional) Salve uma miniatura em /public/templates/NOME.jpg e referencie em `thumb`.
//    Sem `thumb`, mostramos um placeholder com gradiente + número.
// 3) Adicione um objeto no array abaixo.

export type DesignTemplate = {
  id: number;
  title?: string;
  thumb?: string; // ex.: "/templates/1.jpg"
  url: string; // link do Canva
};

export const DESIGN_TEMPLATES: DesignTemplate[] = [
  { id: 1, url: "https://www.canva.com/design/DAHA3qlyItY/RwMYdiouh_bHkD5d1wmL8w/view" },
  { id: 2, url: "https://www.canva.com/design/DAHA3tqzk2w/QLqw2i3qwuKhLtgCTje6rw/view" },
  { id: 3, url: "https://www.canva.com/design/DAHA3gAZ_ts/FTUH-cSocfdh3ZOSbw7EpQ/view" },
  { id: 4, url: "https://www.canva.com/design/DAHA3qvEnJw/WoceytLd5HMOPEipYAx3sw/view" },
  { id: 5, url: "https://www.canva.com/design/DAHA3lmf46Y/-ic9M3zQdZz5LfaB-vvRQA/view" },
  { id: 6, url: "https://www.canva.com/design/DAHA3jVkP4E/AKjuaEhqRxmDQVE6-u9skA/view" },
  { id: 7, url: "https://www.canva.com/design/DAHA3jyuJ-k/AEtW7wbhgWX_eRvwe7XHbg/view" },
  { id: 8, url: "https://www.canva.com/design/DAHA3tDHY-8/5z6vjzEP5pmQP9bTTYfLnw/view" },
  { id: 9, url: "https://www.canva.com/design/DAHA3nYvBrM/tgYx2dMppNoBb3Hv0iwDTw/view" },
  { id: 10, url: "https://www.canva.com/design/DAHA3rhZAwQ/Hy7oMnWvt40EH0oi_D1gBw/view" },
  { id: 11, url: "https://www.canva.com/design/DAHA3ufRchU/q_hCDIO48qBYP56syMlmXA/view" },
  { id: 12, url: "https://www.canva.com/design/DAHA3s-7W_A/wt5NObbYvT6z0JPRCJ7TVw/view" },
  { id: 13, url: "https://www.canva.com/design/DAHA3i7WvzE/TUKHlZY60AuZsst9lTy6LQ/view" },
  { id: 14, url: "https://www.canva.com/design/DAHA3hNlLPA/pBaOZQzFf6q36rlrPKYuSA/view" },
  { id: 15, url: "https://www.canva.com/design/DAHA3lUX-oA/RTG56yo7arMatv1Mafbm_w/view" },
  { id: 16, url: "https://www.canva.com/design/DAHA3tESIZ8/P0iNKWwHEqMVKhk1CpsYsw/view" },
  { id: 17, url: "https://www.canva.com/design/DAHA4YA-0r4/t-AFOwmUY3lqS1OZeZcUkA/view" },
  { id: 18, url: "https://www.canva.com/design/DAHA4eWw_UE/N8OQs1RPA_sK3KZfjdkUPg/view" },
  { id: 19, url: "https://www.canva.com/design/DAHA4eERDJY/T6TdQuMFeAQFYjlmhHCOfA/view" },
  { id: 20, url: "https://www.canva.com/design/DAHA4bfEul4/c7XDxI-cK_Yc60F-1HrEMg/view" },
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
