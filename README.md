# Zuki Commerce OS

Base de un sistema de gestión comercial por organización, con dashboards y consultas a PostgreSQL. Es un producto en desarrollo.

Respaldo público del código local seleccionado el **16 de noviembre de 2026**. Las cuatro variantes Zuki se revisaron por archivos y esquema; tienen diferencias funcionales y se conservan en repositorios independientes. Este respaldo identifica el estado vigente encontrado; no presenta los prototipos como productos terminados.

## Qué contiene

- Dashboard por slug de organización con ventas, pedidos, clientes, stock bajo e insights almacenados.
- Catálogo, filtros, inventario, movimientos, pedidos y fichas de clientes.
- Vistas de reportes y bandeja de conversaciones/mensajes de WhatsApp consultadas desde la base.
- Interfaz POS con selección de productos y estado de carrito del lado del cliente.
- Modelo Prisma con 25 modelos, conexión mediante `@prisma/adapter-pg`, 1 migración inicial y seed de demostración.

**Tecnologías:** Next.js 16.2.9 · React 19.2.4 · Prisma 7.8 · PostgreSQL/adapter-pg · Recharts · Tailwind CSS 4. Las versiones exactas de las dependencias están fijadas en `package-lock.json`. El indicador `private: true` de package.json evita publicar el paquete en npm; no define la visibilidad de GitHub.

## Instalación local

Entorno verificado: Node.js 24.13.1 y npm 11.8.0 en Windows, con el lockfile incluido. Crear una configuración local desde `.env.example`, completar únicamente valores propios y preparar una base de desarrollo cuando corresponda.

```bash
npm ci
npm run db:generate
npm run lint
npx tsc --noEmit
npm run build
npm run dev
```

Los pasos de base que aparecen abajo deben realizarse antes de usar las pantallas que consultan datos. `npm run start` sirve el build ya generado. Los comandos anteriores no publican un despliegue.

## Configuración

| Variables | Uso |
| --- | --- |
| `DATABASE_URL` | Conexión de la aplicación a PostgreSQL |
| `DIRECT_URL` | Conexión usada por `prisma.config.ts` para las herramientas de esquema |

Las variables de servidor no deben usar el prefijo `NEXT_PUBLIC_`. Los secretos y credenciales reales no forman parte del repositorio.

## Datos y esquema

En una base de desarrollo nueva, configurar ambas conexiones y aplicar `npx prisma migrate deploy`. El seed de demostración y la migración están incluidos, pero no fueron ejecutados en esta verificación. Revisar el seed antes de usarlo. `db:reset` borra datos y no forma parte del proceso de respaldo.

## Validación y límites

Pasaron generación/validación Prisma, lint, tipos y build con conexiones sintéticas; no se ejecutaron consultas contra una base real. No hay suite de tests configurada. El filtro por organizationId no equivale a una autorización completa: falta verificar sesión y membresía en las rutas. El POS no tiene un flujo persistente de venta/cobro verificado; la bandeja WhatsApp no integra un proveedor real de mensajes; los insights son registros almacenados, sin llamadas implementadas a un modelo de IA. Facturación, permisos y acciones transaccionales siguen pendientes.

Más detalles en [VALIDACION-GITHUB.md](VALIDACION-GITHUB.md). Una compilación correcta no certifica una tienda operativa en producción.

## Procedencia y alcance del respaldo

Se conserva el commit inicial y se añade el código modificado/no rastreado más reciente. El README anterior decía que Prisma aún no estaba instalado; se reemplazó por esta descripción del código actual.

Incluye fuentes, configuración versionable, lockfile, esquema y migraciones existentes, tests existentes y recursos locales seleccionados. No incluye `.env` privados, credenciales, bases de datos, pedidos/clientes reales, archivos de sesión, imágenes alojadas únicamente en servicios externos, capturas privadas, `node_modules`, `.next` ni otros derivados. Los datos de operación y medios externos necesitan un respaldo privado aparte. No se movió ni borró la fuente original.

## Variantes relacionadas

| Repositorio | Identidad |
| --- | --- |
| [zuki-zone-ecommerce](https://github.com/brusmakaka-lab/zuki-zone-ecommerce) | Tienda con Auth.js, contenido administrable y checkout WhatsApp |
| [zuki-shop](https://github.com/brusmakaka-lab/zuki-shop) | Tienda con variantes, JWT y código de pagos |
| [zuki-ropa-v46](https://github.com/brusmakaka-lab/zuki-ropa-v46) | Variante visual V4.6; integración Prisma 7 pendiente |
| [zuki-commerce-os](https://github.com/brusmakaka-lab/zuki-commerce-os) | Gestión comercial por organización en desarrollo |

