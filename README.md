# MVP 1 — Educación financiera Perú

Base técnica de una futura fintech enfocada inicialmente en **contenido + SEO + confianza + feedback + lista de espera**.

## Qué incluye
- Home mobile-first.
- Biblioteca `/aprender` con búsqueda local.
- Hubs `/deudas` y `/credito`.
- 5 artículos iniciales en Markdown.
- Herramienta simple de capacidad mensual.
- Landing `/plan-de-deudas` con waitlist.
- Feedback global.
- Valoración de artículos.
- PostgreSQL + Prisma para feedback, waitlist y valoraciones.
- Admin mínimo `/admin`.
- Sitemap, robots, metadata, canonical, Open Graph y JSON-LD de artículos/breadcrumbs.
- GA4 opcional y Search Console preparada por variables de entorno.
- Tests unitarios básicos.

## Requisitos
- Node.js 22 o superior.
- npm.
- PostgreSQL local o una base PostgreSQL accesible.

## Inicio local en Windows (PowerShell)
```powershell
Copy-Item .env.example .env
npm install
```

Crea una base local llamada `fintech_mvp1` o cambia `DATABASE_URL` en `.env`.

Luego:
```powershell
npm run db:deploy
npm run dev
```

Abre:
```text
http://localhost:3000
```

## Admin
Configura `ADMIN_SECRET` y `ADMIN_COOKIE_SECRET` con valores largos y diferentes.
Después abre:
```text
http://localhost:3000/admin
```

## Comandos
```powershell
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
npm run db:studio
```

## Publicar un artículo
1. Crea un archivo `.md` en `content/articles`.
2. Añade frontmatter con `slug`, `title`, `description`, `excerpt`, `author`, fechas, `category`, `tags` y `related`.
3. El artículo se incorpora a biblioteca, sitemap y generación estática.

## Analytics
Si configuras `NEXT_PUBLIC_GA_MEASUREMENT_ID`, se carga GA4. Los eventos implementados incluyen:
- `article_view`
- `article_completed`
- `article_helpful_yes/no`
- `feedback_opened/submitted`
- `debt_plan_waitlist_view/signup`
- `tool_view`

Nunca envíes ingresos, deudas, tarjetas u otra información financiera sensible a analytics.

## Decisiones para lanzar rápido
- No hay CMS: Markdown en Git es suficiente para los primeros 30 días.
- No hay tabla `Article` en PostgreSQL: evita duplicar la fuente de verdad.
- No hay login de usuarios.
- El admin no edita contenido: solo observa señales de producto.
- El rate limit es en memoria; sirve para el MVP en una sola instancia. En arquitectura distribuida debe migrarse a un store compartido.
- Las páginas legales son borradores operativos y deben revisarse con asesoría legal peruana antes de un lanzamiento comercial.

## Próximos pasos sugeridos
1. Confirmar nombre y dominio.
2. Configurar PostgreSQL.
3. Revisión legal de privacidad/términos.
4. Configurar GA4 y Search Console.
5. Publicar los 5 artículos y comenzar distribución.
6. Revisar semanalmente feedback, waitlist, Search Console y utilidad de artículos.
7. No construir el motor de deudas hasta tener evidencia de demanda suficiente.
