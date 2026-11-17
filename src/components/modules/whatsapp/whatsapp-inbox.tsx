import { MessageCircle, PackageCheck, CheckCircle2 } from "lucide-react";

import { WhatsAppConversationsTable } from "@/components/modules/whatsapp/whatsapp-conversations-table";
import { WhatsAppFilters } from "@/components/modules/whatsapp/whatsapp-filters";

interface WhatsAppInboxProps {
  organization: {
    name: string;
    slug: string;
  };
  inbox: Awaited<ReturnType<typeof import("@/lib/tenant").getWhatsAppInbox>>;
  filters: {
    query: string;
    status: string;
    hasOrder: string;
  };
}

export function WhatsAppInbox({
  filters,
  inbox,
  organization,
}: WhatsAppInboxProps) {
  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-medium text-zinc-500">
            WhatsApp · {organization.slug}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            Inbox de {organization.name}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
            Lectura multi-tenant de conversaciones, mensajes y pedidos asociados
            desde Neon. Sin webhook ni API externa todavia.
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-md bg-zinc-50 p-4">
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <MessageCircle className="size-4" aria-hidden="true" />
              Conversaciones
            </div>
            <p className="mt-2 font-mono text-2xl font-semibold">
              {inbox.summary.count}
            </p>
          </div>
          <div className="rounded-md bg-zinc-50 p-4">
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <CheckCircle2 className="size-4" aria-hidden="true" />
              Resueltas
            </div>
            <p className="mt-2 font-mono text-2xl font-semibold">
              {inbox.summary.resolved}
            </p>
          </div>
          <div className="rounded-md bg-zinc-50 p-4">
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <PackageCheck className="size-4" aria-hidden="true" />
              Con pedido
            </div>
            <p className="mt-2 font-mono text-2xl font-semibold">
              {inbox.summary.linkedOrders}
            </p>
          </div>
        </div>
      </section>

      <WhatsAppFilters filters={filters} />
      <WhatsAppConversationsTable
        conversations={inbox.conversations}
        organizationSlug={organization.slug}
      />
    </div>
  );
}
