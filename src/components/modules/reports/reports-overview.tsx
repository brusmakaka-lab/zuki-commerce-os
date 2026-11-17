import { Download, Store } from "lucide-react";

import { ReportsCharts } from "@/components/modules/reports/reports-charts";
import { ReportsFilters } from "@/components/modules/reports/reports-filters";
import { ReportsKpis } from "@/components/modules/reports/reports-kpis";
import { ReportsSummaryTables } from "@/components/modules/reports/reports-summary-tables";

interface ReportsOverviewProps {
  organization: {
    name: string;
    slug: string;
  };
  reports: Awaited<ReturnType<typeof import("@/lib/tenant").getReportsOverview>>;
  filters: {
    dateFrom: string;
    dateTo: string;
    channel: string;
    status: string;
  };
}

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export function ReportsOverview({
  filters,
  organization,
  reports,
}: ReportsOverviewProps) {
  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500">
              Reportes - {organization.slug}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Analitica comercial de {organization.name}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
              Lectura multi-tenant de ventas, pedidos, clientes, inventario y
              conversaciones WhatsApp desde Neon.
            </p>
          </div>

          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-zinc-300 px-4 text-sm font-medium text-zinc-400"
            disabled
            type="button"
          >
            <Download className="size-4" aria-hidden="true" />
            Exportar reporte
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-md bg-zinc-50 p-4">
            <p className="text-sm text-zinc-500">Ventas POS</p>
            <p className="mt-2 font-mono text-xl font-semibold">
              {currencyFormatter.format(reports.kpis.posSales)}
            </p>
          </div>
          <div className="rounded-md bg-zinc-50 p-4">
            <p className="text-sm text-zinc-500">Ventas web/manual</p>
            <p className="mt-2 font-mono text-xl font-semibold">
              {currencyFormatter.format(
                reports.kpis.webSales + reports.kpis.manualSales,
              )}
            </p>
          </div>
          <div className="rounded-md bg-zinc-50 p-4">
            <p className="text-sm text-zinc-500">Conversaciones WhatsApp</p>
            <p className="mt-2 font-mono text-xl font-semibold">
              {reports.kpis.conversations}
            </p>
          </div>
          <div className="rounded-md bg-zinc-50 p-4">
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Store className="size-4" aria-hidden="true" />
              Canales con venta
            </div>
            <p className="mt-2 font-mono text-xl font-semibold">
              {
                reports.tables.channelSummary.filter(
                  (channel) => channel.sales > 0,
                ).length
              }
            </p>
          </div>
        </div>
      </section>

      <ReportsFilters filters={filters} />
      <ReportsKpis kpis={reports.kpis} />
      <ReportsCharts charts={reports.charts} />
      <ReportsSummaryTables tables={reports.tables} />
    </div>
  );
}
