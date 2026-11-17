import { MonitorSmartphone } from "lucide-react";

import { PosTerminal } from "@/components/modules/pos/pos-terminal";

interface PosOverviewProps {
  organization: {
    name: string;
    slug: string;
  };
  catalog: Awaited<ReturnType<typeof import("@/lib/tenant").getPosCatalog>>;
}

export function PosOverview({ catalog, organization }: PosOverviewProps) {
  const variantCount = catalog.products.reduce(
    (sum, product) => sum + product.variants.length,
    0,
  );
  const availableVariants = catalog.products.reduce(
    (sum, product) =>
      sum + product.variants.filter((variant) => variant.available > 0).length,
    0,
  );

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500">
              POS - {organization.slug}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Caja de {organization.name}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
              Demo interactiva de venta presencial con productos, variantes y
              stock real del tenant. No crea pedidos ni modifica inventario.
            </p>
          </div>
          <div className="inline-flex h-10 w-fit items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white">
            <MonitorSmartphone className="size-4" aria-hidden="true" />
            Modo demo
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-md bg-zinc-50 p-4">
            <p className="text-sm text-zinc-500">Productos activos</p>
            <p className="mt-2 font-mono text-2xl font-semibold">
              {catalog.products.length}
            </p>
          </div>
          <div className="rounded-md bg-zinc-50 p-4">
            <p className="text-sm text-zinc-500">Variantes</p>
            <p className="mt-2 font-mono text-2xl font-semibold">
              {variantCount}
            </p>
          </div>
          <div className="rounded-md bg-zinc-50 p-4">
            <p className="text-sm text-zinc-500">Disponibles para venta</p>
            <p className="mt-2 font-mono text-2xl font-semibold">
              {availableVariants}
            </p>
          </div>
        </div>
      </section>

      <PosTerminal catalog={catalog} />
    </div>
  );
}
