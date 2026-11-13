import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import fs from 'node:fs';
import path from 'node:path';

function loadDotEnv() {
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
          if (key) process.env[key] = value;
        }
      }
    }
  }
}

loadDotEnv();

// Local-dev-only router for /api/* — mirrors how Vercel itself routes these
// in production (file-based: each entry under api/ is its own Serverless
// Function), so `astro dev` can hit the same endpoints without `vercel dev`.
// Ported from Unstitch's astro.config.ts (~/Unstitch), same trick.
//
// Standalone Serverless Functions get a direct entry each. Everything else
// goes through one of the two catch-all dispatchers (api/[...route].ts,
// api/admin/[...action].ts) by prefix — this delegates to THEIR route
// tables instead of re-listing every endpoint name here too, which is what
// let /api/contact 404 in dev after being added to api/[...route].ts alone:
// this file used to need the exact same name added a second time, by hand.
const STANDALONE_ROUTES = {
  '/api/create-checkout-session': './api/create-checkout-session.ts',
  '/api/stripe-webhook': './api/stripe-webhook.ts',
};

// Order matters: '/api/admin/' must be checked before the more general
// '/api/' so admin routes don't fall into the customer-facing dispatcher.
const CATCH_ALL_ROUTES = [
  { prefix: '/api/admin/', file: './api/admin/[...action].ts' },
  { prefix: '/api/', file: './api/[...route].ts' },
];

function resolveApiTarget(pathname) {
  const endpoint = pathname.replace(/\/$/, '');
  if (STANDALONE_ROUTES[endpoint]) {
    return { file: STANDALONE_ROUTES[endpoint], isRawBody: endpoint === '/api/stripe-webhook' };
  }
  for (const { prefix, file } of CATCH_ALL_ROUTES) {
    if (pathname.startsWith(prefix)) return { file, isRawBody: false };
  }
  return null;
}

function apiDevMiddleware() {
  return {
    name: 'api-dev-middleware',
    configureServer(server) {
      loadDotEnv();
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) {
          return next();
        }

        const pathname = req.url.split('?')[0];
        const target = resolveApiTarget(pathname);

        if (!target) {
          return next();
        }
        const targetFile = target.file;

        const isNoBodyMethod = req.method === 'GET' || req.method === 'HEAD';
        let bodyPromise;

        if (isNoBodyMethod || req.readableEnded) {
          bodyPromise = Promise.resolve(Buffer.alloc(0));
        } else {
          bodyPromise = new Promise((resolve, reject) => {
            const chunks = [];
            req.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
            req.on('end', () => resolve(Buffer.concat(chunks)));
            req.on('error', reject);
            if (req.readableEnded) resolve(Buffer.concat(chunks));
          });
        }

        try {
          const fullPath = path.resolve(process.cwd(), targetFile);
          let handler;
          if (typeof server.ssrLoadModule === 'function') {
            const mod = await server.ssrLoadModule(fullPath);
            handler = mod.default || mod;
          } else {
            handler = (await import(/* @vite-ignore */ `${fullPath}?t=${Date.now()}`)).default;
          }

          if (!handler) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: `Handler not found in ${targetFile}` }));
            return;
          }

          const rawBody = await bodyPromise;

          if (target.isRawBody) {
            req.rawBody = rawBody;
          } else {
            req.body = {};
            try {
              req.body = rawBody.length ? JSON.parse(rawBody.toString('utf8')) : {};
            } catch {
              req.body = {};
            }
          }

          res.status = (code) => {
            res.statusCode = code;
            return res;
          };
          res.json = (data) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
            return res;
          };

          await handler(req, res);
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Internal server error';
          console.error(`Dev API Error [${pathname}]:`, err);
          if (!res.writableEnded) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: message }));
          }
        }
      });
    },
  };
}

export default defineConfig({
  site: 'https://www.ajerhaus.com',
  integrations: [react()],
  redirects: { '/pre-order': '/collection' },
  vite: {
    plugins: [apiDevMiddleware()],
  },
});
