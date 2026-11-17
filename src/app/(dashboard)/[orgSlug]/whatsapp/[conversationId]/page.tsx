import Link from "next/link";
import { notFound } from "next/navigation";

import { WhatsAppConversationDetail } from "@/components/modules/whatsapp/whatsapp-conversation-detail";
import {
  getWhatsAppConversationDetail,
  requireOrganizationBySlug,
} from "@/lib/tenant";

interface WhatsAppConversationPageProps {
  params: Promise<{
    orgSlug: string;
    conversationId: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function WhatsAppConversationPage({
  params,
}: WhatsAppConversationPageProps) {
  const { orgSlug, conversationId } = await params;
  const organization = await requireOrganizationBySlug(orgSlug);
  const conversation = await getWhatsAppConversationDetail(
    organization.id,
    conversationId,
  );

  if (!conversation) {
    notFound();
  }

  return (
    <div className="space-y-5">
      <Link
        className="text-sm font-medium text-zinc-600 transition hover:text-zinc-950"
        href={`/${organization.slug}/whatsapp`}
      >
        Back to inbox
      </Link>
      <WhatsAppConversationDetail
        conversation={conversation}
        organization={organization}
      />
    </div>
  );
}
