/* ─────────────────────────────────────────────────────────────────────────
   IngePresupuestos — Landing JS
   ──────────────────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  const VERSION_URL = 'https://downloads.ingepresupuestos.com/version.json';

  function setFallback() {
    document.getElementById('latest-version').textContent = '— no disponible';
    const fallback = 'https://ingepresupuestos.com/#descargar';
    document.querySelectorAll('#dl-win, #dl-linux, #dl-win-zip, #dl-linux-tar')
      .forEach(el => el.setAttribute('href', fallback));
  }

  fetch(`${VERSION_URL}?t=${Date.now()}`, { headers: { 'Accept': 'application/json' } })
    .then(resp => {
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      return resp.json();
    })
    .then(data => {
      const version = data.version || '';
      let label = version ? `v${version}` : '—';
      if (version && data.release_date) {
        const d = new Date(`${data.release_date}T00:00:00`);
        if (!isNaN(d)) {
          label += ` · ${d.toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })}`;
        }
      }
      document.getElementById('latest-version').textContent = label;
      const dl = data.downloads || {};
      [
        ['dl-win',       'windows_installer'],
        ['dl-linux',     'linux_appimage'],
        ['dl-win-zip',   'windows_portable'],
        ['dl-linux-tar', 'linux_portable'],
      ].forEach(([id, key]) => {
        const el = document.getElementById(id);
        if (el) el.setAttribute('href', dl[key] || '#descargar');
      });
      const ic = (data.ingeconverter || {}).downloads || {};
      [
        ['dl-ic-win',     'windows_installer'],
        ['dl-ic-linux',   'linux_portable'],
        ['dl-ic-win-zip', 'windows_portable'],
      ].forEach(([id, key]) => {
        const el = document.getElementById(id);
        if (el) el.setAttribute('href', ic[key] || '#descargar');
      });
    })
    .catch(() => setFallback());

  // Precios según ubicación: soles en Perú (default), dólares fuera.
  // /cdn-cgi/trace es de Cloudflare, mismo origen, sin cookies. Fallback: zona horaria.
  function applyCurrency(curr) {
    document.querySelectorAll('[data-pen]').forEach(el => {
      el.textContent = curr === 'PEN' ? el.dataset.pen : el.dataset.usd;
    });
  }
  fetch('/cdn-cgi/trace')
    .then(resp => {
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      return resp.text();
    })
    .then(text => {
      const loc = (text.match(/^loc=(\w+)$/m) || [])[1];
      applyCurrency(loc === 'PE' ? 'PEN' : 'USD');
    })
    .catch(() => {
      const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || '');
      applyCurrency(tz === 'America/Lima' ? 'PEN' : 'USD');
    });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', id);
      document.querySelector('.nav-links')?.classList.remove('open');
    });
  });

  // Mobile toggle
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  }

  // Scroll reveal (IntersectionObserver)
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach(function (el) { obs.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  // Mini-carousels (prev/next horizontal scroll, infinite wrap-around)
  document.querySelectorAll('.mini-carousel').forEach(root => {
    const track = root.querySelector('.mini-track');
    const prev = root.querySelector('.mini-prev');
    const next = root.querySelector('.mini-next');
    if (!track) return;

    function go(dir) {
      const slides = track.querySelectorAll('.mini-slide');
      const count = slides.length;
      if (!count) return;
      const slideW = slides[0].offsetWidth;
      let idx = Math.round(track.scrollLeft / slideW);
      idx = (idx + dir + count) % count;           // wrap around → infinito
      track.scrollTo({ left: idx * slideW, behavior: 'smooth' });
    }

    if (prev) prev.addEventListener('click', () => go(-1));
    if (next) next.addEventListener('click', () => go(1));
  });

  // ── Lightbox (ampliar imágenes) ───────────────────────────────────────
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.setAttribute('aria-hidden', 'true');
  lb.innerHTML =
    '<button class="lightbox-close" type="button" aria-label="Cerrar">×</button>' +
    '<img alt="">';
  document.body.appendChild(lb);
  const lbImg = lb.querySelector('img');

  function openLightbox(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || '';
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  // Cualquier captura dentro de carruseles o feat-img es ampliable
  document.querySelectorAll('.mini-slide img, .feat-img img').forEach(img => {
    img.classList.add('zoomable');
    img.addEventListener('click', () => openLightbox(img.currentSrc || img.src, img.alt));
  });

  lb.addEventListener('click', e => {
    if (e.target === lb || e.target.classList.contains('lightbox-close')) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lb.classList.contains('open')) closeLightbox();
  });

  // Copiar comando winget
  document.querySelectorAll('.dl-winget-copy').forEach(function (btn) {
    btn.addEventListener('click', function () {
      navigator.clipboard.writeText(btn.dataset.copy).then(function () {
        var prev = btn.textContent;
        btn.textContent = '¡Copiado!';
        btn.classList.add('copied');
        setTimeout(function () { btn.textContent = prev; btn.classList.remove('copied'); }, 1600);
      });
    });
  });

})();
