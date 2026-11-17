import { OrderChannel, OrderStatus } from "@prisma/client";
import { CalendarRange } from "lucide-react";

interface ReportsFiltersProps {
  filters: {
    dateFrom: string;
    dateTo: string;
    channel: string;
    status: string;
  };
}

export function ReportsFilters({ filters }: ReportsFiltersProps) {
  return (
    <form
      className="grid gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_1fr_0.9fr_0.9fr_auto]"
      method="GET"
    >
      <label className="relative block">
        <span className="sr-only">Fecha desde</span>
        <CalendarRange
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400"
        />
        <input
          className="h-10 w-full rounded-md border border-zinc-300 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
          defaultValue={filters.dateFrom}
          name="dateFrom"
          type="date"
        />
      </label>

      <input
        aria-label="Fecha hasta"
        className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
        defaultValue={filters.dateTo}
        name="dateTo"
        type="date"
      />

      <select
        className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
        defaultValue={filters.channel}
        name="channel"
      >
        <option value="all">Canal</option>
        {Object.values(OrderChannel).map((channel) => (
          <option key={channel} value={channel}>
            {channel.toLowerCase()}
          </option>
        ))}
      </select>

      <select
        className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
        defaultValue={filters.status}
        name="status"
      >
        <option value="all">Estado</option>
        {Object.values(OrderStatus).map((status) => (
          <option key={status} value={status}>
            {status.toLowerCase()}
          </option>
        ))}
      </select>

      <button
        className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800"
        type="submit"
      >
        Filtrar
      </button>
    </form>
  );
}
