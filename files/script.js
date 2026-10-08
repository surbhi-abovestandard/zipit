(() => {
  'use strict';

  /* ---------- Data ---------- */
  const skins = [
    ['Superconductor', 'skin-1'], ['Heat Treated', 'skin-2'], ['Gamma Doppler', 'skin-3'],
    ['Army Sheen', 'skin-4'], ['Safety Net', 'skin-5'], ['Spectre', 'skin-6'],
    ['Titan', 'skin-7'], ['Royal Legion', 'skin-8'], ['Chromatic Aberration', 'skin-9'], ['Brass', 'skin-10']
  ];

  const slides = [
    { title: 'Instant, Secure\nCS2 skins trading',
      description: 'Largest CS2 trading platform with massive catalogue, fast trades, useful filters and 24/7 live support',
      image: 'assets/images/hero-1.webp' },
    { title: 'Trade Rare\nCS2 Skins Instantly',
      description: 'Swap knives, gloves and high-tier rifles with real players. Fair prices, zero hidden fees.',
      image: 'assets/images/hero-2.webp' },
    { title: 'Your Skins.\nYour Market.',
      description: 'Set your own price, track offers in real time and get paid the moment a trade completes.',
      image: 'assets/images/hero-3.webp' }
  ];

  const DURATION = 900;     // matches CSS transition (.9s)
  const AUTOPLAY = 5500;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const $ = id => document.getElementById(id);
  const missing = e => e.target.classList.add('is-missing');

  /* ---------- Category marquee (items duplicated for a seamless -50% loop) ---------- */
  const track = $('skinTrack');
  const cards = skins.map(([name, file]) =>
    `<div class="skin-card"><img src="assets/images/${file}.webp" alt="" loading="lazy"><span>${name}</span></div>`
  ).join('');
  track.innerHTML = cards + cards;                     // 2 identical halves
  track.querySelectorAll('img').forEach(i => i.addEventListener('error', missing));
  track.lastElementChild.parentElement.setAttribute('aria-hidden', 'false');

  /* ---------- Background particles (created ONCE, never touched by the slider) ---------- */
  const particleBox = $('particles');
  const count = innerWidth < 640 ? 14 : 32;
  if (!reduceMotion) {
    for (let i = 0; i < count; i++) {
      const p = document.createElement('i');
      p.className = 'particle';
      const s = 2 + Math.random() * 3;
      p.style.cssText = `left:${Math.random() * 100}%;top:${30 + Math.random() * 70}%;width:${s}px;height:${s}px;` +
        `--dx:${(Math.random() * 80 - 40).toFixed(0)}px;animation-duration:${10 + Math.random() * 14}s;animation-delay:${-Math.random() * 20}s`;
      particleBox.appendChild(p);
    }
  }

  /* ---------- Hero slider (touches only text + media, never the background) ---------- */
  const media = $('heroMedia'), content = $('heroContent');
  const titleEl = $('heroTitle'), textEl = $('heroText'), pager = $('heroPagination');
  const slideEls = slides.map((s, i) => {
    const el = document.createElement('div');
    el.className = 'hero-slide';
    el.innerHTML = `<div class="hero-parallax"><img src="${s.image}" alt="${s.title.replace('\n', ' ')}"></div>`;
    el.querySelector('img').addEventListener('error', missing);
    media.appendChild(el);
    return el;
  });
  const dots = slides.map((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', `Slide ${i + 1}`);
    b.addEventListener('click', () => { goTo(i); restartAutoplay(); });
    pager.appendChild(b);
    return b;
  });

  const setText = s => {
    titleEl.innerHTML = s.title.replace('\n', '<br>');
    textEl.textContent = s.description;
  };

  let current = 0, busy = false, timer;

  function goTo(next) {
    if (next === current || busy) return;
    busy = true;
    const prev = current;
    current = next;

    slideEls[prev].classList.remove('is-active');
    slideEls[prev].classList.add('is-leaving');           // fade out + drift
    content.classList.add('is-out');                      // text fades up/out

    setTimeout(() => {
      setText(slides[next]);
      content.classList.remove('is-out');
      content.classList.add('is-in');                     // snap to start pos (below, invisible)
      slideEls[next].classList.add('is-active');          // image fades/moves in
      void content.offsetWidth;                           // flush so transition restarts
      content.classList.remove('is-in');                  // text rises into place
      dots.forEach((d, i) => d.classList.toggle('is-active', i === next));
      setTimeout(() => { slideEls[prev].classList.remove('is-leaving'); busy = false; }, DURATION);
    }, DURATION * 0.45);
  }

  function restartAutoplay() {
    clearInterval(timer);
    timer = setInterval(() => goTo((current + 1) % slides.length), AUTOPLAY);
  }

  setText(slides[0]);
  slideEls[0].classList.add('is-active');
  dots[0].classList.add('is-active');
  restartAutoplay();
  document.addEventListener('visibilitychange', () => document.hidden ? clearInterval(timer) : restartAutoplay());

  /* ---------- Subtle mouse interaction (desktop, fine pointers only) ---------- */
  const hero = $('hero'), glow = $('glowMouse');
  if (!reduceMotion && matchMedia('(hover:hover) and (pointer:fine)').matches && innerWidth > 820) {
    let raf = null;
    hero.addEventListener('mousemove', e => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const r = hero.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;    // -0.5 … 0.5
        const y = (e.clientY - r.top) / r.height - .5;
        glow.style.transform = `translate3d(${(x + .5) * r.width * .8}px,${(y + .5) * r.height * .6}px,0)`;
        particleBox.style.transform = `translate3d(${x * -14}px,${y * -10}px,0)`;
        media.style.setProperty('--px', `${x * -14}px`);
        slideEls.forEach(el => el.firstElementChild.style.transform = `translate3d(${x * -14}px,${y * -10}px,0)`);
      });
    });
    hero.addEventListener('mouseleave', () => {
      particleBox.style.transform = '';
      slideEls.forEach(el => el.firstElementChild.style.transform = '');
    });
  }
})();
