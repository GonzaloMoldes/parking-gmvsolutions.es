#!/usr/bin/env node

/**
 * CSP Hash Generator
 * Generates SHA-256 hashes for inline scripts to hardening Content-Security-Policy
 *
 * Usage: node scripts/generate-csp-hashes.mjs
 */

import crypto from 'node:crypto';
import path from 'node:path';
import { promises as fs } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parse } from 'parse5';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const layoutPath = path.join(rootDir, 'src/layouts/BaseLayout.astro');

function calculateHash(content) {
  // Remove leading/trailing whitespace but preserve internal whitespace structure
  const normalized = content.trim();
  return crypto.createHash('sha256').update(normalized, 'utf8').digest('base64');
}

async function extractAndHashScripts() {
  console.log('🔐 Generating CSP hashes for inline scripts\n');

  try {
    const content = await fs.readFile(layoutPath, 'utf8');

    // Extract the script content between <script is:inline> blocks
    // This is a simple regex-based extraction since these are known scripts

    const scriptPatterns = [
      {
        name: 'Entry Splash Bootstrap',
        pattern: /(?:\/\/ Entry splash bootstrap\s*)?(\(\) => \{\s*const root = document\.documentElement;[\s\S]*?\}\)\(\);)/,
      },
      {
        name: 'Entry Splash Animation',
        pattern: /(?:\/\/ Entry splash animation\s*)?(\(\) => \{\s*const root = document\.documentElement;[\s\S]*?logoRevealDelay + pulseDuration \+ zoomDuration \+ blackoutHold\);?\s*\}\)\(\);)/,
      },
      {
        name: 'Analytics Loader',
        pattern: /(?:\/\/ Analytics Loading[\s\S]*?)\(function\(\) \{[\s\S]*?window\.addEventListener\('CookiebotOnLoad', initializeAnalytics\);[\s\S]*?\}\)\(\);/,
      },
    ];

    console.log('Scripts found in BaseLayout.astro:\n');

    for (const { name, pattern } of scriptPatterns) {
      const match = content.match(pattern);
      if (match && match[1]) {
        const scriptContent = match[1];
        const hash = calculateHash(scriptContent);
        console.log(`📝 ${name}`);
        console.log(`   Hash: 'sha256-${hash}'`);
        console.log(`   Length: ${scriptContent.length} bytes\n`);
      }
    }

    console.log('\n📋 Update vercel.json CSP header:\n');
    console.log('Change:');
    console.log('  "script-src \'self\' \'unsafe-inline\' https://www.googletagmanager.com ..."\n');
    console.log('To:');
    console.log('  "script-src \'self\' https://www.googletagmanager.com ... \'sha256-HASH1\' \'sha256-HASH2\' \'sha256-HASH3\'"\n');

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

extractAndHashScripts();
