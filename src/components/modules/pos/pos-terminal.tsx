"use client";

import { useMemo, useState } from "react";
import {
  Banknote,
  CreditCard,
  Minus,
  Plus,
  QrCode,
  Search,
  Send,
  ShoppingCart,
  Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";

type PosCatalog = Awaited<
  ReturnType<typeof import("@/lib/tenant").getPosCatalog>
>;
type PosProduct = PosCatalog["products"][number];
type PosVariant = PosProduct["variants"][number];

interface PosTerminalProps {
  catalog: PosCatalog;
}

interface CartItem {
  productId: string;
  productName: string;
  categoryName: string;
  variantId: string;
  variantName: string;
  sku: string;
  price: number;
  available: number;
  quantity: number;
}

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const paymentMethods = [
  { id: "cash", label: "Efectivo", icon: Banknote },
  { id: "card", label: "Tarjeta", icon: CreditCard },
  { id: "transfer", label: "Transferencia", icon: Send },
  { id: "mp", label: "MercadoPago", icon: QrCode },
] as const;

function getDefaultVariant(product: PosProduct, selectedId?: string) {
  return (
    product.variants.find((variant) => variant.id === selectedId) ??
    product.variants.find((variant) => variant.isDefault) ??
    product.variants[0] ??
    null
  );
}

function buildSearchText(product: PosProduct) {
  return [
    product.name,
    product.categoryName,
    product.variants.map((variant) => `${variant.name} ${variant.sku}`).join(" "),
  ]
    .join(" ")
    .toLowerCase();
}

export function PosTerminal({ catalog }: PosTerminalProps) {
  const [query, setQuery] = useState("");
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >({});
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] =
    useState<(typeof paymentMethods)[number]["id"]>("cash");

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return catalog.products;
    }

    return catalog.products.filter((product) =>
      buildSearchText(product).includes(normalizedQuery),
    );
  }, [catalog.products, query]);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const safeDiscount = Math.min(Math.max(discount, 0), subtotal);
  const total = subtotal - safeDiscount;

  function addToCart(product: PosProduct, variant: PosVariant | null) {
    if (!variant || variant.available <= 0) {
      return;
    }

    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.variantId === variant.id,
      );

      if (existingItem) {
        return currentCart.map((item) =>
          item.variantId === variant.id
            ? {
                ...item,
                quantity: Math.min(item.quantity + 1, item.available),
              }
            : item,
        );
      }

      return [
        ...currentCart,
        {
          productId: product.id,
          productName: product.name,
          categoryName: product.categoryName,
          variantId: variant.id,
          variantName: variant.name,
          sku: variant.sku,
          price: variant.price,
          available: variant.available,
          quantity: 1,
        },
      ];
    });
  }

  function updateQuantity(variantId: string, nextQuantity: number) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.variantId === variantId
            ? {
                ...item,
                quantity: Math.min(Math.max(nextQuantity, 0), item.available),
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
      <div className="space-y-4">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <label className="relative block">
            <span className="sr-only">Buscar producto o SKU</span>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-zinc-400"
            />
            <input
              className="h-12 w-full rounded-md border border-zinc-300 bg-white pl-12 pr-4 text-base outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar producto, variante o SKU"
              type="search"
              value={query}
            />
          </label>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-lg border border-zinc-200 bg-white p-10 text-center shadow-sm">
            <h3 className="text-base font-semibold">
              No hay productos para esa busqueda
            </h3>
            <p className="mt-2 text-sm text-zinc-500">
              Cambia el termino de busqueda para volver al catalogo POS.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {filteredProducts.map((product) => {
              const selectedVariant = getDefaultVariant(
                product,
                selectedVariants[product.id],
              );
              const hasStock = Boolean(
                selectedVariant && selectedVariant.available > 0,
              );

              return (
                <article
                  className="flex min-h-56 flex-col rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
                  key={product.id}
                >
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                          {product.categoryName}
                        </p>
                        <h3 className="mt-1 text-base font-semibold text-zinc-950">
                          {product.name}
                        </h3>
                      </div>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-medium",
                          hasStock
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-zinc-100 text-zinc-500",
                        )}
                      >
                        {hasStock
                          ? `${selectedVariant?.available ?? 0} disp.`
                          : "Sin stock"}
                      </span>
                    </div>

                    <label className="mt-4 block">
                      <span className="mb-1 block text-xs font-medium text-zinc-500">
                        Variante
                      </span>
                      <select
                        className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
                        onChange={(event) =>
                          setSelectedVariants((current) => ({
                            ...current,
                            [product.id]: event.target.value,
                          }))
                        }
                        value={selectedVariant?.id ?? ""}
                      >
                        {product.variants.map((variant) => (
                          <option key={variant.id} value={variant.id}>
                            {variant.name} - {variant.sku}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="mt-4 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-xs text-zinc-500">Precio</p>
                        <p className="font-mono text-xl font-semibold">
                          {currencyFormatter.format(selectedVariant?.price ?? 0)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-zinc-500">Reservado</p>
                        <p className="font-mono text-sm">
                          {selectedVariant?.reserved ?? 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    className={cn(
                      "mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition",
                      hasStock
                        ? "bg-zinc-950 text-white hover:bg-zinc-800"
                        : "cursor-not-allowed bg-zinc-100 text-zinc-400",
                    )}
                    disabled={!hasStock}
                    onClick={() => addToCart(product, selectedVariant)}
                    type="button"
                  >
                    <Plus className="size-4" aria-hidden="true" />
                    Agregar
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <aside className="rounded-lg border border-zinc-200 bg-white shadow-sm xl:sticky xl:top-5 xl:self-start">
        <div className="border-b border-zinc-200 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-zinc-500">Ticket actual</p>
              <h3 className="mt-1 text-xl font-semibold">Carrito POS</h3>
            </div>
            <div className="flex size-10 items-center justify-center rounded-md bg-zinc-950 text-white">
              <ShoppingCart className="size-5" aria-hidden="true" />
            </div>
          </div>
        </div>

        <div className="max-h-[430px] overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="rounded-md bg-zinc-50 p-8 text-center">
              <p className="text-sm font-medium text-zinc-700">
                Carrito vacio
              </p>
              <p className="mt-2 text-sm text-zinc-500">
                Agrega productos del catalogo para simular una venta.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  className="rounded-md border border-zinc-200 p-3"
                  key={item.variantId}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-zinc-950">
                        {item.productName}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {item.variantName} - {item.sku}
                      </p>
                    </div>
                    <button
                      aria-label={`Quitar ${item.productName}`}
                      className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-950"
                      onClick={() => updateQuantity(item.variantId, 0)}
                      type="button"
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="inline-flex items-center rounded-md border border-zinc-300">
                      <button
                        aria-label={`Restar ${item.productName}`}
                        className="flex size-9 items-center justify-center text-zinc-600 hover:bg-zinc-100"
                        onClick={() =>
                          updateQuantity(item.variantId, item.quantity - 1)
                        }
                        type="button"
                      >
                        <Minus className="size-4" aria-hidden="true" />
                      </button>
                      <span className="w-10 text-center font-mono text-sm">
                        {item.quantity}
                      </span>
                      <button
                        aria-label={`Sumar ${item.productName}`}
                        className="flex size-9 items-center justify-center text-zinc-600 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:text-zinc-300"
                        disabled={item.quantity >= item.available}
                        onClick={() =>
                          updateQuantity(item.variantId, item.quantity + 1)
                        }
                        type="button"
                      >
                        <Plus className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                    <p className="font-mono text-sm font-semibold">
                      {currencyFormatter.format(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-zinc-200 p-5">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-zinc-500">
              Descuento visual
            </span>
            <input
              className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 font-mono text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
              min={0}
              onChange={(event) => setDiscount(Number(event.target.value) || 0)}
              placeholder="0"
              type="number"
              value={discount === 0 ? "" : discount}
            />
          </label>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-zinc-600">
              <span>Subtotal</span>
              <span className="font-mono">
                {currencyFormatter.format(subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>Descuento</span>
              <span className="font-mono">
                -{currencyFormatter.format(safeDiscount)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-zinc-200 pt-3 text-zinc-950">
              <span className="font-semibold">Total</span>
              <span className="font-mono text-2xl font-semibold">
                {currencyFormatter.format(total)}
              </span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              const active = paymentMethod === method.id;

              return (
                <button
                  className={cn(
                    "inline-flex h-11 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium transition",
                    active
                      ? "border-zinc-950 bg-zinc-950 text-white"
                      : "border-zinc-300 text-zinc-700 hover:bg-zinc-50",
                  )}
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  type="button"
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {method.label}
                </button>
              );
            })}
          </div>

          <button
            className="mt-4 h-12 w-full cursor-not-allowed rounded-md bg-zinc-100 text-sm font-semibold text-zinc-400"
            disabled
            type="button"
          >
            Cobrar (demo)
          </button>
        </div>
      </aside>
    </section>
  );
}
