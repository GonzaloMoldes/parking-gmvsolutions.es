# Plan de simplificación editorial — Web comercial

> **Propósito:** lista ejecutable de tareas para reducir la sobrecarga de texto de las páginas comerciales de `reelevo-site`, darles jerarquía y hacerlas más legibles, sin tocar el blog.
>
> **Medición:** 2026-08-31 · **Estado:** **los cinco bloques cerrados** · **22/22 tareas** · última actualización 2026-09-01
>
> **Fuente de verdad:** el HTML construido en `dist/client` (83 documentos), no el código fuente. Todas las cifras son del contenido de `<main>`, descartando `<script>`, `<style>` y `<svg>`, salvo donde se indique lo contrario. El script que las produce está en el [Anexo III](#anexo-iii--script-de-medición) para poder re-verificar después de cada fase.
>
> **Alcance:** 50 páginas comerciales. Quedan **fuera** las 29 del blog y las 3 legales.
>
> Documento vivo: cada tarea lleva estado, y los hallazgos que aparezcan al ejecutarla se recogen aquí, no solo en el código.

---

## Índice

1. [Resumen ejecutivo](#1-resumen-ejecutivo)
2. [Diagnóstico medido](#2-diagnóstico-medido)
3. [Lo que no está fallando](#3-lo-que-no-está-fallando)
4. [Regla de decisión y plantilla nueva](#4-regla-de-decisión-y-plantilla-nueva)
5. [Bloque A · Arreglos mecánicos (P0)](#bloque-a--arreglos-mecánicos-p0)
6. [Bloque B · Plantilla y piloto (P0)](#bloque-b--plantilla-y-piloto-p0)
7. [Bloque C · Páginas de plataforma (P1)](#bloque-c--páginas-de-plataforma-p1)
8. [Bloque D · Home, precios y satélites (P1)](#bloque-d--home-precios-y-satélites-p1)
9. [Bloque E · Aire y cierre (P2)](#bloque-e--aire-y-cierre-p2)
10. [Secuencia de ejecución](#10-secuencia-de-ejecución)
11. [Ficheros afectados](#11-ficheros-afectados)
12. [Criterios de aceptación](#12-criterios-de-aceptación)
13. [Anexo I · Inventario por categoría](#anexo-i--inventario-por-categoría)
14. [Anexo II · Presupuesto de palabras por bloque](#anexo-ii--presupuesto-de-palabras-por-bloque)
15. [Anexo III · Script de medición](#anexo-iii--script-de-medición)

---

## 1. Resumen ejecutivo

| Bloque | Qué resuelve | Tareas | Hechas | Prioridad |
|---|---|---:|---:|---|
| **A** | Arreglos mecánicos que no tocan copy | 4 | **4** | **P0** ✅ |
| **B** | Plantilla nueva validada en 2 pilotos | 4 | **4** | **P0** ✅ |
| **C** | Las 17 páginas de plataforma | 5 | **5** | P1 ✅ |
| **D** | Home, precios y páginas satélite | 5 | **5** | P1 ✅ |
| **E** | Aire visual y limpieza final | 4 | **4** | P2 ✅ |

**El diagnóstico en una frase:** el problema no es que sobre texto en abstracto, es que todas las páginas comerciales usan la misma plantilla de ocho bloques, y esa plantilla obliga a rellenar secciones que la página concreta no necesita.

**El síntoma medible:** ninguna sección domina. En la mediana, el bloque mayor de una página ocupa el **27 %** del texto; en las páginas de plataforma baja al **15 %**. Ocho bloques del mismo tamaño le dicen al lector que las ocho cosas importan igual — es decir, que ninguna importa.

**La consecuencia práctica:** no hay que reescribir la web. Hay que recortarla y darle jerarquía.

---

## 2. Diagnóstico medido

### 2.1 Volumen

| Métrica (contenido de `<main>`) | Valor |
|---|---:|
| Páginas comerciales analizadas | 50 |
| Palabras, media | 991 |
| Palabras, mediana | 1.026 |
| Palabras, máximo (`/`) | 1.665 |
| Secciones `<section>` por página, mediana | 8 |
| Secciones etiquetadas (`.eyebrow`), mediana | 7 |
| Secciones etiquetadas (`.eyebrow`), máximo | 10 |
| H3 por página, máximo (`/kaizen/`) | 26 |
| Tiempo de lectura medio | ~5 min |

A eso se suma un peaje fijo idéntico en las 83 páginas, **antes** del primer párrafo propio:

| Elemento | Palabras | Enlaces |
|---|---:|---:|
| Cabecera | 275 | 36 |
| Menú móvil (duplicado en el DOM) | 131 | 35 |
| Pie | 100 | 26 |
| **Total** | **506** | **97** |

No es un error — es un menú grande y una decisión legítima de SEO interno — pero explica por qué incluso una página corta «pesa» al abrirla.

### 2.2 La plantilla de ocho bloques (causa raíz)

Las etiquetas `.eyebrow` del código revelan la partitura común:

```
Hero  →  El problema  →  Cómo funciona  →  Funcionalidades
      →  Por rol / Lo que nos diferencia  →  Enfoque prudente
      →  Dudas habituales  →  CTA final
```

Verificado literalmente en `/mantenimiento/`, `/kaizen/`, `/control-produccion/`, `/obras-trazabilidad/`, `/workflows/` y `/portal-operario/`. La etiqueta **«Dudas habituales» aparece en 29 de 49 páginas**; «El problema», en 15.

Peso medio de cada bloque:

| Bloque | Páginas | Palabras/pág | Decisión |
|---|---:|---:|---|
| Dudas habituales (FAQ) | 29 | 243 | **Plegar** — 15-22 % de la página, siempre desplegado |
| Cómo funciona en REELEVO | 4 | 204 | **Núcleo** — es el bloque que debe dominar |
| Funcionalidades | 4 | 198 | **Recortar** — 6 tarjetas → 3 |
| La solución | 5 | 189 | **Núcleo** — fusionar con «Cómo funciona» |
| Por rol / perfil | 3 | 193 | **Eliminar** — ya existe `/para-quien/` |
| El problema | 15 | 179 | **Comprimir** — al hero, 40 palabras |
| Enfoque prudente / Límites | 10 | 140 | **Mover** — a FAQ o a una sola línea |

### 2.3 Ninguna sección manda

Reparto del texto de `/mantenimiento/` entre sus nueve secciones:

| Sección | Palabras | % |
|---|---:|---:|
| Hero | 62 | 5 % |
| El problema | 149 | 11 % |
| Cómo funciona en REELEVO | 186 | 14 % |
| Funcionalidades | 189 | 14 % |
| Lo que nos diferencia | 167 | 12 % |
| Por qué importa (6 perfiles) | 193 | 14 % |
| Enfoque prudente | 136 | 10 % |
| Dudas habituales | 208 | 15 % |
| CTA final | 54 | 4 % |

Nada sobresale, así que hay que leerlo todo para saber qué era importante — y nadie lo hace. Las tres páginas más planas (`/mantenimiento/`, `/obras-trazabilidad/`, `/kaizen/`) tienen alrededor de **ocho «secciones efectivas»** compitiendo en igualdad por la atención. En **15 de 50** páginas ningún bloque llega al 25 %.

### 2.4 Legibilidad

El espaciado **entre** secciones ya es generoso: `.section` usa `padding: 96px 32px`. Con ocho o nueve secciones eso son más de **1.500 px solo de relleno**, así que la sensación no es de amplitud sino de scroll interminable. Añadir aire sin quitar bloques empeora el problema.

Dentro de los bloques, cuatro decisiones restan legibilidad:

| Problema | Valor actual | Efecto |
|---|---|---|
| Cuerpo de tarjetas | `.85`–`.88rem` (13,6–14,1 px) | Por debajo del mínimo cómodo de 15-16 px |
| Peso del body | `font-weight: 300` | El trazo fino se adelgaza ópticamente sobre fondo oscuro |
| Etiquetas | `.58`–`.62rem` (9,3–9,9 px) | Legibles como adorno, no como información |
| Centrado | 15 reglas `text-align: center` | El borde izquierdo irregular obliga a buscar cada línea |

### 2.5 Defecto concreto: `<br>` pega palabras

Los titulares usan `<br>` para controlar el salto de línea. En el fuente hay un salto de línea real tras la etiqueta, pero **el build de Astro colapsa ese espacio**, dejando el texto pegado. Cualquier extractor que lea `textContent` — Google para snippets, y sobre todo los motores de respuesta con IA — lee las palabras unidas.

Ocurre en **49 páginas construidas, 141 veces** (144 ocurrencias en 50 ficheros `.astro` del fuente, incluyendo blog y componentes).

```
/api-integraciones/
  "REELEVO no es una isla.Se conecta con lo que ya tienes"

/calidad-y-conformidad/
  "Casos donde calidad sí ganaalgo práctico"

/casos-de-uso/personal-ett/
  "El temporal ETT aprendesin consumir a tus tutores."
```

Afecta directamente a la estrategia GEO del proyecto (`guia_contenidos_GEO_REELEVO.md`).

---

## 3. Lo que no está fallando

Tres hipótesis razonables que los datos descartan. Conviene saberlo para no gastar esfuerzo ahí.

**3.1 No hay copy duplicado.** Buscando bloques de seis o más palabras repetidos entre páginas, solo aparecen **seis fragmentos** compartidos por cuatro o más páginas, y todos son microcopy de CTA («60 días del plan Pro, sin tarjeta»). La página con más texto reutilizado es `/vs-gembadocs/` con un 15 %, por la tabla comparativa común. El copy está genuinamente escrito página a página: **lo que se repite es la estructura, no las palabras.**

**3.2 El contraste cumple AA.** Ratios WCAG calculados sobre las cuatro superficies del sistema:

| Token | Sobre `--surface` | Sobre `--surface3` |
|---|---:|---:|
| `--white` | 17,18:1 | 14,94:1 |
| `--gray` (.55) | 6,18:1 | 5,86:1 |
| `--gray2` (.48) | 5,01:1 | 4,78:1 |
| `--orange` | 5,42:1 | 4,71:1 |

Todo supera el 4,5:1 de AA. El comentario del CSS que documenta la subida de `--gray2` a `0.48` hizo su trabajo. **No tocar los colores**: tocar tamaños y peso.

**3.3 Los CTAs están disciplinados.** Mediana de 2 destinos distintos por página, casi siempre `/registro` más un enlace de apoyo. Única excepción: **`/por-que-usar-reelevo/`, con 14 CTAs hacia 9 destinos** (tarea `A4`).

**3.4 El blog no es el problema.** 2.385 palabras de media, máximo 4.993. Para contenido editorial con intención de lectura y objetivo SEO claro, es la longitud correcta. **No tocar el blog.**

---

## 4. Regla de decisión y plantilla nueva

### 4.1 La regla: una página, una pregunta

Cada página comercial responde a **una sola pregunta de un solo lector en un solo momento**. Todo lo que no sirva a esa pregunta se enlaza, no se explica. Antes de escribir o conservar una sección:

1. ¿Quién llega aquí y qué acaba de buscar?
2. ¿Qué tiene que entender para dar el siguiente paso?
3. ¿Cuál es ese siguiente paso, y es uno solo?

Si una sección no ayuda a 1, 2 o 3, se va — a otra página que ya existe, a la FAQ plegada, o fuera.

### 4.2 La plantilla: cinco bloques, uno dominante

De ocho bloques planos a cinco con jerarquía explícita. El porcentaje no es decorativo: es el presupuesto de palabras que debe respetar quien escriba la página.

| Bloque | Palabras | % | Trabajo que hace |
|---|---:|---:|---|
| **Hero + problema** | 70 | 13 % | H1, una frase de dolor y el CTA. «El problema» deja de ser sección propia. |
| **Cómo funciona** *(dominante)* | 240 | **44 %** | Los 4 pasos, con captura real. Es el motivo de existir de la página. |
| Qué incluye | 120 | 22 % | 3 capacidades, no 6. Las otras 3 se enlazan. |
| Prueba o límite | 70 | 13 % | Un caso concreto **o** el encaje honesto. Uno de los dos, no ambos. |
| Siguiente paso | 50 | 9 % | Un CTA y dos enlaces relacionados como máximo. |
| FAQ | — | — | Plegada en `<details>`. No cuenta para el presupuesto visible. |

Con esto el bloque mayor pasa del 15 % al 44 %. **Ese salto es la mejora**: el lector ve de un vistazo cuál es el argumento de la página.

### 4.3 Qué se elimina, y a dónde va

| Se elimina | Va a |
|---|---|
| «Por qué importa a cada perfil» (6 subtítulos) | Tres enlaces a `/para-quien/`, que ya lo cubren mejor y con URL indexable propia |
| «Enfoque prudente» (140 palabras) | Una línea en el hero, o una entrada de FAQ |
| «Funcionalidades» de 6 tarjetas | 3 tarjetas; las otras 3 rara vez son el motivo de compra |
| «Lo que nos diferencia» | Enlace a `/vs-alternativas/`, que existe para eso |

---

## Bloque A · Arreglos mecánicos (P0)

Se notan en toda la web sin reescribir una sola página. Riesgo nulo o casi nulo. **Estimación: ~4 h.**

### A1 · Corregir el `<br>` que pega palabras
**Estado:** ✅ hecho (2026-08-31) · **Ficheros:** 51 `.astro` en `src/pages`, `src/components`, `src/layouts`

Añadir un espacio antes de cada `<br>`. HTML colapsa espacios, así que **el resultado visual es idéntico** y el texto extraído queda correcto.

```diff
-  El temporal ETT aprende<br>
+  El temporal ETT aprende <br>
   sin consumir a tus tutores.
```

Comando de aplicación (revisar el diff antes de commitear):

```bash
grep -rlE "[^ >]<br" src/pages src/components src/layouts \
  | xargs sed -i 's/\([^ >]\)<br>/\1 <br>/g; s/\([^ >]\)<br \/>/\1 <br \/>/g'
```

**Verificación:** `grep -rcE "[^ >]<br" src/pages src/components src/layouts` debe dar 0, y el script del Anexo III debe reportar 0 ocurrencias en `dist/`.

---

### A2 · Plegar las FAQ en `<details>`
**Estado:** ✅ hecho (2026-08-31) · **Fichero:** `src/components/FaqSection.astro`

Hoy el componente renderiza cada respuesta en un `<p class="faq-a">` siempre visible. No hay acordeón. Son **243 palabras de media en 29 páginas** ocupando pantalla completa.

- Sustituir `.faq-item` por `<details>` / `<summary>`, con el **primero abierto** (`open`).
- `summary` conserva el `<h3 class="faq-q">` para no romper la jerarquía de encabezados.
- Añadir un indicador de apertura y `cursor: pointer`; quitar el marcador nativo con `summary::-webkit-details-marker { display: none }`.
- **No tocar** el JSON-LD: `faqPageSchema()` en `src/lib/seo.ts` se alimenta de la misma lista y debe seguir emitiendo el `FAQPage` completo.

> El texto sigue en el DOM, así que el schema y la indexación se mantienen. Lo que baja es el scroll percibido: **−20 % en 29 páginas**.

---

### A3 · Tokens tipográficos
**Estado:** ✅ hecho (2026-08-31) · **Fichero:** `src/styles/global.css`

```diff
  /* body — el peso ligero es el que resta definición sobre oscuro */
- body{ font-size:16px; font-weight:300; line-height:1.65; }
+ body{ font-size:17px; font-weight:400; line-height:1.72; }

  /* cuerpo de tarjetas — suelo de 15px */
- .caso-desc,.step-card-desc,.benefit-card-desc{ font-size:.85rem; }
+ .caso-desc,.step-card-desc,.benefit-card-desc{ font-size:.95rem; line-height:1.7; }

  /* etiquetas — de 9,6px a 11,2px */
- .eyebrow,.screenshot-caption{ font-size:.6rem; }
+ .eyebrow,.screenshot-caption{ font-size:.7rem; }

  /* medida de lectura — hoy los párrafos pueden ocupar 1100px */
+ .section-inner p:not(.section-sub){ max-width:68ch; }

  /* centrado solo en hero y CTA, nunca en párrafos de varias líneas */
- .step-card,.benefit-card,.perfil-card{ text-align:center; }
+ .step-card,.benefit-card,.perfil-card{ text-align:left; }
```

**No incluir aquí el `padding` de `.section`** — va en `E1`, después de recortar secciones. Ver [10. Secuencia](#10-secuencia-de-ejecución).

**Cuidado con la cascada:** `global.css` mezcla selectores de tipo y de elemento; comprobar que `.section-inner p` no anula el `max-width` de `.section-sub` (de ahí el `:not()`).

---

### A4 · Reducir los CTAs de `/por-que-usar-reelevo/`
**Estado:** ✅ hecho (2026-08-31) · **Fichero:** `src/pages/por-que-usar-reelevo.astro`

> **Corrección del diagnóstico.** El recuento de «14 CTAs hacia 9 destinos» contaba como CTA las **9 tarjetas de problema**, que son navegación y constituyen la función de la página: es un hub de autodiagnóstico. Eliminarlas habría vaciado la página. La redundancia real eran **tres bloques de conversión casi idénticos** (`problema-cta`, `trial-band` y `cta-section`), separados solo por la FAQ.

**Hecho:** eliminado el bloque intermedio `trial-band` y su CSS asociado (42 líneas de `<style>` local, más su media query). Sus tres bullets duplicaban las notas de los otros dos bloques («60 días del plan Pro, sin tarjeta» y «Precio publicado · Implantación ligera · Soporte en español»).

**Resultado:** de 5 CTAs de conversión en 3 bloques a **3 CTAs en 2 bloques**. Las 9 tarjetas de navegación quedan intactas.

---

## Cierre del bloque A

Ejecutado y verificado el 2026-08-31 con build completo y el script del [Anexo III](#anexo-iii--script-de-medición).

| Tarea | Resultado verificado |
|---|---|
| `A1` | 143 sustituciones en 51 ficheros. **`<br>` pegado: 141 → 0.** Confirmado que el espacio sobrevive al build de Astro: `"Controla tu planta sin complejidad de un sistema MES."` |
| `A2` | `FaqSection.astro` renderiza `<details>` con el primero abierto. Verificado en `/mantenimiento/`: 4 `<details>`, 1 abierto, **`FAQPage` JSON-LD intacto con sus 4 preguntas**, y las 4 respuestas siguen en el DOM. |
| `A3` | `body` a 17px/400/1.72. Cuerpo de tarjetas de 13,6-14,4px a **15,2px**. Etiquetas de 9,6px a **11,2px**. Medida de lectura de 68ch en los 201 párrafos sin clase. `text-align:center` retirado de `.step-card`, `.perfil-card` y `.benefit-card`. |
| `A4` | 5 CTAs de conversión → 3. Ver corrección del diagnóstico arriba. |

**Hallazgos que ajustan el diagnóstico:**

1. **Los 3 casos `><br>`** (`</em><br>`, `</strong><br>`) también pegaban texto y no estaban en el recuento inicial de la tarea. Incluidos en la corrección.
2. **`Footer.astro` usaba `<br />`** en el bloque de dirección postal, pegando «GMV SolutionsRua Marola, 15002A Coruña, España» en **las 83 páginas**, blog y legales incluidos. Corregido también.
3. **El `<br>` glue no era exclusivo de titulares:** el recuento por elemento (h1-h3 + p) daba 123, pero barriendo todo el `<main>` son 141. La cifra del plan se actualizó a 141 antes de ejecutar.
4. **`.dolor-label` ya usaba `text-align:left` dentro de una tarjeta centrada.** Era el precedente correcto en el propio sistema: centrar el número, alinear el texto a la izquierda. `A3` lo generaliza al resto de tarjetas.

**No verificado por falta de navegador:** la reducción de scroll del acordeón de FAQ. El texto sigue en el DOM (el recuento de palabras no baja), así que la mejora es de altura renderizada, no de volumen. Medir con `scroll depth` en GA4 según [§12](#12-criterios-de-aceptación).

---

## Bloque B · Plantilla y piloto (P0)

**Estimación: ~2 días.** No continuar al bloque C hasta cerrar `B4`.

### B1 · Escribir la plantilla como referencia editorial
**Estado:** ✅ hecho (2026-08-31) · **Fichero nuevo:** `PLANTILLA_PAGINA_COMERCIAL.md`

Documento corto con: la regla de las tres preguntas (§4.1), la tabla de cinco bloques con su presupuesto de palabras (§4.2), y la tabla de qué se elimina y a dónde va (§4.3). Es la referencia que se usa en C y D.

### B2 · Piloto 1 — `/mantenimiento/`
**Estado:** ✅ hecho (2026-08-31) · **Fichero:** `src/pages/mantenimiento.astro` (672 → 330 líneas)

De 1.347 a ≤ 600 palabras. Es una de las dos más planas (bloque mayor: 15 %), así que es donde más se va a notar.

### B3 · Piloto 2 — `/kaizen/`
**Estado:** ✅ hecho (2026-08-31) · **Fichero:** `src/pages/kaizen.astro` (742 → 380 líneas)

De 1.514 a ≤ 600 palabras. 26 H3 → máximo 10.

### B4 · Medir el piloto y decidir
**Estado:** ✅ hecho (2026-08-31)

Ejecutar el script del Anexo III antes y después. **Criterio de paso a bloque C:**

- Ambas páginas < 600 palabras en `<main>`.
- Bloque «Cómo funciona» > 40 % del texto de su página.
- Sin pérdida de posiciones a 14 días en Search Console para las keywords de esas dos URLs.

Dejar la versión anterior accesible en git (tag o rama) para poder comparar comportamiento en Analytics.

---

## Cierre del bloque B

Ejecutado y verificado el 2026-08-31. Ambos pilotos **pasan los dos criterios**.

| | Antes | Después | Bloque mayor | Criterios |
|---|---:|---:|---|---|
| `/mantenimiento/` | 1.347 | **520** (−61 %) | 15 % → **41 %** | ✅ ✅ |
| `/kaizen/` | 1.514 | **558** (−63 %) | 16 % → **40 %** | ✅ ✅ |

El texto indexable (`dom`) queda en 753 y 834: las respuestas de FAQ siguen en el DOM, plegadas. Esa diferencia es deliberada — el lector ve menos, el buscador sigue viendo todo.

### Corrección importante: el script del Anexo III medía mal

Al ejecutar `B4` los dos pilotos parecían fallar (745 y 837 palabras, bloque mayor 31 % y 33 %). **El problema no eran las páginas, era la medición.**

El script contaba todo el texto del `<main>`, incluidas las respuestas de FAQ plegadas, mientras que el presupuesto de `PLANTILLA_PAGINA_COMERCIAL.md` deja la FAQ **fuera**. Dos bases distintas para el mismo criterio. Con la FAQ dentro del denominador, además, **ninguna página puede llegar nunca al 40 %**: la propia FAQ pasa a ser el bloque mayor, como se ve en que era el bloque más grande de las dos páginas recortadas (31 % y 33 %).

El script ahora reporta dos columnas y vive también como fichero ejecutable:

- **`dom`** — todo el texto indexable, FAQ incluida. Es lo que ve Google.
- **`presupuesto`** — lo que ve el lector sin desplegar nada. Es la base de la plantilla y de los criterios.

Extraído a **`scripts/medir-densidad.mjs`**, sincronizado con el bloque del [Anexo III](#anexo-iii--script-de-medición).

### Decisiones tomadas al aplicar la plantilla

1. **`/kaizen/` tenía prueba *y* límite.** La plantilla admite uno de los dos. Se quedó la cronología (más persuasiva) y el límite honesto —«REELEVO no crea por sí solo una cultura de mejora continua»— pasó a ser **una quinta pregunta de la FAQ**, con lo que entra también en el `FAQPage` JSON-LD. El argumento no se pierde, la sección sí.
2. **`/mantenimiento/` tenía una tabla comparativa de 167 palabras** («Lo que nos diferencia»). Su argumento ya estaba cubierto por una FAQ existente, que se amplió. La tabla se eliminó entera.
3. **Se retiró el CTA intermedio de `/kaizen/`**, añadido en su día porque la página era tan larga que quien llegaba a media altura no tenía salida (`PROPUESTA_9_DISPARADORES_COMERCIAL_2026-08`, M6b). Con 558 palabras el problema que lo justificaba desaparece.
4. **Los KPIs de ciclo se movieron de la tarjeta «Panel Kanban» al paso 2 del flujo**, donde encajan mejor y refuerzan el bloque que debe dominar. Sin esto `/kaizen/` se quedaba en 36 %.

### Control de vocabulario (anticipo de `C5`)

Se comparó el copy anterior con el nuevo. La mayoría de términos perdidos son conectores de prosa eliminada, pero tres tenían valor de búsqueda y **se restauraron**:

| Término | Dónde se reintrodujo |
|---|---|
| `trazabilidad` + `ISO 9001` | `/mantenimiento/`, paso 4 del flujo |
| `alertas` + `mantenimientos programados` | `/mantenimiento/`, tarjeta 1 |
| `KPIs` | `/kaizen/`, paso 2 del flujo |

**Sigue pendiente lo único que no se puede verificar hoy:** los 14 días de Search Console. Hasta tenerlos, `C1` no debería arrancar.

---

## Bloque C · Páginas de plataforma (P1)

**17 páginas · estimación ~5 días.** Es la fase con **riesgo SEO real**: ir en tandas y esperar **dos semanas de datos entre tandas**.

En cada página: aplicar la plantilla de §4.2, eliminar la sección «por perfil» enlazando a `/para-quien/`, y recortar la rejilla de funcionalidades de 6 a 3 tarjetas.

### C1 · Tanda 1 — las cuatro más cargadas
**Estado:** ✅ hecho (2026-08-31)

> **Decisión del cliente:** se arranca `C` **sin esperar** los 14 días de Search Console que pedía `B4`, asumiendo explícitamente el riesgo de pérdida de posiciones. La estructura por tandas se mantiene para poder revertir una tanda concreta.

| Página | Antes | Después | Reducción | Bloque mayor | Criterios |
|---|---:|---:|---:|---|---|
| `/api-integraciones/` | 1.571 | **601** | −62 % | 15 % → **50 %** | ⚠️ ✅ |
| `/obras-trazabilidad/` | 1.457 | **576** | −60 % | 14 % → **41 %** | ✅ ✅ |
| `/control-produccion/` | 1.420 | **501** | −65 % | 22 % → **41 %** | ✅ ✅ |
| `/portal-operario/` | 1.309 | **478** | −63 % | 26 % → **44 %** | ✅ ✅ |

`/api-integraciones/` se queda en **601 palabras, una por encima del umbral de 600**. Se deja así a propósito: seguir recortando palabras sueltas sería maquillar la métrica, no mejorar la página. Es la más técnica de las cuatro, su bloque «Conectores» es una lista de referencia con nombres propios que conviene no tocar (SAP HR, SAP Production, Holded, Factorial, MachineMetrics, MTConnect, Microsoft 365, WhatsApp) y su bloque dominante es el más alto de las seis páginas reescritas hasta ahora.

**Qué se eliminó en cada una y a dónde fue:**

| Página | Bloque eliminado | Destino |
|---|---|---|
| `api-integraciones` | «Casos de uso» (4 tarjetas) | Fundidos en las descripciones de las tres capas |
| | «Disponibilidad por plan» (tabla) | Nueva FAQ + enlace a `/precios/` |
| | «Para quién tiene sentido» (rejilla sí/no) | Fundido en el bloque de límite |
| | CTA intermedio | Eliminado: la página ya no es larga |
| `obras-trazabilidad` | «Para quién es esto» (4 perfiles) | Una línea con los sectores + enlaces |
| | «Enfoque prudente» (no es un MES) | Nueva FAQ |
| | «Caso real» (201 palabras) | Cronología de 4 líneas |
| | CTA intermedio | Eliminado |
| `control-produccion` | «Lo que ve cada persona» (4 roles, 16 ítems) | Una línea con enlaces a `/para-quien/` |
| | «Enfoque prudente» | Ya estaba cubierto por la FAQ «¿En qué se diferencia de un MES?» — se elimina en vez de repetirlo |
| `portal-operario` | «Reconocimiento y motivación» (3 tarjetas) | Fundido en la tarjeta 4 del portal |
| | «El otro lado» — portal del supervisor (4 tarjetas) | Nueva FAQ |
| | 7 tarjetas de portal | 5 tarjetas |

**Control de vocabulario (`C5`):** de 355-454 términos por página se pierden 112-166, casi todos conectores de prosa eliminada. Con valor de búsqueda solo aparecen `trazabilidad` y `auditorías` (en api-integraciones) y `certificaciones`, `auditorías` y `kaizen` (en obras). **No se han restaurado a propósito:** son términos que pertenecen a `/calidad-y-conformidad/` y `/gestion-competencias/`, y el principio del plan es justamente que cada página deje de competir por el vocabulario de las demás. `/control-produccion/` y `/portal-operario/` no pierden ningún término relevante.

**Efecto acumulado en las 50 páginas comerciales:** presupuesto visible mediana 793 → **729**, bloque mayor 30 % → **31 %**, secciones 7 → **6**. Con 6 de 50 páginas reescritas el movimiento aún es pequeño; el grueso llega en `C2`-`C4` y `D`.

### C2 · Tanda 2
**Estado:** ✅ hecho (2026-09-01) · **4/4 cumplen los dos criterios**

| Página | Antes | Después | Reducción | Bloque mayor |
|---|---:|---:|---:|---|
| `/workflows/` | 1.309 | **465** | −64 % | 19 % → **47 %** |
| `/oee/` | 1.235 | **501** | −59 % | 25 % → **46 %** |
| `/documentacion-procesos/` | 1.222 | **497** | −59 % | 28 % → **43 %** |
| `/calidad-y-conformidad/` | 1.139 | **533** | −53 % | 28 % → **50 %** |

**Qué se eliminó y a dónde fue:**

| Página | Bloque eliminado | Destino |
|---|---|---|
| `workflows` | «El problema» (5 ítems + risk box) | Hero |
| | «Los 17 tipos de nodo» (17 tarjetas) | Lista compacta: se conservan los 17 nombres, se recorta la descripción |
| | «Casos de uso habituales» (6 tarjetas) | FAQ — la pregunta «¿Qué procesos merecen un workflow?» ya los enumeraba |
| | «Enfoque prudente» | Mitad ya estaba en la FAQ; la otra mitad (el editor no es trivial) pasa a una pregunta nueva |
| `oee` | «El problema» (4 ítems + risk box) | Hero |
| | «Disponibilidad por plan» (tabla) | FAQ + enlace a `/precios/` |
| | «Sigue explorando» (3 tarjetas) | Línea de enlaces |
| | 4 tarjetas Lean | 3 (la de ROI se funde en el resto) |
| `documentacion-procesos` | «La realidad» (comparativa mal/bien de 16 ítems) | Hero |
| | «¿Qué documentar?» (6 tarjetas) | FAQ — la pregunta de por dónde empezar ya iba de eso |
| | «Sigue explorando» | Línea de enlaces |
| `calidad-y-conformidad` | «Dónde ayuda de verdad» (4 tarjetas) | Eliminado: solapaba con el bloque de recalls |
| | «Continuidad del dato» (3 tarjetas) | FAQ — ampliando la pregunta de exportación que ya existía |
| | «Sigue explorando» | Línea de enlaces |

### Dos ajustes estructurales, no de recorte

`/workflows/` y `/documentacion-procesos/` se quedaron primero en **38-40 % de dominancia** aun estando dentro de presupuesto. Seguir quitando palabras sueltas habría sido maquillar la métrica, así que se atacó la causa: en las dos páginas **había un bloque que la FAQ ya cubría**.

- En `/workflows/`, la sección «Casos de uso habituales» repetía lo que respondía la pregunta «¿Qué procesos merecen un workflow?». Se eliminó la sección y sus tres ejemplos concretos —cambio de utillaje, puesta en marcha en paralelo, auditoría interna— se incorporaron a esa respuesta. Dominancia 40 % → **47 %**, y la página baja de 551 a 465.
- En `/documentacion-procesos/`, la sección «¿Qué documentar?» solapaba con «¿Cuántos procesos hay que documentar para empezar?». Mismo movimiento: los seis tipos pasan a la respuesta. Dominancia 38 % → **43 %**, y baja de 561 a 497.

Es el mismo patrón que apareció en `C1` con `/control-produccion/`: **la plantilla vieja generaba secciones que duplicaban la FAQ de la propia página.** Conviene buscarlo activamente en `C3` y `C4`.

### Control de vocabulario (`C5`)

De 356-404 términos por página se pierden 88-156, casi todos conectores. Con valor de búsqueda solo sobreviven dos casos, ninguno restaurado: `sops` en plural (el singular `SOP` sigue en la página) y `onboarding` en `/calidad-y-conformidad/`, que es término propio de `/casos-de-uso/onboarding-operarios/`.

### Recuperado de paso

En `/documentacion-procesos/` se conservó el dato **«el 77 % de las pymes industriales españolas no tiene procedimientos documentados y actualizados»** con su cita de fuente, que en el primer borrador de la reescritura se había perdido junto con la sección que lo contenía.

**Efecto acumulado (10 de 50 páginas):** presupuesto visible mediana **729 → 702**, bloque mayor **31 % → 34 %**.

### C3 · Tanda 3
**Estado:** ✅ hecho (2026-09-01) · **4/4 cumplen los dos criterios**

| Página | Antes | Después | Reducción | Bloque mayor |
|---|---:|---:|---:|---|
| `/seguridad/` | 1.132 | **516** | −54 % | 27 % → **47 %** |
| `/modo-offline/` | 1.097 | **458** | −58 % | 25 % → **50 %** |
| `/gestion-competencias/` | 1.024 | **503** | −51 % | 22 % → **48 %** |
| `/integracion-m365/` | 979 | **418** | −57 % | 21 % → **41 %** |

### `/seguridad/` era el caso extremo del patrón

Tenía **seis secciones, y cuatro eran la versión larga de una pregunta que ya estaba en su propia FAQ**:

| Sección | Pregunta que ya la respondía |
|---|---|
| «Aislamiento de datos» | ¿Cómo se garantiza que una empresa no vea los datos de otra? |
| «La pregunta incómoda» (operario sin contraseña) | ¿Es seguro que el operario entre sin cuenta ni contraseña? |
| «Control de acceso» | ¿Puedo dar acceso a un jefe de línea sin que vea la facturación? |
| «RGPD» | ¿Qué pasa con nuestros datos si dejamos de usar REELEVO? |

Se eliminó entera «La pregunta incómoda» —sus cuatro tarjetas se incorporaron a la respuesta, incluidos los detalles que solo estaban ahí: sesión de 24 h, PIN con bcrypt por trigger, alcance limitado al puesto y código personal de ocho caracteres—. Las otras tres se conservan porque aportan **detalle que la FAQ no lleva**: la tabla de los siete roles y la de plataforma. La regla que queda: si la sección no añade nada sobre la respuesta, se va; si añade una tabla o un dato concreto, se queda y la respuesta se acorta.

### Un límite real de la métrica

`/gestion-competencias/` se quedó en **31 % de dominancia** con todo bien colocado. La causa no era la página: su bloque central es una **tabla-matriz de 24 celdas de una o dos palabras**, que pesa poquísimo en recuento pero es el centro visual de la página. El recuento de palabras no ve eso.

No se infló el bloque. Se unió a él la sección «Qué incluye», cuyas tres tarjetas describen precisamente lo que se saca de esa matriz — quedan bajo un subtítulo dentro del mismo bloque. Dominancia 31 % → **48 %**, y la página se lee mejor: la matriz y lo que da, juntos.

**Conviene recordarlo al leer la métrica:** el `% del bloque mayor` mide texto, no peso visual. En páginas con tabla, captura o diagrama grande, el número subestima la jerarquía real.

### Otras decisiones

- **`/modo-offline/`**: se eliminó la comparativa «app nativa vs PWA» (10 ítems) porque la pregunta «¿Hay que instalar una app desde la tienda?» ya iba de eso; sus cinco ventajas se incorporaron a la respuesta.
- **`/integracion-m365/`**: la tabla «Qué está incluido en cada plan» pasa a FAQ **conservando los números concretos** (5 webhooks y 10.000 llamadas/mes en Pro, sin límite en Enterprise), porque son el dato que la gente busca.
- **CTA intermedio** retirado en `/modo-offline/` y `/integracion-m365/`, por la misma razón que en las tandas anteriores.

### Control de vocabulario (`C5`)

Se pierden 75-99 términos por página. `/seguridad/` y `/modo-offline/` no pierden **ninguno** con valor de búsqueda —lo relevante estaba en tablas y FAQ, que se conservan—. Los dos únicos casos son `trazabilidad` y `onboarding`, términos propios de `/obras-trazabilidad/` y `/casos-de-uso/onboarding-operarios/`.

**Efecto acumulado (14 de 50 páginas):** presupuesto visible mediana **702 → 619**, bloque mayor **34 % → 37 %**.

### C4 · Tanda 4
**Estado:** ✅ hecho (2026-09-01)

| Página | Antes | Después | Reducción | Bloque mayor |
|---|---:|---:|---:|---|
| `/cobertura-turnos/` | 954 | **445** | −53 % | 23 % → **45 %** |
| `/firma-digital/` | 892 | **364** | −59 % | 25 % → **42 %** |
| `/software-gestion-pyme-industrial/` | 883 | **403** | −54 % | 30 % → ⚠️ **38 %** |

**Hallazgo de código, no de contenido:** `/software-gestion-pyme-industrial/` **montaba su propio bloque `<details>` y su propio `FAQPage` inline** en vez de usar `FaqSection` + `faqPageSchema()`. Eran dos implementaciones del mismo bloque conviviendo en el repo. Migrada al componente compartido.

`/firma-digital/` tenía la duplicación más literal de todo el bloque C: la sección «Enfoque prudente — no es firma electrónica cualificada» decía exactamente lo mismo que la primera pregunta, «¿Es firma electrónica cualificada?». Se eliminó la sección y su único dato propio —disponible desde el plan Pro— pasó a la respuesta.

`/software-gestion-pyme-industrial/` se queda en **38 %**. Es el mismo caso que `/gestion-competencias/` en `C3`: su bloque dominante es una **rejilla de 8 enlaces a los módulos**, y esta página es un hub cuya función es enrutar. El peso funcional de esa rejilla no lo ve un recuento de palabras. Se dejó de recortar en ese punto en vez de seguir quitando palabras para cruzar un umbral.

### C5 · Control de canibalización
**Estado:** ✅ hecho (2026-09-01)

Comparado el copy anterior y el nuevo de las **17 páginas de plataforma**:

| | |
|---|---:|
| Términos perdidos en total | 1.903 |
| De ellos, con valor de búsqueda | **18** |
| De esos 18, que ya no existen en ninguna página del sitio | **0** |

Los 18 son `trazabilidad`, `auditorías`, `certificaciones`, `kaizen`, `troubleshooting`, `onboarding`, `whatsapp`, `mecanizado`, `iatf` y `sops`. **Ninguno se ha restaurado, y ninguno se ha perdido:** todos siguen presentes en la página que los tiene como tema propio, verificado sobre el HTML construido —`onboarding` en 36 páginas, `sop` en 52, `iatf` en `/documentacion-procesos/`, `whatsapp` en 3—. Es exactamente el efecto que buscaba el plan: cada página deja de competir por el vocabulario de las demás.

**No se ha eliminado ningún H2 con impresiones propias sin destino**, porque en las cuatro tandas el patrón fue el mismo: las secciones eliminadas duplicaban la FAQ de su propia página, y su contenido se incorporó a la respuesta, que entra igualmente en el `FAQPage` JSON-LD.

## Cierre del bloque C

Las **17 páginas de plataforma** reescritas, en cuatro tandas, entre el 2026-08-31 y el 2026-09-01.

| | Antes (mediana) | Después (mediana) | Reducción |
|---|---:|---:|---:|
| Presupuesto visible | 1.222 | **478** | **−61 %** |
| Bloque mayor | 25 % | **44 %** | +19 pp |

**15 de 17 cumplen los dos criterios.** Las dos excepciones están documentadas y son deliberadas: `/api-integraciones/` con 601 palabras (una sobre el umbral) y `/software-gestion-pyme-industrial/` con 38 % de dominancia (hub de enlaces).

### El patrón que se repitió en las cuatro tandas

**La plantilla vieja generaba secciones que duplicaban la FAQ de la propia página.** Apareció en `/control-produccion/`, `/workflows/`, `/documentacion-procesos/`, `/seguridad/`, `/modo-offline/`, `/firma-digital/` y `/software-gestion-pyme-industrial/` — siete de diecisiete. La regla que quedó, y que conviene aplicar en `D`:

1. Si la sección **no añade nada** sobre la respuesta que ya está en la FAQ, se elimina y el detalle se incorpora a la respuesta. El argumento no se pierde y además entra en el `FAQPage` JSON-LD, donde antes no estaba.
2. Si la sección **aporta una tabla o un dato concreto** que la respuesta no lleva, se conserva y se acorta la respuesta.

### Lo que la métrica no ve

En páginas cuyo bloque central es una **tabla, una matriz o una rejilla de enlaces**, el `% del bloque mayor` subestima la jerarquía real, porque mide texto y no peso visual. Ocurrió en `/gestion-competencias/` (matriz de 24 celdas), `/cobertura-turnos/` (mapa de cobertura) y `/software-gestion-pyme-industrial/` (8 módulos). En los dos primeros se resolvió uniendo al bloque la sección que lo describía; en el tercero se aceptó el 38 %.

---

## Bloque D · Home, precios y satélites (P1)

**Estimación ~3 días.**

### D1 · Home
**Estado:** ✅ hecho (2026-09-01) · **Fichero:** `src/pages/index.astro`

| | DOM (indexable) | Visible al cargar |
|---|---:|---:|
| Antes | 1.665 | **1.074** |
| Después | 1.470 | **879** (−18 %) |

5 secciones, bloque dominante **42 %**.

> **Tercer error de medición encontrado, y el más importante.** `PlatformMap` **renderiza sus seis vistas de escenario en el DOM a la vez** y las conmuta con `display:none`. El lector ve una; el recuento veía las seis. Son **591 palabras que nunca están en pantalla**. Es decir: la línea base de la home no eran 1.665 palabras visibles sino 1.074, y el objetivo de 700 se fijó sobre una cifra inflada.

**No se alcanzan las 700 palabras y es deliberado.** Para bajar de 879 habría que eliminar las cuatro escenas de «El día a día» —«Javi está de baja», «Es su primer día»…—, que son el mejor copy del sitio y el gancho de reconocimiento del problema. Lo que sí se hizo:

- Fuera las **12 viñetas de consecuencias** de las cuatro escenas: repetían lo que ya decía cada descripción.
- La sección de posicionamiento era una `<section>` entera **para un solo párrafo que repetía el eyebrow del hero**. Fundida como lede del bloque de escenas: una sección menos, mismo texto indexable.
- CTA de cierre recortado: la explicación del trial se repite en `/precios/` y en la FAQ.

### D2 · Precios
**Estado:** ✅ hecho (2026-09-01) · **Fichero:** `src/pages/precios.astro`

De 905 a **789** palabras visibles, con la tabla de planes al **62 %** y solo 4 secciones: hero → planes → calculadora ROI → CTA.

Se eliminó la sección «Qué compras realmente» (3 tarjetas, 116 palabras). Era lo más flojo de la página: abstracciones tipo «más claridad y aprendizaje útil» o «se trabaja como capa avanzada según alcance», que la propia tabla de planes ya comunica con precios y límites concretos.

**No se tocó ni la tabla de planes ni la calculadora de ROI.** La tabla son 491 palabras, pero es dato de referencia, no prosa; la calculadora es una herramienta cuyo texto son etiquetas de campo. Por eso la página queda en 789 y no en 600: bajar de ahí exigiría quitar información que la gente viene a buscar.

### D3 · Soluciones por caso de uso (6 páginas)
**Estado:** ✅ hecho (2026-09-01) · **6/6 cumplen los dos criterios**

| Página | Antes | Después | Reducción | Bloque mayor |
|---|---:|---:|---:|---|
| `/errores-en-planta/` | 947 | **583** | −38 % | 34 % → **47 %** |
| `/consistencia-entre-turnos/` | 897 | **572** | −36 % | 35 % → **49 %** |
| `/casos-de-uso/transferencia-conocimiento/` | 1.029 | **467** | −55 % | 25 % → **40 %** |
| `/casos-de-uso/personal-ett/` | 904 | **545** | −40 % | 26 % → **53 %** |
| `/casos-de-uso/onboarding-operarios/` | 867 | **417** | −52 % | 27 % → **40 %** |
| `/casos-de-uso/cobertura-bajas/` | 721 | **468** | −35 % | 36 % → **41 %** |

### Cuatro páginas comerciales no tenían FAQ ni `FAQPage`

Las cuatro de `/casos-de-uso/` no llevaban bloque de preguntas **ni schema `FAQPage` en el head**. Eso obligó a cambiar el plan: la poda mecánica bajó solo un 14-20 % y dejó la dominancia en 28-33 %, porque **cada página tenía un bloque secundario compitiendo con el principal y no había dónde moverlo**.

Así que se les añadió FAQ, y ahí fue donde aterrizaron los bloques secundarios:

| Página | Sección absorbida | Preguntas nuevas |
|---|---|---|
| `cobertura-bajas` | «Tres pasos» | 4 |
| `onboarding-operarios` | «Tiempo de aprendizaje» + «Tres pasos» | 4 |
| `personal-ett` | «Situaciones habituales» | 4 |
| `transferencia-conocimiento` | «El momento correcto» + «Si ya es tarde» | 4 |

**No es ampliación de alcance: era la condición para poder recortar.** Y de paso las cuatro pasan a emitir `FAQPage`, que antes no tenían. En `/casos-de-uso/personal-ett/` hizo falta además fundir «Cómo funciona para el ETT» dentro del bloque principal, porque describe cómo funciona la solución: 31 % → 53 %.

**Patrón repetido de las dos páginas con FAQ:** en `/errores-en-planta/` y `/consistencia-entre-turnos/` la sección «Conviene decirlo claro» volvía a ser la versión larga de una pregunta que ya estaba en la página. Mismo tratamiento que en el bloque C.

**Dos limpiezas transversales** en las seis: los cuatro bloques «El resultado» de cada fila de beneficio repetían la descripción de su propia fila, y el párrafo narrativo de cada escenario repetía lo que ya decían sus líneas «Sin REELEVO / Con REELEVO».

> **Quedan 6 páginas comerciales sin `FAQPage`:** las 4 de `/para-quien/` y las 2 de `/sectores/`. Se resuelve en `D4`.

### D4 · Roles y sectores (6 páginas)
**Estado:** ✅ hecho (2026-09-01) · **4/6 cumplen los dos criterios**

| Página | Antes | Después | Reducción | Bloque mayor |
|---|---:|---:|---:|---|
| `/para-quien/jefe-de-produccion/` | 1.119 | ⚠️ **700** | −37 % | 30 % → **47 %** |
| `/para-quien/gerente-propietario/` | 768 | ⚠️ **618** | −20 % | 30 % → **52 %** |
| `/para-quien/responsable-calidad/` | 739 | **542** | −27 % | 30 % → **41 %** |
| `/para-quien/responsable-rrhh/` | 729 | **582** | −20 % | 39 % → **49 %** |
| `/sectores/mecanizado-cnc/` | 707 | **490** | −31 % | 31 % → **44 %** |
| `/sectores/alimentacion/` | 701 | **496** | −29 % | 31 % → **43 %** |

**Las seis estaban sin FAQ ni `FAQPage`**, igual que las de `D3`. Mismo tratamiento: se añade FAQ y ahí aterrizan las secciones que competían con el bloque principal.

| Página | Secciones absorbidas por la FAQ |
|---|---|
| `responsable-calidad` | «Valor ejecutivo», «Límites y alcance», «Sigue explorando» |
| `responsable-rrhh` | «Trazabilidad operativa» |
| `gerente-propietario` | «Cuándo encaja» |
| `jefe-de-produccion` | «Beneficios específicos» |
| `mecanizado-cnc` y `alimentacion` | «Lo que aporta», «Límites y alcance», «Puente natural» |

**Las dos que no bajan de 600 tienen dominancia alta (47 % y 52 %) y se dejan ahí a propósito.** El motivo es el mismo de siempre: llegar a 600 exigía seguir quitando viñetas sueltas de las tarjetas de escenario, que es maquillar la métrica. En `/para-quien/jefe-de-produccion/` ya se recortaron **20 viñetas** —las listas «Sin REELEVO / Con REELEVO» tenían cinco por lado, ahora dos— y en `/para-quien/gerente-propietario/` otras 6.

**Fusiones para dar peso al bloque dominante,** el mismo movimiento del bloque C: «Prueba visual» dentro de «Control operativo» en `jefe-de-produccion`, y «Visión ejecutiva» dentro de «Dónde se nota» en `gerente-propietario`.

### Regresión propia detectada y corregida

Al colgar los enlaces internos de las secciones «Puente natural» y «Sigue explorando» en la nota del CTA usé `<br />` **sin espacio delante**, reintroduciendo en 6 páginas exactamente el defecto que arregló la tarea `A1`. El script del Anexo III lo cazó —`Texto pegado por <br>: 6`— y se corrigió. Vuelve a **0**.

> Es la razón por la que el script se ejecuta después de cada tanda y no solo al final.

### D5 · Comparativas — no tocar
**Estado:** ✅ cerrado sin cambios (2026-09-01)

Las 7 páginas `vs-*` (mediana **622** palabras, bloque mayor 30-41 %) eran **las más sanas de la web** cuando se midió, y siguen sin tocarse. Al terminar los bloques C y D han pasado de ser las mejores a estar entre las que menos foco tienen del sitio, simplemente porque el resto ha mejorado. **No es motivo para tocarlas ahora**: la decisión de no reescribirlas se tomó para acotar el riesgo SEO, y sigue siendo válida. Queda como candidato natural para una tanda posterior, con el mismo método.

## Cierre del bloque D

| | Antes | Después |
|---|---:|---:|
| Home (visible al cargar) | 1.074 | **879** |
| Precios | 905 | **789** |
| 6 páginas de caso de uso | 894 (mediana) | **506** (mediana) |
| 6 de rol y sector | 723 (mediana) | **562** (mediana) |

**10 de las 14 páginas cumplen los dos criterios.** Las 4 excepciones —home, precios, `jefe-de-produccion` y `gerente-propietario`— superan el presupuesto pero todas tienen el bloque dominante por encima del 40 %, y en cada caso está documentado por qué no se recorta más.

**El hallazgo estructural del bloque:** **10 páginas comerciales no tenían FAQ ni `FAQPage`** — las 4 de `/casos-de-uso/`, las 4 de `/para-quien/` y las 2 de `/sectores/`. Eso bloqueaba el método que había funcionado en el bloque C, porque no había dónde mover los bloques secundarios. Añadirles FAQ no fue ampliar alcance: era la condición para poder recortar. **El sitio pasa de 33 a 43 páginas comerciales emitiendo `FAQPage`.**

---

## Bloque E · Aire y cierre (P2)

**Estimación ~1 día.** Solo después de C y D.

### E1 · Subir el aire entre secciones
**Estado:** ✅ hecho (2026-09-01) · **Fichero:** `src/styles/global.css`

```diff
- .section{ padding:96px 32px; }
+ .section{ padding:120px 32px; }
```

> **Orden crítico:** hacer esto **antes** de recortar secciones alarga páginas que ya son largas. El aire es la recompensa de haber quitado bloques, no un sustituto de quitarlos.

**Y se nota justo en eso.** Con la mediana en 5 secciones en vez de 8, el relleno vertical total por página **baja aunque cada sección respire más**:

| | Secciones | Relleno por sección | Relleno total |
|---|---:|---:|---:|
| Antes del plan | 8 | 192 px | 1.536 px |
| Ahora | 5 | **240 px** | **1.200 px** |

25 % más de aire en cada bloque y 336 px menos de scroll. Era exactamente el objetivo del encargo: más espaciado y menos página.

### E2 · Menú móvil duplicado en el DOM
**Estado:** ✅ hecho (2026-09-01), con el alcance acotado · **Fichero:** `src/components/Header.astro`

131 palabras y 35 enlaces por página que replican el mega-menú de escritorio.

**Renderizar una sola vez y reutilizar por CSS no es viable:** el escritorio es un mega-menú de dos columnas con sub-etiquetas y el móvil una lista plana con títulos de sección. Son formas de DOM distintas, no el mismo bloque con otro estilo.

**La única vía que sí reduciría el DOM —construir el menú móvil con JS al abrirlo— se evaluó y se descartó.** Dejaría la navegación móvil dependiendo de JavaScript, que es peor que 131 palabras duplicadas.

**Lo que sí se hizo:** los dos menús pasan a generarse desde **un único origen de datos** en el frontmatter del componente (`PLATAFORMA`, `SOLUCIONES`, `RECURSOS`). Antes los mismos 34 enlaces estaban escritos dos veces y nada impedía que se separaran al tocar uno solo.

Verificado antes y después: **35 enlaces en escritorio, 34 en móvil, 0 etiquetas divergentes, 31 sub-etiquetas, mismos títulos de columna.** El HTML resultante es equivalente; lo que cambia es que ya no se puede desincronizar. **El peso en DOM no baja**, y eso queda como coste asumido.

### E3 · Pasada final de tipografía
**Estado:** ✅ hecho (2026-09-01)

`A3` solo tocó `global.css`, así que los `<style>` locales de cada página seguían por debajo del suelo. Barrido completo, excluyendo el blog:

| | |
|---|---:|
| Etiquetas subidas a `.7rem` (11 px) en estilos locales | **42** |
| Cuerpo subido a `.95rem` (15 px) en estilos locales | **30** |
| Ficheros tocados | **23** |
| Selectores de `global.css` que `A3` no cubrió y ahora sí | **8** |

Los ocho de `global.css` eran `.mega-col-title`, `.mobile-section-title`, `.caso-tag`, `.scenario-card-tag`, `.benefit-result-label`, `.cta-note`, `.micro-case-tag` y `.nav-sub-label`: etiquetas a 9,3-10,9 px que no eran `.eyebrow` y por eso escaparon a la primera pasada. **Ya no queda ningún tamaño por debajo del suelo en todo el sitio comercial.**

Se respetó la letra pequeña como tal: los selectores de nota, fuente, aviso legal y pie de captura se dejaron donde estaban, porque son notas al pie y no cuerpo de texto.

### E4 · Re-medición completa y cierre
**Estado:** ✅ hecho (2026-09-01)

Ver [Criterios de aceptación](#12-criterios-de-aceptación), ya rellenados.

**Regresión encontrada y corregida en esta pasada.** Al eliminar secciones del bloque D quedó un anclaje interno apuntando a una sección que ya no existe: `/gestion-competencias/` enlazaba a `/casos-de-uso/onboarding-operarios/#cuanto-tarda`, y esa sección se había absorbido en la FAQ. Redirigido a `#faq`, que es donde vive ahora el contenido. **Comprobados todos los anclajes internos del sitio: 0 rotos.**

---

## 10. Secuencia de ejecución

```
A1 ─ A2 ─ A3 ─ A4          (~4 h, riesgo nulo, se puede desplegar ya)
        │
        └─ B1 ─ B2 ─ B3 ─ B4          (~2 días, gate de decisión)
                        │
                        ├─ C1 ─ ⏳2 sem ─ C2 ─ ⏳2 sem ─ C3 ─ ⏳2 sem ─ C4 ─ C5
                        │
                        └─ D1 ─ D2 ─ D3 ─ D4          (en paralelo a C)
                                            │
                                            └─ E1 ─ E2 ─ E3 ─ E4
```

**Reglas de orden que no se pueden saltar:**

1. `A3` **no incluye** el `padding` de sección; eso es `E1`, y va al final.
2. `B4` es un gate: si los pilotos no cumplen criterio, se revisa la plantilla antes de seguir.
3. Las tandas de `C` esperan dos semanas de datos entre ellas. Si una tanda pierde posiciones, **se revierte esa tanda, no el plan**.
4. `E1` va después de C y D.

---

## 11. Ficheros afectados

| Fichero | Bloques | Naturaleza del cambio |
|---|---|---|
| `src/styles/global.css` | A3, E1 | Tokens tipográficos y padding de sección |
| `src/components/FaqSection.astro` | A2 | `<p>` → `<details>/<summary>` |
| `src/components/Header.astro` | E2 | Deduplicar menú móvil (opcional) |
| `src/lib/seo.ts` | — | **No se toca.** Verificar que `faqPageSchema()` sigue emitiendo igual |
| `src/pages/**/*.astro` (50 ficheros) | A1 | Espacio antes de `<br>` |
| `src/pages/index.astro` | D1 | Reescritura a 700 palabras |
| `src/pages/precios.astro` | D2 | Reescritura a 600 palabras |
| `src/pages/por-que-usar-reelevo.astro` | A4 | Reducción de CTAs |
| 17 páginas de plataforma | C1-C4 | Reescritura a 550 palabras |
| 12 páginas de soluciones/roles/sectores | D3, D4 | Reescritura a 400 palabras |
| `PLANTILLA_PAGINA_COMERCIAL.md` | B1 | Fichero nuevo |
| `src/pages/blog/**` | — | **No se toca** |

---

## 12. Criterios de aceptación

| Métrica | Línea base | Final | Objetivo | Resultado |
|---|---:|---:|---:|---|
| Presupuesto visible, mediana | 1.026 | **503** | < 500 | ⚠️ a 3 palabras |
| Secciones por página (sin FAQ), mediana | 8 | **5** | 4-5 | ✅ |
| % del bloque mayor, mediana | 27 % | **43 %** | > 40 % | ✅ |
| Texto pegado por `<br>` | 141 | **0** | 0 | ✅ |
| Cuerpo de tarjeta mínimo | 13,6 px | **15,2 px** | ≥ 15 px | ✅ |
| Etiqueta mínima | 9,3 px | **11,2 px** | ≥ 11 px | ✅ |
| Páginas comerciales con `FAQPage` | 33 | **43** | — | ✅ |
| Anclajes internos rotos | 0 | **0** | 0 | ✅ |
| Scroll depth medio | — | — | ↑ | ⏳ GA4 |
| Clics a `/registro` por sesión | — | — | ↑ | ⏳ GA4 |

**Las 32 páginas reescritas quedan en 516 palabras de mediana con el bloque mayor al 46 %.** La mediana global de 503 incluye 18 páginas que nunca entraron en alcance —las 7 `vs-`, `/blog/`, `/faqs/`, `/como-funciona/`, `/sobre-nosotros/`, `/video-demo/`, `/recursos/*` y `/kit-digital-pyme-industrial/`—, cuyo bloque mayor está en el 32 % de mediana. **Ahí está el margen que queda**, no en lo ya reescrito.

> **Aviso al leer la métrica en `/faqs/`:** esa página marca 111 palabras porque el script excluye el bloque de FAQ del presupuesto, y `/faqs/` *es* una FAQ entera. No es un error de la página; es el efecto de aplicarle una regla pensada para páginas que tienen FAQ como complemento.

La web ya tiene instrumentación `data-cta` con intención y localización, así que la parte de negocio se mide sin trabajo adicional. Lo que conviene añadir es una **comparación por cohortes**: páginas reescritas frente a páginas aún sin tocar, durante las mismas semanas.

> **Advertencia honesta:** recortar entre un 45 y un 58 % del texto de páginas que hoy posicionan tiene riesgo SEO, y no se puede prometer que el tráfico se mantenga intacto. Por eso el plan va por tandas con dos semanas de datos entre ellas, y por eso las páginas `vs-` y el blog — donde el volumen sí está justificado — se quedan como están.

---

## Anexo I · Inventario por categoría

Mediana de palabras en `<main>`, y objetivo propuesto. Las 50 páginas comerciales.

| Categoría | Páginas | Mediana hoy | Objetivo | Reducción |
|---|---:|---:|---:|---:|
| Home | 1 | 1.665 | 700 | −58 % |
| Plataforma | 17 | 1.222 | 550 | −55 % |
| Precios | 1 | 1.225 | 600 | −51 % |
| Soluciones · caso de uso | 6 | 1.024 | 400 | −61 % |
| Soluciones · rol | 4 | 762 | 400 | −48 % |
| Sectores | 2 | 710 | 400 | −44 % |
| Comparativas `vs-` | 7 | 622 | — | sin cambio |
| Institucional y recursos | 12 | 973 | 500 | −49 % |

**Institucional y recursos** (bloque no priorizado en este plan, revisar tras `E4`): `/blog/` (índice, 1.378), `/faqs/` (1.270), `/sobre-nosotros/` (1.246), `/como-funciona/` (1.166), `/por-que-usar-reelevo/` (1.027), `/onboarding-software-pymes/` (1.020), `/recursos/onboarding-software-pymes/` (919), `/video-demo/` (797), `/recursos/` (636), `/recursos/gestion-competencias-industria/` (333), `/kit-digital-pyme-industrial/` (262), `/recursos/onboarding-vs-tradicional/` (123).

> Nota: `/faqs/` tiene el 91 % de su texto en un solo bloque. No es un defecto — es una página que hace una sola cosa. Sirve de referencia de lo que se busca en el resto.

---

## Anexo II · Presupuesto de palabras por bloque

Para pegar en la cabecera de cada `.astro` mientras se reescribe.

```
PÁGINA DE PLATAFORMA — 550 palabras
  Hero + problema .............  70   (13 %)
  Cómo funciona ............... 240   (44 %)  ← debe dominar
  Qué incluye ................. 120   (22 %)  ← 3 tarjetas, no 6
  Prueba o límite .............  70   (13 %)  ← uno de los dos, no ambos
  Siguiente paso ..............  50   ( 9 %)  ← 1 CTA + máx. 2 enlaces
  FAQ ......................... plegada, fuera del presupuesto

PÁGINA DE CASO DE USO / ROL / SECTOR — 400 palabras
  Hero + problema .............  60
  Cómo se resuelve ............ 180   ← debe dominar
  Prueba concreta .............  90
  Siguiente paso ..............  70
```

---

## Anexo III · Script de medición

Guardar como `scripts/medir-densidad.mjs` y ejecutar tras `npm run build`:

```bash
npm run build && node scripts/medir-densidad.mjs
```

```js
// Mide la densidad editorial de las paginas comerciales sobre el HTML ya
// construido. Ejecutar despues de `npm run build`:
//
//   node scripts/medir-densidad.mjs
//
// Referencia: PLAN_SIMPLIFICACION_EDITORIAL_WEB_2026-08.md (Anexo III).
import fs from 'fs';

const ROOT = 'dist/client';
const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = d + '/' + e.name;
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) files.push(p);
  }
})(ROOT);

const strip = (s) => s
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
  .replace(/<!--[\s\S]*?-->/g, ' ');

const wc = (s) => {
  const t = s.replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ')
             .replace(/\s+/g, ' ').trim();
  return t ? t.split(' ').length : 0;
};

const rows = [];
let glued = 0;

for (const f of files) {
  const url = '/' + f.replace(ROOT + '/', '').replace(/index\.html$/, '');
  if ((url.startsWith('/blog/') && url !== '/blog/') || url.includes('/legal/') || url.includes('404')) continue;

  const html = fs.readFileSync(f, 'utf8');
  const m = html.match(/<main[\s\S]*?<\/main>/i);
  if (!m) continue;
  const main = strip(m[0]);

  // Defecto A1: <br> que pega palabras al extraer texto.
  glued += (main.match(/(\S)<br\b[^>]*>(\S)/gi) || []).length;

  // La FAQ se separa del resto. Va plegada en <details> y la plantilla la deja
  // FUERA del presupuesto visible, asi que no puede entrar en el denominador:
  // si entra, ninguna pagina llega nunca al 40 % del bloque mayor, porque la
  // propia FAQ pasa a ser el bloque mayor.
  const secs = [...main.matchAll(/<section\b[^>]*>([\s\S]*?)<\/section>/gi)]
    .map((x) => ({ w: wc(x[1]), faq: /faq-section|faq-item/.test(x[1]) }))
    .filter((s) => s.w > 0);

  const presu = secs.filter((s) => !s.faq);
  const budget = presu.length ? presu.reduce((a, s) => a + s.w, 0) : wc(main);
  const max = presu.length ? Math.max(...presu.map((s) => s.w)) : wc(main);

  rows.push({
    url,
    dom: wc(main),
    presupuesto: budget,
    secciones: presu.length,
    mayorPct: budget ? Math.round((max / budget) * 100) : 0,
    h3: (main.match(/<h3\b/gi) || []).length,
  });
}

const med = (a) => { const v = [...a].sort((x, y) => x - y); return v[Math.floor(v.length / 2)]; };

rows.sort((a, b) => b.presupuesto - a.presupuesto);
console.table(rows);

console.log('');
console.log('-- Criterios de aceptacion -----------------------');
console.log('Paginas comerciales .............', rows.length);
console.log('Presupuesto visible, mediana ....', med(rows.map((r) => r.presupuesto)), '  (objetivo < 500)');
console.log('Secciones, mediana ..............', med(rows.map((r) => r.secciones)), '  (objetivo 4-5, sin contar FAQ)');
console.log('% bloque mayor, mediana .........', med(rows.map((r) => r.mayorPct)) + ' %', '(objetivo > 40 %)');
console.log('Texto pegado por <br> ...........', glued, '  (objetivo 0)');
console.log('');
console.log('`dom` es todo el texto indexable, e incluye las respuestas de FAQ plegadas.');
console.log('`presupuesto` es lo que ve el lector sin desplegar nada: la base sobre la');
console.log('que esta definida la plantilla de PLANTILLA_PAGINA_COMERCIAL.md.');
```

**Línea base 2026-08-31, antes de tocar nada:** 50 páginas · mediana 1.026 palabras de `<main>` · 8 secciones · bloque mayor 27 % · 141 `<br>` pegados.

**Tras los bloques A y B (2 páginas reescritas de 50):** presupuesto visible mediana 793 · 7 secciones · bloque mayor 30 % · 0 `<br>` pegados. Las medianas apenas se mueven porque solo se han reescrito 2 páginas; el salto llega con los bloques C y D.
