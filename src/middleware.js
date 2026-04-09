import { defineMiddleware } from 'astro:middleware';
import { DEFAULT_LOCALE, detectLocaleFromPath, stripLocalePrefix } from './lib/i18n.js';
import { getPageRouteSet, localizeHtml } from '../scripts/localize-dist.mjs';

let routeSetPromise;

function getRouteSet() {
  routeSetPromise ??= getPageRouteSet();
  return routeSetPromise;
}

export const onRequest = defineMiddleware(async (context, next) => {
  if (!import.meta.env.DEV) {
    return next();
  }

  const locale = detectLocaleFromPath(context.url.pathname);

  if (locale === DEFAULT_LOCALE) {
    return next();
  }

  const routePath = stripLocalePrefix(context.url.pathname);
  const routeSet = await getRouteSet();

  if (!routeSet.has(routePath)) {
    return next();
  }

  const rewrittenUrl = new URL(routePath, context.url);
  rewrittenUrl.search = context.url.search;

  const response = await next(rewrittenUrl);
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('text/html')) {
    return response;
  }

  const html = await response.text();
  const localizedHtml = await localizeHtml({
    html,
    routePath,
    targetLocale: locale,
    routeSet,
  });

  const headers = new Headers(response.headers);
  headers.set('content-type', 'text/html; charset=utf-8');

  return new Response(localizedHtml, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
});
