const sharp = require('C:/Users/GGPC/Downloads/the-fade-creators/node_modules/sharp');
const path = require('path');
const fs = require('fs');
const SRC = 'C:/Users/GGPC/Downloads';
const OUT = path.join(__dirname, 'images');
fs.mkdirSync(OUT, { recursive: true });

// name, sourceFile, widths, opts
const JOBS = [
  ['hero-lineup',      'frosty-haven-lineup-premium-plum.png',            [1672,1200,900,640], { feather:true }],
  ['biscoff',          'frosty-haven-biscoff-premium.png',                [1000,700,500]],
  ['cup-cafe',         'frosty-haven-dessert-cup-on-table.png',           [1400,1000,700]],
  ['tray-marble',      'frosty-haven-dessert-cream-marble-table.png',     [1400,1000,700]],
  ['tray-shop',        'frosty-haven-dessert-on-shop-table.png',          [1200,900,600]],
  ['counter-stone',    'frosty-haven-option-2-premium-stone-counter.png', [1300,900,650]],
  ['drinks-spread',    'frosty-haven-products-quality-enhanced.png',      [1300,900,650]],
  ['tray-walnut',      'frosty-haven-dessert-dark-walnut-table.png',      [1400,1000,700]],
  ['cta-band',         'frosty-haven-dessert-cta-background.png',         [2172,1600,1100,760]],
  ['lineup-burgundy',  'frosty-haven-full-dessert-table-hero.png',        [1600,1100,760]],
  ['lineup-noir',      'frosty-haven-lineup-premium-noir.png',            [1200,800]],
  ['sundae-portrait',  'frosty-haven-hero-light-mobile.png',              [900,600]],
  ['counter-bright',   'frosty-haven-option-1-bright-shop-table.png',     [1000,700]],
  ['counter-warm',     'frosty-haven-option-3-warm-cafe-table.png',       [1000,700]],
  ['lineup-alt',       'frosty-haven-all-desserts-table-hero.png',        [1200,800]],
  ['lineup-deepplum',  'frosty-haven-dessert-lineup-deep-plum.png',       [1400,900]],
  ['counter-shop',     'frosty-haven-products-on-shop-table.png',         [1000,700]],
  ['lineup-cream',     'frosty-haven-dessert-lineup-dark-cream.png',      [1200,800]],
];

// Soft alpha feather so the hero photo melts into the page background
function featherMask(w, h) {
  const fx = Math.round(w * 0.045), fy = Math.round(h * 0.07);
  return Buffer.from(`<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lx" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stop-color="#000"/><stop offset="${fx/w}" stop-color="#fff"/>
        <stop offset="${1-fx/w}" stop-color="#fff"/><stop offset="1" stop-color="#000"/>
      </linearGradient>
      <linearGradient id="ly" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="#000"/><stop offset="${fy/h}" stop-color="#fff"/>
        <stop offset="0.93" stop-color="#fff"/><stop offset="1" stop-color="#2a2a2a"/>
      </linearGradient>
      <mask id="m"><rect width="100%" height="100%" fill="url(#lx)"/></mask>
    </defs>
    <rect width="100%" height="100%" fill="url(#ly)" mask="url(#m)"/>
  </svg>`);
}

(async () => {
  const manifest = {};
  for (const [name, file, widths, opts = {}] of JOBS) {
    const src = path.join(SRC, file);
    if (!fs.existsSync(src)) { console.log('MISSING', file); continue; }
    const meta = await sharp(src).metadata();
    let base = sharp(src);
    if (opts.feather) {
      const mask = featherMask(meta.width, meta.height);
      const buf = await sharp(src).ensureAlpha()
        .composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
      base = sharp(buf);
    }
    const sizes = [];
    for (const w of widths) {
      if (w > meta.width * 1.02) continue;
      const h = Math.round(meta.height * (w / meta.width));
      const outFile = path.join(OUT, `${name}-${w}.webp`);
      await base.clone().resize({ width: w, withoutEnlargement: true })
        .webp({ quality: opts.feather ? 82 : 78, effort: 6, alphaQuality: 90 })
        .toFile(outFile);
      sizes.push({ w, h, kb: +(fs.statSync(outFile).size / 1024).toFixed(1) });
    }
    manifest[name] = { ratio: +(meta.width / meta.height).toFixed(4), sizes };
    console.log(name.padEnd(18), `${meta.width}x${meta.height}`.padEnd(11),
      sizes.map(s => `${s.w}:${s.kb}kb`).join('  '));
  }
  fs.writeFileSync(path.join(__dirname, 'images', 'manifest.json'), JSON.stringify(manifest, null, 2));
  const total = fs.readdirSync(OUT).filter(f=>f.endsWith('.webp'))
    .reduce((a,f)=>a+fs.statSync(path.join(OUT,f)).size,0);
  console.log('\nTOTAL', (total/1024/1024).toFixed(2)+' MB across', fs.readdirSync(OUT).filter(f=>f.endsWith('.webp')).length, 'files');
})();
