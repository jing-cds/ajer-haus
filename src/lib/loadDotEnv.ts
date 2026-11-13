// src/lib/loadDotEnv.ts
// Shared by src/lib/prisma.ts and src/lib/stripe.ts, which both need their
// env vars loaded before constructing a client at import time. (Not shared
// with astro.config.mjs's own copy — that one runs as plain Node ESM before
// Vite/tsx starts, so it can't import a .ts file from src/lib.)
import fs from 'node:fs';
import path from 'node:path';

export function loadDotEnv(): void {
  const root = process.cwd();
  const envFiles = ['.env', '.env.local', '.env.development', '.env.development.local'];
  for (const file of envFiles) {
    const fullPath = path.resolve(root, file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          let value = trimmed.slice(eqIdx + 1).trim();
          if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          if (key && !process.env[key]) {
            process.env[key] = value;
          }
        }
      }
    }
  }
}
