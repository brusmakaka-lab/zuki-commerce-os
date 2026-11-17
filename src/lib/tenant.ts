import { notFound } from "next/navigation";
import {
  ArgentinaProv,
  ConversationStatus,
  MovementType,
  OrderChannel,
  OrderStatus,
  PaymentStatus,
  ProductStatus,
  type Prisma,
} from "@prisma/client";

import { getDb } from "@/lib/db";

export async function getOrganizationBySlug(slug: string) {
  return getDb().organization.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      name: true,
      legalName: true,
      plan: true,
      currency: true,
      timezone: true,
      settings: {
        select: {
          lowStockThreshold: true,
        },
      },
    },
  });
}

export async function requireOrganizationBySlug(slug: string) {
  const organization = await getOrganizationBySlug(slug);

  if (!organization) {
    notFound();
  }

  return organization;
}

export async function getDashboardMetrics(organizationId: string) {
  const db = getDb();

  const organization = await db.organization.findUnique({
    where: { id: organizationId },
    select: {
      settings: {
        select: {
          lowStockThreshold: true,
        },
      },
    },
  });

  const lowStockThreshold = organization?.settings?.lowStockThreshold ?? 5;

  const [
    totalSales,
    totalOrders,
    pendingOrders,
    totalCustomers,
    activeProducts,
    recentInsights,
    recentOrders,
    inventoryLevels,
  ] = await Promise.all([
    db.order.aggregate({
      _sum: { total: true },
      where: {
        organizationId,
        status: {
          notIn: [OrderStatus.CANCELLED, OrderStatus.REFUNDED],
        },
      },
    }),
    db.order.count({ where: { organizationId } }),
    db.order.count({
      where: {
        organizationId,
        status: OrderStatus.PENDING,
      },
    }),
    db.customer.count({ where: { organizationId } }),
    db.product.count({
      where: {
        organizationId,
        status: ProductStatus.ACTIVE,
        deletedAt: null,
      },
    }),
    db.aIInsight.findMany({
      where: { organizationId },
      orderBy: [{ generatedAt: "desc" }, { createdAt: "desc" }],
      take: 3,
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        status: true,
        confidence: true,
        generatedAt: true,
      },
    }),
    db.order.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        number: true,
        channel: true,
        status: true,
        paymentStatus: true,
        total: true,
        createdAt: true,
        customer: {
          select: {
            name: true,
          },
        },
      },
    }),
    db.inventoryLevel.findMany({
      where: {
        quantity: {
          lte: lowStockThreshold,
        },
        variant: {
          isActive: true,
          product: {
            organizationId,
            status: ProductStatus.ACTIVE,
            deletedAt: null,
          },
        },
      },
      orderBy: [{ quantity: "asc" }, { reserved: "desc" }],
      take: 6,
      select: {
        id: true,
        quantity: true,
        reserved: true,
        location: {
          select: {
            name: true,
          },
        },
        variant: {
          select: {
            id: true,
            sku: true,
            name: true,
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    }),
  ]);

  return {
    totals: {
      sales: Number(totalSales._sum.total ?? 0),
      orders: totalOrders,
      pendingOrders,
      customers: totalCustomers,
      activeProducts,
      lowStock: inventoryLevels.length,
    },
    recentInsights: recentInsights.map((insight) => ({
      ...insight,
      confidence:
        insight.confidence === null ? null : Math.round(insight.confidence * 100),
    })),
    recentOrders: recentOrders.map((order) => ({
      ...order,
      total: Number(order.total),
    })),
    lowStockProducts: inventoryLevels.map((level) => ({
      id: level.id,
      quantity: level.quantity,
      reserved: level.reserved,
      locationName: level.location.name,
      sku: level.variant.sku,
      variantName: level.variant.name,
      productName: level.variant.product.name,
    })),
    lowStockThreshold,
  };
}

export interface ProductCatalogFilters {
  query?: string;
  status?: ProductStatus | "all";
  categoryId?: string;
  lowStock?: boolean;
}

export async function getProductCatalog(
  organizationId: string,
  filters: ProductCatalogFilters,
) {
  const db = getDb();

  const organization = await db.organization.findUnique({
    where: { id: organizationId },
    select: {
      settings: {
        select: {
          lowStockThreshold: true,
        },
      },
    },
  });

  const lowStockThreshold = organization?.settings?.lowStockThreshold ?? 5;
  const normalizedQuery = filters.query?.trim();

  const [products, categories] = await Promise.all([
    db.product.findMany({
      where: {
        organizationId,
        deletedAt: null,
        ...(filters.status && filters.status !== "all"
          ? { status: filters.status }
          : {}),
        ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
        ...(normalizedQuery
          ? {
              OR: [
                {
                  name: {
                    contains: normalizedQuery,
                    mode: "insensitive",
                  },
                },
                {
                  variants: {
                    some: {
                      sku: {
                        contains: normalizedQuery,
                        mode: "insensitive",
                      },
                    },
                  },
                },
              ],
            }
          : {}),
      },
      orderBy: [{ updatedAt: "desc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        variants: {
          select: {
            id: true,
            sku: true,
            price: true,
            inventory: {
              select: {
                quantity: true,
                reserved: true,
              },
            },
          },
        },
      },
    }),
    db.category.findMany({
      where: {
        organizationId,
        isActive: true,
      },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
      },
    }),
  ]);

  const mappedProducts = products.map((product) => {
    const prices = product.variants.map((variant) => Number(variant.price));
    const stockTotal = product.variants.reduce(
      (sum, variant) =>
        sum +
        variant.inventory.reduce(
          (variantSum, level) => variantSum + level.quantity,
          0,
        ),
      0,
    );
    const stockReserved = product.variants.reduce(
      (sum, variant) =>
        sum +
        variant.inventory.reduce(
          (variantSum, level) => variantSum + level.reserved,
          0,
        ),
      0,
    );
    const stockAvailable = stockTotal - stockReserved;

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      categoryName: product.category?.name ?? "Sin categoria",
      status: product.status,
      variantCount: product.variants.length,
      minPrice: prices.length > 0 ? Math.min(...prices) : 0,
      maxPrice: prices.length > 0 ? Math.max(...prices) : 0,
      stockTotal,
      stockReserved,
      stockAvailable,
      isLowStock: stockAvailable <= lowStockThreshold,
      updatedAt: product.updatedAt,
    };
  });

  return {
    products: filters.lowStock
      ? mappedProducts.filter((product) => product.isLowStock)
      : mappedProducts,
    categories,
    lowStockThreshold,
  };
}

export async function getPosCatalog(organizationId: string) {
  const db = getDb();

  const products = await db.product.findMany({
    where: {
      organizationId,
      deletedAt: null,
      status: ProductStatus.ACTIVE,
    },
    orderBy: [{ name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      category: {
        select: {
          name: true,
        },
      },
      variants: {
        where: {
          isActive: true,
        },
        orderBy: [{ isDefault: "desc" }, { name: "asc" }],
        select: {
          id: true,
          sku: true,
          name: true,
          price: true,
          isDefault: true,
          inventory: {
            select: {
              quantity: true,
              reserved: true,
            },
          },
        },
      },
    },
  });

  return {
    products: products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      categoryName: product.category?.name ?? "Sin categoria",
      variants: product.variants.map((variant) => {
        const quantity = variant.inventory.reduce(
          (sum, level) => sum + level.quantity,
          0,
        );
        const reserved = variant.inventory.reduce(
          (sum, level) => sum + level.reserved,
          0,
        );

        return {
          id: variant.id,
          sku: variant.sku,
          name: variant.name,
          price: Number(variant.price),
          isDefault: variant.isDefault,
          quantity,
          reserved,
          available: quantity - reserved,
        };
      }),
    })),
  };
}

export type StockStatusFilter = "all" | "low" | "out" | "ok";

export interface InventoryFilters {
  query?: string;
  locationId?: string;
  stockStatus?: StockStatusFilter;
  movementType?: MovementType | "all";
}

function getStockStatus(available: number, lowStockThreshold: number) {
  if (available <= 0) {
    return "out" as const;
  }

  if (available <= lowStockThreshold) {
    return "low" as const;
  }

  return "ok" as const;
}

export async function getInventoryOverview(
  organizationId: string,
  filters: InventoryFilters,
) {
  const db = getDb();
  const normalizedQuery = filters.query?.trim();

  const organization = await db.organization.findUnique({
    where: { id: organizationId },
    select: {
      settings: {
        select: {
          lowStockThreshold: true,
        },
      },
    },
  });

  const lowStockThreshold = organization?.settings?.lowStockThreshold ?? 5;

  const [inventoryLevels, movementRows, locations] = await Promise.all([
    db.inventoryLevel.findMany({
      where: {
        ...(filters.locationId ? { locationId: filters.locationId } : {}),
        variant: {
          product: {
            organizationId,
            deletedAt: null,
          },
          ...(normalizedQuery
            ? {
                OR: [
                  {
                    sku: {
                      contains: normalizedQuery,
                      mode: "insensitive",
                    },
                  },
                  {
                    product: {
                      name: {
                        contains: normalizedQuery,
                        mode: "insensitive",
                      },
                    },
                  },
                ],
              }
            : {}),
        },
      },
      orderBy: [{ quantity: "asc" }, { updatedAt: "desc" }],
      select: {
        id: true,
        quantity: true,
        reserved: true,
        incoming: true,
        updatedAt: true,
        location: {
          select: {
            id: true,
            name: true,
            isActive: true,
          },
        },
        variant: {
          select: {
            id: true,
            sku: true,
            name: true,
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    }),
    db.inventoryMovement.findMany({
      where: {
        organizationId,
        ...(filters.locationId ? { locationId: filters.locationId } : {}),
        ...(filters.movementType && filters.movementType !== "all"
          ? { type: filters.movementType }
          : {}),
        ...(normalizedQuery
          ? {
              variant: {
                OR: [
                  {
                    sku: {
                      contains: normalizedQuery,
                      mode: "insensitive",
                    },
                  },
                  {
                    product: {
                      name: {
                        contains: normalizedQuery,
                        mode: "insensitive",
                      },
                    },
                  },
                ],
              },
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        type: true,
        quantity: true,
        quantityBefore: true,
        quantityAfter: true,
        reference: true,
        referenceType: true,
        createdAt: true,
        location: {
          select: {
            name: true,
          },
        },
        variant: {
          select: {
            sku: true,
            name: true,
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    }),
    db.location.findMany({
      where: {
        organizationId,
        isActive: true,
      },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
      },
    }),
  ]);

  const levels = inventoryLevels.map((level) => {
    const available = level.quantity - level.reserved;

    return {
      id: level.id,
      productName: level.variant.product.name,
      variantName: level.variant.name,
      sku: level.variant.sku,
      locationId: level.location.id,
      locationName: level.location.name,
      quantity: level.quantity,
      reserved: level.reserved,
      incoming: level.incoming,
      available,
      lowStockThreshold,
      stockStatus: getStockStatus(available, lowStockThreshold),
      updatedAt: level.updatedAt,
    };
  });

  const filteredLevels =
    filters.stockStatus && filters.stockStatus !== "all"
      ? levels.filter((level) => level.stockStatus === filters.stockStatus)
      : levels;

  const summary = {
    stockTotal: filteredLevels.reduce((sum, level) => sum + level.quantity, 0),
    stockAvailable: filteredLevels.reduce(
      (sum, level) => sum + level.available,
      0,
    ),
    stockReserved: filteredLevels.reduce(
      (sum, level) => sum + level.reserved,
      0,
    ),
    stockIncoming: filteredLevels.reduce(
      (sum, level) => sum + level.incoming,
      0,
    ),
    lowStockVariants: filteredLevels.filter(
      (level) => level.stockStatus === "low" || level.stockStatus === "out",
    ).length,
    activeLocations: locations.length,
    recentMovements: movementRows.length,
  };

  return {
    summary,
    levels: filteredLevels,
    movements: movementRows.map((movement) => ({
      id: movement.id,
      type: movement.type,
      productName: movement.variant.product.name,
      variantName: movement.variant.name,
      sku: movement.variant.sku,
      locationName: movement.location.name,
      quantity: movement.quantity,
      quantityBefore: movement.quantityBefore,
      quantityAfter: movement.quantityAfter,
      reference: movement.reference,
      referenceType: movement.referenceType,
      createdAt: movement.createdAt,
    })),
    locations,
    movementTypes: Object.values(MovementType),
    lowStockThreshold,
  };
}

export interface OrderListFilters {
  query?: string;
  status?: OrderStatus | "all";
  paymentStatus?: PaymentStatus | "all";
  channel?: OrderChannel | "all";
  dateFrom?: Date;
  dateTo?: Date;
}

export async function getOrdersList(
  organizationId: string,
  filters: OrderListFilters,
) {
  const db = getDb();
  const normalizedQuery = filters.query?.trim();
  const orderNumber = normalizedQuery ? Number(normalizedQuery) : Number.NaN;

  const where: Prisma.OrderWhereInput = {
    organizationId,
    ...(filters.status && filters.status !== "all"
      ? { status: filters.status }
      : {}),
    ...(filters.paymentStatus && filters.paymentStatus !== "all"
      ? { paymentStatus: filters.paymentStatus }
      : {}),
    ...(filters.channel && filters.channel !== "all"
      ? { channel: filters.channel }
      : {}),
    ...(filters.dateFrom || filters.dateTo
      ? {
          createdAt: {
            ...(filters.dateFrom ? { gte: filters.dateFrom } : {}),
            ...(filters.dateTo ? { lte: filters.dateTo } : {}),
          },
        }
      : {}),
    ...(normalizedQuery
      ? {
          OR: [
            ...(Number.isFinite(orderNumber) ? [{ number: orderNumber }] : []),
            {
              customer: {
                name: {
                  contains: normalizedQuery,
                  mode: "insensitive",
                },
              },
            },
            {
              customer: {
                phone: {
                  contains: normalizedQuery,
                  mode: "insensitive",
                },
              },
            },
          ],
        }
      : {}),
  };

  const [orders, summary] = await Promise.all([
    db.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        number: true,
        channel: true,
        status: true,
        paymentStatus: true,
        total: true,
        createdAt: true,
        customer: {
          select: {
            name: true,
            phone: true,
          },
        },
        _count: {
          select: {
            items: true,
          },
        },
      },
    }),
    db.order.aggregate({
      where,
      _count: { id: true },
      _sum: { total: true },
    }),
  ]);

  return {
    orders: orders.map((order) => ({
      id: order.id,
      number: order.number,
      channel: order.channel,
      status: order.status,
      paymentStatus: order.paymentStatus,
      total: Number(order.total),
      createdAt: order.createdAt,
      customerName: order.customer?.name ?? "Cliente sin asignar",
      customerPhone: order.customer?.phone ?? null,
      itemCount: order._count.items,
    })),
    summary: {
      count: summary._count.id,
      total: Number(summary._sum.total ?? 0),
    },
  };
}

export interface ReportsFilters {
  dateFrom?: Date;
  dateTo?: Date;
  channel?: OrderChannel | "all";
  status?: OrderStatus | "all";
}

function formatReportDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function getReportsOverview(
  organizationId: string,
  filters: ReportsFilters,
) {
  const db = getDb();

  const orderWhere: Prisma.OrderWhereInput = {
    organizationId,
    ...(filters.status && filters.status !== "all"
      ? { status: filters.status }
      : {}),
    ...(filters.channel && filters.channel !== "all"
      ? { channel: filters.channel }
      : {}),
    ...(filters.dateFrom || filters.dateTo
      ? {
          createdAt: {
            ...(filters.dateFrom ? { gte: filters.dateFrom } : {}),
            ...(filters.dateTo ? { lte: filters.dateTo } : {}),
          },
        }
      : {}),
  };

  const customerWhere: Prisma.CustomerWhereInput = {
    organizationId,
    deletedAt: null,
    ...(filters.dateFrom || filters.dateTo
      ? {
          createdAt: {
            ...(filters.dateFrom ? { gte: filters.dateFrom } : {}),
            ...(filters.dateTo ? { lte: filters.dateTo } : {}),
          },
        }
      : {}),
  };

  const [orders, newCustomers, conversations, inventoryLevels] =
    await Promise.all([
      db.order.findMany({
        where: orderWhere,
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          number: true,
          channel: true,
          status: true,
          total: true,
          createdAt: true,
        },
      }),
      db.customer.count({ where: customerWhere }),
      db.whatsAppConversation.count({
        where: {
          organizationId,
          ...(filters.dateFrom || filters.dateTo
            ? {
                createdAt: {
                  ...(filters.dateFrom ? { gte: filters.dateFrom } : {}),
                  ...(filters.dateTo ? { lte: filters.dateTo } : {}),
                },
              }
            : {}),
        },
      }),
      db.inventoryLevel.findMany({
        where: {
          location: {
            organizationId,
            isActive: true,
          },
          variant: {
            product: {
              organizationId,
              deletedAt: null,
            },
          },
        },
        select: {
          id: true,
          quantity: true,
          reserved: true,
          incoming: true,
          location: {
            select: {
              name: true,
            },
          },
          variant: {
            select: {
              sku: true,
              name: true,
              product: {
                select: {
                  name: true,
                  category: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
    ]);

  const orderIds = orders.map((order) => order.id);
  const orderItems =
    orderIds.length > 0
      ? await db.orderItem.findMany({
          where: {
            orderId: {
              in: orderIds,
            },
          },
          select: {
            quantity: true,
            total: true,
            variant: {
              select: {
                sku: true,
                name: true,
                product: {
                  select: {
                    name: true,
                    category: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        })
      : [];

  const totalSales = orders.reduce(
    (total, order) => total + Number(order.total),
    0,
  );
  const orderCount = orders.length;
  const productsSold = orderItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const salesByDay = new Map<string, { date: string; sales: number; orders: number }>();
  const salesByChannel = new Map<
    OrderChannel,
    { channel: OrderChannel; sales: number; orders: number }
  >();
  const ordersByStatus = new Map<
    OrderStatus,
    { status: OrderStatus; orders: number }
  >();

  for (const order of orders) {
    const date = formatReportDate(order.createdAt);
    const day = salesByDay.get(date) ?? { date, sales: 0, orders: 0 };
    day.sales += Number(order.total);
    day.orders += 1;
    salesByDay.set(date, day);

    const channel = salesByChannel.get(order.channel) ?? {
      channel: order.channel,
      sales: 0,
      orders: 0,
    };
    channel.sales += Number(order.total);
    channel.orders += 1;
    salesByChannel.set(order.channel, channel);

    const status = ordersByStatus.get(order.status) ?? {
      status: order.status,
      orders: 0,
    };
    status.orders += 1;
    ordersByStatus.set(order.status, status);
  }

  const topProductsByName = new Map<
    string,
    { productName: string; categoryName: string; quantity: number; revenue: number }
  >();

  for (const item of orderItems) {
    const productName = item.variant.product.name;
    const product = topProductsByName.get(productName) ?? {
      productName,
      categoryName: item.variant.product.category?.name ?? "Sin categoria",
      quantity: 0,
      revenue: 0,
    };

    product.quantity += item.quantity;
    product.revenue += Number(item.total);
    topProductsByName.set(productName, product);
  }

  const organization = await db.organization.findUnique({
    where: { id: organizationId },
    select: {
      settings: {
        select: {
          lowStockThreshold: true,
        },
      },
    },
  });
  const lowStockThreshold = organization?.settings?.lowStockThreshold ?? 5;

  const lowStockLevels = inventoryLevels
    .map((level) => {
      const available = level.quantity - level.reserved;

      return {
        id: level.id,
        productName: level.variant.product.name,
        variantName: level.variant.name,
        sku: level.variant.sku,
        categoryName: level.variant.product.category?.name ?? "Sin categoria",
        locationName: level.location.name,
        quantity: level.quantity,
        reserved: level.reserved,
        incoming: level.incoming,
        available,
        threshold: lowStockThreshold,
      };
    })
    .filter((level) => level.available <= level.threshold)
    .sort((first, second) => first.available - second.available)
    .slice(0, 8);

  const lowStockByProduct = new Map<
    string,
    { productName: string; variants: number; available: number }
  >();
  const lowStockByCategory = new Map<
    string,
    { categoryName: string; variants: number; available: number }
  >();

  for (const level of lowStockLevels) {
    const product = lowStockByProduct.get(level.productName) ?? {
      productName: level.productName,
      variants: 0,
      available: 0,
    };
    product.variants += 1;
    product.available += level.available;
    lowStockByProduct.set(level.productName, product);

    const category = lowStockByCategory.get(level.categoryName) ?? {
      categoryName: level.categoryName,
      variants: 0,
      available: 0,
    };
    category.variants += 1;
    category.available += level.available;
    lowStockByCategory.set(level.categoryName, category);
  }

  const channelSummary = Object.values(OrderChannel).map((channel) => {
    const summary = salesByChannel.get(channel);

    return {
      channel,
      sales: summary?.sales ?? 0,
      orders: summary?.orders ?? 0,
    };
  });

  return {
    kpis: {
      totalSales,
      orderCount,
      averageTicket: orderCount > 0 ? totalSales / orderCount : 0,
      newCustomers,
      productsSold,
      whatsAppSales:
        salesByChannel.get(OrderChannel.WHATSAPP)?.sales ?? 0,
      posSales: salesByChannel.get(OrderChannel.POS)?.sales ?? 0,
      webSales: salesByChannel.get(OrderChannel.WEB)?.sales ?? 0,
      manualSales: salesByChannel.get(OrderChannel.MANUAL)?.sales ?? 0,
      conversations,
    },
    charts: {
      salesByDay: Array.from(salesByDay.values()),
      salesByChannel: channelSummary,
      ordersByStatus: Object.values(OrderStatus).map((status) => ({
        status,
        orders: ordersByStatus.get(status)?.orders ?? 0,
      })),
      topProducts: Array.from(topProductsByName.values())
        .sort((first, second) => second.quantity - first.quantity)
        .slice(0, 6),
      lowStockByProduct: Array.from(lowStockByProduct.values()),
      lowStockByCategory: Array.from(lowStockByCategory.values()),
    },
    tables: {
      channelSummary,
      topProducts: Array.from(topProductsByName.values())
        .sort((first, second) => second.revenue - first.revenue)
        .slice(0, 6),
      lowStockLevels,
    },
    filtersMeta: {
      channels: Object.values(OrderChannel),
      statuses: Object.values(OrderStatus),
    },
  };
}

export async function getOrderDetail(organizationId: string, orderId: string) {
  const db = getDb();

  const order = await db.order.findFirst({
    where: {
      id: orderId,
      organizationId,
    },
    select: {
      id: true,
      number: true,
      channel: true,
      status: true,
      paymentStatus: true,
      subtotal: true,
      discount: true,
      taxRate: true,
      tax: true,
      total: true,
      shippingAddress: true,
      notes: true,
      internalNotes: true,
      metadata: true,
      createdAt: true,
      updatedAt: true,
      confirmedAt: true,
      completedAt: true,
      cancelledAt: true,
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          tags: true,
          totalOrders: true,
          totalSpent: true,
        },
      },
      items: {
        orderBy: { id: "asc" },
        select: {
          id: true,
          quantity: true,
          unitPrice: true,
          discount: true,
          taxRate: true,
          subtotal: true,
          tax: true,
          total: true,
          snapshot: true,
          notes: true,
          variant: {
            select: {
              sku: true,
              name: true,
              product: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
      payments: {
        orderBy: { paidAt: "desc" },
        select: {
          id: true,
          method: true,
          amount: true,
          currency: true,
          installments: true,
          installmentAmount: true,
          reference: true,
          gateway: true,
          status: true,
          paidAt: true,
          createdAt: true,
        },
      },
      events: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          type: true,
          payload: true,
          createdByName: true,
          createdAt: true,
        },
      },
    },
  });

  if (!order) {
    return null;
  }

  const movements = await db.inventoryMovement.findMany({
    where: {
      organizationId,
      OR: [
        { reference: order.id },
        { reference: order.number.toString() },
        { reference: `#${order.number}` },
      ],
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      type: true,
      quantity: true,
      quantityBefore: true,
      quantityAfter: true,
      reference: true,
      referenceType: true,
      createdAt: true,
      location: {
        select: {
          name: true,
        },
      },
      variant: {
        select: {
          sku: true,
          name: true,
          product: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return {
    ...order,
    subtotal: Number(order.subtotal),
    discount: Number(order.discount),
    taxRate: Number(order.taxRate),
    tax: Number(order.tax),
    total: Number(order.total),
    customer: order.customer
      ? {
          ...order.customer,
          totalSpent: Number(order.customer.totalSpent),
        }
      : null,
    items: order.items.map((item) => ({
      ...item,
      unitPrice: Number(item.unitPrice),
      discount: Number(item.discount),
      taxRate: Number(item.taxRate),
      subtotal: Number(item.subtotal),
      tax: Number(item.tax),
      total: Number(item.total),
    })),
    payments: order.payments.map((payment) => ({
      ...payment,
      amount: Number(payment.amount),
      installmentAmount:
        payment.installmentAmount === null
          ? null
          : Number(payment.installmentAmount),
    })),
    movements,
  };
}

export interface CustomerListFilters {
  query?: string;
  tag?: string;
  province?: ArgentinaProv | "all";
  minSpent?: number;
  hasOrders?: boolean;
}

export async function getCustomersList(
  organizationId: string,
  filters: CustomerListFilters,
) {
  const db = getDb();
  const normalizedQuery = filters.query?.trim();
  const normalizedTag = filters.tag?.trim();

  const where: Prisma.CustomerWhereInput = {
    organizationId,
    deletedAt: null,
    ...(normalizedTag ? { tags: { has: normalizedTag } } : {}),
    ...(filters.province && filters.province !== "all"
      ? {
          addresses: {
            some: {
              provincia: filters.province,
            },
          },
        }
      : {}),
    ...(typeof filters.minSpent === "number"
      ? {
          totalSpent: {
            gte: filters.minSpent,
          },
        }
      : {}),
    ...(typeof filters.hasOrders === "boolean"
      ? { totalOrders: filters.hasOrders ? { gt: 0 } : 0 }
      : {}),
    ...(normalizedQuery
      ? {
          OR: [
            {
              name: {
                contains: normalizedQuery,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: normalizedQuery,
                mode: "insensitive",
              },
            },
            {
              phone: {
                contains: normalizedQuery,
                mode: "insensitive",
              },
            },
          ],
        }
      : {}),
  };

  const [customers, allTags, provinces, summary] = await Promise.all([
    db.customer.findMany({
      where,
      orderBy: [{ lastOrderAt: "desc" }, { name: "asc" }],
      take: 50,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        tags: true,
        totalOrders: true,
        totalSpent: true,
        lastOrderAt: true,
        addresses: {
          orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
          take: 1,
          select: {
            localidad: true,
            provincia: true,
          },
        },
      },
    }),
    db.customer.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
      select: {
        tags: true,
      },
    }),
    db.customerAddress.findMany({
      where: {
        customer: {
          organizationId,
          deletedAt: null,
        },
      },
      distinct: ["provincia"],
      orderBy: { provincia: "asc" },
      select: {
        provincia: true,
      },
    }),
    db.customer.aggregate({
      where,
      _count: { id: true },
      _sum: { totalSpent: true },
    }),
  ]);

  return {
    customers: customers.map((customer) => {
      const primaryAddress = customer.addresses[0] ?? null;

      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        tags: customer.tags,
        totalOrders: customer.totalOrders,
        totalSpent: Number(customer.totalSpent),
        lastOrderAt: customer.lastOrderAt,
        location: primaryAddress
          ? `${primaryAddress.localidad}, ${primaryAddress.provincia}`
          : "Sin ubicacion",
        province: primaryAddress?.provincia ?? null,
      };
    }),
    filters: {
      tags: Array.from(new Set(allTags.flatMap((customer) => customer.tags))).sort(),
      provinces: provinces.map((province) => province.provincia),
    },
    summary: {
      count: summary._count.id,
      totalSpent: Number(summary._sum.totalSpent ?? 0),
    },
  };
}

export async function getCustomerDetail(
  organizationId: string,
  customerId: string,
) {
  const db = getDb();

  const customer = await db.customer.findFirst({
    where: {
      id: customerId,
      organizationId,
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      dni: true,
      cuit: true,
      condicionFiscal: true,
      whatsappId: true,
      notes: true,
      tags: true,
      totalOrders: true,
      totalSpent: true,
      lastOrderAt: true,
      createdAt: true,
      updatedAt: true,
      addresses: {
        orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
        select: {
          id: true,
          label: true,
          street: true,
          floor: true,
          apartment: true,
          localidad: true,
          provincia: true,
          codigoPostal: true,
          country: true,
          notes: true,
          isDefault: true,
          createdAt: true,
        },
      },
      orders: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          number: true,
          channel: true,
          status: true,
          paymentStatus: true,
          total: true,
          createdAt: true,
          _count: {
            select: {
              items: true,
            },
          },
        },
      },
      conversations: {
        orderBy: { lastMessageAt: "desc" },
        select: {
          id: true,
          phoneNumber: true,
          contactName: true,
          status: true,
          unreadCount: true,
          lastMessageAt: true,
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: {
              body: true,
              direction: true,
              createdAt: true,
            },
          },
        },
      },
    },
  });

  if (!customer) {
    return null;
  }

  const orders = customer.orders.map((order) => ({
    ...order,
    total: Number(order.total),
    itemCount: order._count.items,
  }));
  const totalSpent = Number(customer.totalSpent);
  const averageTicket =
    customer.totalOrders > 0 ? totalSpent / customer.totalOrders : 0;

  return {
    ...customer,
    totalSpent,
    averageTicket,
    orders,
  };
}

export interface WhatsAppInboxFilters {
  query?: string;
  status?: ConversationStatus | "all";
  hasOrder?: boolean;
}

export async function getWhatsAppInbox(
  organizationId: string,
  filters: WhatsAppInboxFilters,
) {
  const db = getDb();
  const normalizedQuery = filters.query?.trim();

  const where: Prisma.WhatsAppConversationWhereInput = {
    organizationId,
    ...(filters.status && filters.status !== "all"
      ? { status: filters.status }
      : {}),
    ...(typeof filters.hasOrder === "boolean"
      ? filters.hasOrder
        ? { orderId: { not: null } }
        : { orderId: null }
      : {}),
    ...(normalizedQuery
      ? {
          OR: [
            {
              phoneNumber: {
                contains: normalizedQuery,
                mode: "insensitive",
              },
            },
            {
              contactName: {
                contains: normalizedQuery,
                mode: "insensitive",
              },
            },
            {
              customer: {
                name: {
                  contains: normalizedQuery,
                  mode: "insensitive",
                },
              },
            },
            {
              messages: {
                some: {
                  body: {
                    contains: normalizedQuery,
                    mode: "insensitive",
                  },
                },
              },
            },
          ],
        }
      : {}),
  };

  const conversations = await db.whatsAppConversation.findMany({
    where,
    orderBy: { lastMessageAt: "desc" },
    take: 50,
    select: {
      id: true,
      phoneNumber: true,
      contactName: true,
      status: true,
      unreadCount: true,
      orderId: true,
      lastMessageAt: true,
      customer: {
        select: {
          id: true,
          name: true,
          phone: true,
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          id: true,
          body: true,
          direction: true,
          type: true,
          createdAt: true,
        },
      },
      _count: {
        select: {
          messages: true,
        },
      },
    },
  });

  const orderIds = conversations
    .map((conversation) => conversation.orderId)
    .filter((orderId): orderId is string => Boolean(orderId));

  const orders =
    orderIds.length > 0
      ? await db.order.findMany({
          where: {
            organizationId,
            id: { in: orderIds },
          },
          select: {
            id: true,
            number: true,
            status: true,
            total: true,
          },
        })
      : [];
  const orderById = new Map(orders.map((order) => [order.id, order]));

  return {
    conversations: conversations.map((conversation) => {
      const lastMessage = conversation.messages[0] ?? null;
      const order = conversation.orderId
        ? orderById.get(conversation.orderId) ?? null
        : null;

      return {
        id: conversation.id,
        phoneNumber: conversation.phoneNumber,
        contactName: conversation.contactName,
        status: conversation.status,
        unreadCount: conversation.unreadCount,
        lastMessageAt: conversation.lastMessageAt,
        customer: conversation.customer,
        lastMessage,
        messageCount: conversation._count.messages,
        order: order
          ? {
              ...order,
              total: Number(order.total),
            }
          : null,
      };
    }),
    summary: {
      count: conversations.length,
      open: conversations.filter(
        (conversation) => conversation.status === ConversationStatus.OPEN,
      ).length,
      resolved: conversations.filter(
        (conversation) => conversation.status === ConversationStatus.RESOLVED,
      ).length,
      linkedOrders: conversations.filter((conversation) => conversation.orderId)
        .length,
    },
  };
}

export async function getWhatsAppConversationDetail(
  organizationId: string,
  conversationId: string,
) {
  const db = getDb();

  const conversation = await db.whatsAppConversation.findFirst({
    where: {
      id: conversationId,
      organizationId,
    },
    select: {
      id: true,
      phoneNumber: true,
      contactName: true,
      status: true,
      unreadCount: true,
      orderId: true,
      lastMessageAt: true,
      createdAt: true,
      updatedAt: true,
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          tags: true,
        },
      },
      messages: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          direction: true,
          type: true,
          status: true,
          body: true,
          mediaUrl: true,
          mediaType: true,
          mediaCaption: true,
          externalId: true,
          metadata: true,
          createdAt: true,
        },
      },
    },
  });

  if (!conversation) {
    return null;
  }

  const order = conversation.orderId
    ? await db.order.findFirst({
        where: {
          id: conversation.orderId,
          organizationId,
        },
        select: {
          id: true,
          number: true,
          status: true,
          paymentStatus: true,
          total: true,
          createdAt: true,
        },
      })
    : null;

  return {
    ...conversation,
    order: order
      ? {
          ...order,
          total: Number(order.total),
        }
      : null,
  };
}
