import {
  AlertTriangle,
  ArrowRightLeft,
  Boxes,
  MapPin,
  PackageCheck,
  PackageOpen,
  ShieldCheck,
} from "lucide-react";

import { InventoryFilters } from "@/components/modules/inventory/inventory-filters";
import { InventoryLevelsTable } from "@/components/modules/inventory/inventory-levels-table";
import { InventoryMovementsTable } from "@/components/modules/inventory/inventory-movements-table";
import { InventorySummary } from "@/components/modules/inventory/inventory-summary";

interface InventoryOverviewProps {
  organization: {
    name: string;
    slug: string;
  };
  inventory: Awaited<
    ReturnType<typeof import("@/lib/tenant").getInventoryOverview>
  >;
  filters: {
    query: string;
    locationId: string;
    stockStatus: string;
    movementType: string;
  };
}

export function InventoryOverview({
  filters,
  inventory,
  organization,
}: InventoryOverviewProps) {
  const summaryItems = [
    {
      label: "Stock total",
      value: inventory.summary.stockTotal.toString(),
      helper: "Unidades fisicas registradas",
      icon: Boxes,
    },
    {
      label: "Disponible",
      value: inventory.summary.stockAvailable.toString(),
      helper: "Cantidad menos reservas",
      icon: PackageCheck,
    },
    {
      label: "Reservado",
      value: inventory.summary.stockReserved.toString(),
      helper: "Unidades retenidas por pedidos",
      icon: ShieldCheck,
    },
    {
      label: "Entrante",
      value: inventory.summary.stockIncoming.toString(),
      helper: "Stock en transito registrado",
      icon: PackageOpen,
    },
    {
      label: "Bajo stock",
      value: inventory.summary.lowStockVariants.toString(),
      helper: `Umbral: ${inventory.lowStockThreshold} unidades`,
      icon: AlertTriangle,
    },
    {
      label: "Ubicaciones activas",
      value: inventory.summary.activeLocations.toString(),
      helper: "Locales, depositos y virtuales",
      icon: MapPin,
    },
    {
      label: "Movimientos recientes",
      value: inventory.summary.recentMovements.toString(),
      helper: "Ultimos registros filtrados",
      icon: ArrowRightLeft,
    },
  ];

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-medium text-zinc-500">
            Inventario · {organization.slug}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            Stock operativo de {organization.name}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
            Lectura multi-tenant de niveles de inventario y movimientos reales
            registrados en Neon.
          </p>
        </div>
      </section>

      <InventorySummary items={summaryItems} />

      <InventoryFilters
        filters={filters}
        locations={inventory.locations}
        movementTypes={inventory.movementTypes}
      />

      <InventoryLevelsTable levels={inventory.levels} />
      <InventoryMovementsTable movements={inventory.movements} />
    </div>
  );
}
