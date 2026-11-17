import Link from "next/link";
import type { Prisma, WhatsAppMessageType } from "@prisma/client";

import { WhatsAppStatusBadge } from "@/components/modules/whatsapp/whatsapp-status-badge";
import { cn } from "@/lib/utils";

type ConversationDetail = NonNullable<
  Awaited<
    ReturnType<typeof import("@/lib/tenant").getWhatsAppConversationDetail>
  >
>;

interface WhatsAppConversationDetailProps {
  organization: {
    name: string;
    slug: string;
  };
  conversation: ConversationDetail;
}

const dateTimeFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

function stringifyJson(value: Prisma.JsonValue | null) {
  if (!value || (typeof value === "object" && Object.keys(value).length === 0)) {
    return null;
  }

  return JSON.stringify(value, null, 2);
}

function MessageTypeBadge({ type }: { type: WhatsAppMessageType }) {
  return (
    <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs font-medium text-zinc-600">
      {type.toLowerCase()}
    </span>
  );
}

export function WhatsAppConversationDetail({
  conversation,
  organization,
}: WhatsAppConversationDetailProps) {
  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500">
              {organization.name} · WhatsApp
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              {conversation.customer?.name ??
                conversation.contactName ??
                conversation.phoneNumber}
            </h2>
            <p className="mt-2 font-mono text-sm text-zinc-500">
              {conversation.phoneNumber}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <WhatsAppStatusBadge status={conversation.status} />
            <button
              className="h-10 rounded-md border border-zinc-300 px-4 text-sm font-medium text-zinc-400"
              disabled
              type="button"
            >
              Crear pedido desde chat
            </button>
            <button
              className="h-10 rounded-md bg-zinc-200 px-4 text-sm font-medium text-zinc-500"
              disabled
              type="button"
            >
              Marcar como resuelto
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-md bg-zinc-50 p-4">
            <p className="text-sm text-zinc-500">Mensajes</p>
            <p className="mt-2 font-mono text-2xl font-semibold">
              {conversation.messages.length}
            </p>
          </div>
          <div className="rounded-md bg-zinc-50 p-4">
            <p className="text-sm text-zinc-500">Sin leer</p>
            <p className="mt-2 font-mono text-2xl font-semibold">
              {conversation.unreadCount}
            </p>
          </div>
          <div className="rounded-md bg-zinc-50 p-4">
            <p className="text-sm text-zinc-500">Ultimo mensaje</p>
            <p className="mt-2 text-sm font-medium">
              {dateTimeFormatter.format(conversation.lastMessageAt)}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.75fr_1.25fr]">
        <aside className="space-y-5">
          <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold">Cliente</h3>
            {conversation.customer ? (
              <div className="mt-4 space-y-3 text-sm">
                <p>
                  <span className="text-zinc-500">Nombre: </span>
                  {conversation.customer.name}
                </p>
                <p>
                  <span className="text-zinc-500">Email: </span>
                  {conversation.customer.email ?? "Sin email"}
                </p>
                <p>
                  <span className="text-zinc-500">Telefono: </span>
                  {conversation.customer.phone ?? "Sin telefono"}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {conversation.customer.tags.map((tag) => (
                    <span
                      className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700"
                      key={tag}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-zinc-500">
                Conversacion sin cliente asociado.
              </p>
            )}
          </article>

          <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold">Pedido asociado</h3>
            {conversation.order ? (
              <div className="mt-4 space-y-3 text-sm">
                <Link
                  className="font-mono font-semibold underline-offset-4 hover:underline"
                  href={`/${organization.slug}/orders/${conversation.order.id}`}
                >
                  #{conversation.order.number}
                </Link>
                <p>
                  <span className="text-zinc-500">Estado: </span>
                  {conversation.order.status.toLowerCase()}
                </p>
                <p>
                  <span className="text-zinc-500">Pago: </span>
                  {conversation.order.paymentStatus.toLowerCase()}
                </p>
                <p>
                  <span className="text-zinc-500">Total: </span>
                  {currencyFormatter.format(conversation.order.total)}
                </p>
              </div>
            ) : (
              <p className="mt-4 text-sm text-zinc-500">
                Sin pedido asociado.
              </p>
            )}
          </article>
        </aside>

        <section className="rounded-lg border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-200 px-5 py-4">
            <h3 className="text-base font-semibold">Mensajes</h3>
            <p className="mt-1 text-sm text-zinc-500">
              Timeline cronologico de la conversacion.
            </p>
          </div>

          <div className="space-y-4 bg-zinc-50 p-5">
            {conversation.messages.map((message) => {
              const outbound = message.direction === "outbound";
              const metadata = stringifyJson(message.metadata);

              return (
                <article
                  className={cn(
                    "flex",
                    outbound ? "justify-end" : "justify-start",
                  )}
                  key={message.id}
                >
                  <div
                    className={cn(
                      "max-w-[min(680px,90%)] rounded-lg border p-4 shadow-sm",
                      outbound
                        ? "border-zinc-900 bg-zinc-950 text-white"
                        : "border-zinc-200 bg-white text-zinc-950",
                    )}
                  >
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <MessageTypeBadge type={message.type} />
                      <span
                        className={cn(
                          "text-xs",
                          outbound ? "text-zinc-300" : "text-zinc-500",
                        )}
                      >
                        {message.direction} ·{" "}
                        {dateTimeFormatter.format(message.createdAt)}
                      </span>
                    </div>

                    <p className="whitespace-pre-wrap text-sm leading-6">
                      {message.body ?? message.mediaCaption ?? "Mensaje sin texto"}
                    </p>

                    {message.mediaUrl ? (
                      <a
                        className={cn(
                          "mt-3 block text-sm underline-offset-4 hover:underline",
                          outbound ? "text-zinc-200" : "text-zinc-700",
                        )}
                        href={message.mediaUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Media: {message.mediaType ?? message.mediaUrl}
                      </a>
                    ) : null}

                    {message.status ? (
                      <p
                        className={cn(
                          "mt-2 text-xs",
                          outbound ? "text-zinc-300" : "text-zinc-500",
                        )}
                      >
                        Estado: {message.status.toLowerCase()}
                      </p>
                    ) : null}

                    {metadata ? (
                      <pre
                        className={cn(
                          "mt-3 overflow-auto rounded-md p-2 text-xs",
                          outbound
                            ? "bg-zinc-900 text-zinc-300"
                            : "bg-zinc-100 text-zinc-600",
                        )}
                      >
                        {metadata}
                      </pre>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </section>
    </div>
  );
}
