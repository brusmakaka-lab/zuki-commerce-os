import { DollarSign, Users } from "lucide-react";

import { CustomersFilters } from "@/components/modules/customers/customers-filters";
import { CustomersTable } from "@/components/modules/customers/customers-table";

interface CustomersOverviewProps {
  organization: {
    name: string;
    slug: string;
  };
  customers: Awaited<ReturnType<typeof import("@/lib/tenant").getCustomersList>>;
  filters: {
    query: string;
    tag: string;
    province: string;
    minSpent: string;
    hasOrders: string;
  };
}

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export function CustomersOverview({
  customers,
  filters,
  organization,
}: CustomersOverviewProps) {
  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-medium text-zinc-500">
            Clientes · {organization.slug}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            Clientes de {organization.name}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
            Vista de lectura del CRM multi-tenant con compradores, ubicaciones,
            tags e historial comercial real desde Neon.
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-md bg-zinc-50 p-4">
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Users className="size-4" aria-hidden="true" />
              Clientes mostrados
            </div>
            <p className="mt-2 font-mono text-2xl font-semibold">
              {customers.summary.count}
            </p>
          </div>
          <div className="rounded-md bg-zinc-50 p-4">
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <DollarSign className="size-4" aria-hidden="true" />
              Total gastado
            </div>
            <p className="mt-2 font-mono text-2xl font-semibold">
              {currencyFormatter.format(customers.summary.totalSpent)}
            </p>
          </div>
        </div>
      </section>

      <CustomersFilters
        availableFilters={customers.filters}
        filters={filters}
      />
      <CustomersTable
        customers={customers.customers}
        organizationSlug={organization.slug}
      />
    </div>
  );
}
