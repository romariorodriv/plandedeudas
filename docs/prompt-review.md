# Revisión del prompt maestro

## Evaluación
El prompt define bien la visión, el usuario, el objetivo de 30 días y los límites. El principal riesgo era intentar tratar todas las capacidades con profundidad de producto final durante un MVP cuyo objetivo real es aprender.

## Decisiones aplicadas
1. **Contenido en Markdown, no CMS.** El repositorio es la fuente de verdad editorial durante el MVP.
2. **PostgreSQL solo para señales de aprendizaje.** Feedback, waitlist y ratings sí viven en base de datos; los artículos no se duplican en una tabla.
3. **Admin de lectura.** Permite ver señales y artículos, pero no editar contenido.
4. **Una sola herramienta simple.** Calculadora de capacidad mensual; no se construye el motor de deudas.
5. **Sin login de usuarios.** El único acceso restringido es el admin interno mediante secreto de entorno y cookie HttpOnly.
6. **SEO técnico desde el inicio.** Metadata, canonical, sitemap, robots, Article y Breadcrumb JSON-LD.
7. **GA4 opcional.** El sitio funciona aunque analytics no esté configurado.
8. **No se solicitan datos financieros sensibles.** Feedback y waitlist advierten explícitamente qué no enviar.

## Lo que se eliminó o pospuso para lanzar más rápido
- CMS completo.
- Tabla Article en PostgreSQL.
- Newsletter independiente.
- Dashboard de analytics propio.
- Más calculadoras.
- FAQ structured data sin FAQs editoriales reales.
- Autenticación de usuarios.
- Motor de plan de deudas.
- IA, OCR, reportes crediticios, integraciones, pagos y marketplace.

## Riesgos que permanecen
- El rate limit es en memoria y no es suficiente para múltiples instancias de producción.
- Las páginas legales son borradores y requieren revisión legal antes de lanzamiento comercial.
- Las métricas SEO reales dependen de dominio, Search Console, calidad editorial y publicación sostenida.
- La base PostgreSQL debe configurarse para que feedback, waitlist y admin funcionen.
