# Arquitectura del MVP 1

## Decisiones principales
- Next.js App Router + TypeScript para páginas estáticas/SSR y endpoints de formularios.
- Tailwind CSS para UI ligera y mobile-first.
- Markdown en repositorio para contenido editorial: evita CMS en fase de validación.
- PostgreSQL + Prisma únicamente para señales de aprendizaje: feedback, waitlist y valoraciones.
- GA4 opcional por variable de entorno; no bloquea ejecución local.
- Admin interno mínimo con clave compartida en variable de entorno y cookie HttpOnly firmada.

## Separación
- `src/app`: rutas, páginas y API.
- `src/components`: UI, formularios, analytics y layout.
- `src/lib`: dominio técnico (contenido, validación, seguridad, rate limit, analytics).
- `src/config`: marca y navegación.
- `content/articles`: contenido editorial.
- `prisma`: datos del MVP.

## No implementado deliberadamente
- Login de usuarios.
- CMS.
- Motor de deudas.
- OCR/reportes.
- IA.
- Integraciones financieras.
- Pagos.
- App móvil.
