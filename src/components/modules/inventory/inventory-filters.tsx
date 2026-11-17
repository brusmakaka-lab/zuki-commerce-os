import type { MovementType } from "@prisma/client";
import { Search } from "lucide-react";

interface InventoryFiltersProps {
  locations: Array<{
    id: string;
    name: string;
  }>;
  movementTypes: MovementType[];
  filters: {
    query: string;
    locationId: string;
    stockStatus: string;
    movementType: string;
  };
}

export function InventoryFilters({
  filters,
  locations,
  movementTypes,
}: InventoryFiltersProps) {
  return (
    <form
      className="grid gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm xl:grid-cols-[1.4fr_0.9fr_0.9fr_1fr_auto]"
      method="GET"
    >
      <label className="relative block">
        <span className="sr-only">Buscar por producto o SKU</span>
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400"
        />
        <input
          className="h-10 w-full rounded-md border border-zinc-300 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
          defaultValue={filters.query}
          name="q"
          placeholder="Buscar por producto o SKU"
          type="search"
        />
      </label>

      <label>
        <span className="sr-only">Ubicacion</span>
        <select
          className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
          defaultValue={filters.locationId}
          name="location"
        >
          <option value="">Todas las ubicaciones</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span className="sr-only">Estado de stock</span>
        <select
          className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
          defaultValue={filters.stockStatus}
          name="stockStatus"
        >
          <option value="all">Todos los estados</option>
          <option value="ok">OK</option>
          <option value="low">Bajo stock</option>
          <option value="out">Sin stock</option>
        </select>
      </label>

      <label>
        <span className="sr-only">Tipo de movimiento</span>
        <select
          className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
          defaultValue={filters.movementType}
          name="movementType"
        >
          <option value="all">Todos los movimientos</option>
          {movementTypes.map((type) => (
            <option key={type} value={type}>
              {type.toLowerCase()}
            </option>
          ))}
        </select>
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
