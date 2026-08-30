const sharp = require('C:/Users/GGPC/Downloads/the-fade-creators/node_modules/sharp');
const path = require('path'), fs = require('fs');
const SRC = 'C:/Users/GGPC/Downloads', OUT = path.join(__dirname, 'images');

// Menu panel images: consistent 5:4 crop so every tab is pixel-identical in height.
const JOBS = [
  ['menu-ice-cream', 'frosty-haven-biscoff-premium.png',            'attention'],
  ['menu-sundaes',   'frosty-haven-dessert-cream-marble-table.png', 'center'],
  ['menu-shakes',    'frosty-haven-dessert-lineup-dark-cream.png',  'center'],
  ['menu-drinks',    'frosty-haven-products-quality-enhanced.png',  'center'],
  ['menu-desserts',  'frosty-haven-dessert-dark-walnut-table.png',  'center'],
  ['menu-specials',  'frosty-haven-full-dessert-table-hero.png',    'center'],
];

(async () => {
  for (const [name, file, pos] of JOBS) {
    for (const w of [1300, 900]) {
      const h = Math.round(w * 4 / 5);
      const out = path.join(OUT, `${name}-${w}.webp`);
      await sharp(path.join(SRC, file))
        .resize({ width: w, height: h, fit: 'cover', position: pos })
        .webp({ quality: 78, effort: 6 })
        .toFile(out);
      process.stdout.write(`${name}-${w} ${(fs.statSync(out).size/1024).toFixed(1)}kb  `);
    }
    console.log('');
  }
})();
