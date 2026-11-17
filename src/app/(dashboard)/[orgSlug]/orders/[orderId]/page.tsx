import Link from "next/link";
import { notFound } from "next/navigation";

import { OrderDetailView } from "@/components/modules/orders/order-detail-view";
import { getOrderDetail, requireOrganizationBySlug } from "@/lib/tenant";

interface OrderDetailPageProps {
  params: Promise<{
    orgSlug: string;
    orderId: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { orgSlug, orderId } = await params;
  const organization = await requireOrganizationBySlug(orgSlug);
  const order = await getOrderDetail(organization.id, orderId);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-5">
      <Link
        className="text-sm font-medium text-zinc-600 transition hover:text-zinc-950"
        href={`/${organization.slug}/orders`}
      >
        Back to orders
      </Link>
      <OrderDetailView order={order} organization={organization} />
    </div>
  );
}
