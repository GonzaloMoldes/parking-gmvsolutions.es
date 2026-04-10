/**
 * ESTRATEGIA DE TRADUCCIÓN - 3 ARTÍCULOS BLOG CLAVE
 *
 * 1. que-es-un-sop-industrial.astro
 *    - Educativo, SEO-driven
 *    - Público: Managers industriales buscando entender SOPs
 *    - Tono: Experto pero accesible
 *    - Términos críticos: SOP, operario, competencias, troubleshooting
 *
 * 2. onboarding-software-pymes.astro
 *    - Product-focused, Conversion
 *    - Público: RRHH, Jefes de producción evaluando soluciones
 *    - Tono: Directo, orientado a beneficio
 *    - Términos críticos: onboarding, tutor, incorporación, productividad
 *
 * 3. documentar-conocimiento-operarios-expertos.astro
 *    - Educativo, How-to
 *    - Público: Operarios y managers documentando know-how
 *    - Tono: Práctico, con ejemplos
 *    - Términos críticos: conocimiento tácito, tribal knowledge, documentar
 *
 * NOTAS DE TRADUCCIÓN POR IDIOMA:
 *
 * INGLÉS:
 * - Mantener accesible: industrial SME es el audience, no especialistas de IT
 * - Usar "machine operator", "production line", "shop floor" consistentemente
 * - "Skills" para habilidades específicas, "Competencies" para formal clusters
 * - "Absence" / "Sick leave" según contexto
 * - Mantener "Ramp-up" para concepto de velocidad de productividad inicial
 * - Explicar acrónimos en primera mención: "SOP (Standard Operating Procedure)"
 *
 * PORTUGUÉS:
 * - Preferir "Operador" (moderno industrial) vs "Operário" (antiguo)
 * - Preferir "Falta" (operativo) vs "Ausência" (administrativo)
 * - "Habilidades" para contexto operativo, "Competências" para formal
 * - Explicar "Onboarding" como "(Integração)" en primera mención
 * - Usar "Execução" cuando sea claramente sobre acción; "Desempenho" para resultados
 * - Mantener "SOP" con expansión: "SOP (Procedimento Operativo Padrão)"
 *
 * MÉTODOS DE TRADUCCIÓN PARA ESTOS ARTÍCULOS:
 * - Párrafos narrativos: traducir naturalmente, adaptando ejemplos locales
 * - Data/estadísticas: mantener números, adaptar contexto regional si aplica
 * - Lists/bullets: traducir pero mantener paralelismo estructura
 * - Titles/headings: impacto > literalidad (ej: "Why does it matter?" → "Por qué importa?")
 * - Links/CTAs: usar copy desde Home para consistencia
 *
 * EJEMPLO DE RIESGO - NO HACER:
 *
 * Malo EN: "The specialist is on sick leave. Who boots up the filler?"
 * → "boots up" es muy técnico/lenguaje de IT
 *
 * Mejor EN: "Your expert is on sick leave. Who starts up the filling line?"
 * → "starts up" es industrial/máquinas
 *
 * Malo PT: "O conhecimento tribal é aquele que o operário experiente tem na sua cabeça"
 * → Demasiado literal/académico
 *
 * Mejor PT: "É aquele conhecimento que vive só na cabeça do seu operador experiente"
 * → Más natural, conversacional
 */

// Características a mantener en traducciones:
// 1. Tono conversacional y experto (estas son pymes, no corporantes)
// 2. Ejemplos con contexto industrial español/latino
// 3. Datos estadísticos: mantener números base, adaptar si son locales
// 4. "We" statements adaptados al contexto producto
// 5. CTAs consistentes con Home

export const translationStrategy = {
  summary: "Traducción manual context-aware. NO usar automático para estos 3 artículos."
};
