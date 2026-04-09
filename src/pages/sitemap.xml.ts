import { getCollection } from 'astro:content';

export async function GET() {
  const baseURL = 'https://gmvsolutions.es';

  // URLs estáticas principales
  const staticPages = [
    { url: '/', lastmod: '2026-04-07', priority: '1.0', changefreq: 'weekly' },
    { url: '/como-funciona/', lastmod: '2026-04-07', priority: '0.9', changefreq: 'monthly' },
    { url: '/por-que-usar-reelevo/', lastmod: '2026-04-07', priority: '0.9', changefreq: 'monthly' },
    { url: '/precios/', lastmod: '2026-04-07', priority: '0.9', changefreq: 'monthly' },
    { url: '/sobre-nosotros/', lastmod: '2026-04-07', priority: '0.7', changefreq: 'monthly' },
    { url: '/calidad-y-conformidad/', lastmod: '2026-04-07', priority: '0.6', changefreq: 'monthly' },
    { url: '/vs-alternativas/', lastmod: '2026-04-07', priority: '0.6', changefreq: 'monthly' },

    // Casos de uso
    { url: '/casos-de-uso/onboarding-operarios/', lastmod: '2026-04-07', priority: '0.9', changefreq: 'monthly' },
    { url: '/casos-de-uso/personal-ett/', lastmod: '2026-04-07', priority: '0.9', changefreq: 'monthly' },
    { url: '/casos-de-uso/cobertura-bajas/', lastmod: '2026-04-07', priority: '0.8', changefreq: 'monthly' },
    { url: '/casos-de-uso/transferencia-conocimiento/', lastmod: '2026-04-07', priority: '0.8', changefreq: 'monthly' },

    // Para quién
    { url: '/para-quien/responsable-rrhh/', lastmod: '2026-04-07', priority: '0.9', changefreq: 'monthly' },
    { url: '/para-quien/jefe-de-produccion/', lastmod: '2026-04-07', priority: '0.8', changefreq: 'monthly' },
    { url: '/para-quien/responsable-calidad/', lastmod: '2026-04-07', priority: '0.7', changefreq: 'monthly' },
    { url: '/para-quien/gerente-propietario/', lastmod: '2026-04-07', priority: '0.7', changefreq: 'monthly' },

    // Sectores
    { url: '/sectores/alimentacion/', lastmod: '2026-04-07', priority: '0.8', changefreq: 'monthly' },
    { url: '/sectores/mecanizado-cnc/', lastmod: '2026-04-07', priority: '0.8', changefreq: 'monthly' },

    // Blog posts (NUEVOS)
    { url: '/blog/onboarding-software-pymes/', lastmod: '2026-04-07', priority: '0.85', changefreq: 'monthly' },
    { url: '/blog/gestion-competencias-industria/', lastmod: '2026-04-07', priority: '0.85', changefreq: 'monthly' },
    { url: '/blog/onboarding-vs-tradicional/', lastmod: '2026-04-07', priority: '0.85', changefreq: 'monthly' },
    { url: '/video-demo/', lastmod: '2026-04-07', priority: '0.8', changefreq: 'monthly' },

    // Recursos
    { url: '/recursos/', lastmod: '2026-04-07', priority: '0.7', changefreq: 'monthly' },
    { url: '/recursos/coste-absentismo-pymes-industriales/', lastmod: '2026-04-07', priority: '0.6', changefreq: 'yearly' },
    { url: '/recursos/crisis-perdida-conocimiento-planta-industrial/', lastmod: '2026-04-07', priority: '0.6', changefreq: 'yearly' },
    { url: '/recursos/documentar-conocimiento-operarios-expertos/', lastmod: '2026-04-07', priority: '0.6', changefreq: 'yearly' },
    { url: '/recursos/que-es-un-sop-industrial/', lastmod: '2026-04-07', priority: '0.6', changefreq: 'yearly' },
  ];

  // Generar XML del sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map((page) => `  <url>
    <loc>${baseURL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`)
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=604800', // 7 días
    },
  });
}
