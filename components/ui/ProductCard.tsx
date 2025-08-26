"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

/**
 * Product type kept local for now to keep this step self‑contained.
 * We can extract to `@/types` later when we wire more components.
 */
export type Product = {
  id: string;
  name: string;
  slug?: string | null;
  description?: string | null;
  short_description?: string | null;
  price: number;
  compare_price?: number | null;
  images?: { url: string; alt?: string }[] | null;
  featured?: boolean | null;
  quantity?: number | null;
  track_quantity?: boolean | null;
};

export type ProductCardProps = {
  product: Product;
  /** Optional: override default add-to-cart behavior */
  onAddToCart?: (payload: {
    id: string;
    productId: string;
    name: string;
    price: number;
    image?: string;
    quantity: number;
    variant?: any;
  }) => void | Promise<void>;
  className?: string;
};

/**
 * A resilient ProductCard that works even if the cart store isn't wired yet.
 * If `onAddToCart` isn't provided, it lazy-loads `useCartStore` (Zustand)
 * from `@/lib/stores/cartStore` at click time.
 */
export default function ProductCard({ product, onAddToCart, className = "" }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);

  const primaryImage = product.images?.[0]?.url ?? "/vercel.svg"; // simple placeholder
  const alt = product.images?.[0]?.alt ?? product.name;

  const hasDiscount = product.compare_price && product.compare_price > product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.compare_price! - product.price) / product.compare_price!) * 100)
    : 0;

  const outOfStock = (product.track_quantity ?? true) && (product.quantity ?? 0) <= 0;

  async function handleAdd() {
    if (outOfStock || isAdding) return;
    setIsAdding(true);
    const payload = {
      id: `${product.id}-default`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: primaryImage,
      quantity: 1,
      variant: undefined,
    } as const;

    try {
      if (onAddToCart) {
        await onAddToCart(payload);
      } else {
        // Lazy import the cart store so this component stays decoupled.
        const mod = await import("@/lib/stores/cartStore").catch(() => null as any);
        const useCartStore = (mod && (mod.useCartStore || mod.default)) as
          | { getState: () => { addItem: (p: any) => void } }
          | undefined;
        if (useCartStore?.getState) {
          useCartStore.getState().addItem(payload);
        } else {
          console.warn("Cart store not available yet. Provide onAddToCart or implement cart store.");
        }
      }
    } finally {
      setIsAdding(false);
    }
  }

  const productHref = product.slug ? `/products/${product.slug}` : `/products/${product.id}`;

  return (
    <div
      className={`group relative flex flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-neutral-900 ${className}`}
    >
      {/* Media */}
      <Link href={productHref} className="relative aspect-square w-full overflow-hidden rounded-xl">
        <Image
          src={primaryImage}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 300px, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {hasDiscount && (
          <span className="absolute left-2 top-2 rounded-full bg-red-600 px-2 py-1 text-xs font-semibold text-white shadow">
            -{discountPct}%
          </span>
        )}
        {product.featured ? (
          <span className="absolute right-2 top-2 rounded-full bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow">
            Featured
          </span>
        ) : null}
      </Link>

      {/* Body */}
      <div className="mt-3 flex flex-1 flex-col">
        <Link href={productHref} className="line-clamp-2 text-sm font-medium hover:underline">
          {product.name}
        </Link>

        {/* Price */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-semibold tracking-tight">
            {formatCurrency(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-500 line-through">
              {formatCurrency(product.compare_price!)}
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="mt-auto pt-3">
          <button
            type="button"
            onClick={handleAdd}
            disabled={outOfStock || isAdding}
            className="w-full rounded-xl border border-gray-300 bg-gray-100 px-3 py-2 text-sm font-medium transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
          >
            {outOfStock ? "Out of stock" : isAdding ? "Adding…" : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

function formatCurrency(value: number, currency = "USD", locale = undefined as string | undefined) {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `$${value.toFixed(2)}`;
  }
}
