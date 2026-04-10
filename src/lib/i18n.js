export const SITE_URL = 'https://www.gmvsolutions.es';
export const SITE_URL_ALIASES = [
  SITE_URL,
  'https://gmvsolutions.es',
];
export const DEFAULT_LOCALE = 'es';

export const SUPPORTED_LOCALES = [
  {
    code: 'es',
    label: 'ES',
    nativeName: 'Español',
    flagIcon: '/flags/es.svg',
    htmlLang: 'es',
    ogLocale: 'es_ES',
  },
  {
    code: 'en',
    label: 'EN',
    nativeName: 'English',
    flagIcon: '/flags/gb.svg',
    htmlLang: 'en',
    ogLocale: 'en_US',
  },
  {
    code: 'pt',
    label: 'PT',
    nativeName: 'Português',
    flagIcon: '/flags/pt.svg',
    htmlLang: 'pt',
    ogLocale: 'pt_PT',
  },
];

export function getLocaleConfig(locale) {
  return SUPPORTED_LOCALES.find((item) => item.code === locale) ?? SUPPORTED_LOCALES[0];
}

export function normalizeSitePath(pathname = '/') {
  if (!pathname) {
    return '/';
  }

  let normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  normalized = normalized.replace(/\/index\.html$/i, '/');
  normalized = normalized.replace(/\/{2,}/g, '/');

  if (normalized !== '/' && !normalized.endsWith('/')) {
    normalized = `${normalized}/`;
  }

  return normalized || '/';
}

export function detectLocaleFromPath(pathname = '/') {
  const normalized = normalizeSitePath(pathname);

  for (const locale of SUPPORTED_LOCALES) {
    if (locale.code === DEFAULT_LOCALE) {
      continue;
    }

    if (normalized === `/${locale.code}/` || normalized.startsWith(`/${locale.code}/`)) {
      return locale.code;
    }
  }

  return DEFAULT_LOCALE;
}

export function stripLocalePrefix(pathname = '/') {
  const normalized = normalizeSitePath(pathname);
  const locale = detectLocaleFromPath(normalized);

  if (locale === DEFAULT_LOCALE) {
    return normalized;
  }

  const prefix = `/${locale}`;
  const stripped = normalized.slice(prefix.length) || '/';

  return stripped.startsWith('/') ? normalizeSitePath(stripped) : normalizeSitePath(`/${stripped}`);
}

export function buildLocalePath(locale, pathname = '/') {
  const normalizedPath = stripLocalePrefix(pathname);

  if (locale === DEFAULT_LOCALE) {
    return normalizedPath;
  }

  return normalizeSitePath(`/${locale}${normalizedPath === '/' ? '/' : normalizedPath}`);
}

export function toAbsoluteSiteUrl(pathname = '/') {
  return new URL(buildLocalePath(DEFAULT_LOCALE, pathname), SITE_URL).toString();
}

export function normalizePrimarySiteUrl(value = '') {
  if (!value || typeof value !== 'string') {
    return value;
  }

  const matchingBaseUrl = SITE_URL_ALIASES.find((baseUrl) => value.startsWith(baseUrl));

  if (!matchingBaseUrl) {
    // If the value doesn't start with any known alias, assume it's a pathname and build from SITE_URL
    const isPathOnly = value.startsWith('/');
    if (isPathOnly) {
      return new URL(value, SITE_URL).toString();
    }
    return value;
  }

  const url = new URL(value);
  return new URL(`${url.pathname}${url.search}${url.hash}`, SITE_URL).toString();
}
