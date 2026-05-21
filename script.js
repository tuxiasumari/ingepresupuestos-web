/* ─────────────────────────────────────────────────────────────────────────
   IngePresupuestos — Landing JS (mínimo)

   Hace 2 cosas:
   1. Consulta `version.json` en el CDN propio (Cloudflare R2 vía
      downloads.ingepresupuestos.com) para mostrar la última versión
      y poner los links de descarga apuntando a los binarios correctos.
   2. Smooth scroll para los anchors del menú (CSS scroll-behavior ya lo
      cubre pero se mantiene como fallback).

   Sin frameworks. Sin dependencias. Sin build. Sin tracking.
   ──────────────────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  // Endpoint propio servido desde Cloudflare R2 (bucket público vía custom domain).
  const VERSION_URL = 'https://downloads.ingepresupuestos.com/version.json';

  // Fallback si el fetch falla (offline, DNS, R2 caído, etc.).
  function setFallback() {
    document.getElementById('latest-version').textContent = '— no disponible';
    const fallback = 'https://ingepresupuestos.com/#descargar';
    document.querySelectorAll('#dl-win, #dl-linux, #dl-win-zip, #dl-linux-tar')
      .forEach(el => el.setAttribute('href', fallback));
  }

  // ── Fetch al version.json en R2 ──────────────────────────────────────
  // Cache-bust con timestamp para que un release nuevo se vea inmediatamente
  // sin esperar al TTL del edge cache de Cloudflare.
  fetch(`${VERSION_URL}?t=${Date.now()}`, { headers: { 'Accept': 'application/json' } })
    .then(resp => {
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      return resp.json();
    })
    .then(data => {
      // Versión visible en el hero
      const version = data.version || '';
      document.getElementById('latest-version').textContent = version ? `v${version}` : '—';

      const dl = data.downloads || {};

      // Map botón → key en version.json.downloads
      const map = [
        ['dl-win',       'windows_installer'],
        ['dl-linux',     'linux_appimage'],
        ['dl-win-zip',   'windows_portable'],
        ['dl-linux-tar', 'linux_portable'],
      ];

      map.forEach(([id, key]) => {
        const el = document.getElementById(id);
        if (!el) return;
        const url = dl[key];
        if (url) {
          el.setAttribute('href', url);
        } else {
          // Si esa variante no existe en este release, mandamos a la sección
          el.setAttribute('href', '#descargar');
        }
      });
    })
    .catch(err => {
      console.warn('No se pudo cargar version.json:', err);
      setFallback();
    });

  // ── Smooth scroll fallback (CSS scroll-behavior ya cubre la mayoría) ─
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Update URL hash sin saltar
      history.pushState(null, '', targetId);
    });
  });
})();
