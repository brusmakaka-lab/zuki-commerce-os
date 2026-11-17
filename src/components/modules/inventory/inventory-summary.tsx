import type { LucideIcon } from "lucide-react";

interface InventorySummaryProps {
  items: Array<{
    label: string;
    value: string;
    helper: string;
    icon: LucideIcon;
  }>;
}

export function InventorySummary({ items }: InventorySummaryProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <article
            className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
            key={item.label}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-zinc-500">
                  {item.label}
                </p>
                <p className="mt-3 font-mono text-3xl font-semibold tracking-tight">
                  {item.value}
                </p>
              </div>
              <span className="flex size-10 items-center justify-center rounded-md bg-zinc-100 text-zinc-700">
                <Icon className="size-5" aria-hidden="true" />
              </span>
            </div>
            <p className="mt-4 text-sm text-zinc-500">{item.helper}</p>
          </article>
        );
      })}
    </section>
  );
}
