/* ─────────────────────────────────────────────────────────────────────────
   IngePresupuestos — Landing JS (mínimo)

   Hace 2 cosas:
   1. Consulta la API de GitHub Releases para mostrar la última versión
      y poner los links de descarga apuntando a los assets correctos.
   2. Smooth scroll para los anchors del menú (CSS scroll-behavior ya lo
      cubre pero se mantiene como fallback).

   Sin frameworks. Sin dependencias. Sin build. Sin tracking.
   ──────────────────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  // Repo del producto desde donde se descargan los binarios.
  const REPO = 'tuxiasumari/ingepresupuestos-pyside6';
  const RELEASES_API = `https://api.github.com/repos/${REPO}/releases/latest`;
  const RELEASES_LATEST_PAGE = `https://github.com/${REPO}/releases/latest`;

  // Fallback al releases page si la API falla (rate limit, sin internet, etc.)
  function setFallback() {
    document.getElementById('latest-version').textContent = '— ver en GitHub';
    document.querySelectorAll('#dl-win, #dl-linux, #dl-win-zip, #dl-linux-tar')
      .forEach(el => el.setAttribute('href', RELEASES_LATEST_PAGE));
  }

  // Buscar entre los assets el primero que matchee un patrón
  function findAsset(assets, regex) {
    return assets.find(a => regex.test(a.name));
  }

  // ── Fetch a la API de GitHub ─────────────────────────────────────────
  fetch(RELEASES_API, { headers: { 'Accept': 'application/vnd.github+json' } })
    .then(resp => {
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      return resp.json();
    })
    .then(data => {
      // Versión visible en el hero
      const tag = data.tag_name || '';
      document.getElementById('latest-version').textContent = tag;

      const assets = data.assets || [];

      // Map de cada botón al patrón de asset que tiene que matchear
      const map = [
        ['dl-win',       /setup.*\.exe$/i],
        ['dl-linux',     /\.AppImage$/i],
        ['dl-win-zip',   /windows.*\.zip$/i],
        ['dl-linux-tar', /linux.*\.tar\.gz$/i],
      ];

      map.forEach(([id, rx]) => {
        const el = document.getElementById(id);
        if (!el) return;
        const asset = findAsset(assets, rx);
        if (asset) {
          el.setAttribute('href', asset.browser_download_url);
        } else {
          // Si ese asset no existe en este release, mandamos al releases page
          el.setAttribute('href', RELEASES_LATEST_PAGE);
        }
      });
    })
    .catch(err => {
      console.warn('No se pudo cargar la última versión desde GitHub:', err);
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
