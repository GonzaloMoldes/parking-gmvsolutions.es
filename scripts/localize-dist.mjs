import path from 'node:path';
import { promises as fs } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parse, serialize } from 'parse5';
import {
  SITE_URL,
  SITE_URL_ALIASES,
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  buildLocalePath,
  getLocaleConfig,
  normalizePrimarySiteUrl,
  normalizeSitePath,
  stripLocalePrefix,
} from '../src/lib/i18n.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const cacheDir = path.join(rootDir, '.cache');
const cacheFile = path.join(cacheDir, 'localization-cache.json');

const HTML_NS = 'http://www.w3.org/1999/xhtml';
const localeCodes = new Set(SUPPORTED_LOCALES.map((locale) => locale.code));
const targetLocales = SUPPORTED_LOCALES.filter((locale) => locale.code !== DEFAULT_LOCALE);
const skipParentTags = new Set(['script', 'style', 'svg', 'noscript', 'code', 'pre']);
const translatableMetaKeys = new Set([
  'description',
  'og:title',
  'og:description',
  'twitter:title',
  'twitter:description',
]);
const nonTranslatableJsonKeys = new Set([
  '@context',
  '@type',
  '@id',
  'url',
  'sameAs',
  'logo',
  'image',
  'contentUrl',
  'embedUrl',
  'thumbnailUrl',
  'datePublished',
  'dateModified',
  'startDate',
  'endDate',
  'foundingDate',
  'postalCode',
  'addressCountry',
  'areaServed',
  'email',
  'telephone',
  'price',
  'priceCurrency',
  'availability',
  'sku',
  'identifier',
  'itemCondition',
]);
const staticProtectedTerms = [
  'www.gmvsolutions.es',
  'REELEVO',
  'GMV Solutions',
  'gmvsolutions.es',
  'app.gmvsolutions.es',
  'diagnostico.gmvsolutions.es',
  'hola@gmvsolutions.es',
];

let translationCache = {};
let cacheDirty = false;

const isMainModule =
  process.argv[1] && path.resolve(process.argv[1]) === __filename;

if (isMainModule) {
  await runLocalizationBuild();
}

export async function runLocalizationBuild() {
  await ensureDistExists();
  await loadCache();

  const sourcePages = await getSourcePages();
  const routeSet = new Set(sourcePages.map((page) => page.routePath));

  for (const page of sourcePages) {
    const originalHtml = await fs.readFile(page.filePath, 'utf8');
    const localizedSpanish = await localizeHtml({
      html: originalHtml,
      routePath: page.routePath,
      targetLocale: DEFAULT_LOCALE,
      routeSet,
    });

    await fs.writeFile(page.filePath, localizedSpanish, 'utf8');

    for (const locale of targetLocales) {
      const localizedHtml = await localizeHtml({
        html: originalHtml,
        routePath: page.routePath,
        targetLocale: locale.code,
        routeSet,
      });

      const outputPath = htmlPathForRoute(page.routePath, locale.code);
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, localizedHtml, 'utf8');
    }
  }

  await writeSitemap(routeSet);
  await persistCache();

  console.log(
    `Localized ${sourcePages.length} pages into ${SUPPORTED_LOCALES.length} languages (${SUPPORTED_LOCALES.map((locale) => locale.code).join(', ')}).`,
  );
}

async function ensureDistExists() {
  const stat = await fs.stat(distDir).catch(() => null);

  if (!stat || !stat.isDirectory()) {
    throw new Error('dist/ does not exist. Run Astro build before localizing the site.');
  }
}

async function loadCache() {
  const raw = await fs.readFile(cacheFile, 'utf8').catch(() => '');

  if (!raw) {
    translationCache = {};
    return;
  }

  try {
    translationCache = JSON.parse(raw);
  } catch {
    translationCache = {};
  }
}

async function persistCache() {
  if (!cacheDirty) {
    return;
  }

  await fs.mkdir(cacheDir, { recursive: true });
  await fs.writeFile(cacheFile, JSON.stringify(translationCache, null, 2), 'utf8');
}

async function getSourcePages() {
  const htmlFiles = await collectFiles(distDir, (filePath) => filePath.endsWith('.html'));

  return htmlFiles
    .map((filePath) => ({
      filePath,
      routePath: routeFromHtmlPath(filePath),
    }))
    .filter((page) => !isLocalizedRoute(page.routePath))
    .sort((a, b) => a.routePath.localeCompare(b.routePath));
}

export async function getPageRouteSet(pagesDirectory = path.join(rootDir, 'src', 'pages')) {
  const pageFiles = await collectFiles(pagesDirectory, (filePath) => {
    if (!filePath.endsWith('.astro')) {
      return false;
    }

    const normalized = filePath.replace(/\\/g, '/');
    return !normalized.includes('/[');
  });

  return new Set(
    pageFiles
      .map((filePath) => routeFromSourcePagePath(filePath, pagesDirectory))
      .filter(Boolean),
  );
}

async function collectFiles(directory, matcher) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath, matcher)));
      continue;
    }

    if (matcher(fullPath)) {
      files.push(fullPath);
    }
  }

  return files;
}

function routeFromHtmlPath(filePath) {
  const relativePath = path.relative(distDir, filePath).replace(/\\/g, '/');

  if (relativePath === 'index.html') {
    return '/';
  }

  if (relativePath.endsWith('/index.html')) {
    return normalizeSitePath(`/${relativePath.slice(0, -'index.html'.length)}`);
  }

  return normalizeSitePath(`/${relativePath}`);
}

function routeFromSourcePagePath(filePath, pagesDirectory) {
  const relativePath = path.relative(pagesDirectory, filePath).replace(/\\/g, '/');

  if (relativePath === 'index.astro') {
    return '/';
  }

  if (!relativePath.endsWith('.astro')) {
    return null;
  }

  const routePath = relativePath.slice(0, -'.astro'.length);
  return normalizeSitePath(`/${routePath}`);
}

function htmlPathForRoute(routePath, locale) {
  const localizedRoute = buildLocalePath(locale, routePath);
  const trimmed = localizedRoute.replace(/^\/|\/$/g, '');

  if (!trimmed) {
    return path.join(distDir, 'index.html');
  }

  return path.join(distDir, ...trimmed.split('/'), 'index.html');
}

function isLocalizedRoute(routePath) {
  const segments = routePath.split('/').filter(Boolean);
  return segments.length > 0 && segments[0] !== DEFAULT_LOCALE && localeCodes.has(segments[0]);
}

export async function localizeHtml({ html, routePath, targetLocale, routeSet }) {
  const document = parse(html);

  await translateDocument(document, targetLocale);
  rewriteInternalUrls(document, targetLocale, routeSet);
  syncLanguageSelectorMarkup(document, targetLocale);
  updateHeadMetadata(document, targetLocale, routePath);
  await localizeStructuredData(document, targetLocale, routeSet);

  return serialize(document);
}

async function translateDocument(document, targetLocale) {
  if (targetLocale === DEFAULT_LOCALE) {
    return;
  }

  const jobs = [];

  walk(document, (node, ancestors) => {
    if (node.nodeName === '#text') {
      if (!shouldTranslateTextNode(node, ancestors)) {
        return;
      }

      const source = node.value;
      jobs.push({
        source,
        apply(translated) {
          node.value = applyWhitespace(source, translated);
        },
      });

      return;
    }

    if (!isElement(node) || shouldSkipByAncestors(ancestors)) {
      return;
    }

    for (const attr of node.attrs ?? []) {
      if (!shouldTranslateAttribute(node, attr)) {
        continue;
      }

      const source = attr.value;
      jobs.push({
        source,
        apply(translated) {
          attr.value = translated.trim();
        },
      });
    }
  });

  await applyTranslationJobs(jobs, targetLocale);
}

function shouldTranslateTextNode(node, ancestors) {
  if (!node.value || !containsLetters(node.value) || shouldSkipByAncestors(ancestors)) {
    return false;
  }

  const parent = ancestors.at(-1);

  if (!parent || !isElement(parent)) {
    return false;
  }

  if (skipParentTags.has(parent.tagName)) {
    return false;
  }

  return true;
}

function shouldTranslateAttribute(node, attr) {
  const attrName = attr.name.toLowerCase();

  if (hasNoTranslateFlag(node) || !containsLetters(attr.value)) {
    return false;
  }

  if (attrName === 'aria-label' || attrName === 'title' || attrName === 'placeholder') {
    return true;
  }

  if (attrName === 'alt' && node.tagName === 'img') {
    return true;
  }

  if (attrName === 'content' && node.tagName === 'meta') {
    const identifier = getAttr(node, 'property') || getAttr(node, 'name');
    return identifier ? translatableMetaKeys.has(identifier.toLowerCase()) : false;
  }

  return false;
}

function shouldSkipByAncestors(ancestors) {
  return ancestors.some((ancestor) => isElement(ancestor) && hasNoTranslateFlag(ancestor));
}

function hasNoTranslateFlag(node) {
  const translateAttr = getAttr(node, 'translate');
  return translateAttr === 'no' || Boolean(getAttr(node, 'data-no-translate'));
}

async function applyTranslationJobs(jobs, targetLocale) {
  if (jobs.length === 0) {
    return;
  }

  const translations = await translateMany(
    jobs.map((job) => job.source),
    targetLocale,
  );

  jobs.forEach((job, index) => {
    const translated = translations[index];
    job.apply(translated || job.source);
  });
}

async function translateMany(texts, targetLocale) {
  const results = new Array(texts.length);
  const pending = [];

  texts.forEach((text, index) => {
    const cacheKey = `${targetLocale}::${text}`;
    const cached = translationCache[cacheKey];

    if (cached) {
      results[index] = cached;
      return;
    }

    pending.push({ index, text, cacheKey });
  });

  const uniquePending = Array.from(
    pending.reduce((map, entry) => {
      if (!map.has(entry.text)) {
        map.set(entry.text, []);
      }

      map.get(entry.text).push(entry);
      return map;
    }, new Map()),
    ([text, entries]) => ({ text, entries }),
  );

  for (const chunk of chunkTranslatableEntries(uniquePending)) {
    const translatedChunk = await requestChunkTranslation(chunk, targetLocale);

    for (const item of translatedChunk) {
      for (const entry of item.entries) {
        translationCache[entry.cacheKey] = item.translated;
        results[entry.index] = item.translated;
      }
    }

    cacheDirty = true;
    await persistCache();
  }

  return results.map((result, index) => result || texts[index]);
}

function chunkTranslatableEntries(entries) {
  const chunks = [];
  let currentChunk = [];
  let currentLength = 0;
  const maxEncodedLength = 3200;

  for (const entry of entries) {
    const unitLength = encodeURIComponent(entry.text).length + 32;

    if (currentChunk.length > 0 && currentLength + unitLength > maxEncodedLength) {
      chunks.push(currentChunk);
      currentChunk = [];
      currentLength = 0;
    }

    currentChunk.push(entry);
    currentLength += unitLength;
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks;
}

async function requestChunkTranslation(chunk, targetLocale) {
  const markers = chunk.map((entry, index) => {
    const marker = `__SEG_${index}__`;
    const protectedEntry = protectText(entry.text);
    return {
      marker,
      text: protectedEntry.text,
      tokens: protectedEntry.tokens,
      entries: entry.entries,
      source: entry.text,
    };
  });

  const payload = markers.map((item) => `${item.marker}${item.text}`).join('\n');
  const translatedPayload = await translateWithGoogle(payload, targetLocale);
  const translatedSegments = splitTranslatedPayload(translatedPayload);

  if (translatedSegments.length !== markers.length) {
    return Promise.all(
      markers.map(async (item) => {
        const translated = restoreProtectedText(
          await translateWithGoogle(item.text, targetLocale),
          item.tokens,
        );

        return {
          translated,
          entries: item.entries,
        };
      }),
    );
  }

  return markers.map((item, index) => ({
    translated: restoreProtectedText(translatedSegments[index], item.tokens) || item.source,
    entries: item.entries,
  }));
}

async function translateWithGoogle(text, targetLocale) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx');
  url.searchParams.set('sl', DEFAULT_LOCALE);
  url.searchParams.set('tl', targetLocale);
  url.searchParams.set('dt', 't');
  url.searchParams.set('q', text);

  const response = await fetch(url, {
    headers: {
      'user-agent': 'reelevo-localizer/1.0',
    },
  });

  if (!response.ok) {
    throw new Error(`Translation request failed with status ${response.status}`);
  }

  const data = await response.json();
  return Array.isArray(data?.[0]) ? data[0].map((item) => item?.[0] ?? '').join('') : text;
}

function splitTranslatedPayload(translatedPayload) {
  const pattern = /__SEG_(\d+)__/g;
  const matches = Array.from(translatedPayload.matchAll(pattern));

  if (matches.length === 0) {
    return [];
  }

  const segments = [];

  for (let index = 0; index < matches.length; index += 1) {
    const current = matches[index];
    const next = matches[index + 1];
    const start = current.index + current[0].length;
    const end = next ? next.index : translatedPayload.length;
    segments.push(translatedPayload.slice(start, end).trim());
  }

  return segments;
}

function protectText(text) {
  const tokens = [];
  let protectedText = text;

  const dynamicPatterns = [
    /https?:\/\/[^\s"']+/g,
    /\b[\w.+-]+@[\w.-]+\.\w+\b/g,
  ];

  for (const pattern of dynamicPatterns) {
    protectedText = protectedText.replace(pattern, (match) => {
      const placeholder = `__TOKEN_${tokens.length}__`;
      tokens.push({ placeholder, value: match });
      return placeholder;
    });
  }

  for (const term of staticProtectedTerms) {
    if (!protectedText.includes(term)) {
      continue;
    }

    const placeholder = `__TOKEN_${tokens.length}__`;
    tokens.push({ placeholder, value: term });
    protectedText = protectedText.split(term).join(placeholder);
  }

  return {
    text: protectedText,
    tokens,
  };
}

function restoreProtectedText(text, tokens) {
  let restored = text;

  for (const token of tokens) {
    restored = restored.split(token.placeholder).join(token.value);
  }

  return restored;
}

function rewriteInternalUrls(document, targetLocale, routeSet) {
  walk(document, (node) => {
    if (!isElement(node)) {
      return;
    }

    if (getAttr(node, 'data-locale-option')) {
      return;
    }

    for (const attr of node.attrs ?? []) {
      const attrName = attr.name.toLowerCase();

      if (!['href', 'src', 'action', 'poster'].includes(attrName)) {
        continue;
      }

      attr.value = rewriteInternalUrl(attr.value, targetLocale, routeSet);
    }
  });
}

function syncLanguageSelectorMarkup(document, targetLocale) {
  const currentLocale = getLocaleConfig(targetLocale);
  const switchers = findAll(
    document,
    (node) => isElement(node) && getAttr(node, 'data-language-switcher') !== undefined,
  );

  for (const switcher of switchers) {
    const currentLabel = findFirst(
      switcher,
      (node) => isElement(node) && getAttr(node, 'data-language-current') !== undefined,
    );
    const currentFlag = findFirst(
      switcher,
      (node) => isElement(node) && getAttr(node, 'data-language-flag') !== undefined,
    );

    if (currentLabel?.childNodes?.[0]?.nodeName === '#text') {
      currentLabel.childNodes[0].value = currentLocale.label;
    }

    if (currentFlag) {
      setAttr(currentFlag, 'src', currentLocale.flagIcon);
    }

    const localeLinks = findAll(
      switcher,
      (node) => isElement(node) && getAttr(node, 'data-locale-option') !== undefined,
    );

    for (const link of localeLinks) {
      const localeCode = getAttr(link, 'data-locale-option');
      const isActive = localeCode === targetLocale;

      setClassState(link, 'is-active', isActive);

      if (isActive) {
        setAttr(link, 'aria-current', 'page');
      } else {
        removeAttr(link, 'aria-current');
      }
    }
  }
}

function rewriteInternalUrl(value, targetLocale, routeSet) {
  if (!value || value.startsWith('#') || value.startsWith('mailto:') || value.startsWith('tel:')) {
    return value;
  }

  if (value.startsWith('/')) {
    const { pathname, search, hash } = splitUrlParts(value);
    const localizedPath = localizeRoutePath(pathname, targetLocale, routeSet);

    if (!localizedPath) {
      return value;
    }

    return `${localizedPath}${search}${hash}`;
  }

  if (SITE_URL_ALIASES.some((baseUrl) => value.startsWith(baseUrl))) {
    const url = new URL(normalizePrimarySiteUrl(value));
    const localizedPath = localizeRoutePath(url.pathname, targetLocale, routeSet);

    if (localizedPath) {
      url.pathname = localizedPath;
    }

    return url.toString();
  }

  return value;
}

function localizeRoutePath(pathname, targetLocale, routeSet) {
  const normalized = normalizeSitePath(pathname);
  const basePath = stripLocalePrefix(normalized);

  if (!routeSet.has(basePath)) {
    return null;
  }

  return buildLocalePath(targetLocale, basePath);
}

function splitUrlParts(urlValue) {
  const [pathAndSearch, hashPart] = urlValue.split('#', 2);
  const [pathname, searchPart] = pathAndSearch.split('?', 2);

  return {
    pathname,
    search: searchPart ? `?${searchPart}` : '',
    hash: hashPart ? `#${hashPart}` : '',
  };
}

function updateHeadMetadata(document, targetLocale, routePath) {
  const head = findFirst(document, (node) => isElement(node) && node.tagName === 'head');
  const html = findFirst(document, (node) => isElement(node) && node.tagName === 'html');
  const localeConfig = getLocaleConfig(targetLocale);
  const localizedUrl = new URL(buildLocalePath(targetLocale, routePath), SITE_URL).toString();

  if (html) {
    setAttr(html, 'lang', localeConfig.htmlLang);
  }

  if (!head) {
    return;
  }

  upsertHeadElement(head, 'link', { rel: 'canonical' }, [
    ['rel', 'canonical'],
    ['href', localizedUrl],
  ]);

  upsertHeadElement(head, 'meta', { property: 'og:url' }, [
    ['property', 'og:url'],
    ['content', localizedUrl],
  ]);

  upsertHeadElement(head, 'meta', { property: 'og:locale' }, [
    ['property', 'og:locale'],
    ['content', localeConfig.ogLocale],
  ]);

  removeHeadAlternates(head);
  appendAlternateLinks(head, routePath);
}

function removeHeadAlternates(head) {
  head.childNodes = (head.childNodes ?? []).filter((child) => {
    if (!isElement(child) || child.tagName !== 'link') {
      return true;
    }

    return !(getAttr(child, 'rel') === 'alternate' && getAttr(child, 'hreflang'));
  });
}

function appendAlternateLinks(head, routePath) {
  for (const locale of SUPPORTED_LOCALES) {
    const href = new URL(buildLocalePath(locale.code, routePath), SITE_URL).toString();
    appendChild(
      head,
      createElement('link', [
        ['rel', 'alternate'],
        ['hreflang', locale.htmlLang],
        ['href', href],
      ]),
    );
  }

  appendChild(
    head,
    createElement('link', [
      ['rel', 'alternate'],
      ['hreflang', 'x-default'],
      ['href', new URL(buildLocalePath(DEFAULT_LOCALE, routePath), SITE_URL).toString()],
    ]),
  );
}

async function localizeStructuredData(document, targetLocale, routeSet) {
  const scripts = findAll(
    document,
    (node) =>
      isElement(node) &&
      node.tagName === 'script' &&
      (getAttr(node, 'type') || '').toLowerCase() === 'application/ld+json',
  );

  for (const script of scripts) {
    const textNode = (script.childNodes ?? []).find((child) => child.nodeName === '#text');

    if (!textNode || !textNode.value.trim()) {
      continue;
    }

    try {
      const parsed = JSON.parse(textNode.value);
      const localized = await transformStructuredValue(parsed, targetLocale, routeSet, null);
      textNode.value = JSON.stringify(localized);
    } catch {
      // Ignore malformed structured data rather than failing the build.
    }
  }
}

async function transformStructuredValue(value, targetLocale, routeSet, key) {
  if (Array.isArray(value)) {
    const nextValues = [];

    for (const item of value) {
      nextValues.push(await transformStructuredValue(item, targetLocale, routeSet, key));
    }

    return nextValues;
  }

  if (value && typeof value === 'object') {
    const nextObject = {};

    for (const [childKey, childValue] of Object.entries(value)) {
      nextObject[childKey] = await transformStructuredValue(childValue, targetLocale, routeSet, childKey);
    }

    return nextObject;
  }

  if (typeof value !== 'string') {
    return value;
  }

  if (key === 'inLanguage') {
    return getLocaleConfig(targetLocale).htmlLang;
  }

  if (value.startsWith('/') || SITE_URL_ALIASES.some((baseUrl) => value.startsWith(baseUrl))) {
    return rewriteInternalUrl(value, targetLocale, routeSet);
  }

  if (key && nonTranslatableJsonKeys.has(key)) {
    return value;
  }

  if (targetLocale === DEFAULT_LOCALE) {
    return value;
  }

  if (!containsLetters(value)) {
    return value;
  }

  const [translated] = await translateMany([value], targetLocale);
  return translated || value;
}

async function writeSitemap(routeSet) {
  const entries = Array.from(routeSet).sort((a, b) => a.localeCompare(b));
  const urls = [];

  for (const routePath of entries) {
    for (const locale of SUPPORTED_LOCALES) {
      const currentUrl = new URL(buildLocalePath(locale.code, routePath), SITE_URL).toString();
      const alternates = SUPPORTED_LOCALES.map((alternateLocale) => ({
        hreflang: alternateLocale.htmlLang,
        href: new URL(buildLocalePath(alternateLocale.code, routePath), SITE_URL).toString(),
      }));

      alternates.push({
        hreflang: 'x-default',
        href: new URL(buildLocalePath(DEFAULT_LOCALE, routePath), SITE_URL).toString(),
      });

      urls.push(
        [
          '<url>',
          `  <loc>${escapeXml(currentUrl)}</loc>`,
          ...alternates.map(
            (alternate) =>
              `  <xhtml:link rel="alternate" hreflang="${escapeXml(alternate.hreflang)}" href="${escapeXml(alternate.href)}" />`,
          ),
          '</url>',
        ].join('\n'),
      );
    }
  }

  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    '</urlset>',
  ].join('\n');

  await Promise.all([
    fs.rm(path.join(distDir, 'sitemap-index.xml'), { force: true }),
    fs.rm(path.join(distDir, 'sitemap-0.xml'), { force: true }),
    fs.rm(path.join(distDir, 'sitemap-video.xml'), { force: true }),
  ]);

  await fs.writeFile(path.join(distDir, 'sitemap.xml'), sitemap, 'utf8');
}

function walk(node, visitor, ancestors = []) {
  visitor(node, ancestors);

  for (const child of node.childNodes ?? []) {
    walk(child, visitor, [...ancestors, node]);
  }
}

function findFirst(node, predicate) {
  let found = null;

  walk(node, (current) => {
    if (!found && predicate(current)) {
      found = current;
    }
  });

  return found;
}

function findAll(node, predicate) {
  const results = [];

  walk(node, (current) => {
    if (predicate(current)) {
      results.push(current);
    }
  });

  return results;
}

function isElement(node) {
  return Boolean(node?.tagName);
}

function getAttr(node, name) {
  return node.attrs?.find((attr) => attr.name === name)?.value;
}

function setAttr(node, name, value) {
  const existing = node.attrs?.find((attr) => attr.name === name);

  if (existing) {
    existing.value = value;
    return;
  }

  node.attrs = node.attrs ?? [];
  node.attrs.push({ name, value });
}

function removeAttr(node, name) {
  node.attrs = (node.attrs ?? []).filter((attr) => attr.name !== name);
}

function setClassState(node, className, enabled) {
  const currentClass = getAttr(node, 'class') || '';
  const classNames = new Set(currentClass.split(/\s+/u).filter(Boolean));

  if (enabled) {
    classNames.add(className);
  } else {
    classNames.delete(className);
  }

  if (classNames.size === 0) {
    removeAttr(node, 'class');
    return;
  }

  setAttr(node, 'class', Array.from(classNames).join(' '));
}

function appendChild(parent, child) {
  parent.childNodes = parent.childNodes ?? [];
  child.parentNode = parent;
  parent.childNodes.push(child);
}

function createElement(tagName, attrs = []) {
  return {
    nodeName: tagName,
    tagName,
    attrs: attrs.map(([name, value]) => ({ name, value })),
    namespaceURI: HTML_NS,
    childNodes: [],
    parentNode: null,
  };
}

function upsertHeadElement(head, tagName, lookupAttrs, attrs) {
  const existing = (head.childNodes ?? []).find((child) => {
    if (!isElement(child) || child.tagName !== tagName) {
      return false;
    }

    return Object.entries(lookupAttrs).every(([name, value]) => getAttr(child, name) === value);
  });

  if (existing) {
    for (const [name, value] of attrs) {
      setAttr(existing, name, value);
    }

    return existing;
  }

  const element = createElement(tagName, attrs);
  appendChild(head, element);
  return element;
}

function containsLetters(value) {
  return /\p{L}/u.test(value ?? '');
}

function applyWhitespace(original, translated) {
  const leading = original.match(/^\s*/u)?.[0] ?? '';
  const trailing = original.match(/\s*$/u)?.[0] ?? '';
  return `${leading}${translated.trim()}${trailing}`;
}

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}
