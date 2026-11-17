import { OrderChannel, OrderStatus } from "@prisma/client";

import { ReportsOverview } from "@/components/modules/reports/reports-overview";
import {
  getReportsOverview,
  requireOrganizationBySlug,
  type ReportsFilters,
} from "@/lib/tenant";

interface ReportsPageProps {
  params: Promise<{
    orgSlug: string;
  }>;
  searchParams: Promise<{
    dateFrom?: string;
    dateTo?: string;
    channel?: string;
    status?: string;
  }>;
}

export const dynamic = "force-dynamic";

function parseOrderChannel(channel?: string) {
  if (!channel || channel === "all") {
    return "all";
  }

  return Object.values(OrderChannel).includes(channel as OrderChannel)
    ? (channel as OrderChannel)
    : "all";
}

function parseOrderStatus(status?: string) {
  if (!status || status === "all") {
    return "all";
  }

  return Object.values(OrderStatus).includes(status as OrderStatus)
    ? (status as OrderStatus)
    : "all";
}

function parseDate(value?: string, endOfDay = false) {
  if (!value) {
    return undefined;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  if (endOfDay) {
    date.setUTCHours(23, 59, 59, 999);
  }

  return date;
}

export default async function ReportsPage({
  params,
  searchParams,
}: ReportsPageProps) {
  const { orgSlug } = await params;
  const rawFilters = await searchParams;
  const organization = await requireOrganizationBySlug(orgSlug);

  const filters: ReportsFilters = {
    dateFrom: parseDate(rawFilters.dateFrom),
    dateTo: parseDate(rawFilters.dateTo, true),
    channel: parseOrderChannel(rawFilters.channel),
    status: parseOrderStatus(rawFilters.status),
  };

  const reports = await getReportsOverview(organization.id, filters);

  return (
    <ReportsOverview
      filters={{
        dateFrom: rawFilters.dateFrom ?? "",
        dateTo: rawFilters.dateTo ?? "",
        channel: filters.channel ?? "all",
        status: filters.status ?? "all",
      }}
      organization={organization}
      reports={reports}
    />
  );
}
