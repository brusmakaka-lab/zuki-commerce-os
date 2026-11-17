import Link from "next/link";
import type {
  OrderChannel,
  OrderStatus,
  PaymentStatus,
} from "@prisma/client";

import { StatusBadge } from "@/components/modules/orders/order-badges";

interface OrderRow {
  id: string;
  number: number;
  channel: OrderChannel;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  total: number;
  createdAt: Date;
  customerName: string;
  customerPhone: string | null;
  itemCount: number;
}

interface OrdersTableProps {
  orders: OrderRow[];
  organizationSlug: string;
}

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function OrdersTable({ orders, organizationSlug }: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <section className="rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-base font-semibold">No hay pedidos para mostrar</h2>
        <p className="mt-2 text-sm text-zinc-500">
          Ajusta los filtros para volver a ver pedidos del tenant.
        </p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-zinc-50">
            <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500">
              <th className="px-4 py-3 font-medium">Pedido</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Canal</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Pago</th>
              <th className="px-4 py-3 text-right font-medium">Items</th>
              <th className="px-4 py-3 text-right font-medium">Total</th>
              <th className="px-4 py-3 text-right font-medium">Fecha</th>
              <th className="px-4 py-3 text-right font-medium">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                className="border-b border-zinc-100 last:border-b-0"
                key={order.id}
              >
                <td className="px-4 py-4 font-mono font-semibold">
                  #{order.number}
                </td>
                <td className="px-4 py-4">
                  <div className="font-medium text-zinc-950">
                    {order.customerName}
                  </div>
                  <div className="mt-1 text-xs text-zinc-500">
                    {order.customerPhone ?? "Sin telefono"}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <StatusBadge value={order.channel} />
                </td>
                <td className="px-4 py-4">
                  <StatusBadge type="order" value={order.status} />
                </td>
                <td className="px-4 py-4">
                  <StatusBadge type="payment" value={order.paymentStatus} />
                </td>
                <td className="px-4 py-4 text-right font-mono">
                  {order.itemCount}
                </td>
                <td className="px-4 py-4 text-right font-mono font-semibold">
                  {currencyFormatter.format(order.total)}
                </td>
                <td className="px-4 py-4 text-right text-zinc-500">
                  {dateFormatter.format(order.createdAt)}
                </td>
                <td className="px-4 py-4 text-right">
                  <Link
                    className="font-medium text-zinc-950 underline-offset-4 hover:underline"
                    href={`/${organizationSlug}/orders/${order.id}`}
                  >
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
