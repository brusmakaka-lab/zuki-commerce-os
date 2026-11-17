import {
  MessageCircle,
  PackageCheck,
  ReceiptText,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";

interface ReportsKpisProps {
  kpis: Awaited<ReturnType<typeof import("@/lib/tenant").getReportsOverview>>["kpis"];
}

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("es-AR");

export function ReportsKpis({ kpis }: ReportsKpisProps) {
  const cards = [
    {
      label: "Ventas totales",
      value: currencyFormatter.format(kpis.totalSales),
      icon: TrendingUp,
    },
    {
      label: "Pedidos",
      value: numberFormatter.format(kpis.orderCount),
      icon: ReceiptText,
    },
    {
      label: "Ticket promedio",
      value: currencyFormatter.format(kpis.averageTicket),
      icon: ShoppingBag,
    },
    {
      label: "Clientes nuevos",
      value: numberFormatter.format(kpis.newCustomers),
      icon: Users,
    },
    {
      label: "Productos vendidos",
      value: numberFormatter.format(kpis.productsSold),
      icon: PackageCheck,
    },
    {
      label: "Ventas WhatsApp",
      value: currencyFormatter.format(kpis.whatsAppSales),
      icon: MessageCircle,
    },
  ] as const;

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
            key={card.label}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-zinc-500">{card.label}</p>
              <Icon className="size-4 text-zinc-400" aria-hidden="true" />
            </div>
            <p className="mt-3 font-mono text-2xl font-semibold tracking-tight text-zinc-950">
              {card.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
