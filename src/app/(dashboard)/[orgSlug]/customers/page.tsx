import { ArgentinaProv } from "@prisma/client";

import { CustomersOverview } from "@/components/modules/customers/customers-overview";
import {
  getCustomersList,
  requireOrganizationBySlug,
  type CustomerListFilters,
} from "@/lib/tenant";

interface CustomersPageProps {
  params: Promise<{
    orgSlug: string;
  }>;
  searchParams: Promise<{
    q?: string;
    tag?: string;
    province?: string;
    minSpent?: string;
    hasOrders?: string;
  }>;
}

export const dynamic = "force-dynamic";

function parseProvince(province?: string) {
  if (!province || province === "all") {
    return "all";
  }

  return Object.values(ArgentinaProv).includes(province as ArgentinaProv)
    ? (province as ArgentinaProv)
    : "all";
}

function parseMinSpent(value?: string) {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseHasOrders(value?: string) {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return undefined;
}

export default async function CustomersPage({
  params,
  searchParams,
}: CustomersPageProps) {
  const { orgSlug } = await params;
  const rawFilters = await searchParams;
  const organization = await requireOrganizationBySlug(orgSlug);

  const filters: CustomerListFilters = {
    query: rawFilters.q?.trim() ?? "",
    tag: rawFilters.tag ?? "",
    province: parseProvince(rawFilters.province),
    minSpent: parseMinSpent(rawFilters.minSpent),
    hasOrders: parseHasOrders(rawFilters.hasOrders),
  };

  const customers = await getCustomersList(organization.id, filters);

  return (
    <CustomersOverview
      customers={customers}
      filters={{
        query: filters.query ?? "",
        tag: filters.tag ?? "",
        province: filters.province ?? "all",
        minSpent: rawFilters.minSpent ?? "",
        hasOrders: rawFilters.hasOrders ?? "all",
      }}
      organization={organization}
    />
  );
}
