import { MovementType } from "@prisma/client";

import { InventoryOverview } from "@/components/modules/inventory/inventory-overview";
import {
  getInventoryOverview,
  requireOrganizationBySlug,
  type InventoryFilters,
  type StockStatusFilter,
} from "@/lib/tenant";

interface InventoryPageProps {
  params: Promise<{
    orgSlug: string;
  }>;
  searchParams: Promise<{
    q?: string;
    location?: string;
    stockStatus?: string;
    movementType?: string;
  }>;
}

export const dynamic = "force-dynamic";

function parseStockStatus(status?: string): StockStatusFilter {
  if (status === "low" || status === "out" || status === "ok") {
    return status;
  }

  return "all";
}

function parseMovementType(type?: string) {
  if (!type || type === "all") {
    return "all";
  }

  return Object.values(MovementType).includes(type as MovementType)
    ? (type as MovementType)
    : "all";
}

export default async function InventoryPage({
  params,
  searchParams,
}: InventoryPageProps) {
  const { orgSlug } = await params;
  const rawFilters = await searchParams;
  const organization = await requireOrganizationBySlug(orgSlug);

  const filters: InventoryFilters = {
    query: rawFilters.q?.trim() ?? "",
    locationId: rawFilters.location ?? "",
    stockStatus: parseStockStatus(rawFilters.stockStatus),
    movementType: parseMovementType(rawFilters.movementType),
  };

  const inventory = await getInventoryOverview(organization.id, filters);

  return (
    <InventoryOverview
      filters={{
        query: filters.query ?? "",
        locationId: filters.locationId ?? "",
        stockStatus: filters.stockStatus ?? "all",
        movementType: filters.movementType ?? "all",
      }}
      inventory={inventory}
      organization={organization}
    />
  );
}
