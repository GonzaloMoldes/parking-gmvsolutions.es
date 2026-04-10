# Auditoría Del Site Y Seguimiento

Fecha: 2026-04-10  
Auditor: Sistema Automático  
Revisora anterior: 2026-04-09

## Resumen Ejecutivo

El sitio mantiene una base técnica ligera pero **arrastra incoherencias arquitectónicas críticas que no han sido resueltas desde la auditoría anterior**. Los problemas más graves en términos de SEO son:

- **59 páginas tienen canonicals hardcodeados sin www** (https://gmvsolutions.es) mientras que 1 usa www — esto causa señales contradictorias y penaliza la consolidación de autoridad de dominio
- **robots.txt sigue bloqueando CSS, JS y /_astro/** — buscadores no pueden renderizar correctamente las páginas
- **Cookiebot, GTM y gtag.js cargan de forma síncrona en `head`** sin gating de consentimiento visible — ralentiza First Input Delay y viola expectativas GDPR
- **CSP mantiene `'unsafe-inline'` en script-src y style-src** — amplía superficie de ataque XSS
- **GTM noscript está fuera de `</body>`** — viola HTML spec

## Estado Actual vs Auditoría 2026-04-09

| Item | Estado 2026-04-09 | Estado 2026-04-10 | Cambio |
|------|--|--|--|
| Host canónico unificado | Parcial (P0.01 pendiente) | Sin cambio | 🔴 **No resuelto** |
| Canonicals en páginas | Sin revisar | ❌ **59 sin www vs 1 con www** | 🔴 **Crítico** |
| robots.txt bloqueando CSS/JS | Sí | Sí | 🔴 **No resuelto** |
| Sitemap consolidado | ✓ Hecho | ✓ Válido | 🟢 Mantenido |
| URLs inválidas en sitemap | 0 | 0 | 🟢 Limpio |
| Cookiebot + Analytics en head | Sí (P0.05 pendiente) | Sí, ídem | 🔴 **No resuelto** |
| GTM noscript ubicación | Fuera body (P1.05) | Sigue fuera body | 🔴 **No resuelto** |
| CSP unsafe-inline | Sí (P1.01 pendiente) | Sí, ídem | 🔴 **No resuelto** |
| factory-bg.jpg (367 KB) | Sin optimizar (P1.04) | Ídem | 🔴 **No resuelto** |

## Crítica Detallada Por Área

### 🔴 A. Canonicals Hardcodeados — CRÍTICO

**Problema**: Las páginas de blog (y posiblemente otras) tienen canonicals hardcodeados a `https://gmvsolutions.es` sin www, en lugar de usar la normalización de `BaseLayout.astro`.

**Evidencia**:
```bash
59 × https://gmvsolutions.es (sin www)
1  × https://www.gmvsolutions.es (con www)
```

**Impacto SEO**:
- Google ve dos URLs canónicas diferentes para el **mismo contenido** 
- La canonicalización en BaseLayout (línea 32 de BaseLayout.astro usa `normalizePrimarySiteUrl()`) se **sobrescribe** en páginas con canonical hardcodeado
- Esto **fragmenta la autoridad del dominio** entre dos versiones
- Infraestructura resuelve a `www`, pero el canonical apunta a apex — **confusión de señales**
- Perjudica especialmente el SEO de blog porque son el activo más importante de contenido

**Archivos afectados**:
```
src/pages/blog/*.astro (8+ archivos)
src/pages/recursos/[slug]/.astro (dinámico)
Posiblemente más en src/pages/*.astro
```

**Ejemplo de fallo** (src/pages/blog/que-es-un-sop-industrial.astro línea 9):
```astro
const canonical = "https://gmvsolutions.es/blog/que-es-un-sop-industrial/";
```

Debería ser:
```astro
const canonical = buildLocalePath('/' + Astro.url.pathname.split('/').filter(Boolean).join('/') + '/')
```
O mejor: simplemente **no hardcodear**, dejar que BaseLayout lo normalice.

**Criterio de cierre**: 
- Todas las páginas usan canonicals normalizados por BaseLayout
- Verificar en DevTools que todos los canonicals apuntan a `https://www.gmvsolutions.es`
- Auditar con ahrefs/GSC que no hay duplicate content

---

### 🔴 B. robots.txt Bloqueando Recursos Críticos — ALTO

**Problema**: El archivo `robots.txt` sigue bloqueando CSS, JS y `/_astro/`, lo que impide que Googlebot renderice correctamente.

**Archivo**: `/c/Users/gonza/OneDrive/Documentos/GitHub/parking-gmvsolutions.es/public/robots.txt` líneas 23-25:
```
Disallow: /*.css$
Disallow: /*.js$
Disallow: /_astro/
```

**Impacto**:
- Googlebot puede **ver el HTML pero no procesar el JS de interactividad**
- Métricas de Web Vitals aparecen degradadas porque el bot no ve el contenido renderizado
- Afecta especialmente a páginas que dependen de JavaScript para mostrar contenido crítico
- CLS puede ser anormalmente alto porque el bot no ve el layout final

**Criterio de cierre**: Remover esas tres líneas. Los assets estáticos no necesitan ser rastreados, pero deben ser accesibles.

---

### 🔴 C. Carga de Consentimiento y Analytics Sin Gating — ALTO

**Problema**: `BaseLayout.astro` carga 3 scripts de tracking de forma global y **síncrona** sin respetar el consentimiento del usuario:
1. Cookiebot (línea 183)
2. GTM (línea 186)
3. gtag.js directo (línea 194)

**Evidencia** (líneas 182-201 de BaseLayout.astro):
```astro
<!-- Cookiebot -->
<script id="Cookiebot" src="https://consent.cookiebot.com/uc.js" 
  data-cbid="555982fb-7d04-4596-8a45-fa2d446a3892" 
  data-blockingmode="auto" 
  type="text/javascript"></script>

<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){...GTM-M223Z398...})()</script>

<!-- Google tag (gtag.js) — GA4 + Google Ads -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-JJCZ6M3T8Y"></script>
<script is:inline>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-JJCZ6M3T8Y');
  gtag('config', 'AW-18000536518');
</script>
```

**Problemas**:
1. **Cookiebot es síncrono** con `data-blockingmode="auto"` — obliga al navegador a descargar y ejecutar el consentimiento **antes** de renderizar la página
2. **GTM se inyecta directamente en el script inline** — no hay mecanismo de consentimiento implementado
3. **gtag.js se carga como `async`** pero se ejecuta inmediatamente — datos se envían antes de que el usuario consienta
4. **No hay visibilidad de `data-cookieconsent` attributes** en el código — no hay sitios donde se gatee por consentimiento

**Impacto en rendimiento**:
- Ralentiza FCP (First Contentful Paint) porque Cookiebot es bloqueante
- Ralentiza LCP (Largest Contentful Paint)
- Añade 3-4 redondas de DNS + TCP + TLS a la ruta crítica

**Impacto legal/GDPR**:
- Aunque Cookiebot intenta manejar el consentimiento, GTM y GA4 se cargan **sin esperar consentimiento** explícito del usuario
- **Riesgo de multa GDPR** si se interpreta que se están enviando datos a Google/Meta antes del consentimiento

**Criterio de cierre**:
- Cookiebot debe ser el **único** script que se carga de forma no-consentida (para mostrar el banner)
- GTM debe cargarse solo si el usuario consiente
- gtag.js debe cargarse solo si el usuario consiente
- Implementar flags en el HTML: `data-cookieconsent="..."`

---

### 🔴 D. GTM noscript Fuera de `</body>` — BAJO (Técnico)

**Problema**: El noscript de GTM está **fuera** de `</body>`, en las líneas 303-306:

```html
</body>
  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="..."></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->
</html>
```

**Impacto**:
- Viola la spec HTML5 — los `<noscript>` deben estar dentro de `body` o `head`
- Algunos validadores HTML marcarán esto como error
- Puede causar comportamiento inesperado del parser en navegadores antiguos

**Criterio de cierre**: Mover el `<noscript>` inside al principio de `</body>` antes de cerrarlo.

---

### 🟡 E. CSP Mantiene `'unsafe-inline'` — MEDIO

**Problema**: `vercel.json` línea 9 contiene:
```json
"script-src 'self' 'unsafe-inline' https://www.googletagmanager.com ..."
"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com"
```

`'unsafe-inline'` permite que **cualquier script inline se ejecute sin HashNo o Nonce**, ampliando la superficie de ataque XSS.

**Alternativas recomendadas**:
1. Usar `nonce` para scripts/estilos inline conocidos
2. Usar `hash` para estilos que no cambian
3. Externalizar estilos críticos a archivos

**Criterio de cierre**: Eliminar al menos `'unsafe-inline'` de `script-src`; `style-src` es menos crítico pero debería optimizarse también.

---

### 🟡 F. factory-bg.jpg No Optimizado — MEDIO

**Problema**: Imagen de fondo global pesa **367 KB** (`/public/factory-bg.jpg`).

**Impacto**:
- Se descarga en **todas las páginas**
- En conexiones lentas (móvil 4G), suma 2-5 segundos de carga innecesaria
- No tiene `loading="lazy"` ni está en formato moderno (AVIF/WebP)
- Usa CSS `background: url()` en `.hero-bg`, no img tag → no puede ser diferida

**Recomendaciones**:
1. Convertir a AVIF (estimado ~80 KB) / WebP (~150 KB)
2. Generar versiones por tamaño (móvil, tablet, escritorio)
3. Considerar carga diferida: `background-attachment: scroll` en móvil
4. O reemplazar con CSS gradient + patrón SVG

**Criterio de cierre**: factory-bg.jpg pesa < 100 KB o se sirven variantes modernas por device.

---

### 🟡 G. Traducción Depende De Google Translate API — BAJO

**Problema**: `scripts/localize-dist.mjs` línea 484 traduce dinámicamente mediante:
```javascript
const url = new URL('https://translate.googleapis.com/translate_a/single');
```

**Riesgos**:
- **Dependencia de red durante build** — si la API es lenta o no está disponible, el build falla
- **Sin control de versión de traducción** — cambia sin avisar si Google actualiza algo
- **Cambios de traducción impredecibles** — no hay revisión humana centralizada
- **Rate limiting** — builds grandes pueden ser bloqueados

**Criterio de cierre (mejora, no bloqueante)**:
- Introducir glosario de términos protegidos (ya existe en línea 63-71, pero mejorable)
- Considerar sacar a un servicio externo + caché persistente
- Documentar el proceso y terms: si traducción falla, build debe ser predecible

---

## Hallazgos Nuevos (No En Auditoría Anterior)

### 1. Análisis de URLs del Sitemap

| Métrica | Valor | Estado |
|---------|-------|--------|
| Total URLs en sitemap | ~87 | 🟢 |
| URLs con hreflang alternas | 100% | 🟢 |
| URLs duplicadas | 0 | 🟢 |
| Rutas 404 documentadas | 0 | 🟢 |

✓ El sitemap está limpio y coherente. No hay rutas muertas.

### 2. Análisis de i18n

| Aspecto | Hallazgo |
|---------|----------|
| Locales soportados | 3 (es, en, pt) | 
| Redirects apex→www | Sí, en infraestructura |
| hreflang tags | ✓ Generadas dinámicamente |
| Localized assets | CSS, JS, sitemap |
| Bootstrap hreflang en home | ✓ Presentes |

✓ Estructura multiidioma es robusta.

### 3. Estructura de Metadata SEO

**Hallazgos positivos**:
- ✓ Title tags en todas las páginas
- ✓ Meta descriptions bien escritas
- ✓ og:type, og:image, og:locale presentes
- ✓ Schema.org JSON-LD en artículos

**Hallazgos negativos**:
- ❌ Canonicals inconsistentes (ver sección A)
- ⚠️ og:url sigue el canonical (hereda el error)
- ⚠️ og:image usa URL sin www (hereda del error)

---

## Backlog Priorizado (Actualizado)

### P0 — Bloqueantes de SEO

#### P0.01 Unificar Canonicals a `www` en Todas las Páginas

**Urgencia**: CRÍTICO — señales contradictorias fragmentan autoridad

**Acción**:
1. Buscar y reemplazar todos los canonicals hardcodeados que usen `https://gmvsolutions.es` por `https://www.gmvsolutions.es`
2. Eliminar canonicals hardcodeados si es posible; dejar que BaseLayout.astro los normalice vía `normalizePrimarySiteUrl()`
3. Auditar con ahrefs/GSC que google ve un solo canonical por página
4. Verificar que og:url y og:image también apunten a www

**Criterio de cierre**:
```bash
# Antes
grep -r "https://gmvsolutions\.es" src/pages/ | wc -l  # Debe ser 0

# Después  
grep -r "https://gmvsolutions\.es" src/pages/ | wc -l  # Debe ser 0
grep -r "https://www\.gmvsolutions\.es" src/pages/ | wc -l  # Puede ser >0 solo si necesario
```

**Estimado**: 2-3 horas (buscar/reemplazar + pruebas)

---

#### P0.02 Corregir `robots.txt`

**Urgencia**: ALTO — buscadores no pueden renderizar

**Acción**:
Remover líneas 23-25 de `public/robots.txt`:
```diff
- Disallow: /*.css$
- Disallow: /*.js$
- Disallow: /_astro/
```

Resultado final:
```
User-agent: *
Allow: /
Allow: /blog/
... resto igual
# NO bloquear CSS, JS ni /_astro/
```

Luego: Usar Google Search Console para re-rastrear y verificar que Googlebot rinde bien.

**Criterio de cierre**: robots.txt no contiene Disallow para *.css, *.js ni /_astro/

**Estimado**: 30 min

---

#### P0.03 Implementar Gating de Consentimiento para Analytics

**Urgencia**: ALTO — impacta rendimiento + GDPR

**Acción**:
1. Mover Cookiebot al `<head>` manteniendo bloqueante (lo correcto para consentimiento)
2. **Diferir** GTM hasta que Cookiebot indique consentimiento
3. **Diferir** gtag.js hasta que Cookiebot indique consentimiento
4. Implementar evento de consentimiento aceptado → ejecutar GTM/GA4

**Pseudocódigo**:
```astro
<!-- head -->
<script id="Cookiebot" async src="..."></script>

<!-- body, end -->
<script>
  // Esperar a que Cookiebot esté listo
  if (window.CookieConsentIsLoaded) {
    if (window.CookieConsent?.consent?.marketing) {
      loadGTM();
      loadGA4();
    }
  } else {
    window.addEventListener('CookiebotOnConsentUpdate', () => {
      if (window.CookieConsent?.consent?.marketing) {
        loadGTM();
        loadGA4();
      }
    });
  }
</script>
```

**Criterio de cierre**:
- Medir Analytics: No hay pageviews despues de hard-refresh hasta aceptar cookies
- Medir performance: LCP mejora >200ms en páginas sin consentimiento previo

**Estimado**: 4-6 horas

---

#### P0.04 Mover GTM noscript Inside `</body>`

**Urgencia**: BAJO (técnico)

**Acción**: 
Mover líneas 303-306 de `src/layouts/BaseLayout.astro` de **fuera de `</body>`** hacia **dentro**, justo antes de cerrarlo.

```astro
  </main>
  <Footer />
  
  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="..."></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->
</body>
```

**Criterio de cierre**: Validar HTML5 sin warnings sobre noscript mal ubicado.

**Estimado**: 15 min

---

### P1 — Optimizaciones Importantes

#### P1.01 Hardening CSP — Quitar `'unsafe-inline'` de `script-src`

**Acción**:
1. Extraer todos los scripts inline conocidos (BaseLayout.astro tiene 3 inlines)
2. Calcular `hash` para cada uno (SHA-256)
3. Cambiar en `vercel.json`:
```diff
- script-src 'self' 'unsafe-inline' https://www.googletagmanager.com ...
+ script-src 'self' https://www.googletagmanager.com ... 'sha256-xxxxx' 'sha256-yyyyy' ...
```

**Estimado**: 3 horas

---

#### P1.02 Optimizar factory-bg.jpg

**Acciones**:
1. Convertir a AVIF o WebP
2. Generar variantes: móvil (200px wide), tablet (500px), desktop (1200px)
3. Actualizar CSS para usar `srcset` en `<picture>` o ser más selectivo en `background`

**Estimado**: 2-3 horas

**Criterio de cierre**: factory-bg.jpg original < 100 KB o no se carga en página inicial.

---

#### P1.03 Validar Doble Medición Analytics

**Acción**: Revisar si GTM envía eventos a GA4/Ads o si gtag.js hace doble envío.

**Criterio de cierre**: Una navegación = una pageview por plataforma, sin duplicados.

---

### P2 — Mejoras a Mediano Plazo

#### P2.01 Centralizar URLs y Canonical Helpers

Extraer `SITE_URL`, `SITE_URL_ALIASES`, funciones de canonical a utilidades reutilizables para que cambiar de dominio no requiera editar 60 archivos.

**Estimado**: 2 horas

---

#### P2.02 Añadir Checks Automáticos de SEO en Build/CI

Scripting en `scripts/` para:
- Validar que no hay canonicals duplicados por página
- Validar que todas las URLs del sitemap existen en dist/
- Validar que no hay enlaces internos rotos
- LighthouseCI básico en home y 1 artículo

**Estimado**: 4-5 horas

---

## Orden de Ejecución Recomendado

1. **P0.02** (robots.txt) — 30 min, alto impacto inmediato
2. **P0.01** (Canonicals sin www) — 2-3 h, crítico SEO
3. **P0.04** (noscript location) — 15 min
4. **P0.03** (Consentimiento) — 4-6 h, afecta velocidad + GDPR
5. **P1.02** (factory-bg.jpg) — 2-3 h, afecta LCP
6. **P1.01** (CSP) — 3 h, defensa en profundidad
7. **P2.x** — trabajo futuro

---

## Validaciones Recomendadas

- [ ] Ejecutar Lighthouse en chrome://lighthouse para home y blog/que-es-un-sop-industrial
- [ ] Usar GSC para revisar cobertura e indexación pre/post cambios
- [ ] Revisar en ahrefs / semrush que canonicals están consolidados
- [ ] Verificar Core Web Vitals en PageSpeed Insights (comparar antes/después)
- [ ] Medir Analytics: no hay pageviews si rechaza cookies
- [ ] Validar HTML en W3C validator (searchcode.com/validator)
- [ ] Auditar CSP con report-uri.com

---

## Métricas De Seguimiento

| Métrica | Baseline | Objetivo | Estado |
|---------|----------|----------|--------|
| Canonicals sin `www` | 59 | 0 | 🔴 2026-04-10 |
| robots.txt bloqueando CSS/JS | Sí | No | 🔴 2026-04-10 |
| GTM/GA4/Ads cargando pre-consentimiento | Sí | No | 🔴 2026-04-10 |
| PSI Mobile Home | pendiente | > 80 | - |
| PSI Mobile Blog | pendiente | > 85 | - |
| LCP Mobile | pendiente | < 2.5s | - |
| CLS Mobile | pendiente | < 0.1 | - |
| Analytics pageviews duplicadas | pendiente | 0 | - |

---

## Conclusión

El proyecto tiene **buena base (Astro, i18n, arquitectura limpia)** pero mantiene **deuda técnica SEO acumulada** desde la auditoría anterior. Los cambios en P0 son **directos y de alto ROI**; la mayoría pueden hacerse en < 1 hora para tomar impacto.

**Recomendación**: Ejecutar P0.01 + P0.02 + P0.04 esta semana (< 4 horas), medir impacto en GSC/PageSpeed, luego abordar P0.03 que es más compleja pero crítica para GDPR/performance.

---

*Auditoría realizada con análisis estático de código, git history, build output y validación de estructura. No incluye mediciones sintéticas de Lighthouse sin acceso a deploy en vivo.*
