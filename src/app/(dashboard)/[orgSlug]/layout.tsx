import type { Metadata } from "next";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireOrganizationBySlug } from "@/lib/tenant";

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    orgSlug: string;
  }>;
}

export async function generateMetadata({
  params,
}: DashboardLayoutProps): Promise<Metadata> {
  const { orgSlug } = await params;
  const organization = await requireOrganizationBySlug(orgSlug);

  return {
    title: `${organization.name} | Zuki Commerce OS`,
    description: `Dashboard operativo de ${organization.name}.`,
  };
}

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const { orgSlug } = await params;
  const organization = await requireOrganizationBySlug(orgSlug);

  return (
    <DashboardShell
      organization={{
        name: organization.name,
        slug: organization.slug,
        plan: organization.plan,
      }}
    >
      {children}
    </DashboardShell>
  );
}
