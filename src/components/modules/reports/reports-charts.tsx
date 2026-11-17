"use client";

import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ReportsData = Awaited<
  ReturnType<typeof import("@/lib/tenant").getReportsOverview>
>;

interface ReportsChartsProps {
  charts: ReportsData["charts"];
}

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const colors = ["#18181b", "#0f766e", "#2563eb", "#9333ea", "#ea580c", "#64748b"];

function ChartShell({
  children,
  title,
  empty,
}: {
  children: ReactNode;
  title: string;
  empty: boolean;
}) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-zinc-950">{title}</h3>
      <div className="mt-4 h-72">
        {empty ? (
          <div className="flex h-full items-center justify-center rounded-md bg-zinc-50 text-sm text-zinc-500">
            Sin datos para el periodo seleccionado.
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}

export function ReportsCharts({ charts }: ReportsChartsProps) {
  const salesByChannel = charts.salesByChannel.filter(
    (channel) => channel.sales > 0 || channel.orders > 0,
  );
  const ordersByStatus = charts.ordersByStatus.filter(
    (status) => status.orders > 0,
  );
  const lowStockByCategory = charts.lowStockByCategory.filter(
    (category) => category.variants > 0,
  );

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <ChartShell
        empty={charts.salesByDay.length === 0}
        title="Ventas por dia"
      >
        <ResponsiveContainer height="100%" width="100%">
          <LineChart data={charts.salesByDay}>
            <CartesianGrid stroke="#e4e4e7" strokeDasharray="3 3" />
            <XAxis dataKey="date" fontSize={12} tickLine={false} />
            <YAxis
              fontSize={12}
              tickFormatter={(value) => currencyFormatter.format(Number(value))}
              tickLine={false}
              width={82}
            />
            <Tooltip
              formatter={(value, name) => [
                name === "sales"
                  ? currencyFormatter.format(Number(value))
                  : Number(value),
                name === "sales" ? "Ventas" : "Pedidos",
              ]}
            />
            <Legend />
            <Line
              dataKey="sales"
              name="Ventas"
              stroke="#18181b"
              strokeWidth={2}
              type="monotone"
            />
            <Line
              dataKey="orders"
              name="Pedidos"
              stroke="#0f766e"
              strokeWidth={2}
              type="monotone"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartShell>

      <ChartShell empty={salesByChannel.length === 0} title="Ventas por canal">
        <ResponsiveContainer height="100%" width="100%">
          <PieChart>
            <Pie
              data={salesByChannel}
              dataKey="sales"
              innerRadius={58}
              nameKey="channel"
              outerRadius={96}
              paddingAngle={3}
            >
              {salesByChannel.map((entry, index) => (
                <Cell
                  fill={colors[index % colors.length]}
                  key={entry.channel}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => currencyFormatter.format(Number(value))}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </ChartShell>

      <ChartShell
        empty={ordersByStatus.length === 0}
        title="Pedidos por estado"
      >
        <ResponsiveContainer height="100%" width="100%">
          <BarChart data={ordersByStatus}>
            <CartesianGrid stroke="#e4e4e7" strokeDasharray="3 3" />
            <XAxis dataKey="status" fontSize={12} tickLine={false} />
            <YAxis allowDecimals={false} fontSize={12} tickLine={false} />
            <Tooltip />
            <Bar dataKey="orders" fill="#2563eb" name="Pedidos" radius={4} />
          </BarChart>
        </ResponsiveContainer>
      </ChartShell>

      <ChartShell
        empty={charts.topProducts.length === 0}
        title="Top productos vendidos"
      >
        <ResponsiveContainer height="100%" width="100%">
          <BarChart data={charts.topProducts} layout="vertical">
            <CartesianGrid stroke="#e4e4e7" strokeDasharray="3 3" />
            <XAxis allowDecimals={false} fontSize={12} type="number" />
            <YAxis
              dataKey="productName"
              fontSize={12}
              tickLine={false}
              type="category"
              width={120}
            />
            <Tooltip />
            <Bar dataKey="quantity" fill="#0f766e" name="Unidades" radius={4} />
          </BarChart>
        </ResponsiveContainer>
      </ChartShell>

      <ChartShell
        empty={lowStockByCategory.length === 0}
        title="Stock bajo por categoria"
      >
        <ResponsiveContainer height="100%" width="100%">
          <BarChart data={lowStockByCategory}>
            <CartesianGrid stroke="#e4e4e7" strokeDasharray="3 3" />
            <XAxis dataKey="categoryName" fontSize={12} tickLine={false} />
            <YAxis allowDecimals={false} fontSize={12} tickLine={false} />
            <Tooltip />
            <Bar dataKey="variants" fill="#ea580c" name="Variantes" radius={4} />
          </BarChart>
        </ResponsiveContainer>
      </ChartShell>
    </div>
  );
}
