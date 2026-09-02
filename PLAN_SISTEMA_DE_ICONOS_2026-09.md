# Plan de sistema de iconos

> **Propósito:** sustituir los emoji que hoy se usan como icono por un set SVG propio, con el mismo trazo que los iconos del mapa de plataforma de la home, y añadir una animación de entrada acotada al bloque dominante de cada página.
>
> **Diagnóstico:** 2026-09-02 · **Ejecutado:** 2026-09-02 · **Estado:** cerrado · **7/7 tareas**
>
> **Origen:** el mapa de la home (`PlatformMap.astro`) ya usa un set SVG propio que funciona bien. Este plan lo extiende al resto del sitio.
>
> **Planes hermanos:** `PLAN_SIMPLIFICACION_EDITORIAL_WEB_2026-08.md` (cerrado, 22/22) y `PLAN_EFECTOS_Y_RITMO_VISUAL_2026-09.md` (4/5). Este plan **no toca copy, ni estructura, ni espaciado**.

---

## Índice

1. [Resumen ejecutivo](#1-resumen-ejecutivo)
2. [Diagnóstico medido](#2-diagnóstico-medido)
3. [La especificación del icono](#3-la-especificación-del-icono)
4. [La decisión sobre animación](#4-la-decisión-sobre-animación)
5. [El set y el mapeo completo](#5-el-set-y-el-mapeo-completo)
6. [Tareas](#6-tareas)
7. [Cómo verificar](#7-cómo-verificar)
8. [Ficheros afectados](#8-ficheros-afectados)

---

## 1. Resumen ejecutivo

| Tarea | Qué resuelve | Coste | Riesgo |
|---|---|---|---|
| **I1** | Componente `Icon.astro` con la especificación del mapa | ~1 h | Nulo |
| **I2** | Dibujar los 18 iconos del set | ~2 h | Nulo |
| **I3** | Unificar las 23 clases contenedoras en una | ~1 h | Bajo |
| **I4** | Animación de trazado en el bloque dominante | ~1 h | Bajo |
| **I5** | Sustituir los 22 emoji recurrentes | ~1 h | Bajo |
| **I6** | Decidir uno a uno los 32 de uso único | ~1,5 h | Bajo |
| **I7** | Retirar el CSS de las clases viejas | ~30 min | Nulo |

**El problema:** hay **113 emoji usados como icono** en 27 ficheros, con **54 emoji distintos**, metidos en **23 clases contenedoras** con **7 tamaños diferentes** para lo mismo. Un emoji se dibuja distinto en cada sistema operativo, así que el sitio se ve diferente según quién lo abra, y su estilo multicolor choca con la identidad industrial del resto.

**Lo que no se toca:** los **270 `→` y `✓`** del sitio. No son iconos: van dentro del texto de un enlace o como viñeta de una lista. Son tipografía y se quedan.

---

## 2. Diagnóstico medido

### Volumen

| | |
|---|---:|
| Emoji pictóricos usados como icono | **113** |
| Emoji distintos | **54** |
| Ficheros afectados | **27** |
| Clases contenedoras distintas | **23** |
| Tamaños distintos para lo mismo | **7** (de 1,5 a 3 rem) |
| Flechas y checks tipográficos (**no se tocan**) | 270 |

### Distribución: una cola muy larga

| Frecuencia | Cuántos | Cuáles |
|---|---:|---|
| 3 o más usos | **11** | 📊13 📱7 📋6 🎯6 👤5 💰4 🔄4 💡4 🏭4 📈3 🔧3 |
| 2 usos | **11** | 📵 📚 🔑 👷 🎓 👨 🔒 📄 📶 📞 💼 |
| 1 uso | **32** | 👥 🛠 🏅 🎥 🏢 🔩 🔓 🛡 🔍 📸 🔎 🔁 🗂 🚗 🍕 🚨 😰 🤷 📉 🧠 🗓 🔌 🧱 🤝 💾 📖 🏫 💻 📏 👁 🏁 📝 |

**22 emoji cubren 60 de los 113 usos.** Los 32 restantes aparecen una sola vez, y varios son relleno decorativo sin significado operativo (🍕, 🚗, 🤷, 😰). Por eso el set no necesita 54 iconos.

### Los 7 tamaños actuales

| Tamaño | Clases |
|---|---|
| 3 rem | `exec-icon`, `coming-soon-icon`, `traditional-icon` |
| 2,5 rem | `problem-icon`, `feature-icon`, `tool-icon`, `recurso-icon` |
| 2,2 rem | `benefit-card-icon` |
| 2 rem | `solution-icon`, `dimension-icon`, `pilot-icon`, `scalability-icon`, `ceo-metric-icon` |
| 1,8 rem | `os-icon` |
| 1,6 rem | `feature-icon`, `pbi-icon`, `access-icon` |
| 1,5 rem | `hc-icon`, `cert-step-icon`, `value-icon` |

---

## 3. La especificación del icono

La que ya usa `PlatformMap.astro` y funciona:

```html
<svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
  <path d="…" stroke="currentColor" stroke-width="1.5"
        stroke-linecap="round" stroke-linejoin="round" />
</svg>
```

| Propiedad | Valor | Por qué |
|---|---|---|
| `viewBox` | `0 0 32 32` | Rejilla que ya usan los cuatro iconos del mapa |
| `stroke` | `currentColor` | El color lo pone el contenedor, no el icono |
| `fill` | `none` | Trazo puro, coherente con la identidad |
| `stroke-width` | `1.5` | Mismo peso óptico que el texto en Oswald |
| `stroke-linecap/join` | `round` | Suaviza los extremos sin redondear la forma |
| `aria-hidden` | `true` | Decorativo: el lector de pantalla no debe leerlo |

**Dos tamaños, no siete:** 24 px para iconos dentro de listas y filas, 32 px para los de tarjeta.

---

## 4. La decisión sobre animación

La duda inicial fue si animar o no. La respuesta no es «todo o nada», porque **62 de los 103 iconos de páginas comerciales ya están en el bloque dominante** de su página, con una media de 3-4 por bloque — justo la misma cantidad que en el mapa de la home.

### Tres niveles

| Nivel | Dónde | Qué hace | Cuántos |
|---|---|---|---:|
| **Firma** | Solo el mapa de la home | Anillo punteado girando (`pmapSpin 34s`), como ahora | 4 |
| **Destaque** | Bloque dominante de cada página | El icono **se dibuja solo** al entrar en pantalla. Una vez. | ~62 |
| **Neutro** | Bloques secundarios | Estático | ~41 |

### Ambiente frente a entrada

El anillo del mapa es **animación ambiente**: gira siempre. Funciona porque aparece cuatro veces en un solo bloque. Repetido por todo el sitio dejaría de destacar nada, porque todo se movería a la vez.

La del bloque dominante es **animación de entrada**: ocurre una vez y para. Da el énfasis y devuelve la página al reposo.

### Por qué el trazado y no otra cosa

Para un icono de línea, `stroke-dasharray` + `stroke-dashoffset` hace que **la línea se dibuje sola**, como si alguien la trazara. Es el gesto propio de este estilo, no un efecto pegado encima.

Y el mecanismo ya existe: el `IntersectionObserver` de la tarea `R1` revela los bloques al entrar en pantalla. Esto reutiliza esa misma señal.

### Dos condiciones

1. **`prefers-reduced-motion` lo desactiva**, igual que en `R2`.
2. **Escalonado de 60-80 ms** entre los iconos de un mismo bloque, para que se lea como secuencia y no como parpadeo.

> **Aviso de rendimiento:** `stroke-dashoffset` no se anima en el compositor como `transform`, así que corre en el hilo principal. Con 3-4 iconos por bloque y una sola vez es irrelevante. Es otra razón para no extenderlo a los 103.

### Dónde caen hoy los iconos

| Página | En bloque dominante | En bloques secundarios |
|---|---:|---:|
| `/para-quien/jefe-de-produccion/` | 13 | 3 |
| `/como-funciona/` | 6 | 3 |
| `/casos-de-uso/onboarding-operarios/` | 4 | 0 |
| `/casos-de-uso/personal-ett/` | 4 | 0 |
| `/casos-de-uso/transferencia-conocimiento/` | 4 | 0 |
| `/consistencia-entre-turnos/` | 4 | 0 |
| `/errores-en-planta/` | 4 | 0 |
| `/documentacion-procesos/` | 3 | 0 |
| `/integracion-m365/` | 3 | 0 |
| `/modo-offline/` | 3 | 0 |
| `/para-quien/responsable-rrhh/` | 3 | 0 |
| `/sobre-nosotros/` | 3 | 3 |
| **Total** | **62** | **41** |

---

## 5. El set y el mapeo completo

18 iconos cubren los 54 emoji. La columna «sustituye a» es el mapeo que hay que aplicar.

| # | Icono | Sustituye a | Usos |
|---|---|---|---:|
| 1 | `documento` | 📋 📄 📝 📖 | 10 |
| 2 | `grafica` | 📊 📈 📉 | 17 |
| 3 | `movil` | 📱 | 7 |
| 4 | `diana` | 🎯 | 6 |
| 5 | `persona` | 👤 👨 👷 | 9 |
| 6 | `equipo` | 👥 🤝 | 2 |
| 7 | `fabrica` | 🏭 🏢 🏫 | 6 |
| 8 | `ciclo` | 🔄 🔁 | 5 |
| 9 | `idea` | 💡 🧠 | 5 |
| 10 | `herramienta` | 🔧 🛠 | 4 |
| 11 | `dinero` | 💰 💼 | 6 |
| 12 | `candado` | 🔒 🔓 🛡 | 4 |
| 13 | `llave` | 🔑 | 2 |
| 14 | `formacion` | 🎓 📚 | 4 |
| 15 | `conexion` | 📶 📵 🔌 | 5 |
| 16 | `lupa` | 🔍 🔎 👁 📸 | 4 |
| 17 | `maquina` | 🔩 🧱 💻 💾 📏 | 5 |
| 18 | `alerta` | 🚨 😰 🤷 | 3 |

**Sin icono, se resuelven de otra forma** (tarea `I6`):

| Emoji | Dónde | Qué hacer |
|---|---|---|
| 🍕 🚗 | Ejemplos de coste en `/precios/` y similares | Quitar: son relleno decorativo sin significado operativo |
| 🎥 | Enlace a demo | Ya hay un CTA de vídeo al lado; el emoji sobra |
| 🏅 🗓 🗂 🏁 📞 | Usos sueltos | Decidir uno a uno: mapear al set o quitar |

---

## 6. Tareas

### I1 · Componente `Icon.astro`
**Estado:** ✅ hecho · **Fichero nuevo:** `src/components/Icon.astro` · **~1 h**

Un componente que recibe `name` y `size` y emite el SVG con la especificación de §3.

```astro
---
export interface Props {
  /** Nombre del set. Ver ICONS en este mismo fichero. */
  name: string;
  /** 24 en filas y listas, 32 en tarjetas. */
  size?: 24 | 32;
  class?: string;
}
---
```

Los paths van en un objeto `ICONS` en el frontmatter del propio componente, **un solo origen**, igual que se hizo con la navegación en `Header.astro` (tarea `E2`).

Si `name` no existe, lanzar error en build — el mismo patrón que ya usa `Screenshot.astro`, que evita que un nombre mal escrito llegue a producción en silencio.

---

**Al cerrarla:** `src/components/Icon.astro`, 20 iconos. Un nombre desconocido rompe el build, igual que `Screenshot.astro`.

### I2 · Dibujar los 18 iconos
**Estado:** ✅ hecho · **~2 h**

Los 18 de §5, en rejilla de 32×32 y trazo de 1,5. Referencia de estilo: los cuatro que ya existen en `PlatformMap.astro` (documento, portal, gráfica y ciclo), que **deben reutilizarse tal cual** para que el mapa y el resto del sitio no diverjan.

---

**Al cerrarla:** Salieron **20**, no 18: `video` y `telefono` aparecieron al revisar los de uso único. Los cuatro del mapa de plataforma (`documento`, `portal`, `grafica`, `ciclo`) están copiados tal cual para que el mapa no diverja del resto.

### I3 · Unificar las 23 clases contenedoras
**Estado:** ✅ hecho · **~1 h**

Una sola clase `.icon` con dos modificadores de tamaño, sustituyendo a las 23 actuales con sus 7 tamaños. El color lo hereda por `currentColor` del bloque donde vive.

---

**Al cerrarla:** Una sola clase `.icon` con el color y `.icon--24` para el tamaño de fila. Las 23 clases contenedoras se quedan solo con su `margin-bottom`.

### I4 · Animación de trazado en el bloque dominante
**Estado:** ✅ hecho · **~1 h**

Con `stroke-dasharray` y `stroke-dashoffset`, disparada por la clase `.is-visible` que ya coloca el `IntersectionObserver` de la tarea `R1`.

- Solo en iconos dentro del bloque dominante.
- Escalonado de 60-80 ms entre los iconos de un mismo bloque.
- `prefers-reduced-motion` lo desactiva, junto al bloque que ya cubre `.fade-up`.

---

**Al cerrarla:** **54 iconos en 15 páginas**, solo los del bloque dominante; los 24 de bloques secundarios se quedan quietos. El escalonado de 70 ms no se puede sacar en CSS —los iconos cuelgan de tarjetas a profundidades distintas, así que `nth-child` no vale— y lo pone el propio observador en `--icon-delay`. Si el JS no llega, el valor por defecto es `0s`: se pierde el escalonado, no el icono.

### I5 · Sustituir los 22 emoji recurrentes
**Estado:** ✅ hecho · **~1 h**

Los de 2 o más usos: 60 sustituciones sobre el mapeo de §5. Mecánico.

---

**Al cerrarla:** 64 emoji sustituidos en 20 ficheros.

### I6 · Decidir uno a uno los 32 de uso único
**Estado:** ✅ hecho · **~1,5 h**

Aquí hay criterio, no sustitución automática. Para cada uno: ¿aporta significado o es relleno? Si aporta, se mapea al set; si no, se quita. **No inventar iconos nuevos para casos únicos.**

---

**Al cerrarla:** 13 más que el barrido de I5 no vio, porque `✅ ❌ ⚡ ⏱️ ✓ 🇪🇺` están en un bloque Unicode distinto al que buscaba. Otros 10 sueltos en texto. Se conservan 9 a propósito (ver abajo).

### I7 · Retirar el CSS de las clases viejas
**Estado:** ✅ hecho · **~30 min**

Las 23 clases con sus 7 tamaños, una vez no queden usos. Se suma a las **249 clases sin usar** que ya arrastran los estilos locales.

---

**Al cerrarla:** 20 reglas con `font-size` inerte: era el tamaño del emoji, que es texto, y no hace nada sobre un `<svg>` con `width` propio.

## 7. Cómo verificar

| Comprobación | Cómo |
|---|---|
| No quedan emoji como icono | `grep` del rango pictórico en `src/`, excluyendo `<style>` |
| Las flechas y checks siguen intactos | El recuento de `→` y `✓` debe seguir en 270 |
| No hay nombres de icono inválidos | El build falla solo si `Icon.astro` lanza en nombre desconocido |
| El trazado solo en el bloque dominante | Contar `.icon--draw` por sección en `dist/` |
| Sin JavaScript los iconos se ven | Playwright con `javaScriptEnabled: false` |
| `prefers-reduced-motion` los deja quietos | Playwright con `reducedMotion: 'reduce'` |
| Nada de contenido ha cambiado | `node scripts/medir-densidad.mjs` sin variación |

---

## 8. Ficheros afectados

| Fichero | Tareas | Cambio |
|---|---|---|
| `src/components/Icon.astro` | I1, I2 | Nuevo: componente y los 18 paths |
| `src/styles/global.css` | I3, I4, I7 | Clase `.icon`, animación de trazado, retirada de las viejas |
| 27 ficheros de `src/pages` | I5, I6 | Sustitución de emoji por `<Icon>` |
| `src/components/PlatformMap.astro` | I2 | Sus 4 iconos pasan a salir del set compartido |
| — | — | **Sin cambios de copy, estructura ni espaciado** |

---

## 9. Lo que este plan no incluye

| | Motivo |
|---|---|
| Tocar los 270 `→` y `✓` | Son tipografía dentro del texto, no iconos |
| Anillo giratorio fuera de la home | Es la firma del mapa; repetirlo lo devalúa |
| Animar los 103 iconos | 41 están en bloques secundarios: animarlos anula el destaque de los otros 62 |
| Una librería de iconos externa | 18 iconos en línea pesan menos que cualquier dependencia, y así el trazo es propio |

---

## 10. Cierre — lo que quedó y lo que no

**Ejecutado el 2026-09-02.** Verificado en Chrome sobre el build de producción:
78 iconos en 20 páginas, 54 con trazado, **0 incidencias** (ninguno sin dibujar,
sin color ni a medio trazo). Comprobados los tres estados: trazado progresivo
escalonado a 0/70/140 ms, sin JavaScript (el icono se ve entero) y con
`prefers-reduced-motion` (sin animación, icono entero).

### Los 9 emoji que se conservan, y por qué

| Dónde | Cuál | Motivo |
|---|---|---|
| `kaizen.astro` | 💡 | Cita literal del botón de la app: «💡 Proponer mejora». Cambiarlo sería describir mal el producto. |
| `para-quien/jefe-de-produccion.astro` | ⚠️ ✅ ✅ ❓ | Están dentro de la maqueta del panel de producción: representan la pantalla del producto, no son iconos de la web. |
| `Icon.astro`, `kit-digital-pyme-industrial.astro` | 📊 ⚠️ | En comentarios de código. No se renderizan. |

### Un fallo anterior que salió al verificar

No es de este plan sino de **R1** (`PLAN_EFECTOS_Y_RITMO_VISUAL_2026-09.md`), pero
se arregló aquí porque lo destapó la verificación de los iconos.

El observador solo revela lo que ve *entrar* en la vista. Con un salto
instantáneo —llegar por un ancla, pulsar Fin, o que el navegador restaure la
posición al volver atrás— los bloques que quedan por encima nunca llegan a
entrar y se quedaban en `opacity: 0` **para siempre**. Medido en
`/como-funciona/`: **8 de 24 bloques invisibles**. Ahora 0.

El arreglo es un barrido que revela lo que ya ha pasado de largo
(`getBoundingClientRect().bottom < 0`), enganchado al scroll con
`requestAnimationFrame` y ejecutado también al cargar. Afectaba a todo
`.fade-up`, no solo a los iconos.

### Fuera de alcance, a propósito

- **El blog.** Sus páginas siguen con emoji. En `blog/onboarding-software-pymes.astro`
  llegué a quitarle el `font-size` sin querer —comparte nombre de clase con una
  página comercial— y lo revertí: sus iconos siguen siendo emoji y necesitan ese
  tamaño.
- **`.step-card-icon` y `.perfil-card-icon`** en `global.css`: huérfanas, no las
  usa nadie. Van con la limpieza general de clases sin uso, no con esto.

### Una página que se revirtió: `workflows.astro`

El mapeo automático la trató como al resto y se equivocó. Su array `nodos` no es
decoración: es la **leyenda de tipos de nodo** de un editor de flujos, donde cada
glifo existe para distinguir un tipo del siguiente. Al mapearla al set, 17 tipos
quedaron en ~10 iconos con duplicados — `diana` servía a la vez para «Inicio»,
«Checkpoint» y «Fin» —, y una leyenda donde el inicio y el fin se ven igual está
peor que antes de tocarla.

Además, la mitad de esos glifos (`●` `▶` `◆` `↺` `✓`) no son emoji sino notación
de diagrama: el rombo de decisión y el círculo de inicio se ven igual en todos
los sistemas, que era justo el problema que este plan venía a resolver.

Revertida entera. La regla que deja: **el set sustituye iconos decorativos, no
vocabularios donde cada símbolo tiene que ser distinto del resto.**
