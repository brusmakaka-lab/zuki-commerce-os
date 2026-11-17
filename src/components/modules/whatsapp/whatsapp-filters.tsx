import { Search } from "lucide-react";

interface WhatsAppFiltersProps {
  filters: {
    query: string;
    status: string;
    hasOrder: string;
  };
}

export function WhatsAppFilters({ filters }: WhatsAppFiltersProps) {
  return (
    <form
      className="grid gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm lg:grid-cols-[1.4fr_0.8fr_0.8fr_auto]"
      method="GET"
    >
      <label className="relative block">
        <span className="sr-only">Buscar conversación</span>
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400"
        />
        <input
          className="h-10 w-full rounded-md border border-zinc-300 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
          defaultValue={filters.query}
          name="q"
          placeholder="Telefono, cliente o mensaje"
          type="search"
        />
      </label>

      <select
        className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
        defaultValue={filters.status}
        name="status"
      >
        <option value="all">Todos los estados</option>
        <option value="open">Open</option>
        <option value="resolved">Resolved</option>
      </select>

      <select
        className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
        defaultValue={filters.hasOrder}
        name="hasOrder"
      >
        <option value="all">Pedidos</option>
        <option value="true">Con pedido</option>
        <option value="false">Sin pedido</option>
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
