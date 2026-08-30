const sharp = require('C:/Users/GGPC/Downloads/the-fade-creators/node_modules/sharp');
const fs = require('fs'), path = require('path');
const SRC = 'C:/Users/GGPC/Downloads/frosty-haven-lineup-premium-plum.png';
const OUT = path.join(__dirname, 'images');

// crop a little dead space off the top, then feather hard so the photo
// dissolves into the page background instead of sitting in a box.
const CROP_TOP = 0.075, FX = 0.125, FY_TOP = 0.30, FY_BOT = 0.05;

(async () => {
  const m = await sharp(SRC).metadata();
  const top = Math.round(m.height * CROP_TOP);
  const W = m.width, H = m.height - top;

  const mask = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lx" x1="0" x2="1">
        <stop offset="0" stop-color="#000"/>
        <stop offset="${FX * 0.35}" stop-color="#4a4a4a"/>
        <stop offset="${FX}" stop-color="#fff"/>
        <stop offset="${1 - FX}" stop-color="#fff"/>
        <stop offset="${1 - FX * 0.35}" stop-color="#4a4a4a"/>
        <stop offset="1" stop-color="#000"/>
      </linearGradient>
      <linearGradient id="ly" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="#000"/>
        <stop offset="${FY_TOP * 0.45}" stop-color="#3d3d3d"/>
        <stop offset="${FY_TOP}" stop-color="#fff"/>
        <stop offset="${1 - FY_BOT * 2.2}" stop-color="#fff"/>
        <stop offset="1" stop-color="#0f0f0f"/>
      </linearGradient>
      <radialGradient id="rv" cx="50%" cy="54%" r="74%">
        <stop offset="0" stop-color="#fff"/>
        <stop offset="0.62" stop-color="#fff"/>
        <stop offset="0.86" stop-color="#8a8a8a"/>
        <stop offset="1" stop-color="#000"/>
      </radialGradient>
      <mask id="mx"><rect width="100%" height="100%" fill="url(#lx)"/></mask>
      <mask id="my"><rect width="100%" height="100%" fill="url(#ly)" mask="url(#mx)"/></mask>
    </defs>
    <rect width="100%" height="100%" fill="url(#rv)" mask="url(#my)"/>
  </svg>`);

  const base = await sharp(SRC)
    .extract({ left: 0, top, width: W, height: H })
    .ensureAlpha()
    .composite([{ input: mask, blend: 'dest-in' }])
    .png().toBuffer();

  for (const w of [1672, 1200, 900, 640]) {
    const f = path.join(OUT, `hero-lineup-${w}.webp`);
    await sharp(base).resize({ width: w }).webp({ quality: 84, effort: 6, alphaQuality: 92 }).toFile(f);
    process.stdout.write(`${w}:${(fs.statSync(f).size / 1024).toFixed(1)}kb  `);
  }
  console.log(`\nhero is now ${W}x${H} (ratio ${(W / H).toFixed(3)})`);
})();
