import { ProductStatus } from "@prisma/client";
import { Search } from "lucide-react";

interface ProductFiltersProps {
  categories: Array<{
    id: string;
    name: string;
  }>;
  filters: {
    query: string;
    status: string;
    categoryId: string;
    lowStock: boolean;
  };
}

export function ProductFilters({ categories, filters }: ProductFiltersProps) {
  return (
    <form
      className="grid gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm lg:grid-cols-[1.4fr_0.9fr_0.9fr_auto_auto]"
      method="GET"
    >
      <label className="relative block">
        <span className="sr-only">Buscar por nombre o SKU</span>
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400"
        />
        <input
          className="h-10 w-full rounded-md border border-zinc-300 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
          defaultValue={filters.query}
          name="q"
          placeholder="Buscar por nombre o SKU"
          type="search"
        />
      </label>

      <label>
        <span className="sr-only">Estado</span>
        <select
          className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
          defaultValue={filters.status}
          name="status"
        >
          <option value="all">Todos los estados</option>
          {Object.values(ProductStatus).map((status) => (
            <option key={status} value={status}>
              {status.toLowerCase()}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span className="sr-only">Categoria</span>
        <select
          className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
          defaultValue={filters.categoryId}
          name="category"
        >
          <option value="">Todas las categorias</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex h-10 items-center gap-2 rounded-md border border-zinc-300 px-3 text-sm text-zinc-700">
        <input
          className="size-4 rounded border-zinc-300"
          defaultChecked={filters.lowStock}
          name="lowStock"
          type="checkbox"
          value="true"
        />
        Stock bajo
      </label>

      <button
        className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800"
        type="submit"
      >
        Filtrar
      </button>
    </form>
  );
}
