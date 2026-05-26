# IngePresupuestos · Landing Page

Sitio web público de **IngePresupuestos** — software desktop de presupuestos
de obra desarrollado por Ing. Marco Sumari.

URL en producción: **https://ingepresupuestos.com**

Repo del **producto** (privado, código fuente): `~/ingepresupuestos-pyside6/`
→ `github.com/tuxiasumari/ingepresupuestos-pyside6`

Este repo es **independiente** del producto a propósito. Cambios acá no
disparan builds del producto y viceversa.

---

## Stack (intencionalmente simple)

- **HTML + CSS + JS vanilla** — sin React, Vue, Astro, ni nada que requiera
  build step. Cada edición a `index.html` o `style.css` queda live en
  Cloudflare Pages en ~30 segundos tras `git push`.
- **Tipografía**: Inter (Google Fonts vía CDN con preconnect). Misma que la
  app desktop para coherencia visual.
- **`script.js`** (~70 líneas): consulta `version.json` en Cloudflare R2 para
  versión + URLs de descarga. Smooth scroll. Mobile hamburger toggle.
  Scroll reveal (IntersectionObserver). Mini-carousels con prev/next.
- **Hosting**: Cloudflare Pages (free tier ilimitado para sitios estáticos).
- **CDN + SSL**: Cloudflare (gratis, automático).

**No agregar build steps** (webpack, vite, etc.) salvo justificación muy
fuerte. La simplicidad de "HTML que se sirve directo" es lo que mantiene
la velocidad y la facilidad de mantenimiento.

---

## Estructura

```
ingepresupuestos-web/
├── index.html              ← página única
├── style.css               ← variables CSS centralizadas, paleta elementary
├── script.js               ← fetch R2, smooth scroll, reveal, mini-carousel
├── images/
│   ├── favicon.ico
│   ├── logo.png            ← 256×256
│   ├── logo.svg
│   ├── tuxia-icon.png      ← 620×783, ícono Tuxia (pingüino morado con casco AI)
│   ├── ingeconverter-icon.png ← 256×256, ícono IngeConverter (pingüino S10)
│   └── screenshots/
│       ├── principal.png           ← 1920×1080, hero
│       ├── dashboard-windows.jpg   ← 1600×900
│       ├── dashboard-linux.jpg     ← 1600×1000
│       ├── cronograma-gantt.jpg    ← 1600×860
│       ├── proyecto-resumen.jpg    ← 1600×860
│       ├── tuxia.png               ← 1920×1080
│       ├── especificaciones.png    ← 1920×1080
│       ├── centro-reportes.jpg     ← 1600×860
│       ├── importar-powercost.jpg  ← 1600×860
│       ├── proyecto-acu.jpg        ← (no usada aún)
│       ├── proyecto-insumos.jpg    ← (no usada aún)
│       ├── proyecto-metrados-tuxia.jpg ← (no usada aún)
│       ├── proyecto-especificaciones.jpg ← (no usada aún)
│       └── config-ia-linux.jpg     ← (no usada aún)
├── README.md
└── CLAUDE.md               ← este archivo
```

### Paleta (espejo de elementary OS + app)

```css
--orange:      #F37329    /* acento principal (CTAs, badges, línea animada) */
--orange-dk:   #C0621A
--orange-soft: #FEF5EB
--purple:      #7A36B1    /* sección Tuxia IA (Grape de elementary) */
--purple-dk:   #5B2387
--banana-soft: #FDF8E8    /* sección importadores (Banana de elementary) */
--banana:      #F9C440
--slate-900:   #1A2434    /* fondo footer + sección impact */
--slate-700:   #273445    /* header nav + topbar app */
--slate-500:   #485A6C    /* texto secundario */
--slate-300:   #667885    /* texto tenue */
--silver-100:  #F8F9FA    /* fondo sections alternas */
```

**NO hardcodear colores** — usar las CSS variables.

---

## Diseño actual (sesión 2026-05-26)

Inspirado en **elementary.io**: secciones alternadas con screenshot grande
a un lado y texto al otro, mucho aire, tipografía grande.

```
┌─ Header sticky dark (slate-700, espejo del topbar de la app)
│  Logo + nav links + hamburger mobile (sin botón CTA en header)
│
├─ Hero (centrado)
│  "El software de presupuestos de obra para que lo lleves a todos lados"
│  Sub: "Multiplataforma. Offline. Formato abierto. Compatible con S10, Delphin y PowerCost."
│  CTA: "Descargar IngePresupuestos" + versión
│
├─ Feature 1: Multiplataforma (blanco)
│  Texto izq │ Mini-carrusel Win/Linux der (prev/next buttons)
│  "Otras plataformas próximamente" (visión: Android, iOS, Mac)
│
├─ Feature 2: Centro de Reportes (gris, reverso)
│  Screenshot izq │ Texto der
│  11 tipos: presupuestos, ACU, metrados, insumos, specs, cronogramas
│  Exporta a Excel, Word, MS Project, ODS, ODT
│
├─ Feature 3: Tuxia IA (morado #7A36B1, con ícono Tuxia)
│  Texto izq │ Screenshot der
│
├─ Feature 4: Gantt y Cronogramas (gris, reverso)
│  Screenshot izq │ Texto der
│
├─ Feature 5: Importadores (banana #FDF8E8, con ícono IngeConverter)
│  Texto izq │ Screenshot der
│
├─ Feature 6: Formato abierto SQLite (gris, reverso)
│  Screenshot izq │ Texto der
│
├─ Impact: "Trabaja offline si quieres" (slate-900, texto centrado)
│
├─ Descargar (gradiente naranja, cards Win/Linux)
│  "Prueba completa por 30 días."
│
├─ Licenciamiento (gris, 3 cards: Gratis $0 / Perpetua $150 / Anual $30)
│  "Licenciamiento como debería ser — Elección sin compromiso"
│  Botones "Comprar" → WhatsApp directo con mensaje pre-llenado
│
├─ FAQ (blanco, 7 preguntas, acordeón <details>)
│
└─ Footer (slate-900, 4 cols: brand, producto, recursos, contacto)
```

### Animaciones
- **Hero**: fade-up escalonado (título → subtítulo → CTAs → screenshot)
- **Scroll reveal**: cada sección `.feat` aparece con fade + translateY al entrar en viewport (IntersectionObserver, threshold 0.15)
- **Línea naranja animada**: `h2::after` crece de 0 a 48px cuando la sección se hace `.visible` (blanca en sección morada de Tuxia)
- **Hero screenshot**: sombra pronunciada, sin efectos de rotación/brillo

### Responsivo
- `≤ 860px`: feat-row apila en columna (texto arriba, imagen abajo)
- `≤ 760px`: nav-links se ocultan, hamburger visible, menú desplegable
- Mini-carrusel: prev/next botones siempre visibles, scroll-snap nativo

---

## Cómo deployar

### Production (automático)

```bash
git add .
git commit -m "feat: ..."
git push origin main
# → ~30 segundos queda live en ingepresupuestos.com
```

### Local (testing)

```bash
cd ~/ingepresupuestos-web
python3 -m http.server 8765
# Abrir http://localhost:8765
```

---

## Conexión con el repo del producto

| Conexión | Cómo se mantiene |
|----------|------------------|
| **URL de descarga** | `script.js` consulta `downloads.ingepresupuestos.com/version.json` (Cloudflare R2). |
| **Versión en hero** | Misma API de R2. Fallback: "— no disponible". |
| **Precios** | Hardcoded en `index.html` (sección `#precios`). Botones "Comprar" → WhatsApp directo (`wa.me/51998839090`) con mensaje pre-llenado por tipo de licencia. |
| **Íconos** | `tuxia-icon.png` copiado de `resources/icons/elementary/24/tuxia.png` del producto. `ingeconverter-icon.png` copiado de `~/ingeconverter/resources/icons/ingeconverter_256.png`. Si se actualizan, sincronizar manualmente. |

---

## Pendientes (priorizados)

### 🔴 Alta prioridad

1. **Screenshots dedicados por sección** — las capturas actuales son genéricas. Idealmente una captura fresca de la v2.3 enfocada en lo que cada sección describe.
2. **OG banner 1200×630** — para previews al compartir en WhatsApp/Twitter/LinkedIn.
3. **Subir binarios v2.3.0 a R2** — para que los botones de descarga funcionen.

### 🟡 Media prioridad

4. **Favicons en distintos tamaños** (16, 32, 180 apple-touch).
5. **Video demo corto** (1-2 min) embebido en la landing o YouTube.

### 🟢 Cuando llegue el momento

6. **Testimoniales** de beta testers.
7. **Analytics privacy-friendly** (Cloudflare Web Analytics — gratis, sin cookies).
8. **`sitemap.xml`** para Google Search Console.
9. **Página de IngeConverter** — sección o página dedicada al convertidor S10.

---

## Decisiones de diseño (no revertir sin discutir)

- **Sin frameworks JS**: HTML/CSS/JS plano.
- **Sin trackers** (no GA, no FB Pixel).
- **Sin cookies banner**: no hay cookies de tracking.
- **Diseño estilo elementary.io**: screenshot grande a un lado, texto al otro, alternando. Mucho aire. Imagen como protagonista.
- **Header oscuro (slate-700)**: espejo del topbar de la app desktop.
- **Sección Tuxia morada**: color Grape de elementary, con ícono del pingüino.
- **Sección Importadores banana**: color Banana de elementary, con ícono IngeConverter.
- **Idioma español neutro** (no rioplatense, no peninsular) — tuteo para todo LATAM.
- **No publicar sin aprobación de Marco**: iterar local con `python3 -m http.server 8765`, NO `git push` hasta que Marco diga explícitamente.
- **Nombre del autor**: usar "Ing. Marco Sumari" (sin apellido materno).

---

## Contacto

- **Autor producto**: Ing. Marco Sumari
- **Email**: ing.sumari@gmail.com
- **WhatsApp**: +51 998 839 090
- **Repo producto**: github.com/tuxiasumari/ingepresupuestos-pyside6 (privado)
