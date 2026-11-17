import type { InsightStatus, InsightType } from "@prisma/client";

interface InsightItem {
  id: string;
  title: string;
  description: string;
  type: InsightType;
  status: InsightStatus;
  confidence: number | null;
}

interface AiInsightsListProps {
  insights: InsightItem[];
}

export function AiInsightsList({ insights }: AiInsightsListProps) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold">AI Insights recientes</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Señales generadas desde pedidos, stock y ventas.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {insights.map((insight) => (
          <article
            className="rounded-md border border-zinc-200 p-4"
            key={insight.id}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
                {insight.type.replaceAll("_", " ").toLowerCase()}
              </span>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800">
                {insight.status.toLowerCase()}
              </span>
              {insight.confidence !== null ? (
                <span className="font-mono text-xs text-zinc-500">
                  {insight.confidence}% confianza
                </span>
              ) : null}
            </div>
            <h3 className="mt-3 text-sm font-semibold text-zinc-950">
              {insight.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-600">
              {insight.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
