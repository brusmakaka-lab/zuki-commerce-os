import {
  OrderChannel,
  OrderStatus,
  PaymentStatus,
} from "@prisma/client";

import { OrdersOverview } from "@/components/modules/orders/orders-overview";
import {
  getOrdersList,
  requireOrganizationBySlug,
  type OrderListFilters,
} from "@/lib/tenant";

interface OrdersPageProps {
  params: Promise<{
    orgSlug: string;
  }>;
  searchParams: Promise<{
    q?: string;
    status?: string;
    paymentStatus?: string;
    channel?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
}

export const dynamic = "force-dynamic";

function parseOrderStatus(status?: string) {
  if (!status || status === "all") {
    return "all";
  }

  return Object.values(OrderStatus).includes(status as OrderStatus)
    ? (status as OrderStatus)
    : "all";
}

function parsePaymentStatus(status?: string) {
  if (!status || status === "all") {
    return "all";
  }

  return Object.values(PaymentStatus).includes(status as PaymentStatus)
    ? (status as PaymentStatus)
    : "all";
}

function parseOrderChannel(channel?: string) {
  if (!channel || channel === "all") {
    return "all";
  }

  return Object.values(OrderChannel).includes(channel as OrderChannel)
    ? (channel as OrderChannel)
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

export default async function OrdersPage({
  params,
  searchParams,
}: OrdersPageProps) {
  const { orgSlug } = await params;
  const rawFilters = await searchParams;
  const organization = await requireOrganizationBySlug(orgSlug);

  const filters: OrderListFilters = {
    query: rawFilters.q?.trim() ?? "",
    status: parseOrderStatus(rawFilters.status),
    paymentStatus: parsePaymentStatus(rawFilters.paymentStatus),
    channel: parseOrderChannel(rawFilters.channel),
    dateFrom: parseDate(rawFilters.dateFrom),
    dateTo: parseDate(rawFilters.dateTo, true),
  };

  const orders = await getOrdersList(organization.id, filters);

  return (
    <OrdersOverview
      filters={{
        query: filters.query ?? "",
        status: filters.status ?? "all",
        paymentStatus: filters.paymentStatus ?? "all",
        channel: filters.channel ?? "all",
        dateFrom: rawFilters.dateFrom ?? "",
        dateTo: rawFilters.dateTo ?? "",
      }}
      orders={orders}
      organization={organization}
    />
  );
}
