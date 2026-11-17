import type { ProductStatus } from "@prisma/client";

interface ProductRow {
  id: string;
  name: string;
  categoryName: string;
  status: ProductStatus;
  variantCount: number;
  minPrice: number;
  maxPrice: number;
  stockTotal: number;
  stockReserved: number;
  stockAvailable: number;
  isLowStock: boolean;
  updatedAt: Date;
}

interface ProductsTableProps {
  products: ProductRow[];
}

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function formatPriceRange(minPrice: number, maxPrice: number) {
  if (minPrice === maxPrice) {
    return currencyFormatter.format(minPrice);
  }

  return `${currencyFormatter.format(minPrice)} - ${currencyFormatter.format(
    maxPrice,
  )}`;
}

export function ProductsTable({ products }: ProductsTableProps) {
  if (products.length === 0) {
    return (
      <section className="rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-base font-semibold">No hay productos para mostrar</h2>
        <p className="mt-2 text-sm text-zinc-500">
          Ajusta los filtros para volver a ver el catalogo del tenant.
        </p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-zinc-50">
            <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500">
              <th className="px-4 py-3 font-medium">Producto</th>
              <th className="px-4 py-3 font-medium">Categoria</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 text-right font-medium">Variantes</th>
              <th className="px-4 py-3 text-right font-medium">Precio</th>
              <th className="px-4 py-3 text-right font-medium">Stock</th>
              <th className="px-4 py-3 text-right font-medium">Reservado</th>
              <th className="px-4 py-3 text-right font-medium">Disponible</th>
              <th className="px-4 py-3 text-right font-medium">Actualizado</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                className="border-b border-zinc-100 last:border-b-0"
                key={product.id}
              >
                <td className="px-4 py-4">
                  <div className="font-medium text-zinc-950">{product.name}</div>
                  {product.isLowStock ? (
                    <div className="mt-1 text-xs font-medium text-amber-700">
                      Stock bajo
                    </div>
                  ) : null}
                </td>
                <td className="px-4 py-4 text-zinc-600">
                  {product.categoryName}
                </td>
                <td className="px-4 py-4">
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                    {product.status.toLowerCase()}
                  </span>
                </td>
                <td className="px-4 py-4 text-right font-mono">
                  {product.variantCount}
                </td>
                <td className="px-4 py-4 text-right font-mono">
                  {formatPriceRange(product.minPrice, product.maxPrice)}
                </td>
                <td className="px-4 py-4 text-right font-mono">
                  {product.stockTotal}
                </td>
                <td className="px-4 py-4 text-right font-mono">
                  {product.stockReserved}
                </td>
                <td className="px-4 py-4 text-right font-mono font-semibold">
                  {product.stockAvailable}
                </td>
                <td className="px-4 py-4 text-right text-zinc-500">
                  {dateFormatter.format(product.updatedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
