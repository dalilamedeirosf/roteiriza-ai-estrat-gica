// Templates de Design — designs que abrem no Canva.
//
// IMPORTANTE: os links são os de compartilhamento do Canva EXATAMENTE como
// fornecidos (com ?utm...&mode=preview) — não alterar, pois é o que leva ao
// fluxo de usar/editar o modelo.
//
// COMO ADICIONAR MAIS:
// 1) No Canva → Compartilhar → "Link do modelo" (copie o link inteiro).
// 2) (Opcional) miniatura em /public/templates/{id}.jpg.
// 3) Adicione um objeto no array abaixo com o link completo.

export type DesignTemplate = {
  id: number;
  title?: string;
  thumb?: string; // ex.: "/templates/1.jpg"
  url: string; // link do Canva (completo, sem alterar)
};

export const DESIGN_TEMPLATES: DesignTemplate[] = [
  { id: 1, url: "https://www.canva.com/design/DAHA3qlyItY/RwMYdiouh_bHkD5d1wmL8w/view?utm_content=DAHA3qlyItY&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview" },
  { id: 2, url: "https://www.canva.com/design/DAHA3tqzk2w/QLqw2i3qwuKhLtgCTje6rw/view?utm_content=DAHA3tqzk2w&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview" },
  { id: 3, url: "https://www.canva.com/design/DAHA3gAZ_ts/FTUH-cSocfdh3ZOSbw7EpQ/view?utm_content=DAHA3gAZ_ts&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview" },
  { id: 4, url: "https://www.canva.com/design/DAHA3qvEnJw/WoceytLd5HMOPEipYAx3sw/view?utm_content=DAHA3qvEnJw&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview" },
  { id: 5, url: "https://www.canva.com/design/DAHA3lmf46Y/-ic9M3zQdZz5LfaB-vvRQA/view?utm_content=DAHA3lmf46Y&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview" },
  { id: 6, url: "https://www.canva.com/design/DAHA3jVkP4E/AKjuaEhqRxmDQVE6-u9skA/view?utm_content=DAHA3jVkP4E&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview" },
  { id: 7, url: "https://www.canva.com/design/DAHA3jyuJ-k/AEtW7wbhgWX_eRvwe7XHbg/view?utm_content=DAHA3jyuJ-k&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview" },
  { id: 8, url: "https://www.canva.com/design/DAHA3tDHY-8/5z6vjzEP5pmQP9bTTYfLnw/view?utm_content=DAHA3tDHY-8&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview" },
  { id: 9, url: "https://www.canva.com/design/DAHA3nYvBrM/tgYx2dMppNoBb3Hv0iwDTw/view?utm_content=DAHA3nYvBrM&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview#1" },
  { id: 10, url: "https://www.canva.com/design/DAHA3rhZAwQ/Hy7oMnWvt40EH0oi_D1gBw/view?utm_content=DAHA3rhZAwQ&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview" },
  { id: 11, url: "https://www.canva.com/design/DAHA3ufRchU/q_hCDIO48qBYP56syMlmXA/view?utm_content=DAHA3ufRchU&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview#1" },
  { id: 12, url: "https://www.canva.com/design/DAHA3s-7W_A/wt5NObbYvT6z0JPRCJ7TVw/view?utm_content=DAHA3s-7W_A&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview" },
  { id: 13, url: "https://www.canva.com/design/DAHA3i7WvzE/TUKHlZY60AuZsst9lTy6LQ/view?utm_content=DAHA3i7WvzE&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview" },
  { id: 14, url: "https://www.canva.com/design/DAHA3hNlLPA/pBaOZQzFf6q36rlrPKYuSA/view?utm_content=DAHA3hNlLPA&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview" },
  { id: 15, url: "https://www.canva.com/design/DAHA3lUX-oA/RTG56yo7arMatv1Mafbm_w/view?utm_content=DAHA3lUX-oA&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview" },
  { id: 16, url: "https://www.canva.com/design/DAHA3tESIZ8/P0iNKWwHEqMVKhk1CpsYsw/view?utm_content=DAHA3tESIZ8&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview" },
  { id: 17, url: "https://www.canva.com/design/DAHA4YA-0r4/t-AFOwmUY3lqS1OZeZcUkA/view?utm_content=DAHA4YA-0r4&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview" },
  { id: 18, url: "https://www.canva.com/design/DAHA4eWw_UE/N8OQs1RPA_sK3KZfjdkUPg/view?utm_content=DAHA4eWw_UE&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview" },
  { id: 19, url: "https://www.canva.com/design/DAHA4eERDJY/T6TdQuMFeAQFYjlmhHCOfA/view?utm_content=DAHA4eERDJY&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview" },
  { id: 20, url: "https://www.canva.com/design/DAHA4bfEul4/c7XDxI-cK_Yc60F-1HrEMg/view?utm_content=DAHA4bfEul4&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview" },
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
