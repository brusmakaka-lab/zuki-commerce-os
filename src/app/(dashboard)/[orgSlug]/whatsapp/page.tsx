import { ConversationStatus } from "@prisma/client";

import { WhatsAppInbox } from "@/components/modules/whatsapp/whatsapp-inbox";
import {
  getWhatsAppInbox,
  requireOrganizationBySlug,
  type WhatsAppInboxFilters,
} from "@/lib/tenant";

interface WhatsAppPageProps {
  params: Promise<{
    orgSlug: string;
  }>;
  searchParams: Promise<{
    q?: string;
    status?: string;
    hasOrder?: string;
  }>;
}

export const dynamic = "force-dynamic";

function parseStatus(status?: string) {
  if (status === "open") {
    return ConversationStatus.OPEN;
  }

  if (status === "resolved") {
    return ConversationStatus.RESOLVED;
  }

  return "all";
}

function parseHasOrder(value?: string) {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return undefined;
}

export default async function WhatsAppPage({
  params,
  searchParams,
}: WhatsAppPageProps) {
  const { orgSlug } = await params;
  const rawFilters = await searchParams;
  const organization = await requireOrganizationBySlug(orgSlug);

  const filters: WhatsAppInboxFilters = {
    query: rawFilters.q?.trim() ?? "",
    status: parseStatus(rawFilters.status),
    hasOrder: parseHasOrder(rawFilters.hasOrder),
  };

  const inbox = await getWhatsAppInbox(organization.id, filters);

  return (
    <WhatsAppInbox
      filters={{
        query: filters.query ?? "",
        status: rawFilters.status ?? "all",
        hasOrder: rawFilters.hasOrder ?? "all",
      }}
      inbox={inbox}
      organization={organization}
    />
  );
}
