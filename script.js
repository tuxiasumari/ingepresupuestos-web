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
      document.getElementById('latest-version').textContent = version ? `v${version}` : '—';
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

  // Mini-carousels (prev/next horizontal scroll)
  document.querySelectorAll('.mini-carousel').forEach(root => {
    const track = root.querySelector('.mini-track');
    const prev = root.querySelector('.mini-prev');
    const next = root.querySelector('.mini-next');
    if (!track) return;

    function scrollBySlide(dir) {
      const slideW = track.querySelector('.mini-slide').offsetWidth;
      track.scrollBy({ left: dir * slideW, behavior: 'smooth' });
    }

    if (prev) prev.addEventListener('click', () => scrollBySlide(-1));
    if (next) next.addEventListener('click', () => scrollBySlide(1));
  });

})();
