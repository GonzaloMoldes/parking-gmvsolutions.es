# Auditoría Del Site Y Seguimiento

Fecha: 2026-04-09

Ámbito revisado:
- Velocidad y Web Vitals
- Coherencia técnica y SEO
- Seguridad
- Lógica de render, generación e i18n

## Resumen Ejecutivo

El site tiene una base ligera y una build estática razonable, pero ahora mismo arrastra varias incoherencias de arquitectura que afectan a velocidad, rastreo, cumplimiento y mantenibilidad.

Los puntos más importantes a resolver son:
- Alinear todo el proyecto al host canónico `https://www.gmvsolutions.es`, ya que la infraestructura publica siempre `www`.
- `robots.txt` bloqueando CSS, JS y `/_astro/`, algo que puede perjudicar el render de buscadores.
- Carga de consentimiento y analytics en la ruta crítica sin gating claro por consentimiento.
- Rutas inexistentes publicadas en `sitemap.xml` y al menos un enlace interno que apunta a una URL que no existe.

## Estado Actual

- [x] Se ha sacado el `entry splash` de las páginas internas y se ha dejado solo en la home.
- [x] Se ha añadido `preconnect` a `fonts.gstatic.com` y `dns-prefetch` para algunos terceros.
- [x] El site genera ya un único `sitemap.xml` desde el pipeline de build.
- [x] El proyecto trata ya `https://www.gmvsolutions.es` como host primario; la redirección `apex -> www` sigue existiendo a nivel de infraestructura.
- [ ] `robots.txt` sigue bloqueando recursos que Google debería poder renderizar.
- [ ] Cookiebot, GTM y `gtag.js` siguen cargándose de forma global en `head`.

## Backlog Priorizado

### P0

- [ ] P0.01 Unificar el host canónico del proyecto
  Impacto: elimina una redirección inicial, mejora coherencia SEO y evita señales contradictorias entre `canonical`, `hreflang`, sitemap y host real.
  Evidencia: la infraestructura resuelve el site sobre `https://www.gmvsolutions.es` y el host apex redirige a `www`.
  Archivos afectados:
  `src/lib/i18n.js`
  `astro.config.mjs`
  `scripts/localize-dist.mjs`
  `src/layouts/BaseLayout.astro`
  `public/robots.txt`
  `public/llms.txt`
  Acción recomendada: mantener `www` como host oficial y normalizar cualquier URL absoluta interna a esa versión.
  Criterio de cierre: todos los `canonical`, `og:url`, `hreflang`, sitemaps y archivos públicos apuntan a `https://www.gmvsolutions.es`.

- [x] P0.02 Consolidar la estrategia de sitemap
  Resultado aplicado:
  `astro.config.mjs` ya no genera sitemap
  se ha eliminado `src/pages/sitemap.xml.ts`
  se ha eliminado `public/sitemap-video.xml`
  `scripts/localize-dist.mjs` escribe ahora un único `dist/sitemap.xml` y elimina salidas antiguas
  `public/robots.txt` anuncia solo `https://gmvsolutions.es/sitemap.xml`

- [ ] P0.03 Corregir rutas inexistentes publicadas y enlaces internos rotos
  Impacto: evita 404 en sitemap y en navegación interna, mejora crawl budget y coherencia del enlazado.
  Evidencia confirmada:
  `src/pages/sitemap.xml.ts` publica estas rutas que no existen en `dist`:
  `/recursos/coste-absentismo-pymes-industriales/`
  `/recursos/crisis-perdida-conocimiento-planta-industrial/`
  `/recursos/documentar-conocimiento-operarios-expertos/`
  `/recursos/que-es-un-sop-industrial/`
  `src/pages/vs-alternativas.astro` enlaza a `/recursos/que-es-un-sop-industrial/`, que no existe.
  Acción recomendada: cambiar esas rutas a sus URLs reales o crear las páginas faltantes.
  Criterio de cierre: cero URLs inexistentes en sitemap y cero enlaces internos rotos detectados en build.

- [ ] P0.04 Corregir `robots.txt`
  Impacto: permite que buscadores rendericen correctamente el sitio; ahora mismo se están bloqueando recursos necesarios para interpretar la página.
  Evidencia:
  `public/robots.txt` contiene:
  `Disallow: /*.css$`
  `Disallow: /*.js$`
  `Disallow: /_astro/`
  Acción recomendada: dejar de bloquear CSS, JS y assets de `/_astro/`.
  Criterio de cierre: Googlebot y otros buscadores pueden acceder a los recursos necesarios para renderizar.

- [ ] P0.05 Rehacer la carga de consentimiento y analytics
  Impacto: mejora velocidad, reduce bloqueo de render y ayuda a cumplir mejor la lógica de consentimiento.
  Evidencia:
  `src/layouts/BaseLayout.astro` carga:
  `Cookiebot` síncrono
  GTM global
  `gtag.js` global
  No hay gating explícito visible con `data-cookieconsent` en el código revisado.
  Acción recomendada: definir una sola estrategia:
  Cookiebot como puerta de entrada
  carga diferida de analytics
  eventos disparados solo tras consentimiento aceptado
  Criterio de cierre: el banner no bloquea innecesariamente el render y analytics no se carga antes del consentimiento cuando aplique.

### P1

- [ ] P1.01 Endurecer la CSP
  Impacto: reduce superficie de XSS y mejora seguridad general.
  Evidencia: `vercel.json` usa `'unsafe-inline'` en `script-src` y `style-src`.
  Acción recomendada: migrar gradualmente a `nonce` o `hash` para scripts/estilos inline y reducir la allowlist externa al mínimo real.
  Criterio de cierre: se elimina `'unsafe-inline'` al menos de `script-src`, o queda acotado y justificado.

- [ ] P1.02 Revisar si la home debe seguir teniendo splash
  Impacto: aunque ya no afecta a las páginas internas, la home sigue retrasando el primer render intencionadamente en primera visita.
  Evidencia: `src/layouts/BaseLayout.astro` mantiene `enableEntrySplash = Astro.url.pathname === '/'`.
  Acción recomendada: medir PSI/Lighthouse de la home y decidir entre retirarlo, simplificarlo o lanzarlo solo después del primer paint.
  Criterio de cierre: la home no introduce retraso artificial relevante en LCP/FCP.

- [ ] P1.03 Autoalojar y racionalizar fuentes
  Impacto: reduce dependencias externas, acelera el primer render y mejora estabilidad visual.
  Evidencia: `src/layouts/BaseLayout.astro` carga Google Fonts en `head` con varias familias y pesos.
  Acción recomendada: autoalojar `Oswald`, `DM Sans` y `DM Mono`, o al menos recortar pesos/familias.
  Criterio de cierre: no hay CSS de Google Fonts en ruta crítica, o queda reducido al mínimo imprescindible.

- [ ] P1.04 Optimizar el fondo global
  Impacto: se descarga en todas las páginas y puede penalizar velocidad, especialmente en móvil.
  Evidencia:
  `src/styles/global.css` usa `background:url('/factory-bg.jpg')` en `.hero-bg`
  `dist/factory-bg.jpg` pesa ~367 KB
  Acción recomendada: convertir a AVIF/WebP, servir variantes por tamaño o replantear si debe estar en todas las páginas.
  Criterio de cierre: el fondo global pesa sustancialmente menos y no afecta de forma visible al LCP.

- [ ] P1.05 Corregir la estructura HTML del GTM `noscript`
  Impacto: mejora validez HTML y evita comportamientos inesperados del parser.
  Evidencia: en `src/layouts/BaseLayout.astro` el bloque `noscript` de GTM está colocado después de `</body>`.
  Acción recomendada: mover el `noscript` dentro de `body`, idealmente justo después de abrirlo.
  Criterio de cierre: el documento generado tiene estructura HTML válida.

- [ ] P1.06 Validar riesgo de doble medición en analytics
  Impacto: evita pageviews y conversiones duplicadas.
  Evidencia: `src/layouts/BaseLayout.astro` carga GTM y además `gtag.js` de GA4/Ads directamente.
  Acción recomendada: comprobar si GTM ya dispara GA4/Ads; si es así, dejar una sola vía.
  Criterio de cierre: una navegación produce una sola pageview por herramienta y una sola conversión por evento.

### P2

- [ ] P2.01 Estabilizar el pipeline de localización
  Impacto: reduce fragilidad de build y mejora control editorial.
  Evidencia: `scripts/localize-dist.mjs` usa `https://translate.googleapis.com/translate_a/single` durante build.
  Riesgos:
  dependencia de red en build
  cambios de traducción no controlados
  posibles incoherencias terminológicas
  Acción recomendada: introducir glosario, revisión humana y un modo offline o de build determinista.
  Criterio de cierre: el build no depende de respuestas volátiles para generar contenido crítico sin revisión.

- [ ] P2.02 Centralizar URLs y señales SEO globales
  Impacto: reduce errores de copia y hardcodes inconsistentes.
  Evidencia: hay muchas URLs absolutas repetidas manualmente por páginas en `src/pages/**/*.astro`.
  Acción recomendada: extraer `SITE_URL`, `APP_URL`, `DIAGNOSTICO_URL` y helpers de `canonical`/`og:url` a utilidades comunes.
  Criterio de cierre: cambiar de dominio o subdominio no obliga a editar decenas de páginas.

- [ ] P2.03 Añadir comprobaciones automáticas de calidad en build
  Impacto: evita que vuelvan a entrar incoherencias ya detectadas.
  Acción recomendada:
  check de enlaces internos
  check de rutas del sitemap
  check de host canónico
  Lighthouse CI básico para home y una página de contenido
  Criterio de cierre: el CI falla si se publica una URL rota, un sitemap inconsistente o una regresión grave de rendimiento.

- [ ] P2.04 Limpiar código muerto y aclarar la responsabilidad de cada capa
  Impacto: mejora mantenibilidad.
  Evidencia:
  la responsabilidad de i18n está repartida entre `src/lib/i18n.js`, `src/middleware.js` y `scripts/localize-dist.mjs`
  Acción recomendada: documentar el flujo y eliminar piezas redundantes.
  Criterio de cierre: cada responsabilidad tiene una sola implementación clara.

## Validaciones Recomendadas

- [ ] Ejecutar Lighthouse/PageSpeed en:
  `/`
  `/blog/onboarding-software-pymes/`
  `/onboarding-software-pymes/`
- [ ] Comprobar que todas las URLs de `sitemap.xml` existen realmente.
- [ ] Comprobar que `canonical`, `og:url` y `hreflang` usan el mismo host que producción.
- [ ] Revisar en DevTools:
  número de requests a analytics antes de consentimiento
  duplicidad de pageviews
  peso real del fondo global y de las fuentes

## Métricas De Seguimiento

Completar antes y después de cada tanda de cambios:

| Métrica | Baseline | Objetivo | Última revisión |
| --- | --- | --- | --- |
| Redirecciones iniciales | 1 | 0 | 2026-04-09 |
| PSI Mobile Home | pendiente | > 80 | pendiente |
| PSI Mobile Blog | pendiente | > 85 | pendiente |
| LCP Mobile Home | pendiente | < 2.5 s | pendiente |
| LCP Mobile Blog | pendiente | < 2.5 s | pendiente |
| CLS | pendiente | < 0.1 | pendiente |
| URLs inválidas en sitemap | 4 confirmadas | 0 | 2026-04-09 |
| Enlaces internos rotos conocidos | 1 confirmado | 0 | 2026-04-09 |
| `robots.txt` bloqueando CSS/JS | sí | no | 2026-04-09 |
| CSP con `unsafe-inline` | sí | reducir/eliminar | 2026-04-09 |

## Orden Recomendado De Ejecución

1. Decidir host oficial y unificar dominio.
2. Consolidar sitemap y corregir rutas rotas.
3. Arreglar `robots.txt`.
4. Rehacer consentimiento y analytics.
5. Endurecer CSP.
6. Optimizar fuentes y fondo global.
7. Revisar splash de la home.
8. Añadir checks automáticos en build/CI.

## Notas

- Esta auditoría mezcla hallazgos confirmados con un pequeño número de revisiones recomendadas. Los items confirmados están marcados como tales en la propia evidencia.
- El cambio de 2026-04-09 que saca el splash de las páginas internas ya está aplicado y debería reflejarse en la siguiente pasada de Lighthouse/PageSpeed.
