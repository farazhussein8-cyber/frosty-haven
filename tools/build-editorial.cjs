/* ------------------------------------------------------------------
   FROSTY HAVEN — editorial art direction pass
   Grades the source photography into the brand palette (blush / cream
   / near-black), then cuts the crops the layout actually needs.
   Nothing here modifies the originals.
   ------------------------------------------------------------------ */
const sharp = require('C:/Users/GGPC/Downloads/the-fade-creators/node_modules/sharp');
const path = require('path'), fs = require('fs');

const DL  = 'C:/Users/GGPC/Downloads';
// Copied out of Screenshots deliberately: the approved comp is the source of
// truth for the hero and screenshot filenames get reused and overwritten.
const MOCK = 'C:/Users/GGPC/OneDrive/Desktop/frosty-haven-website/images/hero-comp-crave.png';
const RAW = 'C:/Users/GGPC/OneDrive/Desktop/frosty-haven-website/images';
const OUT = path.join(__dirname, '..', 'images');
fs.mkdirSync(OUT, { recursive: true });

const BLUSH = [0xF4, 0xDE, 0xDF];

/* ---- the grade -------------------------------------------------
   Pulls the set background toward blush while leaving the dessert
   itself alone: the mask keys on low saturation + high lightness,
   which is the wall and the table and nothing that goes in a cup. */
async function graded(src, o) {
  o = Object.assign({ sat: 0.8, bri: 1.10, blush: 1, boost: 1.15, satCut: 0.34, lCut: 0.30, warm: 1.05 }, o || {});
  // `lift` raises the floor without touching white, for the shots that are
  // lit dark. Absolute black next to the cream page reads as a hole punched
  // in the paper, and it is also where WebP bands worst.
  const liftK = (255 - (o.lift || 0)) / 255;
  const { data, info } = await sharp(src).raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height, ch = info.channels;
  const out = Buffer.alloc(w * h * 3);
  for (let i = 0, p = 0; i < w * h; i++, p += ch) {
    let r = data[p], g = data[p + 1], b = data[p + 2];
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    const s = mx === 0 ? 0 : (mx - mn) / mx, l = mx / 255;
    let m = Math.max(0, Math.min(1, (o.satCut - s) / o.satCut)) *
            Math.max(0, Math.min(1, (l - o.lCut) / 0.45));
    m = Math.pow(m, 0.85) * o.boost;
    const avg = (r + g + b) / 3;
    r = (avg + (r - avg) * o.sat) * o.bri;
    g = (avg + (g - avg) * o.sat) * o.bri;
    b = (avg + (b - avg) * o.sat) * o.bri;
    const a = Math.min(1, m * o.blush), lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    r = r * (1 - a) + BLUSH[0] * lum * o.warm * a;
    g = g * (1 - a) + BLUSH[1] * lum * o.warm * a;
    b = b * (1 - a) + BLUSH[2] * lum * o.warm * a;
    if (o.lift) { r = r * liftK + o.lift; g = g * liftK + o.lift; b = b * liftK + o.lift; }
    out[i * 3]     = Math.max(0, Math.min(255, r | 0));
    out[i * 3 + 1] = Math.max(0, Math.min(255, g | 0));
    out[i * 3 + 2] = Math.max(0, Math.min(255, b | 0));
  }
  return sharp(out, { raw: { width: w, height: h, channels: 3 } });
}

/* ---- feather masks --------------------------------------------- */
function edgeMask(w, h, fx, fyTop, fyBot) {
  // Two luminance masks, nested: the horizontal fade multiplies the vertical
  // one, and the white rect underneath turns the result into real alpha.
  const svg = '<svg width="' + w + '" height="' + h + '" xmlns="http://www.w3.org/2000/svg"><defs>' +
    '<linearGradient id="lx" x1="0" x2="1">' +
      '<stop offset="0" stop-color="#000"/>' +
      '<stop offset="' + (fx * 0.38) + '" stop-color="#4d4d4d"/>' +
      '<stop offset="' + fx + '" stop-color="#fff"/>' +
      '<stop offset="' + (1 - fx) + '" stop-color="#fff"/>' +
      '<stop offset="' + (1 - fx * 0.38) + '" stop-color="#4d4d4d"/>' +
      '<stop offset="1" stop-color="#000"/></linearGradient>' +
    '<linearGradient id="ly" x1="0" x2="0" y1="0" y2="1">' +
      '<stop offset="0" stop-color="#000"/>' +
      '<stop offset="' + (fyTop * 0.4) + '" stop-color="#404040"/>' +
      '<stop offset="' + fyTop + '" stop-color="#fff"/>' +
      '<stop offset="' + (1 - fyBot) + '" stop-color="#fff"/>' +
      '<stop offset="' + (1 - fyBot * 0.32) + '" stop-color="#3a3a3a"/>' +
      '<stop offset="1" stop-color="#000"/></linearGradient>' +
    '<mask id="mx"><rect width="100%" height="100%" fill="url(#lx)"/></mask>' +
    '<mask id="my"><rect width="100%" height="100%" fill="url(#ly)" mask="url(#mx)"/></mask>' +
    '</defs><rect width="100%" height="100%" fill="#fff" mask="url(#my)"/></svg>';
  return Buffer.from(svg);
}

const box = (m, x0, y0, x1, y1) => ({
  left: Math.round(m.width * x0), top: Math.round(m.height * y0),
  width: Math.round(m.width * (x1 - x0)), height: Math.round(m.height * (y1 - y0))
});

async function emit(pipe, name, widths, q) {
  const meta = await pipe.clone().metadata();
  for (const w of widths) {
    if (w > meta.width * 1.35) continue;
    const f = path.join(OUT, name + '-' + w + '.webp');
    await pipe.clone().resize({ width: w, withoutEnlargement: false })
      .webp({ quality: q || 80, effort: 6, alphaQuality: 92 }).toFile(f);
  }
  console.log(name.padEnd(20), meta.width + 'x' + meta.height, widths.join('/'));
}

(async () => {
  /* ============ HERO — graded line-up, feathered into the page ==== */
  const pearlSrc = DL + '/frosty-haven-lineup-premium-pearl.png';
  const pg = await graded(pearlSrc, { sat: 0.8, bri: 1.10, boost: 1.15 });
  const pm = await pg.clone().metadata();

  // front plate — the centre desserts, sharper, sits over the wordmark
  {
    const c = box(pm, 0.24, 0.10, 0.78, 1);
    const base = await pg.clone().extract(c).sharpen({ sigma: 0.6 }).ensureAlpha()
      .composite([{ input: edgeMask(c.width, c.height, 0.10, 0.13, 0.17), blend: 'dest-in' }])
      .png().toBuffer();
    await emit(sharp(base), 'ed-hero-front', [1100, 800, 560], 84);
  }
  // mobile — tighter, taller crop
  {
    const c = box(pm, 0.17, 0.06, 0.85, 1);
    const base = await pg.clone().extract(c).ensureAlpha()
      .composite([{ input: edgeMask(c.width, c.height, 0.07, 0.12, 0.05), blend: 'dest-in' }])
      .png().toBuffer();
    await emit(sharp(base), 'ed-hero-m', [900, 640, 460], 82);
  }

  // side dessert — a small group lifted off the end of the line-up,
  // feathered so it reads as a foreground object on the blush field
  {
    const c = box(pm, 0.015, 0.155, 0.205, 1);
    const base = await pg.clone().extract(c).sharpen({ sigma: 0.5 }).ensureAlpha()
      .composite([{ input: edgeMask(c.width, c.height, 0.17, 0.14, 0.16), blend: 'dest-in' }])
      .png().toBuffer();
    await emit(sharp(base), 'ed-hero-side-l', [620, 420, 300], 84);
  }
  /* ============ DARK — the same line-up, noir ==================== */
  const noirSrc = DL + '/frosty-haven-lineup-premium-noir.png';
  const nm = await sharp(noirSrc).metadata();
  await emit(sharp(noirSrc), 'ed-crave', [1672, 1200, 860], 80);
  {
    const c = box(nm, 0.28, 0.08, 0.74, 1);
    const base = await sharp(noirSrc).extract(c).modulate({ brightness: 0.86 }).ensureAlpha()
      .composite([{ input: edgeMask(c.width, c.height, 0.30, 0.28, 0.40), blend: 'dest-in' }])
      .png().toBuffer();
    await emit(sharp(base), 'ed-noir-cut', [1000, 720, 520], 84);
  }

  /* ============ HERO PHOTOGRAPH ==================================
     The approved comp used whole, with its baked-in type lifted out so the
     real headline and buttons stay live text on top.

     Only the glyphs are replaced, not the field around them. An earlier
     pass rebuilt the whole left side by ramping from the frame edge to a
     clean column near the shake, which looked right but roughly doubled the
     gradient: the comp holds just 0-7 levels across that dark area, so a
     stretched version turns invisible one-level steps into banding the
     encoder then blocks up. Masking the type and interpolating across each
     glyph run leaves the original field untouched. */
  {
    const SRC = MOCK;
    const TEXT = 22;  // a glyph is far brighter than the field, which is 0-7
    const GROW = 8;   // dilate from the cores to swallow the antialiased halo

    const { data, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true });
    const w = info.width, h = info.height, cn = info.channels, n = w * h;
    const px = (x, y, c) => data[(y * w + x) * cn + c];
    const lum = (x, y) => 0.299 * px(x, y, 0) + 0.587 * px(x, y, 1) + 0.114 * px(x, y, 2);
    // the two places the comp puts type, both over the near-black field;
    // the copy block stops short of the shake, whose glass starts near x .428
    const inType = (x, y) => (y < h * 0.125) || (x < w * 0.422 && y < h * 0.86);

    // Threshold globally, not against a local floor. A local floor sounds
    // safer but the field itself spans 0-7, so its own gradient clears
    // floor+5 and gets masked - which flattened the comp's ambient falloff
    // to black and left a hard edge where the mask stopped. A flat cut at 22
    // is far above the field and far below any glyph, so it takes the type
    // and nothing else. The halo is handled by dilation from the cores
    // instead, which does not care how faint the halo is.
    const mask = new Uint8Array(n);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      if (inType(x, y) && lum(x, y) > TEXT) mask[y * w + x] = 1;
    }
    const grown = Uint8Array.from(mask);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      if (!mask[y * w + x]) continue;
      for (let dy = -GROW; dy <= GROW; dy++) for (let dx = -GROW; dx <= GROW; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx >= 0 && ny >= 0 && nx < w && ny < h && inType(nx, ny)) grown[ny * w + nx] = 1;
      }
    }

    // Interpolate across each masked run from the clean field either side.
    // Across a smooth field that reproduces the gradient rather than
    // replacing it, so the falloff survives.
    const out = Buffer.alloc(n * 3);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (!grown[i]) { for (let c = 0; c < 3; c++) out[i * 3 + c] = px(x, y, c); continue; }
      let l = x; while (l > 0 && grown[y * w + l]) l--;
      let r = x; while (r < w - 1 && grown[y * w + r]) r++;
      const tt = (x - l) / Math.max(1, r - l);
      for (let c = 0; c < 3; c++) {
        out[i * 3 + c] = Math.round(px(l, y, c) * (1 - tt) + px(r, y, c) * tt);
      }
    }
    const base = await sharp(out, { raw: { width: w, height: h, channels: 3 } }).png().toBuffer();
    for (const width of [1920, 1440, 1100, 760]) {
      await sharp(base).resize({ width, kernel: 'lanczos3' })
        .webp({ quality: 93, effort: 6, smartSubsample: true })
        .toFile(path.join(OUT, 'ed-hero-bg-' + width + '.webp'));
    }
    console.log('ed-hero-bg'.padEnd(20), w + 'x' + h, '1920/1440/1100/760');
  }
  /* ============ PRODUCT PLATES =================================== */
  const PLATES = [
    ['ed-p-loadedcup', RAW + '/loaded-cup-hero.webp',   { sat: 0.62, bri: 1.16, boost: 1.5, satCut: 0.55 }, [0.26, 0.27, 0.74, 0.99], [1200, 840, 560]],
    // The cup is tall and narrow where the old bowl was wide, so the crop
    // keeps the full frame width and only trims above the swirl and below the
    // base. Closing in horizontally would cut the cup off at the bottom.
    ['ed-p-pista',     RAW + '/flurr-pista-cup.png',    { sat: 0.62, bri: 1.16, boost: 1.5, satCut: 0.55 }, [0.00, 0.085, 1.00, 0.915], [1200, 840, 560]],
    ['ed-p-acai',      RAW + '/featured-acai-bowl.png', { sat: 0.88, bri: 1.06, boost: 0.75, satCut: 0.30 }, [0.00, 0.00, 1.00, 1.00], [1100, 760, 520]],
    // Back on the pink set, so this takes the same blush grade as the rest of
    // the plates. The crop only trims dead space above the straws and below
    // the ice — the shot is composed square and cropping it to the old
    // landscape ratio would cut the cups off at the base.
    ['ed-p-shakes',    RAW + '/milkshakes-trio-splash.png', { sat: 0.62, bri: 1.16, boost: 1.5, satCut: 0.55 }, [0.00, 0.085, 1.00, 0.925], [1300, 900, 620]],
    ['ed-p-lava',      RAW + '/lava-cake.webp',         { sat: 0.62, bri: 1.16, boost: 1.5, satCut: 0.55 }, [0.18, 0.29, 0.82, 0.97], [1200, 840, 560]],
    ['ed-p-twist',     RAW + '/soft-serve-twist.webp',  { sat: 0.62, bri: 1.16, boost: 1.5, satCut: 0.55 }, [0.29, 0.30, 0.83, 0.99], [1100, 760, 520]],
    ['ed-marble',      DL + '/frosty-haven-dessert-cream-marble-table.png',   { sat: 0.86, bri: 1.05, boost: 0.9 }, [0.17, 0.15, 0.89, 1.00], [1200, 840, 560]],
    ['ed-shop',        DL + '/frosty-haven-option-2-premium-stone-counter.png', { sat: 0.78, bri: 1.08, boost: 1.0 }, [0, 0, 1, 1], [1300, 900, 640]],
  ];
  for (const row of PLATES) {
    const name = row[0], src = row[1], g = row[2], crop = row[3], widths = row[4];
    const pipe = await graded(src, g);
    const m = await pipe.clone().metadata();
    await emit(pipe.extract(box(m, crop[0], crop[1], crop[2], crop[3])), name, widths, 80);
  }

  /* ============ LOGO — flat mark, used as a CSS mask =============
     The supplied logo is glossy 3D pink on a soft drop shadow. Neither
     survives at nav size, so this reduces it to a flat silhouette: the
     shadow is grey and the mark is saturated, so the shadow is keyed out
     on chroma rather than by thresholding alpha (which would eat the
     antialiased edges and leave a pale halo). The result is served as a
     mask so one file paints ink on the light surfaces and cream on the
     dark ones, straight from currentColor. */
  {
    const smooth = (e0, e1, x) => { const v = Math.max(0, Math.min(1, (x - e0) / (e1 - e0))); return v * v * (3 - 2 * v); };
    const trimmed = await sharp(RAW + '/logo.png').trim({ threshold: 5 }).png().toBuffer();
    const { data, info } = await sharp(trimmed).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const w = info.width, h = info.height, n = w * h;
    const px = Buffer.alloc(n * 4);
    for (let i = 0; i < n; i++) {
      const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2], a = data[i * 4 + 3] / 255;
      const chroma = (Math.max(r, g, b) - Math.min(r, g, b)) / 255;
      const keep = smooth(0.09, 0.24, chroma);
      px[i * 4] = 17; px[i * 4 + 1] = 17; px[i * 4 + 2] = 17;
      px[i * 4 + 3] = Math.round(255 * smooth(0.16, 0.60, a * keep));
    }
    const flat = await sharp(px, { raw: { width: w, height: h, channels: 4 } })
      .trim({ threshold: 2 }).png().toBuffer();
    const fm = await sharp(flat).metadata();
    await sharp(flat).resize({ width: 512 })
      .png({ compressionLevel: 9, palette: true }).toFile(path.join(OUT, 'logo-mark.png'));
    console.log('logo-mark'.padEnd(20), fm.width + 'x' + fm.height, 'ratio ' + (fm.width / fm.height).toFixed(3));
  }
  /* ============ MENU TILES — 4:5 portrait ======================== */
  const TILES = [
    ['ed-t-loadedcup', 'ed-p-loadedcup-1200.webp'],
    ['ed-t-pista',     'ed-p-pista-1200.webp'],
    ['ed-t-acai',      'ed-p-acai-1100.webp'],
    ['ed-t-shakes',    'ed-p-shakes-1300.webp'],
    ['ed-t-lava',      'ed-p-lava-1200.webp'],
    ['ed-t-twist',     'ed-p-twist-1100.webp'],
  ];
  const TILE_CROP = {
    // the old top-70% crop cut the bowl off and filled the tile with the
    // floral wall behind it, so the Açaí tile did not show any açaí
    'ed-t-acai':   [0.20, 0.18, 1.00, 0.88],
  };
  for (const row of TILES) {
    for (const w of [800, 540]) {
      let pipe = sharp(path.join(OUT, row[1]));
      const tc = TILE_CROP[row[0]];
      if (tc) { const m = await pipe.metadata(); pipe = pipe.extract(box(m, tc[0], tc[1], tc[2], tc[3])); }
      await pipe
        .resize({ width: w, height: Math.round(w * 5 / 4), fit: 'cover', position: 'attention' })
        .webp({ quality: 80, effort: 6 }).toFile(path.join(OUT, row[0] + '-' + w + '.webp'));
    }
    console.log(row[0].padEnd(20), '4:5');
  }
})();
