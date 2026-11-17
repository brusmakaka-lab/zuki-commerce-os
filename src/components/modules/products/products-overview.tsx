import { Plus } from "lucide-react";

import { ProductFilters } from "@/components/modules/products/product-filters";
import { ProductsTable } from "@/components/modules/products/products-table";

interface ProductsOverviewProps {
  organization: {
    name: string;
    slug: string;
  };
  catalog: Awaited<ReturnType<typeof import("@/lib/tenant").getProductCatalog>>;
  filters: {
    query: string;
    status: string;
    categoryId: string;
    lowStock: boolean;
  };
}

export function ProductsOverview({
  catalog,
  filters,
  organization,
}: ProductsOverviewProps) {
  const totalStock = catalog.products.reduce(
    (sum, product) => sum + product.stockTotal,
    0,
  );
  const availableStock = catalog.products.reduce(
    (sum, product) => sum + product.stockAvailable,
    0,
  );

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500">
              Productos · {organization.slug}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Catalogo de {organization.name}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
              Lectura operativa del catalogo multi-tenant con variantes,
              precios y stock consolidado desde Neon.
            </p>
          </div>
          <button
            className="inline-flex h-10 w-fit items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800"
            type="button"
          >
            <Plus className="size-4" aria-hidden="true" />
            Nuevo producto
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-md bg-zinc-50 p-4">
            <p className="text-sm text-zinc-500">Productos mostrados</p>
            <p className="mt-2 font-mono text-2xl font-semibold">
              {catalog.products.length}
            </p>
          </div>
          <div className="rounded-md bg-zinc-50 p-4">
            <p className="text-sm text-zinc-500">Stock total</p>
            <p className="mt-2 font-mono text-2xl font-semibold">
              {totalStock}
            </p>
          </div>
          <div className="rounded-md bg-zinc-50 p-4">
            <p className="text-sm text-zinc-500">Stock disponible</p>
            <p className="mt-2 font-mono text-2xl font-semibold">
              {availableStock}
            </p>
          </div>
        </div>
      </section>

      <ProductFilters categories={catalog.categories} filters={filters} />
      <ProductsTable products={catalog.products} />
    </div>
  );
}
