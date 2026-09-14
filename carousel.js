/* stamp&seal — hero carousel.
   Add or edit slides in SLIDES below. Everything else follows automatically.
   Optional: set `img` to a photo path (e.g. "assets/img/trodat.png") and it
   replaces the drawn plate for that slide. */

(function () {
  'use strict';

  var SLIDES = [
    {
      id: 'self',
      eyebrow: 'Self-inking stamps',
      title: ['One press,', 'clean every time'],
      body: 'Machine-made self-inking stamps in six compact bodies. Pick the size by how many lines you need, send the wording, and we cut the die.',
      chips: ['KT1028', 'Pastel 1333', 'CB3513', 'Bubble Mint', 'Wworld', 'HA12'],
      note: 'Rubber sizes 10 × 28 mm to 13 × 35 mm',
      tagline: 'Your wording, cut into rubber.',
      accent: '#C2410C',
      from: '#F0873B', to: '#8A2C06',
      art: { shape: 'rect', w: 13, h: 33, lines: ['JUAN M. DELA CRUZ', 'PROPRIETOR'] },
      img: '',
      link: '#catalogue'
    },
    {
      id: 'trodat',
      eyebrow: 'Trodat stamps',
      title: ['Built for PTRs', 'and licences'],
      body: 'The 4910 through 4926 range, self-inking and machine made. Five lines for an engineer, twelve for a full PTR block with an office address.',
      chips: ['4910', '4911', '4912', '4913', '4915', '4926'],
      note: 'Up to 12 lines on the 4926',
      tagline: 'Read the proof twice. Then we cut.',
      accent: '#1F4E79',
      from: '#5D8FBF', to: '#132F4C',
      art: { shape: 'rect', w: 20, h: 56, lines: ['ENGR. J. M. DELA CRUZ', 'CIVIL ENGINEER', 'PRC No. 0123456', 'PTR No. 7891011'] },
      img: '',
      link: '#catalogue'
    },
    {
      id: 'dater',
      eyebrow: 'Trodat daters',
      title: ['Received,', 'approved, dated'],
      body: 'Adjustable date bands with your own wording set around them. Turn the band by hand; the fixed text stays on the die for years.',
      chips: ['4810', '4850', '4750', '4727'],
      note: 'Date only, or up to five lines around it',
      tagline: 'The date changes. The die does not.',
      accent: '#2F6046',
      from: '#6FA487', to: '#1C3C2B',
      art: { shape: 'rect', w: 13, h: 33, lines: ['RECEIVED', '01 · 09 · 2026', 'REJIBE ENTERPRISES'] },
      img: '',
      link: '#catalogue'
    },
    {
      id: 'seal',
      eyebrow: 'Dry seals',
      title: ['Pressed into', 'the paper'],
      body: 'Embossed seals supplied with your design engraved. Pocket bodies fold flat for site work; desk frames are steel built for high volume.',
      chips: ['Pocket', 'Desk', 'Portable desk', 'Trodat pocket'],
      note: 'Engraving included',
      tagline: 'No ink. Just pressure.',
      accent: '#7A5C2E',
      from: '#C2A26B', to: '#463218',
      art: { shape: 'round', w: 45, h: 45, lines: ['REJIBE', '★', 'ENTERPRISES'] },
      img: '',
      link: '#seals'
    },
    {
      id: 'sign',
      eyebrow: 'Signage and acrylic',
      title: ['Cut, etched,', 'mounted'],
      body: 'Acrylic laser cutting, table signs, plaques, plastic signs and panaflex. Storefront lettering through to a name plate for one desk.',
      chips: ['Panaflex', 'Table sign', 'Plaque', 'Plastic sign', 'Acrylic'],
      note: 'Sized to your wall or your desk',
      tagline: 'Made on Pacana Street.',
      accent: '#6D2E46',
      from: '#B06A86', to: '#3D1727',
      art: { shape: 'plate', w: 34, h: 62, lines: ['OFFICE OF THE', 'CITY ENGINEER', '— ROOM 204 —'] },
      img: '',
      link: '#services'
    },
    {
      id: 'medal',
      eyebrow: 'Medals, mugs and markers',
      title: ['Giveaways that', 'outlast the event'],
      body: 'Custom medals for school and sports programmes, printed mugs for staff and guests, and brass or stainless markers with build-up lettering.',
      chips: ['Medals', 'Mugs', 'Brass marker', 'Stainless build-up'],
      note: 'Bulk orders welcome',
      tagline: 'Tell us the occasion.',
      accent: '#8A5A16',
      from: '#D9A441', to: '#513210',
      art: { shape: 'round', w: 42, h: 42, lines: ['CHAMPION', '2026'] },
      img: '',
      link: '#services'
    }
  ];

  var slidesEl = document.getElementById('slides');
  if (!slidesEl) return;

  var deck    = document.getElementById('deck');
  var stage   = document.querySelector('.stage');
  var bgA     = document.getElementById('bgA');
  var bgB     = document.getElementById('bgB');
  var dotsEl  = document.getElementById('dots');
  var tagEl   = document.getElementById('tagline');
  var peekBtn = document.getElementById('peek');
  var peekArt = document.getElementById('peekArt');

  var index = 0;
  var busy = false;
  var showingA = true;

  /* ---------- build ---------- */

  function plate(art, small) {
    var k = small ? 0.9 : 3.4;                  // px per mm
    var wide = Math.round(Math.max(art.w, art.h) * k);
    var tall = Math.round(Math.min(art.w, art.h) * k);
    if (art.shape === 'round') { wide = tall = Math.round(art.w * k * 1.15); }

    var cls = 'plate plate--' + art.shape;
    var lines = art.lines.map(function (l) { return '<span>' + l + '</span>'; }).join('');
    return '<span class="' + cls + '" style="width:' + wide + 'px;height:' + tall + 'px">' +
             '<span class="plate__text">' + lines + '</span>' +
           '</span>';
  }

  SLIDES.forEach(function (s, i) {
    var art = s.img
      ? '<img class="slide__photo" src="' + s.img + '" alt="' + s.eyebrow + '">'
      : plate(s.art, false);

    var chips = s.chips.map(function (c) {
      return '<button class="size" type="button" data-jump="' + c + '">' + c + '</button>';
    }).join('');

    var el = document.createElement('article');
    el.className = 'slide';
    el.setAttribute('role', 'group');
    el.setAttribute('aria-label', s.eyebrow + ' (' + (i + 1) + ' of ' + SLIDES.length + ')');
    el.innerHTML =
      '<div class="slide__copy">' +
        '<p class="slide__eyebrow">' + s.eyebrow + '</p>' +
        '<h1>' + s.title[0] + '<br>' + s.title[1] + '</h1>' +
        '<p class="slide__body">' + s.body + '</p>' +
        '<a class="btn btn--accent" href="' + s.link + '">See the range</a>' +
      '</div>' +
      '<div class="slide__art">' + art + '</div>' +
      '<div class="slide__meta">' +
        '<p class="slide__note">' + s.note + '</p>' +
        '<p class="slide__label">Models</p>' +
        '<div class="sizes">' + chips + '</div>' +
      '</div>';
    slidesEl.appendChild(el);

    var dot = document.createElement('button');
    dot.className = 'dot';
    dot.type = 'button';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', s.eyebrow);
    dot.addEventListener('click', function () { go(i); });
    dotsEl.appendChild(dot);
  });

  var slideEls = Array.prototype.slice.call(slidesEl.children);
  var dotEls   = Array.prototype.slice.call(dotsEl.children);

  /* ---------- transitions ---------- */

  function paint(s) {
    var layer = showingA ? bgB : bgA;
    var other = showingA ? bgA : bgB;
    layer.style.background =
      'radial-gradient(120% 90% at 78% 8%, ' + s.from + ' 0%, ' + s.to + ' 62%, ' + s.to + ' 100%)';
    layer.style.opacity = '1';
    other.style.opacity = '0';
    showingA = !showingA;
    stage.style.setProperty('--accent', s.accent);
  }

  function go(next, dir) {
    if (busy || next === index) return;
    if (dir === undefined) dir = next > index ? 1 : -1;
    busy = true;

    var out = slideEls[index];
    var into = slideEls[next];

    out.classList.remove('is-on');
    out.classList.add(dir === 1 ? 'to-left' : 'to-right');

    into.classList.remove('to-left', 'to-right');
    into.classList.add(dir === 1 ? 'from-right' : 'from-left');
    void into.offsetWidth;                       // commit the start position
    into.classList.remove('from-right', 'from-left');
    into.classList.add('is-on');

    dotEls[index].classList.remove('is-on');
    dotEls[next].classList.add('is-on');

    var s = SLIDES[next];
    paint(s);
    tagEl.textContent = s.tagline;
    setPeek(next);

    index = next;
    setTimeout(function () {
      out.classList.remove('to-left', 'to-right');
      busy = false;
    }, 620);
  }

  function step(d) {
    go((index + d + SLIDES.length) % SLIDES.length, d);
  }

  function setPeek(i) {
    var n = SLIDES[(i + 1) % SLIDES.length];
    peekArt.innerHTML = n.img
      ? '<img src="' + n.img + '" alt="">'
      : plate(n.art, true);
    peekBtn.setAttribute('title', 'Next: ' + n.eyebrow);
  }

  /* ---------- controls ---------- */

  document.getElementById('next').addEventListener('click', function () { step(1); });
  document.getElementById('prev').addEventListener('click', function () { step(-1); });
  peekBtn.addEventListener('click', function () { step(1); });

  deck.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { step(1); e.preventDefault(); }
    if (e.key === 'ArrowLeft')  { step(-1); e.preventDefault(); }
  });

  /* Drag and swipe. Pointer events cover mouse, touch and pen. */
  var startX = 0, startY = 0, dragging = false, locked = false;

  deck.addEventListener('pointerdown', function (e) {
    if (e.target.closest('button, a')) return;
    dragging = true; locked = false;
    startX = e.clientX; startY = e.clientY;
    deck.classList.add('is-dragging');
  });

  deck.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    var dx = e.clientX - startX;
    var dy = e.clientY - startY;
    if (!locked) {
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 12) { dragging = false; deck.classList.remove('is-dragging'); return; }
      if (Math.abs(dx) > 8) locked = true;
    }
    if (locked) {
      e.preventDefault();
      var pull = Math.max(-120, Math.min(120, dx));
      slideEls[index].style.transform = 'translateX(' + pull * 0.35 + 'px)';
      slideEls[index].style.setProperty('--pull', pull + 'px');
    }
  });

  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    deck.classList.remove('is-dragging');
    var dx = (e.clientX || startX) - startX;
    slideEls[index].style.transform = '';
    slideEls[index].style.removeProperty('--pull');
    if (Math.abs(dx) > 55) step(dx < 0 ? 1 : -1);
  }
  deck.addEventListener('pointerup', endDrag);
  deck.addEventListener('pointercancel', endDrag);
  deck.addEventListener('pointerleave', endDrag);

  /* A model chip sends you to that model in the stamp builder. */
  slidesEl.addEventListener('click', function (e) {
    var chip = e.target.closest('[data-jump]');
    if (!chip) return;
    var want = chip.dataset.jump;
    var select = document.getElementById('stampModel');
    if (select) {
      var match = Array.prototype.slice.call(select.options).filter(function (o) {
        return o.value.toLowerCase().indexOf(want.toLowerCase()) > -1;
      })[0];
      if (match) {
        select.value = match.value;
        select.dispatchEvent(new Event('change'));
        document.getElementById('builder').scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
    }
    document.getElementById('catalogue').scrollIntoView({ behavior: 'smooth' });
  });

  /* ---------- first paint ---------- */
  slideEls[0].classList.add('is-on');
  dotEls[0].classList.add('is-on');
  paint(SLIDES[0]);
  tagEl.textContent = SLIDES[0].tagline;
  setPeek(0);
})();
