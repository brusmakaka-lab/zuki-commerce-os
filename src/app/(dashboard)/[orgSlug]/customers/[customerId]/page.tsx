import Link from "next/link";
import { notFound } from "next/navigation";

import { CustomerDetailView } from "@/components/modules/customers/customer-detail-view";
import { getCustomerDetail, requireOrganizationBySlug } from "@/lib/tenant";

interface CustomerDetailPageProps {
  params: Promise<{
    orgSlug: string;
    customerId: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function CustomerDetailPage({
  params,
}: CustomerDetailPageProps) {
  const { orgSlug, customerId } = await params;
  const organization = await requireOrganizationBySlug(orgSlug);
  const customer = await getCustomerDetail(organization.id, customerId);

  if (!customer) {
    notFound();
  }

  return (
    <div className="space-y-5">
      <Link
        className="text-sm font-medium text-zinc-600 transition hover:text-zinc-950"
        href={`/${organization.slug}/customers`}
      >
        Back to customers
      </Link>
      <CustomerDetailView customer={customer} organization={organization} />
    </div>
  );
}
