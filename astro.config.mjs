import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://gmvsolutions.es',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      // Entradas personalizadas para blog posts
      serialize(item) {
        // Aumentar prioridad para blog posts
        if (item.url.includes('/blog/') || item.url.includes('/video-demo/')) {
          item.priority = 0.85;
          item.changefreq = 'weekly';
        }
        // Aumentar prioridad para casos de uso
        if (item.url.includes('/casos-de-uso/')) {
          item.priority = 0.9;
          item.changefreq = 'monthly';
        }
        // Aumentar prioridad para RRHH
        if (item.url.includes('/para-quien/responsable-rrhh/')) {
          item.priority = 0.95;
          item.changefreq = 'monthly';
        }
        // Página principal máxima prioridad
        if (item.url === 'https://gmvsolutions.es/') {
          item.priority = 1.0;
          item.changefreq = 'weekly';
        }
        return item;
      },
    }),
  ],
});
