import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  helper: string;
  icon: LucideIcon;
}

export function MetricCard({ label, value, helper, icon: Icon }: MetricCardProps) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-500">{label}</p>
          <p className="mt-3 font-mono text-3xl font-semibold tracking-tight">
            {value}
          </p>
        </div>
        <span className="flex size-10 items-center justify-center rounded-md bg-zinc-100 text-zinc-700">
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-4 text-sm text-zinc-500">{helper}</p>
    </section>
  );
}
