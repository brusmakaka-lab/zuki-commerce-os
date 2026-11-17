// prisma/seed.ts — datos de demo realistas para Argentina
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  Plan,
  MemberRole,
  CondicionFiscal,
  LocationType,
  ProductStatus,
  MovementType,
  OrderChannel,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  ConversationStatus,
  ArgentinaProv,
  InsightType,
  InsightStatus,
  AuditAction,
} from "@prisma/client";
import { config } from "dotenv";

config({ path: ".env.local" });
config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Iniciando seed de Zuki Commerce OS (Argentina)...");

  // ─── ORGANIZACIÓN ────────────────────────────────────────────────────────
  const org = await prisma.organization.upsert({
    where: { slug: "ropa-del-sur" },
    update: {},
    create: {
      slug: "ropa-del-sur",
      name: "Ropa del Sur",
      legalName: "Ropa del Sur S.R.L.",
      cuit: "30712345678",
      currency: "ARS",
      timezone: "America/Argentina/Buenos_Aires",
      country: "AR",
      condicionFiscal: CondicionFiscal.RESPONSABLE_INSCRIPTO,
      plan: Plan.PRO,
      nextOrderNumber: 1001,
    },
  });

  // ─── SETTINGS ────────────────────────────────────────────────────────────
  await prisma.orgSettings.upsert({
    where: { organizationId: org.id },
    update: {},
    create: {
      organizationId: org.id,
      storeName: "Ropa del Sur",
      storeDescription: "Indumentaria femenina con diseño propio. Envíos a todo el país.",
      enablePublicStore: true,
      whatsappNumber: "+5491123456789",
      enableWhatsApp: true,
      greetingMessage: "¡Hola! 👋 Bienvenida a Ropa del Sur. ¿En qué te puedo ayudar?",
      awayMessage: "Hola, en este momento no estamos disponibles. Te respondemos a la brevedad 🙏",
      defaultTaxRate: 21,
      enableInvoicing: true,
      invoicePrefix: "A",
      lowStockThreshold: 5,
      enableLowStockAlert: true,
      enablePos: true,
      notifyEmail: "admin@ropadelsur.com.ar",
      primaryColor: "#6366f1",
      accentColor: "#f59e0b",
    },
  });

  // ─── USUARIOS ─────────────────────────────────────────────────────────────
  const owner = await prisma.user.upsert({
    where: { email: "ana@ropadelsur.com.ar" },
    update: {},
    create: {
      email: "ana@ropadelsur.com.ar",
      name: "Ana Gómez",
      emailVerified: new Date(),
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: "lucia@ropadelsur.com.ar" },
    update: {},
    create: {
      email: "lucia@ropadelsur.com.ar",
      name: "Lucía Fernández",
      emailVerified: new Date(),
    },
  });

  const cashier = await prisma.user.upsert({
    where: { email: "martin@ropadelsur.com.ar" },
    update: {},
    create: {
      email: "martin@ropadelsur.com.ar",
      name: "Martín Díaz",
      emailVerified: new Date(),
    },
  });

  // ─── MEMBRESÍAS ───────────────────────────────────────────────────────────
  await prisma.member.upsert({
    where: { organizationId_userId: { organizationId: org.id, userId: owner.id } },
    update: {},
    create: { organizationId: org.id, userId: owner.id, role: MemberRole.OWNER },
  });
  await prisma.member.upsert({
    where: { organizationId_userId: { organizationId: org.id, userId: manager.id } },
    update: {},
    create: { organizationId: org.id, userId: manager.id, role: MemberRole.MANAGER },
  });
  await prisma.member.upsert({
    where: { organizationId_userId: { organizationId: org.id, userId: cashier.id } },
    update: {},
    create: { organizationId: org.id, userId: cashier.id, role: MemberRole.CASHIER },
  });

  // ─── UBICACIONES ──────────────────────────────────────────────────────────
  const localPalermo = await prisma.location.upsert({
    where: { id: "loc_palermo_001" },
    update: {},
    create: {
      id: "loc_palermo_001",
      organizationId: org.id,
      name: "Local Palermo",
      type: LocationType.STORE,
      address: "Thames 1745, C1414 CABA",
      isDefault: true,
    },
  });

  const deposito = await prisma.location.upsert({
    where: { id: "loc_deposito_001" },
    update: {},
    create: {
      id: "loc_deposito_001",
      organizationId: org.id,
      name: "Depósito Lanús",
      type: LocationType.WAREHOUSE,
      address: "Av. Hipólito Yrigoyen 3200, Lanús Este, Buenos Aires",
    },
  });

  // ─── CATEGORÍAS ───────────────────────────────────────────────────────────
  const catRemeras = await prisma.category.upsert({
    where: { organizationId_slug: { organizationId: org.id, slug: "remeras" } },
    update: {},
    create: {
      organizationId: org.id,
      name: "Remeras",
      slug: "remeras",
      description: "Remeras de algodón con diseños exclusivos",
      sortOrder: 1,
    },
  });

  const catPantalones = await prisma.category.upsert({
    where: { organizationId_slug: { organizationId: org.id, slug: "pantalones" } },
    update: {},
    create: {
      organizationId: org.id,
      name: "Pantalones",
      slug: "pantalones",
      description: "Pantalones y joggers para el día a día",
      sortOrder: 2,
    },
  });

  const catAccesorios = await prisma.category.upsert({
    where: { organizationId_slug: { organizationId: org.id, slug: "accesorios" } },
    update: {},
    create: {
      organizationId: org.id,
      name: "Accesorios",
      slug: "accesorios",
      sortOrder: 3,
    },
  });

  // ─── PRODUCTOS Y VARIANTES ────────────────────────────────────────────────
  const remera1 = await prisma.product.upsert({
    where: { organizationId_slug: { organizationId: org.id, slug: "remera-basica-algodon" } },
    update: {},
    create: {
      organizationId: org.id,
      categoryId: catRemeras.id,
      name: "Remera Básica Algodón",
      slug: "remera-basica-algodon",
      description: "Remera de algodón pima 180g. Corte relaxed. Lavable a máquina.",
      imageUrls: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800",
      ],
      tags: ["algodón", "básica", "verano"],
      status: ProductStatus.ACTIVE,
      trackStock: true,
    },
  });

  const talles = ["XS", "S", "M", "L", "XL"];
  const colores = ["Blanco", "Negro", "Gris"];

  for (const color of colores) {
    for (const talle of talles) {
      const sku = `REM-${color.toUpperCase().slice(0, 3)}-${talle}`;
      const existing = await prisma.productVariant.findFirst({
        where: { productId: remera1.id, sku },
      });
      if (!existing) {
        const variant = await prisma.productVariant.create({
          data: {
            productId: remera1.id,
            sku,
            name: `${color} / Talle ${talle}`,
            price: 8500,
            compareAt: 11000,
            costPrice: 3800,
            attributes: { talle, color },
            isDefault: color === "Blanco" && talle === "M",
          },
        });
        // stock en ambas ubicaciones
        await prisma.inventoryLevel.create({
          data: { variantId: variant.id, locationId: localPalermo.id, quantity: 8, reserved: 1 },
        });
        await prisma.inventoryLevel.create({
          data: { variantId: variant.id, locationId: deposito.id, quantity: 20, reserved: 0 },
        });
        await prisma.inventoryMovement.create({
          data: {
            organizationId: org.id,
            variantId: variant.id,
            locationId: deposito.id,
            type: MovementType.INITIAL_STOCK,
            quantity: 20,
            quantityBefore: 0,
            quantityAfter: 20,
            reason: "Stock inicial de apertura",
            createdById: owner.id,
          },
        });
      }
    }
  }

  const pantalonJogger = await prisma.product.upsert({
    where: { organizationId_slug: { organizationId: org.id, slug: "jogger-french-terry" } },
    update: {},
    create: {
      organizationId: org.id,
      categoryId: catPantalones.id,
      name: "Jogger French Terry",
      slug: "jogger-french-terry",
      description: "Pantalón jogger de french terry. Puños y cintura elástica. Bolsillos laterales.",
      imageUrls: ["https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800"],
      tags: ["jogger", "comodo", "loungewear"],
      status: ProductStatus.ACTIVE,
      trackStock: true,
    },
  });

  for (const talle of ["S", "M", "L", "XL"]) {
    const sku = `JOG-NEG-${talle}`;
    const existing = await prisma.productVariant.findFirst({
      where: { productId: pantalonJogger.id, sku },
    });
    if (!existing) {
      const v = await prisma.productVariant.create({
        data: {
          productId: pantalonJogger.id,
          sku,
          name: `Negro / Talle ${talle}`,
          price: 15900,
          compareAt: 19900,
          costPrice: 7200,
          attributes: { talle, color: "Negro" },
          isDefault: talle === "M",
        },
      });
      await prisma.inventoryLevel.create({
        data: { variantId: v.id, locationId: localPalermo.id, quantity: talle === "M" ? 3 : 6 },
      });
    }
  }

  const bolso = await prisma.product.upsert({
    where: { organizationId_slug: { organizationId: org.id, slug: "bolso-tote-canvas" } },
    update: {},
    create: {
      organizationId: org.id,
      categoryId: catAccesorios.id,
      name: "Bolso Tote Canvas",
      slug: "bolso-tote-canvas",
      description: "Bolso tote de canvas resistente. 40x35cm. Ideal para el día a día.",
      imageUrls: ["https://images.unsplash.com/photo-1544816155-12df9643f363?w=800"],
      tags: ["bolso", "canvas", "accesorios"],
      status: ProductStatus.ACTIVE,
      trackStock: true,
    },
  });

  const bolsoVariant = await prisma.productVariant.upsert({
    where: { productId_sku: { productId: bolso.id, sku: "BOL-CAN-NAT" } },
    update: {},
    create: {
      productId: bolso.id,
      sku: "BOL-CAN-NAT",
      name: "Natural",
      price: 12500,
      costPrice: 5500,
      attributes: { color: "Natural" },
      isDefault: true,
    },
  });

  await prisma.inventoryLevel.upsert({
    where: { variantId_locationId: { variantId: bolsoVariant.id, locationId: localPalermo.id } },
    update: {},
    create: { variantId: bolsoVariant.id, locationId: localPalermo.id, quantity: 4 },
  });

  // ─── CLIENTES ─────────────────────────────────────────────────────────────
  const cliente1 = await prisma.customer.upsert({
    where: { organizationId_phone: { organizationId: org.id, phone: "+5491165432100" } },
    update: {},
    create: {
      organizationId: org.id,
      name: "Valentina Torres",
      email: "vale.torres@gmail.com",
      phone: "+5491165432100",
      whatsappId: "+5491165432100",
      condicionFiscal: CondicionFiscal.CONSUMIDOR_FINAL,
      tags: ["frecuente", "premium"],
      totalOrders: 5,
      totalSpent: 73500,
      lastOrderAt: new Date("2026-06-10"),
    },
  });

  await prisma.customerAddress.upsert({
    where: { id: "addr_vale_001" },
    update: {},
    create: {
      id: "addr_vale_001",
      customerId: cliente1.id,
      label: "Casa",
      street: "Gurruchaga 1890 PB A",
      localidad: "CABA",
      provincia: ArgentinaProv.CABA,
      codigoPostal: "1414",
      isDefault: true,
    },
  });

  const cliente2 = await prisma.customer.upsert({
    where: { organizationId_phone: { organizationId: org.id, phone: "+5491187654321" } },
    update: {},
    create: {
      organizationId: org.id,
      name: "Camila Rodríguez",
      email: "cami.rod@hotmail.com",
      phone: "+5491187654321",
      whatsappId: "+5491187654321",
      condicionFiscal: CondicionFiscal.CONSUMIDOR_FINAL,
      tags: ["nuevo"],
      totalOrders: 1,
      totalSpent: 8500,
      lastOrderAt: new Date("2026-06-18"),
    },
  });

  await prisma.customerAddress.upsert({
    where: { id: "addr_cami_001" },
    update: {},
    create: {
      id: "addr_cami_001",
      customerId: cliente2.id,
      label: "Casa",
      street: "Belgrano 540 3°B",
      localidad: "Rosario",
      provincia: ArgentinaProv.SANTA_FE,
      codigoPostal: "2000",
      isDefault: true,
    },
  });

  const cliente3 = await prisma.customer.upsert({
    where: { organizationId_phone: { organizationId: org.id, phone: "+5491144332211" } },
    update: {},
    create: {
      organizationId: org.id,
      name: "Sofía Méndez",
      phone: "+5491144332211",
      whatsappId: "+5491144332211",
      condicionFiscal: CondicionFiscal.CONSUMIDOR_FINAL,
      tags: ["mayorista"],
      totalOrders: 12,
      totalSpent: 185000,
      lastOrderAt: new Date("2026-06-15"),
    },
  });

  // ─── PEDIDOS ──────────────────────────────────────────────────────────────
  const varianteRemeraM = await prisma.productVariant.findFirst({
    where: { productId: remera1.id, sku: "REM-BLA-M" },
  });

  const order1 = await prisma.order.upsert({
    where: { organizationId_number: { organizationId: org.id, number: 1001 } },
    update: {},
    create: {
      organizationId: org.id,
      customerId: cliente1.id,
      number: 1001,
      channel: OrderChannel.WHATSAPP,
      status: OrderStatus.DELIVERED,
      paymentStatus: PaymentStatus.PAID,
      subtotal: 8500,
      discount: 0,
      taxRate: 21,
      tax: 1785,
      total: 8500,
      shippingAddress: {
        street: "Gurruchaga 1890 PB A",
        localidad: "CABA",
        provincia: "CABA",
        codigoPostal: "1414",
      },
      metadata: { whatsappConversationId: "conv_001" },
      confirmedAt: new Date("2026-06-01T10:30:00Z"),
      completedAt: new Date("2026-06-03T16:00:00Z"),
      createdAt: new Date("2026-06-01T09:15:00Z"),
    },
  });

  if (varianteRemeraM) {
    await prisma.orderItem.upsert({
      where: { id: "oi_1001_001" },
      update: {},
      create: {
        id: "oi_1001_001",
        orderId: order1.id,
        variantId: varianteRemeraM.id,
        quantity: 1,
        unitPrice: 8500,
        discount: 0,
        taxRate: 21,
        subtotal: 8500,
        tax: 1785,
        total: 8500,
        snapshot: {
          name: "Remera Básica Algodón",
          variantName: "Blanco / Talle M",
          sku: "REM-BLA-M",
          imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        },
      },
    });
  }

  await prisma.payment.upsert({
    where: { id: "pay_1001_001" },
    update: {},
    create: {
      id: "pay_1001_001",
      orderId: order1.id,
      organizationId: org.id,
      method: PaymentMethod.MERCADOPAGO,
      amount: 8500,
      currency: "ARS",
      installments: 1,
      reference: "MP-123456789",
      gateway: "mercadopago",
      paidAt: new Date("2026-06-01T09:20:00Z"),
    },
  });

  // eventos del pedido
  for (const event of [
    { type: "order.created", payload: { channel: "whatsapp" }, createdAt: new Date("2026-06-01T09:15:00Z") },
    { type: "order.confirmed", payload: { previousStatus: "PENDING" }, createdAt: new Date("2026-06-01T10:30:00Z") },
    { type: "payment.received", payload: { amount: 8500, method: "MERCADOPAGO" }, createdAt: new Date("2026-06-01T09:20:00Z") },
    { type: "order.delivered", payload: { previousStatus: "SHIPPED" }, createdAt: new Date("2026-06-03T16:00:00Z") },
  ]) {
    await prisma.orderEvent.create({
      data: {
        orderId: order1.id,
        ...event,
        createdByName: "Sistema",
      },
    });
  }

  // pedido pendiente por WhatsApp
  const order2 = await prisma.order.upsert({
    where: { organizationId_number: { organizationId: org.id, number: 1002 } },
    update: {},
    create: {
      organizationId: org.id,
      customerId: cliente2.id,
      number: 1002,
      channel: OrderChannel.WHATSAPP,
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.UNPAID,
      subtotal: 8500,
      discount: 0,
      taxRate: 21,
      tax: 1785,
      total: 8500,
      notes: "Me mandás por Andreani, pago ahora por MP",
      createdAt: new Date("2026-06-18T14:22:00Z"),
    },
  });

  // pedido POS
  const varianteJoggerM = await prisma.productVariant.findFirst({
    where: { productId: pantalonJogger.id, sku: "JOG-NEG-M" },
  });

  const order3 = await prisma.order.upsert({
    where: { organizationId_number: { organizationId: org.id, number: 1003 } },
    update: {},
    create: {
      organizationId: org.id,
      customerId: cliente3.id,
      number: 1003,
      channel: OrderChannel.POS,
      status: OrderStatus.DELIVERED,
      paymentStatus: PaymentStatus.PAID,
      subtotal: 28400,
      discount: 2840,
      taxRate: 21,
      tax: 5363.4,
      total: 25560,
      internalNotes: "Cliente mayorista, 10% de descuento aplicado",
      confirmedAt: new Date("2026-06-15T11:00:00Z"),
      completedAt: new Date("2026-06-15T11:05:00Z"),
      createdAt: new Date("2026-06-15T11:00:00Z"),
    },
  });

  if (varianteJoggerM) {
    await prisma.orderItem.upsert({
      where: { id: "oi_1003_001" },
      update: {},
      create: {
        id: "oi_1003_001",
        orderId: order3.id,
        variantId: varianteJoggerM.id,
        quantity: 2,
        unitPrice: 15900,
        discount: 2840,
        taxRate: 21,
        subtotal: 31800,
        tax: 5922,
        total: 28960,
        snapshot: {
          name: "Jogger French Terry",
          variantName: "Negro / Talle M",
          sku: "JOG-NEG-M",
        },
      },
    });
  }

  await prisma.payment.upsert({
    where: { id: "pay_1003_001" },
    update: {},
    create: {
      id: "pay_1003_001",
      orderId: order3.id,
      organizationId: org.id,
      method: PaymentMethod.TRANSFER,
      amount: 25560,
      currency: "ARS",
      reference: "CBU-OP-20260615",
      paidAt: new Date("2026-06-15T11:10:00Z"),
    },
  });

  // ─── WHATSAPP ─────────────────────────────────────────────────────────────
  const conv1 = await prisma.whatsAppConversation.upsert({
    where: { id: "conv_001" },
    update: {},
    create: {
      id: "conv_001",
      organizationId: org.id,
      customerId: cliente2.id,
      phoneNumber: "+5491187654321",
      contactName: "Cami Rod",
      status: ConversationStatus.IN_PROGRESS,
      unreadCount: 2,
      orderId: order2.id,
      lastMessageAt: new Date("2026-06-18T14:25:00Z"),
    },
  });

  for (const msg of [
    {
      direction: "inbound",
      body: "Hola! Vi la remera blanca en Instagram. La tienen en talle M?",
      createdAt: new Date("2026-06-18T14:20:00Z"),
    },
    {
      direction: "outbound",
      body: "¡Hola Cami! 👋 Sí, tenemos en M. El precio es $8.500. ¿Te la enviamos por Andreani?",
      createdAt: new Date("2026-06-18T14:21:00Z"),
    },
    {
      direction: "inbound",
      body: "Sí perfecto! Me la mandás a Rosario. Pago ahora por MP.",
      createdAt: new Date("2026-06-18T14:22:00Z"),
    },
    {
      direction: "outbound",
      body: "Genial! Ya te creo el pedido #1002. El link de MercadoPago es este 👇",
      createdAt: new Date("2026-06-18T14:23:00Z"),
    },
    {
      direction: "inbound",
      body: "Listo! Ya pagué 🎉",
      createdAt: new Date("2026-06-18T14:25:00Z"),
    },
  ]) {
    await prisma.whatsAppMessage.create({
      data: {
        conversationId: conv1.id,
        ...msg,
      },
    });
  }

  // nueva conversación sin resolver
  const conv2 = await prisma.whatsAppConversation.upsert({
    where: { id: "conv_002" },
    update: {},
    create: {
      id: "conv_002",
      organizationId: org.id,
      phoneNumber: "+5491199887766",
      contactName: "María García",
      status: ConversationStatus.OPEN,
      unreadCount: 1,
      lastMessageAt: new Date("2026-06-21T09:10:00Z"),
    },
  });

  await prisma.whatsAppMessage.create({
    data: {
      conversationId: conv2.id,
      direction: "inbound",
      body: "Buen día, cuánto sale el jogger negro en talle L?",
      createdAt: new Date("2026-06-21T09:10:00Z"),
    },
  });

  // ─── AUDIT LOG ────────────────────────────────────────────────────────────
  await prisma.auditLog.create({
    data: {
      organizationId: org.id,
      userId: owner.id,
      userEmail: owner.email,
      userName: owner.name,
      action: AuditAction.CREATE,
      entity: "Order",
      entityId: order1.id,
      after: { number: 1001, channel: "WHATSAPP", total: 8500 },
      ipAddress: "192.168.1.100",
    },
  });

  // ─── DOMAIN EVENTS ────────────────────────────────────────────────────────
  await prisma.domainEvent.createMany({
    data: [
      {
        organizationId: org.id,
        type: "order.confirmed",
        aggregateType: "Order",
        aggregateId: order1.id,
        payload: { orderId: order1.id, channel: "WHATSAPP", total: 8500, customerId: cliente1.id },
        processed: true,
        processedAt: new Date("2026-06-01T10:31:00Z"),
        createdAt: new Date("2026-06-01T10:30:00Z"),
      },
      {
        organizationId: org.id,
        type: "inventory.low_stock",
        aggregateType: "Product",
        aggregateId: pantalonJogger.id,
        payload: { variantSku: "JOG-NEG-M", locationId: localPalermo.id, quantity: 3, threshold: 5 },
        processed: false,
        createdAt: new Date("2026-06-21T08:00:00Z"),
      },
    ],
  });

  // ─── AI INSIGHTS ──────────────────────────────────────────────────────────
  await prisma.aIInsight.createMany({
    data: [
      {
        organizationId: org.id,
        type: InsightType.TOP_PRODUCTS,
        status: InsightStatus.READY,
        title: "Tus 3 productos más vendidos en junio",
        description:
          "La Remera Básica Algodón lidera las ventas con 87 unidades vendidas. El canal WhatsApp genera el 62% de los pedidos de este producto.",
        data: {
          products: [
            { name: "Remera Básica Algodón", units: 87, revenue: 739500 },
            { name: "Jogger French Terry", units: 34, revenue: 540600 },
            { name: "Bolso Tote Canvas", units: 21, revenue: 262500 },
          ],
        },
        confidence: 0.94,
        periodStart: new Date("2026-06-01"),
        periodEnd: new Date("2026-06-21"),
        generatedAt: new Date("2026-06-21T07:00:00Z"),
        expiresAt: new Date("2026-06-28T07:00:00Z"),
        modelUsed: "claude-haiku-4-5-20251001",
        tokensUsed: 1240,
      },
      {
        organizationId: org.id,
        type: InsightType.LOW_STOCK_ALERT,
        status: InsightStatus.READY,
        title: "Riesgo de quiebre de stock: Jogger M y L",
        description:
          "Al ritmo de ventas actual (2.3 unidades/día), el Jogger French Terry talle M se agotará en el local en aproximadamente 1 día. Se recomienda trasladar stock del depósito.",
        data: {
          alerts: [
            { sku: "JOG-NEG-M", location: "Local Palermo", stock: 3, daysLeft: 1.3 },
            { sku: "JOG-NEG-L", location: "Local Palermo", stock: 6, daysLeft: 2.6 },
          ],
          recommendation: "Trasladar 10 unidades de M y 8 de L desde Depósito Lanús.",
        },
        confidence: 0.87,
        periodStart: new Date("2026-06-14"),
        periodEnd: new Date("2026-06-21"),
        generatedAt: new Date("2026-06-21T08:00:00Z"),
        expiresAt: new Date("2026-06-23T08:00:00Z"),
        modelUsed: "claude-haiku-4-5-20251001",
        tokensUsed: 890,
      },
      {
        organizationId: org.id,
        type: InsightType.SALES_FORECAST,
        status: InsightStatus.READY,
        title: "Proyección de ventas: semana del 22 al 28 de junio",
        description:
          "Basado en el historial de las últimas 8 semanas, se proyectan ventas por $312.000 ARS para la próxima semana. El canal WhatsApp seguirá siendo dominante (58%).",
        data: {
          projectedRevenue: 312000,
          projectedOrders: 38,
          byChannel: { WHATSAPP: 0.58, POS: 0.28, WEB: 0.14 },
          weeklyTrend: "+12% vs. semana anterior",
        },
        confidence: 0.79,
        periodStart: new Date("2026-06-22"),
        periodEnd: new Date("2026-06-28"),
        generatedAt: new Date("2026-06-21T07:00:00Z"),
        expiresAt: new Date("2026-06-29T07:00:00Z"),
        modelUsed: "claude-sonnet-4-6",
        tokensUsed: 2100,
      },
    ],
  });

  console.log("✅ Seed completado exitosamente.");
  console.log(`   Org: ${org.name} (slug: ${org.slug})`);
  console.log(`   Productos: 3 | Ubicaciones: 2 | Clientes: 3 | Pedidos: 3`);
  console.log(`   Conversaciones WhatsApp: 2 | AI Insights: 3`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
