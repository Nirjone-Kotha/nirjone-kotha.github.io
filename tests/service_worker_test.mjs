import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const code = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
const handlers = {};
const recorded = { addAll: null, deleted: [], claimed: false, preload: false, skip: false, notification: null, opened: null };
const cache = { addAll: async items => { recorded.addAll = items; }, put: async () => {} };
const caches = {
  open: async () => cache,
  keys: async () => ['old-cache', 'moner-kotha-shell-4.1.0', 'moner-kotha-runtime-4.1.0'],
  delete: async key => { recorded.deleted.push(key); return true; },
  match: async () => null
};
const self = {
  location: { origin: 'https://example.test' },
  addEventListener: (name, handler) => { handlers[name] = handler; },
  registration: { navigationPreload: { enable: async () => { recorded.preload = true; } }, showNotification: async (title, options) => { recorded.notification = { title, options }; } },
  clients: { claim: async () => { recorded.claimed = true; }, matchAll: async () => [], openWindow: async url => { recorded.opened = url; } },
  skipWaiting: () => { recorded.skip = true; }
};
const context = { self, caches, URL, Response, fetch: async () => ({ ok: true, clone() { return this; } }), console };
vm.createContext(context);
vm.runInContext(code, context);
if (!handlers.install || !handlers.activate || !handlers.fetch || !handlers.message || !handlers.push || !handlers.notificationclick) throw new Error('missing handlers');
let installPromise;
handlers.install({ waitUntil: promise => { installPromise = promise; } });
await installPromise;
if (!recorded.addAll || recorded.addAll.length < 10) throw new Error('shell not precached');
let activatePromise;
handlers.activate({ waitUntil: promise => { activatePromise = promise; } });
await activatePromise;
if (!recorded.deleted.includes('old-cache') || !recorded.claimed || !recorded.preload) throw new Error('activation failed');
handlers.message({ data: { type: 'SKIP_WAITING' } });
if (!recorded.skip) throw new Error('skip waiting failed');
let pushPromise; handlers.push({ data: { json: () => ({ title: 'Test', body: 'Hello', url: '/' }) }, waitUntil: promise => { pushPromise = promise; } }); await pushPromise; if (!recorded.notification || recorded.notification.title !== 'Test') throw new Error('push notification failed');
console.log(JSON.stringify({ status: 'PASS', shellFiles: recorded.addAll.length, deleted: recorded.deleted, claimed: recorded.claimed, navigationPreload: recorded.preload, push: recorded.notification.title }));
