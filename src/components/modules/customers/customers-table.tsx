import Link from "next/link";

import { CustomerTags } from "@/components/modules/customers/customer-tags";

interface CustomerRow {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  tags: string[];
  totalOrders: number;
  totalSpent: number;
  lastOrderAt: Date | null;
  location: string;
}

interface CustomersTableProps {
  customers: CustomerRow[];
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

export function CustomersTable({
  customers,
  organizationSlug,
}: CustomersTableProps) {
  if (customers.length === 0) {
    return (
      <section className="rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-base font-semibold">No hay clientes para mostrar</h2>
        <p className="mt-2 text-sm text-zinc-500">
          Ajusta los filtros para volver a ver clientes del tenant.
        </p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px] text-left text-sm">
          <thead className="bg-zinc-50">
            <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500">
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Telefono</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Tags</th>
              <th className="px-4 py-3 text-right font-medium">Pedidos</th>
              <th className="px-4 py-3 text-right font-medium">Gastado</th>
              <th className="px-4 py-3 text-right font-medium">Ultima compra</th>
              <th className="px-4 py-3 font-medium">Ubicacion</th>
              <th className="px-4 py-3 text-right font-medium">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr
                className="border-b border-zinc-100 last:border-b-0"
                key={customer.id}
              >
                <td className="px-4 py-4 font-medium text-zinc-950">
                  {customer.name}
                </td>
                <td className="px-4 py-4 font-mono text-zinc-600">
                  {customer.phone ?? "Sin telefono"}
                </td>
                <td className="px-4 py-4 text-zinc-600">
                  {customer.email ?? "Sin email"}
                </td>
                <td className="px-4 py-4">
                  <CustomerTags tags={customer.tags} />
                </td>
                <td className="px-4 py-4 text-right font-mono">
                  {customer.totalOrders}
                </td>
                <td className="px-4 py-4 text-right font-mono font-semibold">
                  {currencyFormatter.format(customer.totalSpent)}
                </td>
                <td className="px-4 py-4 text-right text-zinc-500">
                  {customer.lastOrderAt
                    ? dateFormatter.format(customer.lastOrderAt)
                    : "Sin compras"}
                </td>
                <td className="px-4 py-4 text-zinc-600">{customer.location}</td>
                <td className="px-4 py-4 text-right">
                  <Link
                    className="font-medium text-zinc-950 underline-offset-4 hover:underline"
                    href={`/${organizationSlug}/customers/${customer.id}`}
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
