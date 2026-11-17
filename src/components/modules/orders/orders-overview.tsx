import { ClipboardList, DollarSign } from "lucide-react";

import { OrdersFilters } from "@/components/modules/orders/orders-filters";
import { OrdersTable } from "@/components/modules/orders/orders-table";

interface OrdersOverviewProps {
  organization: {
    name: string;
    slug: string;
  };
  orders: Awaited<ReturnType<typeof import("@/lib/tenant").getOrdersList>>;
  filters: {
    query: string;
    status: string;
    paymentStatus: string;
    channel: string;
    dateFrom: string;
    dateTo: string;
  };
}

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export function OrdersOverview({
  filters,
  orders,
  organization,
}: OrdersOverviewProps) {
  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-medium text-zinc-500">
            Pedidos · {organization.slug}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            Pedidos de {organization.name}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
            Lectura multi-tenant de pedidos, clientes, pagos y estados reales
            desde Neon.
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-md bg-zinc-50 p-4">
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <ClipboardList className="size-4" aria-hidden="true" />
              Pedidos mostrados
            </div>
            <p className="mt-2 font-mono text-2xl font-semibold">
              {orders.summary.count}
            </p>
          </div>
          <div className="rounded-md bg-zinc-50 p-4">
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <DollarSign className="size-4" aria-hidden="true" />
              Total filtrado
            </div>
            <p className="mt-2 font-mono text-2xl font-semibold">
              {currencyFormatter.format(orders.summary.total)}
            </p>
          </div>
        </div>
      </section>

      <OrdersFilters filters={filters} />
      <OrdersTable orders={orders.orders} organizationSlug={organization.slug} />
    </div>
  );
}
