type ReportsData = Awaited<
  ReturnType<typeof import("@/lib/tenant").getReportsOverview>
>;

interface ReportsSummaryTablesProps {
  tables: ReportsData["tables"];
}

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export function ReportsSummaryTables({ tables }: ReportsSummaryTablesProps) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <section className="rounded-lg border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-200 px-5 py-4">
          <h3 className="text-sm font-semibold text-zinc-950">
            Productos con mas venta
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-5 py-3 font-medium">Producto</th>
                <th className="px-5 py-3 font-medium">Categoria</th>
                <th className="px-5 py-3 font-medium">Unidades</th>
                <th className="px-5 py-3 font-medium">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {tables.topProducts.length === 0 ? (
                <tr>
                  <td className="px-5 py-6 text-center text-zinc-500" colSpan={4}>
                    Sin productos vendidos en el periodo.
                  </td>
                </tr>
              ) : (
                tables.topProducts.map((product) => (
                  <tr key={product.productName}>
                    <td className="px-5 py-4 font-medium text-zinc-950">
                      {product.productName}
                    </td>
                    <td className="px-5 py-4 text-zinc-600">
                      {product.categoryName}
                    </td>
                    <td className="px-5 py-4 font-mono">{product.quantity}</td>
                    <td className="px-5 py-4 font-mono">
                      {currencyFormatter.format(product.revenue)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-200 px-5 py-4">
          <h3 className="text-sm font-semibold text-zinc-950">
            Variantes con stock bajo
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-5 py-3 font-medium">Producto</th>
                <th className="px-5 py-3 font-medium">SKU</th>
                <th className="px-5 py-3 font-medium">Ubicacion</th>
                <th className="px-5 py-3 font-medium">Disponible</th>
                <th className="px-5 py-3 font-medium">Umbral</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {tables.lowStockLevels.length === 0 ? (
                <tr>
                  <td className="px-5 py-6 text-center text-zinc-500" colSpan={5}>
                    No hay variantes bajo el umbral.
                  </td>
                </tr>
              ) : (
                tables.lowStockLevels.map((level) => (
                  <tr key={level.id}>
                    <td className="px-5 py-4">
                      <div className="font-medium text-zinc-950">
                        {level.productName}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {level.variantName}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-zinc-600">
                      {level.sku}
                    </td>
                    <td className="px-5 py-4 text-zinc-600">
                      {level.locationName}
                    </td>
                    <td className="px-5 py-4 font-mono">{level.available}</td>
                    <td className="px-5 py-4 font-mono">{level.threshold}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
