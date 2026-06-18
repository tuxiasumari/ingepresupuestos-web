/* Blog — JS mínimo (menú móvil + lightbox de imágenes). El blog NO usa
   script.js de la landing porque ese script espera elementos que aquí no
   existen (versión, precios). */
(function () {
  'use strict';

  /* ---- Menú móvil ---- */
  var toggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', function () { navLinks.classList.toggle('open'); });
  }

  /* ---- Lightbox / zoom de imágenes ---- */
  var zoomables = document.querySelectorAll('.zoomable, .article-cover');
  if (!zoomables.length) return;

  var box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('aria-hidden', 'true');
  box.innerHTML = '<button class="lightbox-close" aria-label="Cerrar">&times;</button>' +
                  '<img alt="">' +
                  '<div class="lightbox-cap"></div>';
  document.body.appendChild(box);

  var lbImg = box.querySelector('img');
  var lbCap = box.querySelector('.lightbox-cap');

  function abrir(src, alt, cap) {
    lbImg.src = src;
    lbImg.alt = alt || '';
    lbCap.textContent = cap || '';
    lbCap.style.display = cap ? 'block' : 'none';
    box.classList.add('open');
    box.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function cerrar() {
    box.classList.remove('open');
    box.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  zoomables.forEach(function (img) {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', function () {
      var fig = img.closest('figure') || img.parentElement;
      var capEl = fig ? fig.querySelector('figcaption') : null;
      abrir(img.currentSrc || img.src, img.alt, capEl ? capEl.textContent : '');
    });
  });

  box.addEventListener('click', function (e) {
    if (e.target !== lbImg) cerrar();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && box.classList.contains('open')) cerrar();
  });

  /* ---- Copiar enlace ---- */
  var copyBtn = document.querySelector('.share-copy');
  if (copyBtn) {
    var bar = copyBtn.closest('.share-bar');
    var url = (bar && bar.getAttribute('data-url')) || window.location.href;
    var txtEl = copyBtn.querySelector('.share-copy-txt');
    var original = txtEl ? txtEl.textContent : '';
    copyBtn.addEventListener('click', function () {
      var done = function () {
        copyBtn.classList.add('copiado');
        if (txtEl) txtEl.textContent = '¡Copiado!';
        setTimeout(function () {
          copyBtn.classList.remove('copiado');
          if (txtEl) txtEl.textContent = original;
        }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done, done);
      } else {
        var ta = document.createElement('textarea');
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta);
        done();
      }
    });
  }
})();
