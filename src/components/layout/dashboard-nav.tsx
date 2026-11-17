"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Boxes,
  CircleDollarSign,
  ClipboardList,
  LayoutDashboard,
  MessageCircle,
  Package,
  Settings,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

const navigation = [
  { label: "Overview", href: "", icon: LayoutDashboard },
  { label: "Productos", href: "/products", icon: Package },
  { label: "Inventario", href: "/inventory", icon: Boxes },
  { label: "Pedidos", href: "/orders", icon: ClipboardList },
  { label: "Clientes", href: "/customers", icon: Users },
  { label: "WhatsApp", href: "/whatsapp", icon: MessageCircle },
  { label: "Reportes", href: "/reports", icon: BarChart3 },
  { label: "POS", href: "/pos", icon: CircleDollarSign },
  { label: "Configuracion", href: "/configuracion", icon: Settings },
] as const;

interface DashboardNavProps {
  organizationSlug: string;
  variant: "sidebar" | "mobile";
}

export function DashboardNav({ organizationSlug, variant }: DashboardNavProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Dashboard"
      className={
        variant === "sidebar"
          ? "space-y-1 px-4 py-5"
          : "flex gap-2 overflow-x-auto border-t border-zinc-200 px-4 py-2 lg:hidden"
      }
    >
      {navigation.map((item) => {
        const Icon = item.icon;
        const href = `/${organizationSlug}${item.href}`;
        const active =
          item.href === "" ? pathname === href : pathname.startsWith(href);

        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={cn(
              variant === "sidebar"
                ? "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
                : "whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950",
              active &&
                "bg-zinc-950 text-white hover:bg-zinc-900 hover:text-white",
            )}
            href={href}
            key={item.label}
          >
            {variant === "sidebar" ? (
              <Icon className="size-4" aria-hidden="true" />
            ) : null}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
