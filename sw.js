/* Service Worker de Ecos Perdidos
 * Estrategias:
 *  - Precache: páginas, CSS, JS, imágenes, audios e íconos (funciona sin conexión).
 *  - Páginas (HTML): red primero, caché si no hay internet.
 *  - Resto de archivos propios: caché primero y se actualiza en segundo plano.
 *  - Fuentes de Google: se guardan al usarse por primera vez.
 *  - Videos: NO se guardan (pesan más de 250 MB); se piden siempre a la red.
 * Para publicar cambios, sube el número de VERSION.
 */
const VERSION = 'v1';
const CACHE = 'ecos-perdidos-' + VERSION;
const CACHE_FUENTES = 'ecos-perdidos-fuentes';

const PRECACHE = [
  './',
  './index.html',
  './offline.html',
  './manifest.json',
  './pages/galeria.html',
  './pages/linea-tiempo.html',
  './pages/historias.html',
  './pages/aporta.html',
  './pages/acerca.html',
  './css/base.css',
  './css/navbar.css',
  './css/components.css',
  './css/responsive.css',
  './js/data.js',
  './js/audio-player.js',
  './js/navbar.js',
  './js/filtros.js',
  './js/main.js',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/img/portada.jpg',
  './assets/img/equipo.jpg',
  './assets/img/camotero.jpg',
  './assets/img/afilador.jpg',
  './assets/img/fierro-viejo.jpg',
  './assets/img/organillero.jpg',
  './assets/img/telefono-disco.jpg',
  './assets/img/tamales.jpg',
  './assets/audio/camotero.mp3',
  './assets/audio/afilador.mp3',
  './assets/audio/fierro-viejo.mp3',
  './assets/audio/organillero.mp3',
  './assets/audio/telefono-disco.mp3',
  './assets/audio/tamales.mp3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      // Se guarda archivo por archivo: si uno falta, los demás sí se guardan.
      Promise.all(PRECACHE.map((url) =>
        cache.add(url).catch((err) => console.warn('[SW] No se pudo guardar', url, err))
      ))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((claves) => Promise.all(
        claves
          .filter((k) => k.startsWith('ecos-perdidos-') && k !== CACHE && k !== CACHE_FUENTES)
          .map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

/* Los audios se piden con "Range"; si vienen de la caché hay que responder 206. */
async function conRango(request, response) {
  const rango = request.headers.get('range');
  if (!rango || !response || response.status !== 200) return response;
  const m = /bytes=(\d*)-(\d*)/.exec(rango);
  if (!m) return response;
  const buf = await response.arrayBuffer();
  const total = buf.byteLength;
  let inicio, fin;
  if (m[1] === '' && m[2] !== '') {            // últimos N bytes
    inicio = Math.max(0, total - parseInt(m[2], 10));
    fin = total - 1;
  } else {
    inicio = parseInt(m[1] || '0', 10);
    fin = m[2] ? Math.min(parseInt(m[2], 10), total - 1) : total - 1;
  }
  return new Response(buf.slice(inicio, fin + 1), {
    status: 206,
    statusText: 'Partial Content',
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'audio/mpeg',
      'Content-Range': `bytes ${inicio}-${fin}/${total}`,
      'Content-Length': String(fin - inicio + 1),
      'Accept-Ranges': 'bytes'
    }
  });
}

async function paginaRedPrimero(request) {
  try {
    const respuesta = await fetch(request, { cache: 'no-cache' });
    if (respuesta && respuesta.ok) {
      const copia = respuesta.clone();
      caches.open(CACHE).then((c) => c.put(request, copia));
    }
    return respuesta;
  } catch (e) {
    const guardada = await caches.match(request, { ignoreSearch: true });
    return guardada || (await caches.match('./offline.html')) ||
      new Response('Sin conexión', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
}

async function cachePrimero(request) {
  const guardada = await caches.match(request, { ignoreSearch: true });
  const deRed = fetch(request).then((r) => {
    if (r && r.ok && !request.headers.has('range')) {
      const copia = r.clone();
      caches.open(CACHE).then((c) => c.put(request, copia));
    }
    return r;
  }).catch(() => null);

  if (guardada) {
    deRed.catch(() => {});                       // actualiza en segundo plano
    return conRango(request, guardada);
  }
  const r = await deRed;
  return r || new Response('', { status: 504 });
}

async function fuentes(request) {
  const cache = await caches.open(CACHE_FUENTES);
  const guardada = await cache.match(request);
  const deRed = fetch(request).then((r) => {
    if (r && (r.ok || r.type === 'opaque')) cache.put(request, r.clone());
    return r;
  }).catch(() => guardada);
  return guardada || deRed;
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // Fuentes de Google
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(fuentes(request));
    return;
  }

  // Solo archivos de este mismo sitio
  if (url.origin !== self.location.origin) return;

  // Videos: directo a la red, no se guardan
  if (request.destination === 'video' || /\.(mp4|webm|mov)$/i.test(url.pathname)) return;

  // Páginas
  if (request.mode === 'navigate') {
    event.respondWith(paginaRedPrimero(request));
    return;
  }

  event.respondWith(cachePrimero(request));
});
