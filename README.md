# Frosty Haven

Two static pages. No build step, no framework, no dependencies.
Open `index.html` and it works.

```
frosty-haven/
├─ index.html              the home page
├─ menu.html               the full menu
├─ css/style.css           all styling
├─ js/site.config.js       ← everything about the business lives here
├─ js/main.js              behaviour + the menu data
├─ images/                 optimised WebP, several sizes of each photo
├─ tools/                  image build scripts (not needed to run the site)
└─ tools-serve.js          tiny local preview server
```

---

## The design

Three surfaces, alternating deliberately: **blush** `#F4DEDF`, **cream**
`#FAF6F1` and **near-black** `#111111`, with **hot pink** `#EC407A` used
only where something is meant to be pressed. Each surface change is a beat
in the scroll, not decoration.

Type is **Instrument Serif** for anything that carries the brand, and
**Archivo** for navigation, labels and body copy. The wordmark is set, not
placed as a logo file — `FROSTY / HAVEN` in the hero is real text that the
photography cuts through, which is why it scales cleanly from 320px to
1440px+. The drippy pink logo still appears where it belongs: on every cup
in the photography, and as the favicon.

Section rhythm is intentional. The hero, the campaign frame
(`Made to Crave`), the brand story and the order block are loud. The intro,
the craft list and the visit block are quiet. Nothing repeats a template.

### Motion

All of it is CSS transitions and transforms driven by one `requestAnimationFrame`
loop and one scroll listener — no animation library. Durations sit between
600ms and 1200ms on `cubic-bezier(.16,1,.3,1)`.

- The hero reveals on load, layer by layer, and its three planes drift at
  different speeds under the pointer.
- Sections reveal with `clip-path` wipes and short upward moves as they
  enter. Reveals are checked on the scroll event rather than through an
  `IntersectionObserver`, because several of these elements are clipped to
  zero height before they reveal and an observer reads that as off-screen.
- The custom cursor is desktop-only and deliberately avoids `mix-blend-mode`:
  on a fixed element it drags the whole page into one blend group, and some
  compositors then tint everything.
- **`prefers-reduced-motion` is fully respected.** Everything still reads;
  it simply stops moving.

---

## Editing the site

### Business details, hours, socials, reviews

Open **`js/site.config.js`**. That one file holds the phone number, address,
opening hours, Instagram/TikTok links, the Google review link, the ratings
and the reviews themselves.

Anything left as an empty string (`''`) or an empty array (`[]`) is
**automatically hidden** — no "TBC" text, no dead links, no empty boxes.

- **`orderUrl`** — currently a WhatsApp pickup link. Swap it for an online
  ordering page any time; every "Order Now" button follows it.
- **`hours`** — a day can have two time ranges (see Friday). Add
  `closed: true` to grey a day out. The live **Open now / Closed now** badge
  and the "— today" marker in the hours list are both calculated from these
  values plus `timezone`.
- **`reviews`** — real Google reviews supplied by the shop. Nothing here is
  invented, and nothing invented should be added. The home page shows one
  review at a time at display size, so it picks the ones that read as a
  line rather than a paragraph (roughly 55–168 characters) — reviews outside
  that range stay in the file and simply aren't featured. If the list were
  emptied, the section would invite a review instead of showing fake ones.

### The menu

The `MENU` array at the top of **`js/main.js`** drives both the home-page
teaser and the whole of `menu.html`. Each item takes a `name`, a `desc`, and
an optional `price` — leave `price` out and nothing is shown. Each category
points at an image by name, e.g. `ed-t-shakes`, expecting
`images/<name>-540.webp` and `images/<name>-800.webp` in a 4:5 crop.

### Photography

Every photo is served as WebP in two or three sizes and the browser picks
the right one. Filenames follow `name-WIDTH.webp`.

The originals live outside this folder. `tools/build-editorial.cjs` is the
one that matters now: it colour-grades the source photography into the brand
palette — pulling the studio backdrops from coral and taupe toward blush
while leaving the dessert itself untouched — then cuts the crops the layout
needs and feathers the edges of the hero and CTA plates so they dissolve
into the page instead of sitting in a visible rectangle.

```bash
node tools/build-editorial.cjs
```

The older scripts (`build-hero.cjs`, `build-images.cjs`, `build-menu-images.cjs`,
`build-real-images.cjs`) built the previous site's assets and are kept for
reference. The images they produced are archived in
`../frosty-haven-previous/images-archive/`, along with the previous
`index.html`, `style.css` and `main.js`.

---

## Preview it locally

```bash
node tools-serve.js
```

Then open <http://localhost:4321>. Pass a port as an argument or set `PORT`
to use a different one.

---

## Deploying

It's a static site, so anything works — Netlify, Vercel, Cloudflare Pages,
GitHub Pages, or plain shared hosting. Upload the folder as-is; there is
nothing to compile.

---

## Notes on how it's built

- **No frameworks and no animation libraries.** Total JavaScript is smaller
  than a single icon font.
- **No layout shift.** Every image declares its `width` and `height`.
- **Below-the-fold images are lazy-loaded**; the hero is preloaded, with a
  separate preload for the mobile crop so phones never download the wide one.
- **Mobile is composed, not compressed.** The hero, the product spreads and
  the order block each have their own layout below 620px — different
  crops, different type sizes, gentler parallax, no cursor.
- **Keyboard and screen-reader friendly**: skip link, focus rings, labelled
  landmarks, a complete `<h1>`, and a `<noscript>` fallback that reveals
  everything if JavaScript never arrives.
