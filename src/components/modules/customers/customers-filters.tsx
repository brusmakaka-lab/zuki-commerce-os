import { Search } from "lucide-react";

interface CustomersFiltersProps {
  availableFilters: {
    tags: string[];
    provinces: string[];
  };
  filters: {
    query: string;
    tag: string;
    province: string;
    minSpent: string;
    hasOrders: string;
  };
}

export function CustomersFilters({
  availableFilters,
  filters,
}: CustomersFiltersProps) {
  return (
    <form
      className="grid gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm xl:grid-cols-[1.3fr_0.8fr_0.9fr_0.75fr_0.75fr_auto]"
      method="GET"
    >
      <label className="relative block">
        <span className="sr-only">Buscar cliente</span>
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400"
        />
        <input
          className="h-10 w-full rounded-md border border-zinc-300 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
          defaultValue={filters.query}
          name="q"
          placeholder="Nombre, email o telefono"
          type="search"
        />
      </label>

      <select
        className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
        defaultValue={filters.tag}
        name="tag"
      >
        <option value="">Todos los tags</option>
        {availableFilters.tags.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>

      <select
        className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
        defaultValue={filters.province}
        name="province"
      >
        <option value="all">Todas las provincias</option>
        {availableFilters.provinces.map((province) => (
          <option key={province} value={province}>
            {province}
          </option>
        ))}
      </select>

      <input
        className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
        defaultValue={filters.minSpent}
        min="0"
        name="minSpent"
        placeholder="Min gasto"
        type="number"
      />

      <select
        className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
        defaultValue={filters.hasOrders}
        name="hasOrders"
      >
        <option value="all">Pedidos</option>
        <option value="true">Con pedidos</option>
        <option value="false">Sin pedidos</option>
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
