import type { MovementType } from "@prisma/client";

interface InventoryMovementRow {
  id: string;
  type: MovementType;
  productName: string;
  variantName: string;
  sku: string;
  locationName: string;
  quantity: number;
  quantityBefore: number;
  quantityAfter: number;
  reference: string | null;
  referenceType: string | null;
  createdAt: Date;
}

interface InventoryMovementsTableProps {
  movements: InventoryMovementRow[];
}

const dateTimeFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export function InventoryMovementsTable({
  movements,
}: InventoryMovementsTableProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-200 px-5 py-4">
        <h2 className="text-base font-semibold">Ultimos movimientos</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Auditoria operativa de entradas, ajustes y transferencias.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-zinc-50">
            <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500">
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Producto / Variante</th>
              <th className="px-4 py-3 font-medium">Ubicacion</th>
              <th className="px-4 py-3 text-right font-medium">Cantidad</th>
              <th className="px-4 py-3 text-right font-medium">Antes</th>
              <th className="px-4 py-3 text-right font-medium">Despues</th>
              <th className="px-4 py-3 font-medium">Referencia</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((movement) => (
              <tr
                className="border-b border-zinc-100 last:border-b-0"
                key={movement.id}
              >
                <td className="px-4 py-4 text-zinc-600">
                  {dateTimeFormatter.format(movement.createdAt)}
                </td>
                <td className="px-4 py-4">
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                    {movement.type.toLowerCase()}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="font-medium text-zinc-950">
                    {movement.productName}
                  </div>
                  <div className="mt-1 text-xs text-zinc-500">
                    {movement.variantName} · {movement.sku}
                  </div>
                </td>
                <td className="px-4 py-4 text-zinc-600">
                  {movement.locationName}
                </td>
                <td className="px-4 py-4 text-right font-mono">
                  {movement.quantity}
                </td>
                <td className="px-4 py-4 text-right font-mono">
                  {movement.quantityBefore}
                </td>
                <td className="px-4 py-4 text-right font-mono font-semibold">
                  {movement.quantityAfter}
                </td>
                <td className="px-4 py-4 text-zinc-500">
                  {movement.reference
                    ? `${movement.referenceType ?? "ref"}:${movement.reference}`
                    : "Sin referencia"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
