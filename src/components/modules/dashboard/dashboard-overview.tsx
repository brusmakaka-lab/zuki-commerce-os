import {
  AlertTriangle,
  PackageCheck,
  ShoppingCart,
  TrendingUp,
  Users,
  WalletCards,
} from "lucide-react";

import { AiInsightsList } from "@/components/modules/dashboard/ai-insights-list";
import { LowStockList } from "@/components/modules/dashboard/low-stock-list";
import { MetricCard } from "@/components/modules/dashboard/metric-card";
import { RecentOrdersTable } from "@/components/modules/dashboard/recent-orders-table";

interface DashboardOverviewProps {
  organization: {
    name: string;
    slug: string;
    currency: string;
    timezone: string;
  };
  dashboard: Awaited<ReturnType<typeof import("@/lib/tenant").getDashboardMetrics>>;
}

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export function DashboardOverview({
  dashboard,
  organization,
}: DashboardOverviewProps) {
  const metrics = [
    {
      label: "Ventas totales",
      value: currencyFormatter.format(dashboard.totals.sales),
      helper: `${organization.currency} · datos reales de Neon`,
      icon: TrendingUp,
    },
    {
      label: "Pedidos totales",
      value: dashboard.totals.orders.toString(),
      helper: "Pedidos cargados en el tenant",
      icon: ShoppingCart,
    },
    {
      label: "Pedidos pendientes",
      value: dashboard.totals.pendingOrders.toString(),
      helper: "Requieren confirmación o cobro",
      icon: AlertTriangle,
    },
    {
      label: "Clientes",
      value: dashboard.totals.customers.toString(),
      helper: "Contactos y compradores registrados",
      icon: Users,
    },
    {
      label: "Productos activos",
      value: dashboard.totals.activeProducts.toString(),
      helper: "Catálogo publicado y vendible",
      icon: PackageCheck,
    },
    {
      label: "Stock bajo",
      value: dashboard.totals.lowStock.toString(),
      helper: `Umbral operativo: ${dashboard.lowStockThreshold} unidades`,
      icon: WalletCards,
    },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500">
              Overview · {organization.slug}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Operación comercial de {organization.name}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
              Vista inicial de lectura para validar multi-tenancy, ventas,
              inventario, WhatsApp e insights sobre datos reales de Neon.
            </p>
          </div>
          <div className="rounded-md bg-zinc-100 px-3 py-2 text-sm text-zinc-600">
            Zona horaria: {organization.timezone}
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <MetricCard
            helper={metric.helper}
            icon={metric.icon}
            key={metric.label}
            label={metric.label}
            value={metric.value}
          />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <AiInsightsList insights={dashboard.recentInsights} />
        <LowStockList
          products={dashboard.lowStockProducts}
          threshold={dashboard.lowStockThreshold}
        />
      </section>

      <RecentOrdersTable orders={dashboard.recentOrders} />
    </div>
  );
}
