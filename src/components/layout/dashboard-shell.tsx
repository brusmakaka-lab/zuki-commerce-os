import Link from "next/link";

import { DashboardNav } from "@/components/layout/dashboard-nav";

interface DashboardShellProps {
  children: React.ReactNode;
  organization: {
    name: string;
    slug: string;
    plan: string;
  };
}

export function DashboardShell({ children, organization }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-950">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-zinc-200 bg-white lg:block">
        <div className="flex h-16 items-center gap-3 border-b border-zinc-200 px-6">
          <Link
            className="flex size-9 items-center justify-center rounded-lg bg-zinc-950 text-sm font-semibold text-white"
            href="/"
          >
            Z
          </Link>
          <div>
            <p className="text-sm font-semibold">Zuki Commerce OS</p>
            <p className="text-xs text-zinc-500">Multi-tenant dashboard</p>
          </div>
        </div>

        <DashboardNav organizationSlug={organization.slug} variant="sidebar" />
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur">
          <div className="flex min-h-16 flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Organizacion
              </p>
              <h1 className="text-xl font-semibold">{organization.name}</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600">
                Plan {organization.plan.toLowerCase()}
              </span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
                Demo publica
              </span>
            </div>
          </div>

          <DashboardNav organizationSlug={organization.slug} variant="mobile" />
        </header>

        <main className="px-5 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
