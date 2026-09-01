# Plan de efectos y ritmo visual

> **Propósito:** lista ejecutable de tareas derivadas del análisis de una referencia externa (`agenciascalavip.com`), aplicada al estado real de `reelevo-site`.
>
> **Análisis:** 2026-09-01 · **Estado:** R1-R4 hechas y verificadas en navegador · **4/5 tareas** · última actualización 2026-09-02
>
> **Documento hermano:** `PLAN_SIMPLIFICACION_EDITORIAL_WEB_2026-08.md`, ya cerrado (22/22). Este plan **no toca contenido ni espaciado**: solo efectos, jerarquía visual y accesibilidad.
>
> **Limitación de la fuente:** la referencia se leyó con una herramienta que convierte el HTML a texto y **descarta la cabecera, las hojas de estilo y los scripts**. Es fiable en cuanto a su **estructura** (secciones, orden, contenido de cada bloque) y **no aporta nada sobre su CSS**: ni espaciados, ni tipografías, ni curvas de animación, ni librerías. Nada de lo que sigue afirma cómo son sus efectos; lo que hace es partir de su formato observable y contrastarlo con el código de REELEVO, que sí está verificado.

---

## Índice

1. [Resumen ejecutivo](#1-resumen-ejecutivo)
2. [El formato de la referencia](#2-el-formato-de-la-referencia)
3. [La diferencia que lo condiciona todo](#3-la-diferencia-que-lo-condiciona-todo)
4. [Hallazgo: los efectos están a medio construir](#4-hallazgo-los-efectos-están-a-medio-construir)
5. [Espaciado: por qué no hay nada que traer](#5-espaciado-por-qué-no-hay-nada-que-traer)
6. [Tareas](#6-tareas)
7. [Lo que este plan deliberadamente no incluye](#7-lo-que-este-plan-deliberadamente-no-incluye)
8. [Ficheros afectados](#8-ficheros-afectados)

---

## 1. Resumen ejecutivo

| Tarea | Qué resuelve | Coste | Riesgo |
|---|---|---|---|
| **R1** | `.fade-up` no se dispara al hacer scroll | ~2 h | Bajo |
| **R2** | `prefers-reduced-motion` no cubre las 866 apariciones | ~15 min | Nulo |
| **R3** | Numeración en bloques que no son secuencia | ~1 h | Nulo |
| **R4** | Foco de teclado en tarjetas clicables | ~1 h | Nulo |
| **R5** | No hay prueba social — tarea comercial | semanas | Fuera de código |

**Efectos:** REELEVO ya tiene el marcado para las apariciones al hacer scroll —**866 elementos con `.fade-up`**— pero **no tiene el mecanismo que las dispara**. Todas se animan al cargar la página, así que las de más abajo terminan su animación antes de que nadie las vea.

**Espaciado:** no hay nada que traer. El sitio acaba de pasar a 120 px por sección con 5 secciones de mediana y 68 ch de medida de lectura.

**Organización de contenido:** la referencia es una landing de una sola página con navegación por anclas. Copiarla desharía la arquitectura de 50 URLs que se acaba de ordenar. Lo que sí falta es **prueba social**, y eso no es un problema de diseño.

---

## 2. El formato de la referencia

Nueve bloques en una sola página. Esto sí es observable con fiabilidad:

1. Cabecera con logo y menú horizontal
2. Hero con titular grande y un botón de acción
3. Rejilla de tres columnas **numeradas** (01, 02, 03)
4. Bloque de enfoque: titular, texto y tres sub-bloques
5. Servicios: cuatro tarjetas clicables
6. Casos: galería de miniaturas **con métricas por cliente**
7. Prueba social: **carrusel de logos de cliente, repetido tres veces**
8. CTA con una oferta concreta y viñetas
9. Pie con navegación, servicios, contacto y copyright

La navegación apunta a anclas de la propia página (`#inicio`, `#sobre-nosotros`, `#casos`, `#servicios`), con solo dos salidas a páginas reales. Es el patrón clásico de landing de agencia: **un embudo vertical único**, no un sitio navegable.

---

## 3. La diferencia que lo condiciona todo

| | La referencia | REELEVO |
|---|---|---|
| Tipo | Landing de agencia | Sitio comercial de 50 páginas |
| Navegación | Una página, anclas | 50 URLs con intención propia |
| Entrada del visitante | Siempre por el hero | Por cualquier página |
| SEO | Una URL | 43 páginas emitiendo `FAQPage` |
| Prueba social | Logos y métricas de cliente | **Ninguna** |

**La consecuencia práctica:** aplicar la *organización de contenido* de la referencia significaría concentrar en una página lo que hoy está repartido en cincuenta. Eso **revierte exactamente el trabajo del plan anterior**: la mediana pasó de 1.026 a 503 palabras visibles y el bloque dominante del 27 % al 43 % precisamente por separar intenciones, no por juntarlas.

Lo que sí es transferible son **los efectos y los patrones de bloque**, que no dependen de si el sitio tiene una página o cincuenta.

---

## 4. Hallazgo: los efectos están a medio construir

REELEVO tiene **866 elementos marcados con `.fade-up`** —unos 18 por página—, con clases de retardo escalonado de `.delay-1` a `.delay-5`. Es exactamente el marcado que hace falta para una aparición progresiva al hacer scroll. Pero así está definido:

```css
/* global.css, línea 375 */
.fade-up{opacity:0;animation:fadeUp .7s cubic-bezier(.4,0,.2,1) forwards;}
.delay-1{animation-delay:.1s;} .delay-2{animation-delay:.2s;}
.delay-3{animation-delay:.35s;} .delay-4{animation-delay:.5s;}
```

Es una **animación CSS que arranca al cargar la página**. No hay ningún `IntersectionObserver` en el proyecto —verificado con `grep` sobre `src/`—, así que no se dispara al entrar en pantalla.

En la práctica: los 18 elementos de la página empiezan a animarse a la vez, y los retardos más largos terminan medio segundo después. **Cuando el visitante llega al cuarto bloque, esa animación ocurrió hace veinte segundos.** El efecto solo se ve en lo que cabe en la primera pantalla.

Es decir: **se está pagando el coste del marcado sin recibir el efecto** — y es justo el efecto que la referencia usa para dar ritmo a una página larga.

### Un problema de accesibilidad al lado

El bloque `prefers-reduced-motion` de `global.css` (línea 414) **solo desactiva la animación de entrada del logo**:

```css
@media(prefers-reduced-motion:reduce){
  .entry-splash,.site-shell,.entry-splash__logo-wrap{transition:none;}
  .entry-splash__logo{animation:none;transition:none;}
}
```

No cubre `.fade-up`, así que quien ha pedido al sistema operativo que reduzca el movimiento **sigue recibiendo 866 elementos animados**.

---

## 5. Espaciado: por qué no hay nada que traer

| Parámetro | Valor actual | Comentario |
|---|---:|---|
| Relleno vertical por sección | 120 px | Subido desde 96 px en la tarea `E1` |
| Secciones por página (mediana) | 5 | Bajado desde 8 |
| Relleno vertical total | 1.200 px | Antes 1.536 px, con menos aire por bloque |
| Ancho del contenedor | 1.100 px | Estándar y adecuado |
| Medida de lectura | 68 ch | En el rango cómodo |
| Separación en rejillas | 24 px | Consistente en todo el sitio |
| Cuerpo mínimo | 15,2 px | Suelo aplicado en `A3` y `E3` |
| Etiqueta mínima | 11,2 px | Suelo aplicado en `A3` y `E3` |

**Recomendación: no tocar nada de esto.** Cambiar el espaciado ahora, sin haber visto todavía el efecto de los recortes en los datos, añadiría una variable más a un cambio que aún no se ha medido.

---

## 6. Tareas

### R1 · Disparar `.fade-up` al entrar en pantalla
**Estado:** ✅ hecho (2026-09-02) · **Ficheros:** `src/styles/global.css`, `src/layouts/BaseLayout.astro` · **~2 h**

El estado oculto **solo puede existir si hay JavaScript para revelarlo**. Por eso se marca el documento con una clase `js` antes de pintar, y el `opacity:0` cuelga de ella: sin JS, todo se ve.

**1. Marcar el documento, en el `<head>` de `BaseLayout.astro`,** antes de cualquier CSS que dependa de ello:

```html
<script is:inline>document.documentElement.classList.add('js');</script>
```

**2. Reescribir la regla en `global.css`:**

```diff
- .fade-up{opacity:0;animation:fadeUp .7s cubic-bezier(.4,0,.2,1) forwards;}
+ /* Sin JS el contenido se ve: el estado oculto cuelga de .js, que solo
+    existe si el observador puede revelarlo despues. */
+ .js .fade-up{opacity:0;}
+ .js .fade-up.is-visible{animation:fadeUp .7s cubic-bezier(.4,0,.2,1) forwards;}
```

Las clases `.delay-1` a `.delay-5` no cambian: siguen siendo `animation-delay` y ahora escalonan la entrada de cada grupo al revelarse.

**3. El observador, al final de `BaseLayout.astro`:**

```html
<script>
  const els = document.querySelectorAll('.fade-up');

  if (!('IntersectionObserver' in window)) {
    // Navegador sin soporte: se muestra todo de golpe, sin animar.
    els.forEach((el) => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add('is-visible');
          io.unobserve(e.target); // una sola vez: no se repite al subir
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 }
    );
    els.forEach((el) => io.observe(el));
  }
</script>
```

El `rootMargin` negativo hace que la animación arranque cuando el elemento ya ha entrado un poco, no justo al asomar el primer píxel.

**Verificación:**
- Con JS desactivado, una página cualquiera se ve completa.
- Con `prefers-reduced-motion` activo, no hay animación (ver `R2`).
- Al recargar a media página, lo que está en pantalla aparece; lo de más abajo espera.
- `npm run build` sin errores y `node scripts/medir-densidad.mjs` sin cambios: esta tarea no toca contenido.

---

### R2 · Respetar `prefers-reduced-motion` en las 866 apariciones
**Estado:** ✅ hecho (2026-09-02) · **Fichero:** `src/styles/global.css` · **~15 min**

```diff
  @media(prefers-reduced-motion:reduce){
    .entry-splash,.site-shell,.entry-splash__logo-wrap{transition:none;}
    .entry-splash__logo{animation:none;transition:none;}
+   .js .fade-up,
+   .js .fade-up.is-visible{opacity:1;animation:none;transform:none;}
  }
```

Va junto a `R1`: sin esto, activar el disparo por scroll empeoraría la experiencia de quien pidió menos movimiento.

---

### R3 · Quitar la numeración de lo que no es una secuencia
**Estado:** ✅ hecho (2026-09-02) · **~1 h**

La referencia numera su rejilla de tres columnas y hace bien: son pasos. REELEVO también numera correctamente sus bloques de flujo —los cuatro pasos de «Cómo funciona» llevan `.flow-num`— pero **numera además cosas que no van en orden**: las tarjetas de «Qué incluye» de las páginas de plataforma llevan un círculo naranja con 1, 2, 3 (`.cell-number`) cuando son tres capacidades paralelas.

Numerar lo que no es secuencia le dice al lector algo falso sobre el contenido.

**Mantener la numeración** donde sí hay orden real: los pasos de «Cómo funciona», las cronologías (`.timeline`) y el flujo de `/modo-offline/`.

**Sustituir** `.cell-number` por un icono, una etiqueta corta o nada. Verificado: está en **5 páginas**, no en las 17 de plataforma — `control-produccion`, `gestion-competencias`, `kaizen`, `mantenimiento` y `obras-trazabilidad`. En el resto las rejillas ya usan otro patrón.

---

### R4 · Auditar estados de foco de teclado en tarjetas clicables
**Estado:** ✅ hecho (2026-09-02), con el alcance ampliado · **~1 h**

Hay tarjetas que son enlaces enteros con efecto de ratón:

| Selector | Página | Estado |
|---|---|---|
| `.module-cell` | `/software-gestion-pyme-industrial/` — 8 módulos, con `transform` al pasar el ratón | ❌ sin `:focus-visible` |
| `.problema-card` | `/por-que-usar-reelevo/` — 9 tarjetas de problema | ❌ sin `:focus-visible` |

**Verificado por `grep`: ninguna de las dos lo tiene.** Ambas son enlaces que envuelven la tarjeta entera, así que quien navega con teclado las recorre sin ninguna señal visual de dónde está. Es la parte de «efectos» que suele quedarse fuera porque solo se prueba con ratón.

`.cross-card` ya no existe: desapareció con las secciones «Sigue explorando» que se eliminaron en los bloques `C` y `D`.

---

### R5 · Conseguir prueba social — tarea comercial, no de diseño
**Estado:** ⬜ pendiente · **semanas · fuera de código**

Es la diferencia estructural más grande con la referencia, que dedica **dos bloques enteros** —galería de casos con métricas y carrusel de logos repetido tres veces— a demostrar que otros ya han confiado.

**REELEVO no tiene ni un logo de cliente, ni un testimonio, ni una métrica de resultado en todo el sitio.** Y no es un descuido: hay **cuatro descargos explícitos** del tipo «escenario ilustrativo, no un caso medido en un cliente», y una sección de caso real comentada en `para-quien/jefe-de-produccion.astro` con el texto «Próximamente». La honestidad está siendo deliberada y bien llevada.

**La tarea es comercial:** conseguir que dos o tres clientes autoricen su logo y una cifra verificable. Cuando existan, el bloque se monta en un par de horas y encaja entre el bloque dominante y el CTA de cierre.

**Hasta entonces, mantener los descargos actuales.** Son un activo, no una carencia: dicen al lector que las cifras que sí se publiquen serán ciertas.

---

## 7. Lo que este plan deliberadamente no incluye

| Patrón de la referencia | Veredicto | Motivo |
|---|---|---|
| Página única con navegación por anclas | **No** | Concentraría en una URL lo que hoy son 50 con intención propia. Revierte los bloques `C` y `D` del plan anterior. |
| Carrusel automático de logos, repetido 3 veces | **No** | Sin logos que poner no hay nada que rotar. Y un carrusel que se mueve solo es hostil con `prefers-reduced-motion`. |
| Métricas grandes tipo «4M · 242K · 564» | **Solo si son reales** | REELEVO viene marcando explícitamente lo que es estimación. Poner cifras sin dato detrás rompe esa coherencia. |
| Cambios de espaciado | **No** | Ver [§5](#5-espaciado-por-qué-no-hay-nada-que-traer). |
| Efectos nuevos más allá de arreglar el existente | **No** | Ver abajo. |

> **Por qué no se añade una segunda capa de cambios ahora.** El sitio acaba de pasar por una reescritura de 32 páginas cuyos resultados **aún no se han medido** en Search Console ni en GA4. Añadir ahora efectos y reorganización haría imposible saber cuál de las dos causó qué. `R1` y `R2` son la excepción razonable porque **arreglan algo roto sin alterar contenido**, y su efecto es de experiencia, no de posicionamiento.

---

## 8. Ficheros afectados

| Fichero | Tareas | Naturaleza del cambio |
|---|---|---|
| `src/styles/global.css` | R1, R2 | Regla `.fade-up` y bloque `prefers-reduced-motion` |
| `src/layouts/BaseLayout.astro` | R1 | Marca `js` en el `<head>` y observador al final |
| 5 páginas: `control-produccion`, `gestion-competencias`, `kaizen`, `mantenimiento`, `obras-trazabilidad` | R3 | Quitar `.cell-number` de las rejillas «Qué incluye» |
| `src/pages/software-gestion-pyme-industrial.astro` | R4 | `:focus-visible` en `.module-cell` |
| `src/pages/por-que-usar-reelevo.astro` | R4 | `:focus-visible` en `.problema-card` |
| `src/pages/**` | — | **Sin cambios de contenido.** Ninguna tarea toca copy. |

---

## 9. Cierre de R1-R4

Ejecutado el 2026-09-02 y **verificado en navegador real** (Chrome del sistema vía Playwright), que era la comprobación que faltaba en todo el trabajo anterior.

### Comportamiento medido en `/mantenimiento/` (18 elementos `.fade-up`)

| Escenario | Resultado |
|---|---|
| Al cargar, sin hacer scroll | **5 de 18** revelados — solo lo que cabe en pantalla |
| Bajando por la página | 5 → 6 → 9 → 13 → **18** a 900, 1800, 2700 y 3600 px |
| **Sin JavaScript** | **0 ocultos** — la página se ve entera |
| **Con `prefers-reduced-motion`** | **0 ocultos**, sin animación |
| Foco de teclado | `outline: 2px solid rgb(244, 82, 30)` |

Antes del cambio, los 18 se animaban a la vez al cargar.

### R4 resultó más amplio de lo previsto

El plan hablaba de dos selectores de tarjeta. Al mirarlo, **`:focus-visible` solo existía para el menú de cabecera**: el resto del sitio —botones, enlaces de contenido, tarjetas clicables— se quedaba con el contorno por defecto del navegador, que sobre fondo casi negro es invisible. El propio `global.css` ya lo decía en un comentario, pero solo se había resuelto para la navegación.

Se resolvió con **una regla global** para `a`, `button`, `summary` y `[tabindex]`, en vez de parchear dos selectores.

### Defecto encontrado al mirar las capturas

La captura del bloque «Qué incluye» destapó que las líneas de enlaces se leían **«producción,responsable de calidad,gerente»**, sin espacios. Es el mismo colapso de espacios en blanco que causó el problema de los `<br>` en la tarea `A1` del plan anterior: Astro elimina el salto de línea entre el separador y la etiqueta `<a>` siguiente.

**64 ocurrencias en 27 páginas**, unas introducidas por mí al añadir los enlaces internos en los bloques `C` y `D`, otras anteriores. Corregidas poniendo separador y enlace en la misma línea, donde el espacio sí sobrevive al build. **Quedan 1**, un `—<a>` en una entrada del blog que en tipografía española es aceptable.

> Vale la pena anotarlo como patrón del proyecto: **en Astro, un salto de línea entre texto y una etiqueta en línea desaparece**. Afecta a `<br>`, a `<a>` y a cualquier elemento en línea. Si el espacio importa, tiene que estar en la misma línea.

### Lo que no se tocó

Ni una palabra de copy, ni un valor de espaciado. La medición del plan anterior sigue idéntica: presupuesto visible mediana **503**, bloque mayor **43 %**, `<br>` pegados **0**.
