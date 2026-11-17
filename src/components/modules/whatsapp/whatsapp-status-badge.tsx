import type { ConversationStatus } from "@prisma/client";

const statusClasses: Record<ConversationStatus, string> = {
  OPEN: "bg-amber-100 text-amber-800",
  IN_PROGRESS: "bg-sky-100 text-sky-800",
  RESOLVED: "bg-emerald-100 text-emerald-800",
  ARCHIVED: "bg-zinc-200 text-zinc-700",
};

interface WhatsAppStatusBadgeProps {
  status: ConversationStatus;
}

export function WhatsAppStatusBadge({ status }: WhatsAppStatusBadgeProps) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[status]}`}
    >
      {status.toLowerCase()}
    </span>
  );
}
