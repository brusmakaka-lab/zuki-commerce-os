import type { OrderStatus, PaymentStatus } from "@prisma/client";

const orderStatusClasses: Record<OrderStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-sky-100 text-sky-800",
  PROCESSING: "bg-indigo-100 text-indigo-800",
  READY: "bg-violet-100 text-violet-800",
  SHIPPED: "bg-blue-100 text-blue-800",
  DELIVERED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-rose-100 text-rose-800",
  REFUNDED: "bg-zinc-200 text-zinc-700",
};

const paymentStatusClasses: Record<PaymentStatus, string> = {
  UNPAID: "bg-amber-100 text-amber-800",
  PARTIAL: "bg-sky-100 text-sky-800",
  PAID: "bg-emerald-100 text-emerald-800",
  REFUNDED: "bg-zinc-200 text-zinc-700",
  VOID: "bg-rose-100 text-rose-800",
};

interface StatusBadgeProps {
  value: OrderStatus | PaymentStatus | string;
  type?: "order" | "payment" | "neutral";
}

export function StatusBadge({ type = "neutral", value }: StatusBadgeProps) {
  const className =
    type === "order"
      ? orderStatusClasses[value as OrderStatus]
      : type === "payment"
        ? paymentStatusClasses[value as PaymentStatus]
        : "bg-zinc-100 text-zinc-700";

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {value.toLowerCase()}
    </span>
  );
}
