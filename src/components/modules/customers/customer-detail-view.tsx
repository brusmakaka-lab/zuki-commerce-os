import Link from "next/link";

import { CustomerTags } from "@/components/modules/customers/customer-tags";
import { StatusBadge } from "@/components/modules/orders/order-badges";

type CustomerDetail = NonNullable<
  Awaited<ReturnType<typeof import("@/lib/tenant").getCustomerDetail>>
>;

interface CustomerDetailViewProps {
  organization: {
    name: string;
    slug: string;
  };
  customer: CustomerDetail;
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

const dateTimeFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

function formatDate(date: Date | null) {
  return date ? dateFormatter.format(date) : "Sin registro";
}

export function CustomerDetailView({
  customer,
  organization,
}: CustomerDetailViewProps) {
  const lastOrder = customer.orders[0] ?? null;

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500">
              {organization.name} · cliente
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              {customer.name}
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Creado {formatDate(customer.createdAt)}
            </p>
          </div>
          <CustomerTags tags={customer.tags} />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-md bg-zinc-50 p-4">
            <p className="text-sm text-zinc-500">Total gastado</p>
            <p className="mt-2 font-mono text-xl font-semibold">
              {currencyFormatter.format(customer.totalSpent)}
            </p>
          </div>
          <div className="rounded-md bg-zinc-50 p-4">
            <p className="text-sm text-zinc-500">Ticket promedio</p>
            <p className="mt-2 font-mono text-xl font-semibold">
              {currencyFormatter.format(customer.averageTicket)}
            </p>
          </div>
          <div className="rounded-md bg-zinc-50 p-4">
            <p className="text-sm text-zinc-500">Pedidos</p>
            <p className="mt-2 font-mono text-xl font-semibold">
              {customer.totalOrders}
            </p>
          </div>
          <div className="rounded-md bg-zinc-950 p-4 text-white">
            <p className="text-sm text-zinc-300">Ultimo pedido</p>
            <p className="mt-2 font-mono text-xl font-semibold">
              {lastOrder ? `#${lastOrder.number}` : "Sin pedidos"}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold">Datos generales</h3>
          <div className="mt-4 space-y-3 text-sm">
            <p>
              <span className="text-zinc-500">Telefono: </span>
              {customer.phone ?? "Sin telefono"}
            </p>
            <p>
              <span className="text-zinc-500">Email: </span>
              {customer.email ?? "Sin email"}
            </p>
            <p>
              <span className="text-zinc-500">DNI: </span>
              {customer.dni ?? "Sin DNI"}
            </p>
            <p>
              <span className="text-zinc-500">CUIT: </span>
              {customer.cuit ?? "Sin CUIT"}
            </p>
            <p>
              <span className="text-zinc-500">Condicion fiscal: </span>
              {customer.condicionFiscal.toLowerCase()}
            </p>
            <p>
              <span className="text-zinc-500">WhatsApp ID: </span>
              {customer.whatsappId ?? "Sin WhatsApp ID"}
            </p>
            <p>
              <span className="text-zinc-500">Notas: </span>
              {customer.notes ?? "Sin notas"}
            </p>
          </div>
        </article>

        <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold">Direcciones</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {customer.addresses.length > 0 ? (
              customer.addresses.map((address) => (
                <div className="rounded-md border border-zinc-200 p-4" key={address.id}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold">{address.label}</p>
                    {address.isDefault ? (
                      <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                        default
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm text-zinc-600">{address.street}</p>
                  <p className="mt-1 text-sm text-zinc-600">
                    {address.floor ? `${address.floor} ` : ""}
                    {address.apartment ?? ""}
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">
                    {address.localidad}, {address.provincia}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    CP {address.codigoPostal ?? "sin CP"} · {address.country}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-zinc-500">Sin direcciones cargadas.</p>
            )}
          </div>
        </article>
      </section>

      <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-200 px-5 py-4">
          <h3 className="text-base font-semibold">Historial de pedidos</h3>
          <p className="mt-1 text-sm text-zinc-500">
            Compras asociadas al cliente dentro del tenant.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-zinc-50">
              <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500">
                <th className="px-4 py-3 font-medium">Pedido</th>
                <th className="px-4 py-3 font-medium">Canal</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Pago</th>
                <th className="px-4 py-3 text-right font-medium">Items</th>
                <th className="px-4 py-3 text-right font-medium">Total</th>
                <th className="px-4 py-3 text-right font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {customer.orders.map((order) => (
                <tr className="border-b border-zinc-100 last:border-b-0" key={order.id}>
                  <td className="px-4 py-4 font-mono font-semibold">
                    <Link
                      className="underline-offset-4 hover:underline"
                      href={`/${organization.slug}/orders/${order.id}`}
                    >
                      #{order.number}
                    </Link>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold">Conversaciones WhatsApp</h3>
        <div className="mt-4 grid gap-3 xl:grid-cols-2">
          {customer.conversations.length > 0 ? (
            customer.conversations.map((conversation) => (
              <article className="rounded-md border border-zinc-200 p-4" key={conversation.id}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">
                      {conversation.contactName ?? conversation.phoneNumber}
                    </p>
                    <p className="mt-1 font-mono text-xs text-zinc-500">
                      {conversation.phoneNumber}
                    </p>
                  </div>
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                    {conversation.status.toLowerCase()}
                  </span>
                </div>
                <p className="mt-3 text-sm text-zinc-600">
                  {conversation.messages[0]?.body ?? "Sin mensajes"}
                </p>
                <p className="mt-2 text-xs text-zinc-500">
                  Ultimo mensaje {dateTimeFormatter.format(conversation.lastMessageAt)} ·{" "}
                  {conversation.unreadCount} sin leer
                </p>
              </article>
            ))
          ) : (
            <p className="text-sm text-zinc-500">
              No hay conversaciones WhatsApp asociadas.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
