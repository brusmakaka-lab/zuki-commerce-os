import type { Prisma } from "@prisma/client";

import { StatusBadge } from "@/components/modules/orders/order-badges";

type OrderDetail = NonNullable<
  Awaited<ReturnType<typeof import("@/lib/tenant").getOrderDetail>>
>;

interface OrderDetailViewProps {
  organization: {
    name: string;
    slug: string;
  };
  order: OrderDetail;
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
  hour: "2-digit",
  minute: "2-digit",
});

function formatDate(date: Date | null) {
  return date ? dateFormatter.format(date) : "No registrado";
}

function stringifyJson(value: Prisma.JsonValue | null) {
  if (value === null) {
    return "Sin datos";
  }

  return JSON.stringify(value, null, 2);
}

function readSnapshotLabel(snapshot: Prisma.JsonValue, fallback: string) {
  if (typeof snapshot !== "object" || snapshot === null || Array.isArray(snapshot)) {
    return fallback;
  }

  const name = snapshot.name;
  const variantName = snapshot.variantName;

  return [typeof name === "string" ? name : fallback, typeof variantName === "string" ? variantName : null]
    .filter(Boolean)
    .join(" / ");
}

export function OrderDetailView({ order, organization }: OrderDetailViewProps) {
  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500">
              {organization.name} · pedido
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Pedido #{order.number}
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Creado {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge value={order.channel} />
            <StatusBadge type="order" value={order.status} />
            <StatusBadge type="payment" value={order.paymentStatus} />
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-md bg-zinc-50 p-4">
            <p className="text-sm text-zinc-500">Subtotal</p>
            <p className="mt-2 font-mono text-xl font-semibold">
              {currencyFormatter.format(order.subtotal)}
            </p>
          </div>
          <div className="rounded-md bg-zinc-50 p-4">
            <p className="text-sm text-zinc-500">Descuento</p>
            <p className="mt-2 font-mono text-xl font-semibold">
              {currencyFormatter.format(order.discount)}
            </p>
          </div>
          <div className="rounded-md bg-zinc-50 p-4">
            <p className="text-sm text-zinc-500">Impuestos</p>
            <p className="mt-2 font-mono text-xl font-semibold">
              {currencyFormatter.format(order.tax)}
            </p>
          </div>
          <div className="rounded-md bg-zinc-950 p-4 text-white">
            <p className="text-sm text-zinc-300">Total</p>
            <p className="mt-2 font-mono text-xl font-semibold">
              {currencyFormatter.format(order.total)}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold">Cliente</h3>
          {order.customer ? (
            <div className="mt-4 space-y-3 text-sm">
              <p>
                <span className="text-zinc-500">Nombre: </span>
                <span className="font-medium">{order.customer.name}</span>
              </p>
              <p>
                <span className="text-zinc-500">Email: </span>
                {order.customer.email ?? "Sin email"}
              </p>
              <p>
                <span className="text-zinc-500">Telefono: </span>
                {order.customer.phone ?? "Sin telefono"}
              </p>
              <p>
                <span className="text-zinc-500">Pedidos historicos: </span>
                {order.customer.totalOrders}
              </p>
              <p>
                <span className="text-zinc-500">Gasto historico: </span>
                {currencyFormatter.format(order.customer.totalSpent)}
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-zinc-500">Cliente no asignado.</p>
          )}
        </article>

        <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold">Fechas del pedido</h3>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <p>
              <span className="text-zinc-500">Confirmado: </span>
              {formatDate(order.confirmedAt)}
            </p>
            <p>
              <span className="text-zinc-500">Completado: </span>
              {formatDate(order.completedAt)}
            </p>
            <p>
              <span className="text-zinc-500">Cancelado: </span>
              {formatDate(order.cancelledAt)}
            </p>
            <p>
              <span className="text-zinc-500">Actualizado: </span>
              {formatDate(order.updatedAt)}
            </p>
          </div>
        </article>
      </section>

      <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-200 px-5 py-4">
          <h3 className="text-base font-semibold">Items</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-zinc-50">
              <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500">
                <th className="px-4 py-3 font-medium">Producto</th>
                <th className="px-4 py-3 font-medium">SKU</th>
                <th className="px-4 py-3 text-right font-medium">Cantidad</th>
                <th className="px-4 py-3 text-right font-medium">Unitario</th>
                <th className="px-4 py-3 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr className="border-b border-zinc-100 last:border-b-0" key={item.id}>
                  <td className="px-4 py-4">
                    <div className="font-medium">
                      {readSnapshotLabel(item.snapshot, item.variant.product.name)}
                    </div>
                    <pre className="mt-2 max-w-xl overflow-auto rounded-md bg-zinc-50 p-2 text-xs text-zinc-600">
                      {stringifyJson(item.snapshot)}
                    </pre>
                  </td>
                  <td className="px-4 py-4 font-mono text-zinc-600">
                    {item.variant.sku}
                  </td>
                  <td className="px-4 py-4 text-right font-mono">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-4 text-right font-mono">
                    {currencyFormatter.format(item.unitPrice)}
                  </td>
                  <td className="px-4 py-4 text-right font-mono font-semibold">
                    {currencyFormatter.format(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold">Pagos</h3>
          <div className="mt-4 space-y-3">
            {order.payments.length > 0 ? (
              order.payments.map((payment) => (
                <div className="rounded-md border border-zinc-200 p-4" key={payment.id}>
                  <div className="flex items-center justify-between gap-3">
                    <StatusBadge value={payment.method} />
                    <span className="font-mono font-semibold">
                      {currencyFormatter.format(payment.amount)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-500">
                    {payment.gateway ?? "manual"} · {payment.status} ·{" "}
                    {formatDate(payment.paidAt)}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Ref: {payment.reference ?? "sin referencia"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-zinc-500">Sin pagos registrados.</p>
            )}
          </div>
        </article>

        <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold">Timeline</h3>
          <div className="mt-4 space-y-3">
            {order.events.map((event) => (
              <div className="rounded-md border border-zinc-200 p-4" key={event.id}>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium">{event.type}</span>
                  <span className="text-xs text-zinc-500">
                    {formatDate(event.createdAt)}
                  </span>
                </div>
                <p className="mt-2 text-xs text-zinc-500">
                  Por {event.createdByName ?? "Sistema"}
                </p>
                <pre className="mt-2 overflow-auto rounded-md bg-zinc-50 p-2 text-xs text-zinc-600">
                  {stringifyJson(event.payload)}
                </pre>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold">Movimientos de inventario</h3>
        <div className="mt-4 space-y-3">
          {order.movements.length > 0 ? (
            order.movements.map((movement) => (
              <div className="rounded-md border border-zinc-200 p-4" key={movement.id}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">
                      {movement.variant.product.name} / {movement.variant.name}
                    </p>
                    <p className="mt-1 font-mono text-xs text-zinc-500">
                      {movement.variant.sku} · {movement.location.name}
                    </p>
                  </div>
                  <StatusBadge value={movement.type} />
                </div>
                <p className="mt-3 text-sm text-zinc-600">
                  Cantidad {movement.quantity} · antes {movement.quantityBefore} · despues{" "}
                  {movement.quantityAfter}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-zinc-500">
              No hay movimientos relacionados por referencia para este pedido.
            </p>
          )}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold">Notas</h3>
          <p className="mt-3 text-sm text-zinc-600">
            Cliente: {order.notes ?? "Sin notas"}
          </p>
          <p className="mt-2 text-sm text-zinc-600">
            Internas: {order.internalNotes ?? "Sin notas internas"}
          </p>
        </article>
        <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold">Metadata</h3>
          <pre className="mt-3 overflow-auto rounded-md bg-zinc-50 p-3 text-xs text-zinc-600">
            {stringifyJson(order.metadata)}
          </pre>
        </article>
      </section>
    </div>
  );
}
