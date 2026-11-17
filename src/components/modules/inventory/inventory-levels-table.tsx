type StockStatus = "ok" | "low" | "out";

interface InventoryLevelRow {
  id: string;
  productName: string;
  variantName: string;
  sku: string;
  locationName: string;
  quantity: number;
  reserved: number;
  available: number;
  lowStockThreshold: number;
  stockStatus: StockStatus;
}

interface InventoryLevelsTableProps {
  levels: InventoryLevelRow[];
}

const statusLabels: Record<StockStatus, string> = {
  ok: "OK",
  low: "Bajo stock",
  out: "Sin stock",
};

const statusClasses: Record<StockStatus, string> = {
  ok: "bg-emerald-100 text-emerald-800",
  low: "bg-amber-100 text-amber-800",
  out: "bg-rose-100 text-rose-800",
};

export function InventoryLevelsTable({ levels }: InventoryLevelsTableProps) {
  if (levels.length === 0) {
    return (
      <section className="rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-base font-semibold">No hay inventario para mostrar</h2>
        <p className="mt-2 text-sm text-zinc-500">
          Ajusta los filtros para volver a ver niveles de stock.
        </p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-200 px-5 py-4">
        <h2 className="text-base font-semibold">Inventario por variante</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Niveles actuales por producto, variante y ubicacion.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="bg-zinc-50">
            <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500">
              <th className="px-4 py-3 font-medium">Producto</th>
              <th className="px-4 py-3 font-medium">Variante</th>
              <th className="px-4 py-3 font-medium">SKU</th>
              <th className="px-4 py-3 font-medium">Ubicacion</th>
              <th className="px-4 py-3 text-right font-medium">Cantidad</th>
              <th className="px-4 py-3 text-right font-medium">Reservado</th>
              <th className="px-4 py-3 text-right font-medium">Disponible</th>
              <th className="px-4 py-3 text-right font-medium">Umbral</th>
              <th className="px-4 py-3 text-right font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {levels.map((level) => (
              <tr
                className="border-b border-zinc-100 last:border-b-0"
                key={level.id}
              >
                <td className="px-4 py-4 font-medium text-zinc-950">
                  {level.productName}
                </td>
                <td className="px-4 py-4 text-zinc-600">
                  {level.variantName}
                </td>
                <td className="px-4 py-4 font-mono text-zinc-600">
                  {level.sku}
                </td>
                <td className="px-4 py-4 text-zinc-600">
                  {level.locationName}
                </td>
                <td className="px-4 py-4 text-right font-mono">
                  {level.quantity}
                </td>
                <td className="px-4 py-4 text-right font-mono">
                  {level.reserved}
                </td>
                <td className="px-4 py-4 text-right font-mono font-semibold">
                  {level.available}
                </td>
                <td className="px-4 py-4 text-right font-mono">
                  {level.lowStockThreshold}
                </td>
                <td className="px-4 py-4 text-right">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      statusClasses[level.stockStatus]
                    }`}
                  >
                    {statusLabels[level.stockStatus]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
