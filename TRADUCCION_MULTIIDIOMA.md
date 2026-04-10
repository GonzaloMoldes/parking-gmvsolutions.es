# 📚 Sistema de Traducción Multiidioma - REELEVO

Fecha: 2026-04-10  
Idiomas: ES (principal) → EN + PT  
Método: Híbrido (Automático + Manual Selectivo)

---

## 🎯 Visión General

La web se traduce a **3 idiomas**: **Español** (principal), **Inglés**, **Portugués**.

**Problema identificado**: Traducciones automáticas literales del español no funcionan bien en contexto industrial SME. Términos como "operario", "baja", "tutor", etc. pierden significado o suenan corporativos/anticuados en EN/PT.

**Solución**: Sistema híbrido
- **Automático**: Páginas técnicas, FAQ, configuración
- **Manual**: Home + 3 artículos de blog clave
- **Glosario**: Diccionario de 70+ términos con contexto y reglas

---

## 📁 Nueva Estructura de Archivos

```
src/locales/
  ├── glossary.json              # 70+ términos con EN/PT por contexto
  ├── translations-manual.mjs    # Traducciones manuales (Home + helper)
  ├── translation-strategy-blog.mjs # Estrategia traducción blog
  └── blog-translations/
      ├── que-es-un-sop-industrial.en.astro
      ├── que-es-un-sop-industrial.pt.astro
      ├── onboarding-software-pymes.en.astro
      ├── onboarding-software-pymes.pt.astro
      ├── documentar-conocimiento-operarios-expertos.en.astro
      └── documentar-conocimiento-operarios-expertos.pt.astro
```

---

## 🔑 Glosario (glossary.json)

Estructura de cada término:

```json
{
  "operario": {
    "es": "Operario",
    "en": {
      "default": "Machine Operator",
      "formal": "Production Operator",
      "short": "Operator"
    },
    "pt": {
      "default": "Operador",
      "formal": "Operador de máquina"
    },
    "context": "Descripción de cuándo y por qué cada variación",
    "usage": "Dónde aparece en la web",
    "avoid": "Variaciones a NO usar",
    "doNotTranslateLiteral": true,  // Opcional: si necesita adaptación
    "expand": "Si es acrónimo, expansión necesaria"
  }
}
```

### Términos Críticos (No traducir literal):

| ES | NO Traducir Literal | ✅ Usar |
|----|-------------------|--------|
| **Operario** | "Operator" (confunde con teleoperador) | EN: "Machine Operator"; PT: "Operador" |
| **Baja** | "Sick leave" (muy específico) | EN: "Absence"; PT: "Falta" |
| **Tutor** | "Trainer" (corporativo) | EN: "Experienced operator"; PT: "Operador experiente" |
| **Dependencia operativa** | Translation word-for-word | EN: "Key person risk"; PT: "Risco de pessoal-chave" |
| **Arranca sin fricción** | "Starts without friction" (idioma) | EN: "Seamless setup"; PT: "Começa sem complicações" |

### Acrónimos (NUNCA traducir, SIEMPRE expandir en primera mención):

```
SOP    → "SOP (Standard Operating Procedure)" EN
         "SOP (Procedimento Operativo Padrão)" PT

SME/PME → Mantener ambos según idioma

ISO, IATF, GMP, LOTO → Mantener, expandir si crítico
```

---

## 🌍 Estrategia por Idioma

### INGLÉS (EN)

**Audience**: Jefes de producción, RRHH industrial en mercados angloparlantes (UK, Irlanda, US)

**Tonos a evitar**:
- ❌ Demasiado corporativo ("Subject matter expert" en contexto puro operativo)
- ❌ Confusión de términos ("Operator" genérico; "Trainer" )
- ❌ Calcos del español ("visibility" vago)

**Principios**:
- "Machine Operator" > "Operator"
- "Absence" > "Sick leave" (contexto operativo)
- "Skills" (específico) vs "Competencies" (cluster formalizado)
- "Production line start up" / "start the line" es lenguaje natural industrial

**Ejemplo BIEN**:
> "Your expert is on sick leave. Who starts up the filling line? It's 6:30 AM Tuesday. Javi has been on that machine for 15 years and he's in urgent care."

**Ejemplo MAL**:
> "The specialized operator is on medical leave. Who activates the filling station? It's 06:30 on Tuesday..."
> (muy corporativo, "activates" no es lenguaje industrial)

---

### PORTUGUÉS (PT)

**Audience**: RRHH, Jefes de planta en Brasil, Portugal, otros mercados lusoparlantes

**Tonos a evitar**:
- ❌ Muy formal/administrativo ("Ausência" en contexto operativo)
- ❌ Demasiado académico ("Instrutor", "Competências formais")
- ❌ Anticuado ("Operário" en contexto moderno)

**Principios**:
- "Operador" (moderno industrial) > "Operário" (anticuado)
- "Falta" (operativo) > "Ausência" (administrativo)
- "Habilidades" (operativo) > "Competências" (formal)
- Explicar "Onboarding" como "(Integração)" en primera mención
- "Começa sem complicações" > "Começar sem fricção" (literal)

**Ejemplo BIEN**:
> "Seu especialista está de falta. Quem dá partida na envasadora? É terça 6h30. João trabalha naquela máquina há 15 anos e está na emergência."

**Ejemplo MAL**:
> "O operário especializado está de ausência. Quem ativa a máquina envasadora?"
> (muito formal, "ativa" não é lenguajo industrial)

---

## 📰 3 Artículos Blog Clave para Traducción Manual

### 1. **que-es-un-sop-industrial.astro**
- **Tipo**: Educativo, SEO-driven
- **Audiencia**: Managers industriales entendiendo SOPs
- **Longitud**: ~3000 palabras
- **Traducción Crítica**: Conceptos técnicos + ejemplos prácticos
- **Términos**: SOP, operario, competencias, troubleshooting,  procedimiento
- **Esfuerzo**: ALTO (es un artículo complejo)

**Notas**:
- SOP aparece 50+ veces → expandir SOLO en primera mención
- "Operario" vs "Operador" → usar término principal, ser consistente
- Ejemplos de maquinaria: adaptar si tiene sentido regional (CNC, llenadora)
- Números/estadísticas de industria ES → verificar si aplicables EN/PT

---

### 2. **onboarding-software-pymes.astro**
- **Tipo**: Product-focused, Conversion
- **Audiencia**: RRHH, Jefes producción evaluando soluciones
- **Longitud**: ~2000 palabras
- **Traducción Crítica**: Beneficios claros, llamadas a acción
- **Términos**: Onboarding, tutor, incorporación, productividad, ramp-up
- **Esfuerzo**: MEDIO (pero muy importante para conversión)

**Notas**:
- Mantener "Onboarding" pero aclarar: "Onboarding (integración)" PT
- CTAs deben ser idénticas a Home ("Sign up for REELEVO")
- "Ramp-up" es término industrial universal EN/PT → mantener
- Evitar "Development" en EN para contexto operativo

---

### 3. **documentar-conocimiento-operarios-expertos.astro**
- **Tipo**: How-to, Educativo
- **Audiencia**: Operarios, técnicos documentando procesos
- **Longitud**: ~2500 palabras
- **Traducción Crítica**: Claridad instruccional, ejemplos prácticos
- **Términos**: Conocimiento tácito, tribal knowledge, documentar, SOP
- **Esfuerzo**: MEDIO (menos denso que SOP article)

**Notas**:
- "Tribal knowledge" es anglicismo establecido → mantener EN/PT
- "Conocimiento tácito" → EN: "Unwritten knowledge" (más operativo que "Tacit")
- Step-by-step instructions → estructura debe ser idéntica EN/PT
- Ejemplos pueden tener variantes regionales (tipos de máquinas)

---

## 🔄 Cómo Mantener Este Sistema

### Workflow para Traducción Manual

1. **Leer artículo ES** completamente
2. **Marcar términos críticos** con comentarios:
   ```html
   <!-- CONTEXT: operational --> Operario nuevo
   <!-- GLOSSARY_TERM: operario → "Machine Operator" (EN) / "Operador" (PT) -->
   ```
3. **Traducir por secciones** (hero → problema → solución → CTA)
4. **Verificar contra glosario** para cada término clave
5. **Revisar tono** contra ejemplos de EN/PT en documento
6. **Testing**: Verificar que no hay calcos literales que suenen extraños

### Workflow para Nuevas Páginas (no en manual)

Si creas una NUEVA página:

1. **Marcar términos** con comentarios HTML:
   ```html
   <!-- GLOSSARY: operario, competencias, baja -->
   <!-- CONTEXT: marketing/emotional -->
   ```
2. **Dejar automático** vía `localize-dist.mjs` (que ya lee glosario)
3. **Revisar traducción generada** (10% de auditoría)
4. **Corregir manualmente** si glosario fue ignorado

---

## 🛠️ Cómo Usar el Glosario en Código

### Opción A: Comentarios HTML (RECOMENDADO)

```astro
<!-- GLOSSARY: operario, competencias, baja -->
<!-- CONTEXT: operational/marketing -->
<!-- EXPAND_ACRONYM: SOP(1st mention) -->

<h1>Manual de Competencias para Operarios Nuevos</h1>
```

**`localize-dist.mjs`** lee estos comentarios y aplica reglas de glosario.

### Opción B: Data Attributes (Futuro)

```astro
<p data-glossary-terms="operario,baja" data-context="operational">
  El operario nuevo está de baja...
</p>
```

Para futuro si quieres UI reutilizable.

---

## 📊 Checklist: Términos a Revisar en Traducción

Cuando traduzcas manual, verficia que estos términos usan GLOSARIO:

```
☐ Operario/Operador        ☐ Baja/Falta/Ausencia
☐ Tutor/Tutoría             ☐ Competencias/Skills
☐ Dependencia operativa     ☐ Puesto de trabajo
☐ Onboarding/Incorporación  ☐ Arranca/Comiença
☐ Menos improvisación       ☐ Visibilidad operativa
☐ SOP (expandido)           ☐ SME/PME
☐ Jefe de Producción        ☐ RRHH/RH
```

---

## 📝 Archivos de Traducción Existentes

Estos ya están creados:

- ✅ `glossary.json` — 30+ términos críticos con variantes EN/PT
- ✅ `translations-manual.mjs` — Home (hero, problema, proof)
- ✅ `translation-strategy-blog.mjs` — Estrategia para 3 blog artículos

**Falta crear** (para completar Opción B):
- [ ] `que-es-un-sop-industrial.en.astro` — Traducción EN
- [ ] `que-es-un-sop-industrial.pt.astro` — Traducción PT
- [ ] `onboarding-software-pymes.en.astro` — Traducción EN
- [ ] `onboarding-software-pymes.pt.astro` — Traducción PT
- [ ] `documentar-conocimiento-operarios-expertos.en.astro` — Traducción EN
- [ ] `documentar-conocimiento-operarios-expertos.pt.astro` — Traducción PT

---

## 🚀 Próximos Pasos

1. **Revisar glosario** - Verificar que términos clave están cubiertos
2. **Traducir 3 artículos blog** siguiendo estrategia (puedo ayudarte o hacer en background)
3. **Actualizar `localize-dist.mjs`** para usar glosario en nuevas traducciones automáticas
4. **Testear**: Convertir Home + 1 blog a EN/PT, revisar coherencia
5. **Agregar UI feedback**: "¿Esta traducción es incorrecta?" para mejorar glosario iterativamente

---

## 📞 Dudas Comunes

**P: ¿Por qué no traducir TODO manualmente?**  
R: Es inviable. Tenemos 40+ páginas × 3 idiomas = 120 versiones. Mantén manual solo lo crítico (Home + 3 artículos blog). El resto: automático + glosario.

**P: ¿Qué pasa si el glosario no tiene un término?**  
R: `localize-dist.mjs` traduce automático (Google Translate). Log te dirá cuál término faltó. Añádelo al glosario y re-build.

**P: ¿Los usuarios verán las traducciones automáticas mientras hago manuales?**  
R: Sí, hasta que publiques las manuales. Usa feature flag o draft mode si quieres testear primero.

**P: ¿Cómo mantengo esto en el future?**  
R: Cuando añadas página nueva:
1. Marca términos con comentarios HTML
2. Deja automático + glosario
3. Audita 10% de traducción

---

## 📚 Referencias

- `src/locales/glossary.json` — Glosario master
- `scripts/localize-dist.mjs` — Motor de traducción (línea 63-71 = protección de términos)
- Artículos de referencia:
  - EN: https://www.gmvsolutions.es/en/
  - PT: https://www.gmvsolutions.es/pt/

---

**Mantenedor**: Sistema de traducción REELEVO  
**Última actualización**: 2026-04-10  
**Estado**: Glosario + estrategia listos. Traducciones manuales en progreso.
