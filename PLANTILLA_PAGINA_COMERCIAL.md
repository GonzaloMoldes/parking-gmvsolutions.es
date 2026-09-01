# Plantilla de página comercial

> Referencia editorial para escribir y recortar páginas comerciales de `reelevo-site`.
> Sale del diagnóstico de `PLAN_SIMPLIFICACION_EDITORIAL_WEB_2026-08.md` (tarea `B1`).
>
> **No aplica al blog.** Los artículos tienen 2.385 palabras de media y esa longitud está justificada: hay intención de lectura y objetivo SEO propio.

---

## 1. La regla

Cada página comercial responde a **una sola pregunta, de un solo lector, en un solo momento**. Todo lo que no sirva a esa pregunta **se enlaza, no se explica**.

Antes de escribir o de conservar una sección, respóndete:

1. ¿Quién llega aquí y qué acaba de buscar?
2. ¿Qué tiene que entender para dar el siguiente paso?
3. ¿Cuál es ese siguiente paso, y es uno solo?

Si una sección no ayuda a 1, 2 o 3, se va: a otra página que ya existe, a la FAQ plegada, o fuera.

---

## 2. El presupuesto de palabras

El porcentaje no es decorativo. Es la jerarquía: **un bloque tiene que dominar**. Si todos los bloques miden lo mismo, el lector no sabe cuál era el argumento.

### Página de plataforma — 550 palabras

| Bloque | Palabras | % | Trabajo que hace |
|---|---:|---:|---|
| Hero + problema | 70 | 13 % | H1, una frase de dolor, el CTA. **El problema no es sección propia.** |
| **Cómo funciona** | **240** | **44 %** | Los 4 pasos, con captura real. Es el motivo de existir de la página. |
| Qué incluye | 120 | 22 % | **3 capacidades, no 6.** Las otras se enlazan. |
| Prueba o límite | 70 | 13 % | Un caso concreto **o** el encaje honesto. Uno de los dos, no ambos. |
| Siguiente paso | 50 | 9 % | Un CTA y **máximo 2** enlaces relacionados. |
| FAQ | — | — | Plegada en `<details>`. Fuera del presupuesto visible. |

### Página de caso de uso, rol o sector — 400 palabras

| Bloque | Palabras | % |
|---|---:|---:|
| Hero + problema | 60 | 15 % |
| **Cómo se resuelve** | **180** | **45 %** |
| Prueba concreta | 90 | 23 % |
| Siguiente paso | 70 | 17 % |

---

## 3. Qué se elimina, y a dónde va

Estos cuatro bloques venían de la plantilla antigua de ocho secciones. Ninguno desaparece del sitio: **cambian de sitio**.

| Se elimina de la página | Va a |
|---|---|
| «Lo que cambia para cada perfil» (6 subtítulos) | 3 enlaces a `/para-quien/`, que ya lo cubren mejor y con URL indexable propia |
| «Enfoque prudente» / «Límites y alcance» (140 palabras) | Una línea en el hero, o una entrada de FAQ |
| «Funcionalidades» de 6 tarjetas | 3 tarjetas. Las otras 3 rara vez son el motivo de compra |
| «Lo que nos diferencia» (tabla comparativa) | `/vs-alternativas/`, o una entrada de FAQ si el argumento es específico de esa página |

**Antes de borrar un H2, comprueba en Search Console si tiene impresiones propias.** Si las tiene, el contenido debe sobrevivir en la página destino del enlace, no desaparecer.

---

## 4. Qué NO se toca

- **El `<title>`, la `description` y el `canonical`.** El recorte es de cuerpo, no de metadatos.
- **El H1.** Es el que posiciona.
- **La lista `faqs`.** Alimenta a la vez el bloque visible y el `FAQPage` JSON-LD (`faqPageSchema()`). Si quitas una pregunta, la quitas de los dos sitios a la vez, que es justo lo que se quiere.
- **La cobertura de palabras clave.** Antes de dar una página por cerrada, comprueba que los términos que traían tráfico siguen apareciendo en el cuerpo. Recortar no es perder vocabulario.
- **Las tarjetas de navegación en páginas hub.** En `/por-que-usar-reelevo/` las 9 tarjetas de problema *son* la función de la página, no ruido de CTA.

---

## 5. Reglas de forma

- **Un CTA de conversión por bloque de cierre, y como mucho dos bloques por página.** Tres bloques de conversión casi idénticos es el patrón que había que quitar.
- **Nada de `text-align:center` en párrafos de varias líneas.** Centrado solo en hero, CTA y cifras sueltas.
- **Los párrafos sin clase ya están limitados a 68ch** por `global.css`. No hace falta hacer nada, pero tampoco los metas en un contenedor que rompa esa medida.
- **Cuerpo mínimo 15px** (`.95rem`). Las etiquetas, mínimo 11px (`.7rem`).
- **Espacio antes de cada `<br>`.** Sin él, el build de Astro pega las palabras y los extractores de texto leen «plantasin complejidad». Ver tarea `A1`.

---

## 6. Checklist antes de dar una página por cerrada

- [ ] ¿Está por debajo del presupuesto de palabras de su tipo?
- [ ] ¿Hay un bloque que se lleva el 40 % o más del texto?
- [ ] ¿Hay 5 secciones o menos?
- [ ] ¿La FAQ está plegada y sigue alimentando el JSON-LD?
- [ ] ¿Sobreviven los términos de búsqueda que traían tráfico?
- [ ] ¿Hay un solo siguiente paso, repetido como mucho dos veces?
- [ ] ¿Pasa el script del Anexo III del plan con `npm run build`?
