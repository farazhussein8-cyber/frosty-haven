/* ==================================================================
   FROSTY HAVEN — behaviour
   No frameworks, no animation libraries. Plain JS, one rAF loop.
   ================================================================== */
(function () {
  'use strict';

  var CFG = window.FROSTY_HAVEN || {};
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var has = function (v) { return typeof v === 'string' && v.trim() !== ''; };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  };

  /* ------------------------------------------------------------------
     MENU DATA — the single source for both the teaser and menu.html.
     `price` is optional; leave it out and nothing is shown.
     ------------------------------------------------------------------ */
  var MENU = [
    {
      id: 'loaded-cups', label: 'Loaded Cups', img: 'ed-t-loadedcup',
      alt: 'The Loaded Cup — soft serve dipped in chocolate with churro, banana and strawberry',
      note: 'Dipped, stacked and finished in front of you.',
      items: [
        { name: 'The Loaded Cup', desc: 'Soft serve dipped in chocolate, stacked with a churro, fresh banana and strawberry.', price: 'S · M · L' }
      ]
    },
    {
      id: 'ice-cream', label: 'Ice Cream', img: 'ed-t-twist',
      alt: 'A two-flavour soft serve twist on a crisp waffle cone',
      note: 'One machine, swirled to order, never pre-scooped.',
      items: [
        { name: 'Soft Serve Twist', desc: 'Two flavours swirled together, piled high on a crisp waffle cone.', price: 'S · M · L' },
        { name: 'Biscoff Flurr', desc: 'Soft serve swirled with Biscoff crumble and a warm caramel drizzle.' },
        { name: 'Nutella Flurr', desc: 'Swirled with Nutella and a generous crumble of chocolate cookie.' },
        { name: 'Bueno Flurr', desc: 'Loaded with crushed Bueno, granola and a caramel drizzle.' },
        { name: 'Pista Flurr', desc: 'Pistachio soft serve, swirled and showered in crushed pistachio.' },
        { name: 'Custom Flurr', desc: 'Vanilla soft serve with a sauce and topping of your choice.' }
      ]
    },
    {
      id: 'bowls', label: 'Bowls', img: 'ed-t-acai',
      alt: 'Açaí bowl with granola, banana and fresh strawberry',
      note: 'Blended thick. The one people compare to Brazil.',
      items: [
        { name: 'Açaí Bowl', desc: 'Açaí blended smooth, swirled and piled high with granola, banana and fresh strawberry.', price: 'S · M · L' }
      ]
    },
    {
      id: 'shakes', label: 'Shakes', img: 'ed-t-shakes',
      alt: 'Three thick Frosty Haven milkshakes topped with cream and sauce',
      note: 'Spoon-thick. Actually thick, not marketing thick.',
      items: [
        { name: 'Thick Milkshake — Strawberry', desc: 'Whipped cream, berry drizzle.', price: '$9' },
        { name: 'Thick Milkshake — Chocolate', desc: 'Whipped cream, chocolate drizzle.', price: '$9' },
        { name: 'Thick Milkshake — Caramel', desc: 'Whipped cream, caramel drizzle.', price: '$9' },
        { name: 'Protein Shakes', desc: 'All the flavour, built for your fitness goals. Ask in store.' }
      ]
    },
    {
      id: 'cakes', label: 'Cakes & Treats', img: 'ed-t-lava',
      alt: 'Molten lava cake topped with ice cream and pistachio sauce',
      note: 'Warm, cold, and completely unreasonable.',
      items: [
        { name: 'Lava Cake', desc: 'Molten centre, ice cream on top, your choice of sauce — pistachio, Biscoff, Nutella, Bueno or chocolate.' },
        { name: 'Frosty Cheesecakes', desc: 'Rich, chilled cheesecake with a Frosty Haven twist.' },
        { name: 'Loaded Cookies', desc: 'Warm, stacked and piled high with toppings.' },
        { name: 'Loaded Brownies', desc: 'Fudgy brownies buried under frosty toppings.' }
      ]
    },
    {
      id: 'specials', label: 'Specials', img: 'ed-t-pista',
      alt: 'A loaded pistachio dessert with soft serve and crushed pistachio',
      note: 'The board changes. Ask what just landed.',
      items: [
        { name: 'Frosty Nachos', desc: 'A must-try — our over-the-top dessert nachos.' },
        { name: 'Croffles', desc: 'Crunchy croissant-waffle, Biscoff or pistachio. Ask in store.' }
      ]
    },
    {
      id: 'drinks', label: 'Drinks', img: 'ed-t-shakes',
      alt: 'Cold Frosty Haven drinks lined up on the counter',
      note: 'Cold, bright and faintly ridiculous.',
      items: [
        { name: 'Blue Lagoon', desc: 'A tropical blue splash bursting with sweet, refreshing flavour.' },
        { name: 'Guava Splash', desc: 'Juicy guava soda with a bright, fruity fizz.' },
        { name: 'Melon Zest', desc: 'Crisp, chilled melon soda with a light citrus twist.' },
        { name: 'Add boba', desc: 'Blueberry · Green Apple · Lychee', price: '+$1' }
      ]
    }
  ];

  /* ================= boot ================= */
  var lit = false;
  function lightUp() { if (lit) return; lit = true; document.body.classList.add('ready'); }
  requestAnimationFrame(function () { requestAnimationFrame(lightUp); });
  setTimeout(lightUp, 120);

  var yr = $('[data-year]');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ================= config-driven links ================= */
  if (has(CFG.orderUrl)) {
    $$('[data-order]').forEach(function (a) {
      a.href = CFG.orderUrl.trim(); a.target = '_blank'; a.rel = 'noopener';
    });
  }
  var c = CFG.contact || {};
  $$('[data-directions]').forEach(function (a) {
    if (has(c.mapsUrl)) { a.href = c.mapsUrl.trim(); a.target = '_blank'; a.rel = 'noopener'; }
    else a.remove();
  });
  $$('[data-review]').forEach(function (a) {
    if (has(CFG.reviewUrl)) { a.href = CFG.reviewUrl.trim(); a.target = '_blank'; a.rel = 'noopener'; }
    else a.remove();
  });
  var social = CFG.social || {};
  $$('[data-social]').forEach(function (a) {
    var k = a.getAttribute('data-social');
    if (has(social[k])) { a.href = social[k].trim(); a.target = '_blank'; a.rel = 'noopener'; }
    else a.remove();
  });

  /* ================= social icons ================= */
  var ICONS = {
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="3" width="18" height="18" rx="5.2"/><circle cx="12" cy="12" r="4.1"/><circle cx="17.4" cy="6.6" r="1.15" fill="currentColor" stroke="none"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 2h-3v13.1a2.75 2.75 0 1 1-2.2-2.7V9.3a5.85 5.85 0 1 0 5.2 5.8V8.9a6.9 6.9 0 0 0 4 1.3V7.2a3.95 3.95 0 0 1-4-4.1V2Z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 22v-8.4h2.8l.42-3.27H13.5V8.24c0-.95.26-1.59 1.62-1.59h1.73V3.73A23.2 23.2 0 0 0 14.32 3.6c-2.5 0-4.2 1.53-4.2 4.33v2.4H7.3v3.27h2.82V22h3.38Z"/></svg>'
  };
  var LABELS = { instagram: 'Instagram', tiktok: 'TikTok', facebook: 'Facebook' };
  var socialHTML = ['instagram', 'tiktok', 'facebook'].filter(function (k) { return has(social[k]); })
    .map(function (k) {
      return '<a href="' + esc(social[k].trim()) + '" target="_blank" rel="noopener" aria-label="' +
        LABELS[k] + '">' + ICONS[k] + '</a>';
    }).join('');
  $$('[data-socs]').forEach(function (el) {
    if (socialHTML) el.innerHTML = socialHTML; else el.remove();
  });

  /* ================= contact details ================= */
  var det = $('[data-details]');
  if (det) {
    var rows = [];
    var addr = (c.addressLines || []).filter(has);
    if (addr.length) {
      rows.push('<div class="det"><dt>Address</dt><dd>' +
        (has(c.mapsUrl)
          ? '<a href="' + esc(c.mapsUrl.trim()) + '" target="_blank" rel="noopener">' + addr.map(esc).join('<br>') + '</a>'
          : addr.map(esc).join('<br>')) + '</dd></div>');
    }
    if (has(c.phone)) {
      rows.push('<div class="det"><dt>Phone</dt><dd><a href="tel:' +
        esc(c.phone.replace(/[^\d+]/g, '')) + '">' + esc(c.phone) + '</a></dd></div>');
    }
    if (has(c.email)) {
      rows.push('<div class="det"><dt>Email</dt><dd><a href="mailto:' +
        esc(c.email.trim()) + '">' + esc(c.email) + '</a></dd></div>');
    }
    if (rows.length) det.innerHTML = rows.join(''); else det.remove();
  }

  /* ================= hours + live open badge ================= */
  var hours = Array.isArray(CFG.hours) ? CFG.hours.filter(function (h) {
    return h && has(h.days) && (has(h.time) || Array.isArray(h.time));
  }) : [];

  function nowLocal() {
    var opts = { weekday: 'long', hour: '2-digit', minute: '2-digit', hour12: false };
    if (has(CFG.timezone)) opts.timeZone = CFG.timezone;
    var map = {};
    new Intl.DateTimeFormat('en-GB', opts).formatToParts(new Date())
      .forEach(function (p) { map[p.type] = p.value; });
    return { day: map.weekday, mins: (parseInt(map.hour, 10) % 24) * 60 + parseInt(map.minute, 10) };
  }
  function toMins(str) {
    var m = /(\d{1,2}):(\d{2})\s*(am|pm)/i.exec(str);
    if (!m) return null;
    var hh = (+m[1]) % 12;
    if (/pm/i.test(m[3])) hh += 12;
    return hh * 60 + (+m[2]);
  }

  var hoursEl = $('[data-hours]');
  if (hoursEl) {
    if (!hours.length) hoursEl.remove();
    else {
      var today = nowLocal().day;
      hoursEl.innerHTML = hours.map(function (h) {
        var times = (Array.isArray(h.time) ? h.time : [h.time]).filter(has)
          .map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('');
        return '<div class="r' + (h.closed ? ' off' : '') + (h.days === today ? ' today' : '') + '">' +
               '<dt>' + esc(h.days) + '</dt><dd>' + times + '</dd></div>';
      }).join('');
    }
  }

  var badge = $('[data-badge]');
  if (badge) {
    if (!hours.length) badge.remove();
    else {
      var tick = function () {
        var n = nowLocal(), open = false;
        var d = hours.filter(function (h) { return h.days === n.day; })[0];
        if (d && !d.closed) {
          (Array.isArray(d.time) ? d.time : [d.time]).forEach(function (t) {
            var p = String(t).split(/[–-]/);
            if (p.length < 2) return;
            var a = toMins(p[0]), b = toMins(p[1]);
            if (a !== null && b !== null && n.mins >= a && n.mins < b) open = true;
          });
        }
        badge.className = 'badge ' + (open ? 'is-open' : 'is-shut');
        badge.innerHTML = '<i></i>' + (open ? 'Open now' : 'Closed now');
        badge.hidden = false;
      };
      tick();
      setInterval(tick, 60000);
    }
  }

  /* ================= navigation ================= */
  var nav = $('#nav');
  var burger = $('#burger');
  var mnav = $('#mnav');

  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mnav.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger && mnav) {
    burger.addEventListener('click', function () {
      setMenu(!document.body.classList.contains('menu-open'));
    });
    mnav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('menu-open')) setMenu(false);
    });
    window.matchMedia('(min-width: 901px)').addEventListener('change', function (e) {
      if (e.matches) setMenu(false);
    });
  }

  /* the wordmark and links flip to cream over the dark bands */
  var darkBands = $$('[data-dark]');
  var lastStuck = null, lastDark = null;
  function navState() {
    if (nav) {
      var stuck = window.scrollY > 20;
      if (stuck !== lastStuck) { nav.classList.toggle('is-stuck', stuck); lastStuck = stuck; }
    }
    var probe = 34;
    var dark = darkBands.some(function (el) {
      var r = el.getBoundingClientRect();
      return r.top <= probe && r.bottom >= probe;
    });
    if (dark !== lastDark) { document.body.classList.toggle('nav-dark', dark); lastDark = dark; }
  }

  /* scroll spy on the in-page links */
  var spyLinks = $$('[data-spy]');
  if (spyLinks.length && 'IntersectionObserver' in window) {
    var targets = spyLinks.map(function (a) {
      return { a: a, el: document.getElementById(a.getAttribute('href').slice(1)) };
    }).filter(function (o) { return o.el; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        spyLinks.forEach(function (l) { l.classList.remove('is-on'); });
        var hit = targets.filter(function (o) { return o.el === e.target; })[0];
        if (hit) hit.a.classList.add('is-on');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    targets.forEach(function (o) { spy.observe(o.el); });
  }

  /* ================= marquee ================= */
  var marq = $('[data-marq]');
  if (marq) {
    var set = marq.firstElementChild;
    var guard = 0;
    while (set.scrollWidth < window.innerWidth && guard++ < 8) {
      Array.prototype.slice.call(set.children).forEach(function (n) {
        set.appendChild(n.cloneNode(true));
      });
    }
    var twin = set.cloneNode(true);
    twin.setAttribute('aria-hidden', 'true');
    marq.appendChild(twin);
  }

  /* ================= reviews ================= */
  var mount = $('#revsMount');
  if (mount) {
    var all = Array.isArray(CFG.reviews) ? CFG.reviews : [];
    /* the layout gives one review the whole page, so it wants the ones
       that read as a line, not a paragraph. Nothing is edited or invented. */
    var picks = all.filter(function (r) {
      return r && has(r.text) && r.text.trim().length >= 55 && r.text.trim().length <= 168;
    }).sort(function (a, b) { return b.text.length - a.text.length; }).slice(0, 7);

    if (!picks.length) {
      mount.innerHTML =
        '<p class="revs__q" data-rv="mask">Real words from real customers land here — never invented ones.</p>' +
        (has(CFG.reviewUrl)
          ? '<p style="margin-top:2rem"><a class="btn btn--text" href="' + esc(CFG.reviewUrl.trim()) +
            '" target="_blank" rel="noopener">Leave a review <i>&rarr;</i></a></p>' : '');
    } else {
      mount.innerHTML =
        '<div class="revs__stage">' + picks.map(function (r, i) {
          return '<figure class="revs__slide' + (i === 0 ? ' is-on' : '') + '">' +
            '<blockquote class="revs__q">&ldquo;' + esc(r.text.trim()) + '&rdquo;</blockquote>' +
            '<figcaption class="revs__who"><b>' + esc(r.name || 'Google review') + '</b>' +
              (has(r.source) ? ' &nbsp;·&nbsp; ' + esc(r.source) : '') +
              (has(r.when) ? ' &nbsp;·&nbsp; ' + esc(r.when) : '') +
            '</figcaption></figure>';
        }).join('') + '</div>' +
        '<div class="revs__ctrl">' +
          '<p class="revs__nums"><b data-rn>01</b> / ' + String(picks.length).padStart(2, '0') + '</p>' +
          '<div class="revs__btns">' +
            '<button class="rbtn" data-rprev aria-label="Previous review"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 4 6 10l6 6"/></svg></button>' +
            '<button class="rbtn" data-rnext aria-label="Next review"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8 4l6 6-6 6"/></svg></button>' +
          '</div>' +
        '</div>';

      var slides = $$('.revs__slide', mount);
      var num = $('[data-rn]', mount);
      var idx = 0, timer = null;

      function go(next) {
        var from = slides[idx];
        idx = (next + slides.length) % slides.length;
        from.classList.remove('is-on');
        from.classList.add('is-out');
        setTimeout(function () { from.classList.remove('is-out'); }, 640);
        slides[idx].classList.add('is-on');
        num.textContent = String(idx + 1).padStart(2, '0');
      }
      function auto() {
        if (REDUCED) return;
        clearInterval(timer);
        timer = setInterval(function () { go(idx + 1); }, 7000);
      }
      $('[data-rnext]', mount).addEventListener('click', function () { go(idx + 1); auto(); });
      $('[data-rprev]', mount).addEventListener('click', function () { go(idx - 1); auto(); });
      auto();
    }

    /* rating line beside the section label */
    var st = $('[data-stars]');
    if (st) {
      var rating = (CFG.ratings || []).filter(function (r) { return r && has(r.score); })[0];
      var STAR = '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 1.6l2.5 5.4 5.9.7-4.4 4 1.2 5.8L10 14.6 4.8 17.5 6 11.7 1.6 7.7l5.9-.7L10 1.6Z"/></svg>';
      if (rating) {
        st.innerHTML = new Array(6).join(STAR) +
          '<span class="lab" style="margin-left:.7rem">' + esc(rating.score) + ' / ' + esc(rating.of || '5') +
          (has(rating.label) ? ' on ' + esc(rating.label) : '') +
          (has(rating.note) ? ' &nbsp;·&nbsp; ' + esc(rating.note) : '') + '</span>';
      } else st.remove();
    }
  }

  /* ================= menu page ================= */
  var mjump = $('#mjump'), mbody = $('#mbody');
  if (mjump && mbody) {
    mjump.innerHTML = MENU.map(function (cat) {
      return '<a href="#cat-' + cat.id + '">' + esc(cat.label) + '</a>';
    }).join('');

    mbody.innerHTML = MENU.map(function (cat, i) {
      return '<section class="mcat" id="cat-' + cat.id + '"><div class="wrap mcat__grid">' +
        '<div class="mcat__side">' +
          '<p class="lab">' + String(i + 1).padStart(2, '0') + ' / ' + String(MENU.length).padStart(2, '0') + '</p>' +
          '<h2 class="dsp">' + esc(cat.label) + '</h2>' +
          '<p class="lede" style="font-size:1rem">' + esc(cat.note) + '</p>' +
          '<div data-rv="img"><img src="images/' + cat.img + '-540.webp" srcset="images/' + cat.img +
            '-540.webp 540w, images/' + cat.img + '-800.webp 800w" sizes="(max-width:900px) 60vw, 26vw" ' +
            'width="540" height="675" loading="lazy" decoding="async" alt="' + esc(cat.alt) + '"></div>' +
        '</div>' +
        '<div class="mcat__list">' + cat.items.map(function (it) {
          return '<div class="mrow" data-rv="up">' +
            '<h3>' + esc(it.name) + '</h3>' +
            (has(it.price) ? '<span class="p">' + esc(it.price) + '</span>' : '<span></span>') +
            '<p>' + esc(it.desc) + '</p></div>';
        }).join('') + '</div>' +
      '</div></section>';
    }).join('');
  }

  /* ================= frost =================
     A dozen specks drifting around the hero product. Deliberately sparse:
     any more and it stops reading as air and starts reading as an effect. */
  (function () {
    var host = $('[data-frost]');
    if (!host) return;
    if (REDUCED) { host.remove(); return; }
    var html = '';
    for (var i = 0; i < 12; i++) {
      html += '<i style="' +
        '--fx:' + (6 + Math.random() * 88).toFixed(1) + '%;' +
        '--fy:' + (8 + Math.random() * 78).toFixed(1) + '%;' +
        '--fs:' + (1.5 + Math.random() * 1.9).toFixed(1) + 'px;' +
        '--fo:' + (0.14 + Math.random() * 0.22).toFixed(2) + ';' +
        '--fd:' + (7 + Math.random() * 6).toFixed(1) + 's;' +
        '--fdelay:' + (Math.random() * 7).toFixed(1) + 's"></i>';
    }
    host.innerHTML = html;
  })();

  /* ================= reveals =================
     Driven from the same rAF loop as the parallax rather than an
     IntersectionObserver: several of these elements are clip-path
     masked to zero height before they reveal, which the observer
     reads as never on screen. */
  var pending = $$('[data-rv]');
  (function stagger() {
    var seen = new Map();
    pending.forEach(function (el) {
      if (el.style.getPropertyValue('--rvd')) return;
      var p = el.parentElement;
      var n = seen.get(p) || 0;
      seen.set(p, n + 1);
      if (n) el.style.setProperty('--rvd', Math.min(n, 5) * 90 + 'ms');
    });
  })();

  function checkReveal(vh) {
    for (var i = pending.length - 1; i >= 0; i--) {
      var r = pending[i].getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > vh * -0.15) {
        pending[i].classList.add('in');
        pending.splice(i, 1);
      }
    }
  }
  if (REDUCED) {
    pending.forEach(function (el) { el.classList.add('in'); });
    pending.length = 0;
  }

  /* ================= scroll + pointer motion ================= */
  var craveImg  = document.querySelector('[data-scale]');

  var mx = 0, my = 0, tmx = 0, tmy = 0;   // pointer, smoothed
  var sy = window.scrollY;
  var running = false;

  function frame() {
    running = false;
    var vh = window.innerHeight;

    if (!REDUCED) {
      mx += (tmx - mx) * 0.06;
      my += (tmy - my) * 0.06;

      if (craveImg) {
        var r = craveImg.parentElement.getBoundingClientRect();
        if (r.bottom > -240 && r.top < vh + 240) {
          var k = (r.top + r.height / 2 - vh / 2) / vh;   // -1 … 1
          craveImg.style.transform =
            'translate3d(0,' + (k * -52).toFixed(2) + 'px,0) scale(' + (1.08 + Math.abs(k) * 0.04).toFixed(4) + ')';
        }
      }
    }
  }
  function schedule() { if (!running) { running = true; requestAnimationFrame(frame); } }

  function onScroll() {
    sy = window.scrollY;
    if (pending.length) checkReveal(window.innerHeight);
    navState();
    schedule();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  document.addEventListener('visibilitychange', function () { if (!document.hidden) onScroll(); });

  if (FINE && !REDUCED) {
    var settle = null;
    window.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      tmx = (e.clientX / window.innerWidth - 0.5) * 2;
      tmy = (e.clientY / window.innerHeight - 0.5) * 2;
      schedule();
      clearInterval(settle);
      settle = setInterval(function () {
        if (Math.abs(tmx - mx) < 0.004 && Math.abs(tmy - my) < 0.004) { clearInterval(settle); return; }
        schedule();
      }, 16);
    }, { passive: true });
  }
  onScroll();
  window.addEventListener('load', onScroll);

  /* ================= cursor ================= */
  if (FINE && !REDUCED) {
    var cur = $('#cur');
    if (cur) {
      var cx = -80, cy = -80, tx = -80, ty = -80, raf = null;
      var loop = function () {
        cx += (tx - cx) * 0.2;
        cy += (ty - cy) * 0.2;
        cur.style.transform = 'translate3d(' + (cx) + 'px,' + (cy) + 'px,0) translate(-50%,-50%)';
        raf = (Math.abs(tx - cx) > 0.4 || Math.abs(ty - cy) > 0.4) ? requestAnimationFrame(loop) : null;
      };
      window.addEventListener('pointermove', function (e) {
        if (e.pointerType !== 'mouse') return;
        tx = e.clientX; ty = e.clientY;
        cur.classList.add('on');
        if (!raf) raf = requestAnimationFrame(loop);
      }, { passive: true });
      document.addEventListener('pointerover', function (e) {
        var view = !!e.target.closest('[data-view]');
        cur.classList.toggle('view', view);
        cur.classList.toggle('hot', !view && !!e.target.closest('a,button'));
      });
      document.addEventListener('pointerleave', function () { cur.classList.remove('on'); });
      window.addEventListener('blur', function () { cur.classList.remove('on'); });
    }
  }
})();
