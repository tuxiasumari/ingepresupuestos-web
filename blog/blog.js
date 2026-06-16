/* Blog — JS mínimo (solo menú móvil). El blog NO usa script.js de la landing
   porque ese script espera elementos que aquí no existen (versión, precios). */
(function () {
  'use strict';
  var toggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', function () { navLinks.classList.toggle('open'); });
  }
})();
