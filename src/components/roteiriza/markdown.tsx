import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Renderiza markdown (o formato que a IA devolve) com a estética do app.
 * remark-breaks preserva as quebras de linha simples (essencial pros roteiros).
 */
export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      components={{
        h1: ({ node, ...p }: any) => <h2 className="editorial-title mb-2 mt-4 text-xl first:mt-0" {...p} />,
        h2: ({ node, ...p }: any) => <h3 className="editorial-title mb-2 mt-4 text-lg first:mt-0" {...p} />,
        h3: ({ node, ...p }: any) => (
          <h4 className="mb-1.5 mt-4 text-xs font-semibold uppercase tracking-wider text-violet first:mt-0" {...p} />
        ),
        h4: ({ node, ...p }: any) => <h5 className="mb-1 mt-3 text-sm font-semibold" {...p} />,
        p: ({ node, ...p }: any) => <p className="mb-2 leading-relaxed last:mb-0" {...p} />,
        strong: ({ node, ...p }: any) => <strong className="font-semibold text-foreground" {...p} />,
        ul: ({ node, ...p }: any) => <ul className="mb-2 ml-4 list-disc space-y-1" {...p} />,
        ol: ({ node, ...p }: any) => <ol className="mb-2 ml-4 list-decimal space-y-1" {...p} />,
        li: ({ node, ...p }: any) => <li className="leading-relaxed" {...p} />,
        blockquote: ({ node, ...p }: any) => (
          <blockquote className="my-2 rounded-r-md border-l-2 border-violet/50 bg-muted/50 px-3 py-1.5 text-foreground/80" {...p} />
        ),
        hr: () => <hr className="my-3 border-border" />,
        a: ({ node, ...p }: any) => <a className="text-violet underline underline-offset-2" target="_blank" rel="noreferrer" {...p} />,
        code: ({ node, ...p }: any) => <code className="rounded bg-muted px-1 py-0.5 text-[0.85em]" {...p} />,
        table: ({ node, ...p }: any) => (
          <div className="my-2 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm" {...p} />
          </div>
        ),
        th: ({ node, ...p }: any) => <th className="border-b px-2 py-1 font-semibold" {...p} />,
        td: ({ node, ...p }: any) => <td className="border-b px-2 py-1" {...p} />,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
