interface LowStockProduct {
  id: string;
  productName: string;
  variantName: string;
  sku: string;
  locationName: string;
  quantity: number;
  reserved: number;
}

interface LowStockListProps {
  products: LowStockProduct[];
  threshold: number;
}

export function LowStockList({ products, threshold }: LowStockListProps) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-base font-semibold">Productos con menor stock</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Variantes en o por debajo del umbral de {threshold} unidades.
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {products.map((product) => (
          <article
            className="flex items-center justify-between gap-4 rounded-md border border-zinc-200 p-4"
            key={product.id}
          >
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-zinc-950">
                {product.productName}
              </h3>
              <p className="mt-1 truncate text-sm text-zinc-500">
                {product.variantName} · {product.locationName}
              </p>
              <p className="mt-2 font-mono text-xs text-zinc-500">
                {product.sku}
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-2xl font-semibold">
                {product.quantity}
              </p>
              <p className="text-xs text-zinc-500">
                {product.reserved} reservadas
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
