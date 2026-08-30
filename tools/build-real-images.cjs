const sharp = require('C:/Users/GGPC/Downloads/the-fade-creators/node_modules/sharp');
const path = require('path'), fs = require('fs');
const SRC = 'C:/Users/GGPC/OneDrive/Desktop/frosty-haven-website/images';
const OUT = path.join(__dirname, 'images');

// Real Frosty Haven product + shop photography carried over from the existing site.
// 5:4 crops for the menu panels; free-form crops elsewhere.
const MENU = [
  ['menu-loaded-cups', 'loaded-cup-hero.webp',           0],
  ['menu-ice-cream',   'soft-serve-twist.webp',          0],
  ['menu-bowls',       'featured-acai-bowl.png',         0],
  ['menu-shakes',      'milkshakes-trio.webp',           0],
  ['menu-cakes',       'lava-cake.webp',                 0],
  ['menu-specials',    'featured-pistachio-brownie.png', 0],
  ['menu-drinks',      'drink-blue-lagoon.png',          0],
];

const FREE = [
  ['fh-acai',       'featured-acai-bowl.png',         [1000, 700, 500]],
  ['fh-pistachio',  'featured-pistachio-brownie.png', [1000, 700, 500]],
  ['fh-biscoff',    'featured-biscoff-cup.png',       [1000, 700, 500]],
  ['fh-chocolate',  'featured-chocolate-cup.png',     [1000, 700, 500]],
  ['fh-loadedcup',  'loaded-cup-hero.webp',           [1200, 900, 650]],
  ['fh-shakes',     'milkshakes-trio.webp',           [1300, 900, 650]],
  ['fh-twist',      'soft-serve-twist.webp',          [1200, 800]],
  ['fh-lava',       'lava-cake.webp',                 [1200, 800]],
  ['fh-counter',    'counter-closeup.jpg',            [1600, 1100, 760]],
  ['fh-interior',   'interior-collage.jpg',           [900, 600]],
  ['fh-sundae',     'loaded-sundae.jpg',              [900, 600]],
  ['fh-blue',       'drink-blue-lagoon.png',          [800, 550]],
  ['fh-guava',      'drink-guava-splash.png',         [800, 550]],
  ['fh-melon',      'drink-melon-zest.png',           [800, 550]],
];

(async () => {
  for (const [name, file, trimBottom] of MENU) {
    const m = await sharp(path.join(SRC, file)).metadata();
    const h = Math.round(m.height * (1 - trimBottom));
    for (const w of [1300, 900]) {
      const f = path.join(OUT, `${name}-${w}.webp`);
      await sharp(path.join(SRC, file))
        .extract({ left: 0, top: 0, width: m.width, height: h })
        .resize({ width: w, height: Math.round(w * 4 / 5), fit: 'cover', position: 'attention' })
        .webp({ quality: 78, effort: 6 }).toFile(f);
    }
    console.log('menu', name);
  }
  for (const [name, file, widths] of FREE) {
    const m = await sharp(path.join(SRC, file)).metadata();
    const out = [];
    for (const w of widths) {
      if (w > m.width * 1.02) continue;
      const f = path.join(OUT, `${name}-${w}.webp`);
      await sharp(path.join(SRC, file)).resize({ width: w, withoutEnlargement: true })
        .webp({ quality: 78, effort: 6 }).toFile(f);
      out.push(`${w}:${(fs.statSync(f).size / 1024).toFixed(0)}kb`);
    }
    console.log(name.padEnd(15), `${m.width}x${m.height}`.padEnd(11), out.join(' '));
  }
  // brand logo, transparent, trimmed
  const lg = await sharp(path.join(SRC, 'logo.png')).trim().toBuffer({ resolveWithObject: true });
  for (const w of [560, 320]) {
    await sharp(lg.data).resize({ width: w }).webp({ quality: 92, alphaQuality: 100, effort: 6 })
      .toFile(path.join(OUT, `logo-${w}.webp`));
  }
  console.log('logo', lg.info.width + 'x' + lg.info.height);
})();
