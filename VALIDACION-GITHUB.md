# Verificación del respaldo · 2026-11-16

## Código preservado

HEAD de origen: `1a8cf81eb7a884e0d9bb486da79370a67e5463cd`; 1 commits previos.

Se copiaron los archivos actuales, incluidos cambios sin commit y archivos nuevos del proyecto. Se excluyeron dependencias, compilaciones y archivos privados; el código funcional no fue modificado para conseguir la compilación. README, reglas de exclusión y documentación de respaldo se prepararon en una copia de trabajo independiente.

Se conserva el commit inicial y se añade el código modificado/no rastreado más reciente. El README anterior decía que Prisma aún no estaba instalado; se reemplazó por esta descripción del código actual.

## Controles ejecutados antes de publicar

Pasaron generación/validación Prisma, lint, tipos y build con conexiones sintéticas; no se ejecutaron consultas contra una base real. No hay suite de tests configurada. El filtro por organizationId no equivale a una autorización completa: falta verificar sesión y membresía en las rutas. El POS no tiene un flujo persistente de venta/cobro verificado; la bandeja WhatsApp no integra un proveedor real de mensajes; los insights son registros almacenados, sin llamadas implementadas a un modelo de IA. Facturación, permisos y acciones transaccionales siguen pendientes.

La instalación usó `npm ci --ignore-scripts` con el lockfile y luego generación explícita del cliente Prisma. Los valores de prueba se limitaron al proceso; no se copiaron secretos productivos.

## Publicación y recuperación

El procedimiento de publicación exige revisar con Gitleaks los archivos seleccionados y todos los commits, comprobar el número de commits revisados, publicar en un repositorio público nuevo sin forzar historial y comparar el árbol remoto completo (rutas, modos y hashes Git).

Después se clona desde GitHub en una carpeta nueva, se instala desde el lockfile, se repiten los controles y se cotejan los hashes. El resultado final, commits y evidencia de recuperación se registran en el inventario local del propietario; este documento describe los controles previos y el procedimiento exigido, no anticipa sus resultados.

## Qué no certifica

No es una auditoría exhaustiva de seguridad ni una prueba de compras reales, cobros, entrega de mensajes o disponibilidad del proveedor. No se importaron bases personales. Los archivos privados y medios externos no quedan respaldados por esta publicación. No se eliminó ni movió ningún proyecto original.
