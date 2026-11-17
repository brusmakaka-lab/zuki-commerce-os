import { PosOverview } from "@/components/modules/pos/pos-overview";
import { getPosCatalog, requireOrganizationBySlug } from "@/lib/tenant";

interface PosPageProps {
  params: Promise<{
    orgSlug: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function PosPage({ params }: PosPageProps) {
  const { orgSlug } = await params;
  const organization = await requireOrganizationBySlug(orgSlug);
  const catalog = await getPosCatalog(organization.id);

  return <PosOverview catalog={catalog} organization={organization} />;
}
