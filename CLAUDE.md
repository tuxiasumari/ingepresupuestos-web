# IngePresupuestos · Landing Page

Sitio web público de **IngePresupuestos** — software desktop de presupuestos
de obra desarrollado por Ing. Marco Sumari Tellez.

URL en producción: **https://ingepresupuestos.com**
(actualmente `ingepresupuestos-web.pages.dev` mientras propaga el dominio
custom)

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
- **Sin dependencias JS**: el único `script.js` (84 líneas) consulta la API
  de GitHub Releases para llenar versión + URLs de descarga. Si falla,
  fallback al releases page.
- **Hosting**: Cloudflare Pages (free tier ilimitado para sitios estáticos).
- **CDN + SSL**: Cloudflare (gratis, automático).

**No agregar build steps** (webpack, vite, etc.) salvo justificación muy
fuerte. La simplicidad de "HTML que se sirve directo" es lo que mantiene
la velocidad y la facilidad de mantenimiento.

---

## Estructura

```
ingepresupuestos-web/
├── index.html              ← página única, ~360 líneas
├── style.css               ← ~640 líneas, variables CSS centralizadas
├── script.js               ← ~85 líneas, fetch GitHub Releases API
├── images/
│   ├── favicon.ico         ← 32 KB
│   ├── logo.png            ← 256×256, 11 KB
│   └── logo.svg            ← 7 KB
├── README.md               ← para humanos
└── CLAUDE.md               ← este archivo (para Claude Code)
```

### Paleta y tipografía (espejo de la app)

```css
--orange:        #F37329    /* acento principal (CTAs, badges) */
--orange-dark:   #C0621A
--orange-soft:   #FEF5EB
--slate-900:     #1A2434    /* fondo footer */
--slate-700:     #273445    /* texto principal */
--slate-500:     #485A6C    /* texto secundario */
--slate-300:     #667885    /* texto tenue */
--silver-100:    #F8F9FA    /* fondo de sections alternas */
```

**NO hardcodear colores** — usar las CSS variables. Si necesitás un color
nuevo, agregalo a `:root` en `style.css`.

---

## Secciones del index.html

```
┌─ Header sticky (logo + nav)
├─ Hero (titulo + tagline + 2 CTAs + screenshot mockup)
├─ Features grid (8 cards: ACU, Gantt, Reportes, Importadores, Curva S,
│                  Tuxia IA, Fórmula polinómica, Offline)
├─ Importadores (4 cards: Delphin, PowerCost, S10, IFC)
├─ Descargas (sección naranja con 2 botones grandes Win/Linux)
├─ Precios (3 cards: Trial / Perpetua / Anual — placeholders `$ —`)
├─ FAQ (9 preguntas, acordeón nativo <details>/<summary>)
└─ Footer (4 cols: brand, producto, recursos, contacto)
```

---

## Cómo deployar

### Production (automático)

Cualquier push a `main` dispara deploy automático en Cloudflare Pages:

```bash
git add .
git commit -m "feat: ..."
git push origin main
# → en ~30 segundos queda live en ingepresupuestos.com
```

### Local (testing antes de pushear)

```bash
cd ~/ingepresupuestos-web
python3 -m http.server 8765
# Abrir http://localhost:8765
```

### Preview en Cloudflare Pages

Cada **push a una branch que no es `main`** dispara un deploy de preview con
URL única (`abc123.ingepresupuestos-web.pages.dev`). Útil para mostrar
cambios antes de mergear sin afectar producción.

---

## Convenciones de assets

### Screenshots (PENDIENTE)

Actualmente la landing usa **placeholders** (gradiente con logo). Reemplazar
con capturas reales cuando Marco las tome:

| Nombre en `images/` | Resolución | Qué capturar |
|---------------------|-----------|--------------|
| `hero-screenshot.png` | 1600×1000 | Vista del proyecto con árbol + ACU + topbar |
| `feature-gantt.png` | 1200×800 | Gantt con ruta crítica roja |
| `feature-reportes.png` | 1200×800 | Centro de reportes con preview PDF |
| `feature-importar.png` | 1200×800 | Pantalla de import Delphin/PowerCost |
| `feature-tuxia.png` | 1200×800 | Tuxia respondiendo |

Optimizar PNG con tinypng.com o squoosh.app antes de commitear (<500 KB).

### OG banner (PENDIENTE)

Para previews al compartir en WhatsApp/Twitter/LinkedIn:

```
Archivo:     images/og-banner.png
Resolución:  1200×630 EXACTO
Contenido:   Logo grande + "IngePresupuestos" + tagline + fondo gradiente
```

Actualmente `meta property="og:image"` apunta a una URL que no existe todavía.

### Logo (LISTO)

`logo.svg` (vectorial) y `logo.png` (256×256 raster) están copiados del repo
del producto. **Si se actualiza el logo del producto**, sincronizar acá
también (no hay sync automático).

---

## Conexión con el repo del producto

| Conexión | Cómo se mantiene |
|----------|------------------|
| **URL de descarga** | `script.js` consulta `api.github.com/repos/tuxiasumari/ingepresupuestos-pyside6/releases/latest`. Bug actual: como el repo es privado, la API responde 404 a anónimos. **Migrar a Cloudflare R2 cuando esté listo el bucket.** |
| **Versión mostrada en hero** | Misma API. Cuando esté privado, mostrará "— ver en GitHub" como fallback. |
| **Precios** | Hardcoded en `index.html` (sección `#precios`). Cuando Marco decida precios reales, actualizar acá. |
| **URL_COMPRA del producto** | `core/licencia.py` del producto apunta a `https://ingepresupuestos.com/licencia` — cuando se decida vender, agregar `#licencia` con la oferta o `/licencia` como sección separada. |
| **Versión bundleada** | NO se sincroniza automático. La app desktop tiene su `CURRENT_VERSION` en `core/update_manager.py`, la web lee dinámicamente de Releases API. |

---

## Pendientes (priorizados)

### 🔴 Alta prioridad

1. **Migrar descargas a Cloudflare R2** — el repo del producto es privado, los Releases de GitHub no son accesibles para anónimos. Modificar `script.js` para apuntar a `downloads.ingepresupuestos.com/v$VERSION/...` cuando los workflows del producto suban allí.
2. **Screenshots reales** — Marco tomará capturas cuando esté inspirado. Reemplazar `screenshot-placeholder` en `index.html`.
3. **Conectar custom domain `ingepresupuestos.com`** — está en proceso, DNS propagando.

### 🟡 Media prioridad

4. **OG banner 1200×630** para compartir en redes.
5. **Variantes de logo** (blanco para fondo oscuro, monocromo).
6. **Favicons en distintos tamaños** (16, 32, 180 apple-touch).

### 🟢 Cuando llegue el momento

7. **Precios concretos** en sección `#precios`.
8. **Testimoniales** de beta testers contentos.
9. **GIF demo** o **video YouTube** de la app en acción (1-3 min).
10. **Analytics privacy-friendly** (Cloudflare Web Analytics — gratis, sin cookies).
11. **`sitemap.xml`** para Google Search Console cuando el dominio esté activo.

---

## Decisiones de diseño (no revertir sin discutir)

- **Sin frameworks JS**: HTML/CSS/JS plano. Si alguien sugiere React/Vue/Astro, declinar — la simplicidad ES el feature.
- **Sin trackers** (no GA, no FB Pixel, etc.). Privacy-first.
- **Sin cookies banner**: como no hay cookies de tracking, no necesitamos banner GDPR. Si en futuro agregamos analytics, usar uno cookieless (Plausible / Cloudflare Web Analytics).
- **Sin formulario de captura de email**: WhatsApp + Email + link directo a descarga son suficientes durante beta. Cuando lance comercial, evaluar Mailerlite/Buttondown free tier.
- **Idioma español neutro** (no rioplatense, no peninsular) — apunta a mercado peruano principalmente pero quiere ser legible para todo LATAM.

---

## Setup desde cero (si alguien clona este repo)

```bash
# 1. Clone
git clone https://github.com/tuxiasumari/ingepresupuestos-web.git
cd ingepresupuestos-web

# 2. Test local
python3 -m http.server 8765
# Abrir http://localhost:8765

# 3. Para deploy en producción (asumiendo ya tenés cuenta Cloudflare):
#    Cloudflare Dashboard → Workers & Pages → Create Application →
#    Connect to Git → seleccionar este repo → Build settings vacíos →
#    Save and Deploy. Listo en ~30 segundos.
```

---

## Contacto

- **Autor producto**: Ing. Marco Sumari Tellez
- **Email**: ing.sumari@gmail.com
- **WhatsApp**: +51 998 839 090
- **Repo producto**: github.com/tuxiasumari/ingepresupuestos-pyside6 (privado)
