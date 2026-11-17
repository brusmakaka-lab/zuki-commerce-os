import { DashboardOverview } from "@/components/modules/dashboard/dashboard-overview";
import {
  getDashboardMetrics,
  requireOrganizationBySlug,
} from "@/lib/tenant";

interface OrganizationDashboardPageProps {
  params: Promise<{
    orgSlug: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function OrganizationDashboardPage({
  params,
}: OrganizationDashboardPageProps) {
  const { orgSlug } = await params;
  const organization = await requireOrganizationBySlug(orgSlug);
  const dashboard = await getDashboardMetrics(organization.id);

  return <DashboardOverview dashboard={dashboard} organization={organization} />;
}
