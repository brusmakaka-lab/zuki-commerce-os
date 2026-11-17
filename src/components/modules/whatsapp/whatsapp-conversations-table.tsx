import Link from "next/link";
import type { ConversationStatus, WhatsAppMessageType } from "@prisma/client";

import { WhatsAppStatusBadge } from "@/components/modules/whatsapp/whatsapp-status-badge";

interface ConversationRow {
  id: string;
  phoneNumber: string;
  contactName: string | null;
  status: ConversationStatus;
  unreadCount: number;
  lastMessageAt: Date;
  customer: {
    id: string;
    name: string;
    phone: string | null;
  } | null;
  lastMessage: {
    body: string | null;
    direction: string;
    type: WhatsAppMessageType;
    createdAt: Date;
  } | null;
  messageCount: number;
  order: {
    id: string;
    number: number;
    total: number;
  } | null;
}

interface WhatsAppConversationsTableProps {
  conversations: ConversationRow[];
  organizationSlug: string;
}

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export function WhatsAppConversationsTable({
  conversations,
  organizationSlug,
}: WhatsAppConversationsTableProps) {
  if (conversations.length === 0) {
    return (
      <section className="rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-base font-semibold">
          No hay conversaciones para mostrar
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          Ajusta los filtros para volver a ver el inbox del tenant.
        </p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-zinc-50">
            <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500">
              <th className="px-4 py-3 font-medium">Contacto</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Ultimo mensaje</th>
              <th className="px-4 py-3 text-right font-medium">Fecha</th>
              <th className="px-4 py-3 text-right font-medium">Mensajes</th>
              <th className="px-4 py-3 text-right font-medium">Pedido</th>
              <th className="px-4 py-3 text-right font-medium">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {conversations.map((conversation) => (
              <tr
                className="border-b border-zinc-100 last:border-b-0"
                key={conversation.id}
              >
                <td className="px-4 py-4">
                  <div className="font-medium text-zinc-950">
                    {conversation.contactName ?? conversation.phoneNumber}
                  </div>
                  <div className="mt-1 font-mono text-xs text-zinc-500">
                    {conversation.phoneNumber}
                  </div>
                </td>
                <td className="px-4 py-4 text-zinc-600">
                  {conversation.customer?.name ?? "Sin cliente"}
                </td>
                <td className="px-4 py-4">
                  <WhatsAppStatusBadge status={conversation.status} />
                </td>
                <td className="max-w-xs px-4 py-4 text-zinc-600">
                  <span className="line-clamp-2">
                    {conversation.lastMessage?.body ?? "Sin mensajes"}
                  </span>
                  {conversation.unreadCount > 0 ? (
                    <span className="mt-1 inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                      {conversation.unreadCount} sin leer
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-4 text-right text-zinc-500">
                  {dateFormatter.format(conversation.lastMessageAt)}
                </td>
                <td className="px-4 py-4 text-right font-mono">
                  {conversation.messageCount}
                </td>
                <td className="px-4 py-4 text-right font-mono">
                  {conversation.order ? `#${conversation.order.number}` : "-"}
                </td>
                <td className="px-4 py-4 text-right">
                  <Link
                    className="font-medium text-zinc-950 underline-offset-4 hover:underline"
                    href={`/${organizationSlug}/whatsapp/${conversation.id}`}
                  >
                    Abrir
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
