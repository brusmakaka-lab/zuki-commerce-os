import { ProductStatus } from "@prisma/client";

import { ProductsOverview } from "@/components/modules/products/products-overview";
import {
  getProductCatalog,
  type ProductCatalogFilters,
  requireOrganizationBySlug,
} from "@/lib/tenant";

interface ProductsPageProps {
  params: Promise<{
    orgSlug: string;
  }>;
  searchParams: Promise<{
    q?: string;
    status?: string;
    category?: string;
    lowStock?: string;
  }>;
}

export const dynamic = "force-dynamic";

function parseProductStatus(status?: string) {
  if (!status || status === "all") {
    return "all";
  }

  return Object.values(ProductStatus).includes(status as ProductStatus)
    ? (status as ProductStatus)
    : "all";
}

export default async function ProductsPage({
  params,
  searchParams,
}: ProductsPageProps) {
  const { orgSlug } = await params;
  const rawFilters = await searchParams;
  const organization = await requireOrganizationBySlug(orgSlug);

  const filters: ProductCatalogFilters = {
    query: rawFilters.q?.trim() ?? "",
    status: parseProductStatus(rawFilters.status),
    categoryId: rawFilters.category ?? "",
    lowStock: rawFilters.lowStock === "true",
  };

  const catalog = await getProductCatalog(organization.id, {
    query: filters.query,
    status: filters.status,
    categoryId: filters.categoryId,
    lowStock: filters.lowStock,
  });

  return (
    <ProductsOverview
      catalog={catalog}
      filters={{
        query: filters.query ?? "",
        status: filters.status ?? "all",
        categoryId: filters.categoryId ?? "",
        lowStock: filters.lowStock ?? false,
      }}
      organization={organization}
    />
  );
}
