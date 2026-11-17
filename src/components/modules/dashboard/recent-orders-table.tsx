import type { OrderChannel, OrderStatus, PaymentStatus } from "@prisma/client";

interface RecentOrder {
  id: string;
  number: number;
  channel: OrderChannel;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  total: number;
  createdAt: Date;
  customer: {
    name: string;
  } | null;
}

interface RecentOrdersTableProps {
  orders: RecentOrder[];
}

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "short",
});

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-base font-semibold">Pedidos recientes</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Últimos movimientos comerciales del tenant.
        </p>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500">
              <th className="py-3 font-medium">Pedido</th>
              <th className="py-3 font-medium">Cliente</th>
              <th className="py-3 font-medium">Canal</th>
              <th className="py-3 font-medium">Estado</th>
              <th className="py-3 font-medium">Pago</th>
              <th className="py-3 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr className="border-b border-zinc-100 last:border-0" key={order.id}>
                <td className="py-3 font-mono text-zinc-950">
                  #{order.number}
                  <span className="ml-2 font-sans text-xs text-zinc-500">
                    {dateFormatter.format(order.createdAt)}
                  </span>
                </td>
                <td className="py-3 text-zinc-700">
                  {order.customer?.name ?? "Cliente sin asignar"}
                </td>
                <td className="py-3 text-zinc-600">{order.channel}</td>
                <td className="py-3">
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                    {order.status.toLowerCase()}
                  </span>
                </td>
                <td className="py-3 text-zinc-600">
                  {order.paymentStatus.toLowerCase()}
                </td>
                <td className="py-3 text-right font-mono font-semibold">
                  {currencyFormatter.format(order.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
