
// Smooth the page's native scroll and keep GSAP ScrollTrigger in sync.
if (
  window.Lenis &&
  window.gsap &&
  window.ScrollTrigger &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  gsap.registerPlugin(ScrollTrigger);
  const lenis = new Lenis({
    duration: 1.2,
    smoothWheel: true,
    anchors: true
  });
  window.lenis = lenis;
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

const topbar = document.querySelector(".topbar");
if (topbar) {
  const updateTopbarState = () => {
    topbar.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  window.addEventListener("scroll", updateTopbarState, { passive: true });
  updateTopbarState();

  const navToggle = topbar.querySelector(".nav-toggle");
  const navPanel = topbar.querySelector("#primaryNavigation");
  if (navToggle && navPanel) {
    const setNavOpen = (open) => {
      topbar.classList.toggle("nav-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    };

    navToggle.addEventListener("click", () => {
      setNavOpen(navToggle.getAttribute("aria-expanded") !== "true");
    });
    navPanel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setNavOpen(false));
    });
    document.addEventListener("click", (event) => {
      if (!topbar.contains(event.target)) setNavOpen(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setNavOpen(false);
    });
  }
}

// Fill the static Popular CS2 skin cards with catalogue data.
(() => {
  const grid = document.querySelector('#popularSkinsGrid');
  if (!grid) return;

  const skins = [
    ['M4A4 | Spider Lily', 'Minimal Wear', '€84.99', '0.002398089884', '14.0'],
    ['Specialist Gloves | The Oligarch', 'Minimal Wear', '€104.05', '0.002398089884', '9.5'],
    ['The Professionals | Mantis', 'Minimal Wear', '€104.05', '0.002398089884', ''],
    ['AK-47 | The Oligarch', 'Minimal Wear', '€78.02', '0.002398089884', ''],
    ['Doppler | Ruby', 'Minimal Wear', '€49.99', '0.002398089884', ''],
    ['★ Karambit | Doppler', 'Factory New', '€249.99', '0.001928440032', ''],
    ['AWP | Green Energy', 'Minimal Wear', '€84.99', '0.002398089884', ''],
    ['Sticker | The Verkkars', 'Holo', '€84.99', '0.002398089884', ''],
    ['Glock-18 | Vogue', 'Minimal Wear', '€78.02', '0.002398089884', ''],
    ['MP9 | Starlight Protector', 'Minimal Wear', '€49.99', '0.002398089884', ''],
    ['USP-S | Whiteout', 'Minimal Wear', '€84.99', '0.002398089884', '12.6'],
    ['AK-47 | Slate', 'Minimal Wear', '€84.99', '0.002398089884', ''],
    ['M4A1-S | Blue Phosphor', 'Minimal Wear', '€84.99', '0.002398089884', ''],
    ['USP-S | Neo-Noir', 'Minimal Wear', '€78.02', '0.002398089884', ''],
    ['Specialist Gloves | Foundation', 'Minimal Wear', '€49.99', '0.002398089884', '9.5']
  ];

  const cards = grid.querySelectorAll('[data-skin-card]');
  const cardKeychains = [
    [5, 1, 2, 3, 4], [1, 4], [1], [1, 3], [1, 3, 4],
    [1, 2, 3, 4], [1, 2, 3, 4], [1], [1, 4], [1, 2, 3],
    [5, 1, 2, 3, 4], [1, 2, 3, 4], [1, 2, 3, 4], [1], [1, 2, 3, 4]
  ];
  const cardCharms = [
    ['images/keychain-5.png'], [], [], [], [], [], [], [], [], [],
    ['images/keychain-5.png'], [], [], [], []
  ];
  cards.forEach((card) => {
    const index = Number(card.dataset.skinCard);
    const skin = skins[index];
    if (!skin) return;

    const [name, condition, price, float, badge] = skin;
    card.querySelector('[data-skin-name]').textContent = name;
    card.querySelector('[data-skin-condition]').textContent = `${condition} (Sapphire)`;
    card.querySelector('[data-skin-price]').textContent = price;
    card.querySelector('[data-skin-float]').textContent = float;

    const image = card.querySelector('[data-skin-image]');
    image.src = `images/image-${index + 1}.png`;
    image.alt = name;
    card.querySelector('[data-skin-link]').setAttribute('aria-label', `View ${name}`);

    card.querySelectorAll('[data-keychain]').forEach((keychain) => {
      const keychainIndex = Number(keychain.dataset.keychain);
      keychain.hidden = keychainIndex === 5 || !cardKeychains[index]?.includes(keychainIndex);
      keychain.setAttribute('aria-label', `View ${name} keychain ${keychainIndex}`);
    });

    card.querySelectorAll('[data-charm-slot]').forEach((charm, charmIndex) => {
      const imagePath = cardCharms[index]?.[charmIndex];
      charm.hidden = !imagePath;
      if (!imagePath) return;
      charm.querySelector('[data-charm-image]').src = imagePath;
      charm.setAttribute('aria-label', `View ${name} charm ${charmIndex + 1}`);
    });

    const badgeElement = card.querySelector('[data-skin-badge]');
    badgeElement.textContent = badge;
    badgeElement.hidden = !badge;
  });

  const timers = grid.querySelectorAll('.popular-skin-footer time');
  let seconds = 12 * 3600 + 35 * 60 + 32;
  window.setInterval(() => {
    seconds = seconds > 0 ? seconds - 1 : 12 * 3600 + 35 * 60 + 32;
    const formatted = [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60]
      .map(value => String(value).padStart(2, '0')).join(':');
    timers.forEach(timer => { timer.textContent = formatted; });
  }, 1000);
})();

// Use a Coverflow carousel for popular skins on compact screens only.
(() => {
  const grid = document.querySelector('#popularSkinsGrid');
  if (!grid || !window.Swiper) return;

  const compactViewport = window.matchMedia('(max-width: 767px)');
  let slider = null;

  const syncPopularSkinsSlider = () => {
    if (compactViewport.matches && !slider) {
      grid.classList.add('is-mobile-slider');
      slider = new Swiper(grid, {
        wrapperClass: 'popular-skins-track',
        slideClass: 'popular-skin-card',
        effect: 'coverflow',
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 8,
        speed: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 550,
        grabCursor: true,
        watchSlidesProgress: true,
        coverflowEffect: {
          rotate: 0,
          stretch: -16,
          depth: 110,
          modifier: 1.15,
          slideShadows: false
        },
        pagination: {
          el: grid.querySelector('.popular-skins-pagination'),
          clickable: true,
          bulletClass: 'popular-skin-dot',
          bulletActiveClass: 'is-active',
          renderBullet(index, className) {
            return `<button type="button" class="${className}" aria-label="Go to skin ${index + 1}"></button>`;
          }
        },
        keyboard: {
          enabled: true,
          onlyInViewport: true
        }
      });
    } else if (!compactViewport.matches && slider) {
      slider.destroy(true, true);
      slider = null;
      grid.classList.remove('is-mobile-slider');
    }
  };

  syncPopularSkinsSlider();
  compactViewport.addEventListener('change', syncPopularSkinsSlider);
})();

// Respect reduced-motion preferences for the decorative section background.
const popularSkinsVideo = document.querySelector('.popular-skins-video');
if (popularSkinsVideo) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    popularSkinsVideo.pause();
  } else {
    popularSkinsVideo.play().catch(() => {});
  }
}

// Reveal text and images as they enter view without changing page layout.
(() => {
  const targets = 'h1, h2, h3, p, .bonus, .skin-action-link, .skin-art-label, .skin-price-tag, .nav-link, .currency-text, .slide-title, .slide-text, .card-info .title, img';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) return;

  document.body.classList.add('content-motion-ready');
  let previousScrollY = window.scrollY;
  let scrollDirection = 'down';
  window.addEventListener('scroll', () => {
    const currentY = window.scrollY;
    if (currentY !== previousScrollY) scrollDirection = currentY > previousScrollY ? 'down' : 'up';
    previousScrollY = currentY;
  }, { passive: true });
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.dataset.motionDirection = scrollDirection;
      entry.target.classList.toggle('is-motion-visible', entry.isIntersecting);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });

  const watch = (node) => {
    if (!(node instanceof Element)) return;
    if (node.matches(targets)) {
      const siblings = node.parentElement ? Array.from(node.parentElement.querySelectorAll(':scope > h1, :scope > h2, :scope > h3, :scope > p, :scope > img')) : [];
      node.classList.add(node.tagName === 'IMG' ? 'content-image-motion' : 'content-text-motion');
      const siblingIndex = siblings.indexOf(node);
      node.dataset.motionDirection = 'down';
      if (siblingIndex >= 0) node.style.transitionDelay = `${Math.min(siblingIndex, 4) * 75}ms`;
      observer.observe(node);
    }
      node.querySelectorAll(targets).forEach((target) => {
        if (target.classList.contains('content-text-motion') || target.classList.contains('content-image-motion')) return;
        const siblings = target.parentElement ? Array.from(target.parentElement.querySelectorAll(':scope > h1, :scope > h2, :scope > h3, :scope > p, :scope > img')) : [];
        target.classList.add(target.tagName === 'IMG' ? 'content-image-motion' : 'content-text-motion');
        target.dataset.motionDirection = 'down';
        target.style.transitionDelay = `${Math.max(0, Math.min(siblings.indexOf(target), 4)) * 75}ms`;
        observer.observe(target);
      });
  };
  watch(document.body);
  new MutationObserver((records) => records.forEach((record) => record.addedNodes.forEach(watch)))
    .observe(document.body, { childList: true, subtree: true });
})();

const DROP_INTERVAL = 1300;
const CARDS_PER_DROP = 2;
const MAX_CARDS = 26;

// ===== CREATE CARD =====
const dropData = [
  { meta: "Superconductor", name: "Superconductor" },
  { meta: "Heat treated", name: "Heat treated" },
  { meta: "Gamma Doppler (phase 1)", name: "Gamma Doppler (phase 1)" },
  { meta: "Army sheen", name: "Army sheen" },
  { meta: "Safety net", name: "Safety net" },
  { meta: "Spectre", name: "Spectre" },
  { meta: "Titan", name: "Titan" },
  { meta: "Royal legion", name: "Royal legion" },
  { meta: "Chromatic aberration", name: "Chromatic aberration" },
  { meta: "Brass", name: "Brass" },
  { meta: "Phosphor", name: "Phosphor" }
];
let skinImageIndex = 0;

function createCard(item, bgIndex, isNew = false) {
  const card = document.createElement("article");
  card.className = "drop-card" + (isNew ? " is-new" : "");

  const visual = document.createElement("div");
  visual.className = "visual";

  visual.style.backgroundImage =
    `linear-gradient(180deg, rgba(28,19,34,.08), rgba(7,9,20,.2)), url('images/bg-img-${bgIndex}.png')`;

  const itemImage = document.createElement("img");
  itemImage.className = "drop-item-image";
  itemImage.src = `images/img-${(skinImageIndex++ % 11) + 1}.png`;
  itemImage.alt = "";
  itemImage.setAttribute("aria-hidden", "true");

  const info = document.createElement("div");
  info.className = "card-info";

  const title = document.createElement("div");
  title.className = "title";
  title.textContent = item.name || "Featured item";

  info.appendChild(title);
  card.append(visual, itemImage, info);

  return card;
}

// ===== SINGLE GRID =====
const dropRow = document.querySelector(
  '.drop-row[data-row="combined"]'
);

if (dropRow) {
  const dropGrid = document.createElement("div");
  dropGrid.className = "drop-row-grid";
  dropRow.appendChild(dropGrid);

  // Show all 11 items together
  dropData.forEach((item, index) => {
    dropGrid.appendChild(
      createCard(item, (index % 5) + 1, false)
    );
  });

  let hovering = false;
  let duplicateIndex = 0;

  // ===== HOVER =====
  dropRow.addEventListener("mouseenter", () => {
    hovering = true;
  });

  dropRow.addEventListener("mouseleave", () => {
    hovering = false;

    dropGrid.scrollTo({
      left: 0,
      behavior: "smooth"
    });
  });

  // ===== HORIZONTAL SCROLL =====
  dropGrid.addEventListener("wheel", (e) => {
    if (!hovering) return;

    e.preventDefault();
    dropGrid.scrollLeft += e.deltaY + e.deltaX;
  }, { passive: false });

  // ===== DUPLICATE EXISTING ITEMS =====
  function addDrops() {
    if (hovering) return;

    for (let i = 0; i < CARDS_PER_DROP; i++) {
      const item =
        dropData[duplicateIndex % dropData.length];

      duplicateIndex++;

      const bgIndex = ((duplicateIndex - 1) % 5) + 1;

      const card = createCard(item, bgIndex, true);

      card.style.animationDelay = `${i * 0.18}s`;

      dropGrid.prepend(card);
    }

    while (dropGrid.children.length > MAX_CARDS) {
      dropGrid.lastElementChild.remove();
    }
  }

  setInterval(addDrops, DROP_INTERVAL);
}


// ==============================currancy box=======================
const currencies = [
  {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    flag: "images/flag.svg"
  },
  {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    flag: "images/flags/eu.svg"
  },
  {
    code: "GBP",
    symbol: "£",
    name: "British Pound",
    flag: "images/flags/gb.svg"
  },
  {
    code: "DKK",
    symbol: "kr",
    name: "Danish Krone",
    flag: "images/flags/dk.svg"
  }
];

const dropdown = document.querySelector(".currency-dropdown");

if (dropdown) {
  const box = dropdown.querySelector(".currency-box");
  const menu = dropdown.querySelector("#currencyMenu");
  const currencyText = dropdown.querySelector("#currencyText");
  const currencyFlag = dropdown.querySelector("#currencyFlag");

  if (box && menu && currencyText && currencyFlag) {

    // Generate options dynamically
    currencies.forEach((currency) => {
      const option = document.createElement("button");

      option.type = "button";

      option.innerHTML = `
        <img src="${currency.flag}" alt="${currency.name}">
        <span>${currency.symbol} ${currency.code}</span>
      `;

      option.addEventListener("click", (event) => {
        event.stopPropagation();

        currencyText.textContent = `${currency.symbol} ${currency.code}`;
        currencyFlag.src = currency.flag;
        currencyFlag.alt = `${currency.name} Flag`;

        menu.classList.remove("show");
        box.setAttribute("aria-expanded", "false");

        console.log("Selected:", currency);
      });

      menu.appendChild(option);
    });

    // Move dropdown menu outside the header/parent
    document.body.appendChild(menu);

    // Position menu below currency button
    const positionMenu = () => {
      const rect = box.getBoundingClientRect();

      menu.style.left = `${rect.right - menu.offsetWidth}px`;
      menu.style.top = `${rect.bottom + 8}px`;
    };

    // Open / close
    box.addEventListener("click", (event) => {
      event.stopPropagation();

      const isOpen = menu.classList.toggle("show");

      if (isOpen) {
        positionMenu();
      }

      box.setAttribute("aria-expanded", String(isOpen));
    });

    // Close when clicking outside
    document.addEventListener("click", (event) => {
      if (!menu.contains(event.target) && !box.contains(event.target)) {
        menu.classList.remove("show");
        box.setAttribute("aria-expanded", "false");
      }
    });

    // Keep menu aligned
    window.addEventListener("resize", () => {
      if (menu.classList.contains("show")) {
        positionMenu();
      }
    });

    window.addEventListener("scroll", () => {
      if (menu.classList.contains("show")) {
        positionMenu();
      }
    });
  }
}

const searchToggle = document.querySelector(".search-toggle");
const searchBox = document.querySelector("#headerSearch");
const signinToggle = document.querySelector(".signin-toggle");
const signinPanel = document.querySelector("#signinPanel");

function setHeaderPanel(panel, toggle, isOpen) {
  panel.classList.toggle("is-open", isOpen);
  toggle.setAttribute("aria-expanded", String(isOpen));
}

if (searchToggle && searchBox && signinToggle && signinPanel) {
  searchToggle.addEventListener("click", () => {
    const isOpen = !searchBox.classList.contains("is-open");
    setHeaderPanel(searchBox, searchToggle, isOpen);
    setHeaderPanel(signinPanel, signinToggle, false);

    if (isOpen) {
      searchBox.querySelector("input")?.focus();
    }
  });

  signinToggle.addEventListener("click", () => {
    const isOpen = !signinPanel.classList.contains("is-open");
    setHeaderPanel(signinPanel, signinToggle, isOpen);
    setHeaderPanel(searchBox, searchToggle, false);
  });

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;

    if (!searchBox.contains(event.target) && !searchToggle.contains(event.target)) {
      setHeaderPanel(searchBox, searchToggle, false);
    }

    if (!signinPanel.contains(event.target) && !signinToggle.contains(event.target)) {
      setHeaderPanel(signinPanel, signinToggle, false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    setHeaderPanel(searchBox, searchToggle, false);
    setHeaderPanel(signinPanel, signinToggle, false);
  });
}


// ============================== hero slider ===========================
const heroSlider = document.querySelector('.hero-slider');

if (heroSlider && window.Swiper) {
  const heroDots = heroSlider.parentElement.querySelector('.hero-dots');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function updateHeroSlides(swiper) {
    swiper.slides.forEach((slide) => {
      const active = slide.classList.contains('swiper-slide-active');
      slide.setAttribute('aria-hidden', String(!active));
      slide.inert = !active;
    });
  }

  if (heroDots) {
    heroSlider.classList.add('is-enhanced');
    const heroSwiper = new Swiper(heroSlider, {
      effect: 'fade',
      fadeEffect: { crossFade: true },
      loop: true,
      speed: reduceMotion.matches ? 0 : 2500,
      // autoplay: reduceMotion.matches ? false : {
      //   delay: 3000,
      //   disableOnInteraction: false,
      //   pauseOnMouseEnter: true
      // },
      pagination: {
        el: heroDots,
        clickable: true,
        bulletClass: 'hero-dot',
        bulletActiveClass: 'is-active',
        renderBullet(index, className) {
          return `<button type="button" class="${className}" aria-label="Show slide ${index + 1}"></button>`;
        }
      },
      on: {
        init: updateHeroSlides,
        slideChangeTransitionStart: updateHeroSlides
      }
    });
  }
}

// A soft cursor-follow glow spans the full page on desktop pointers.
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const pageGlow = document.createElement('span');
  pageGlow.className = 'page-cursor-glow';
  pageGlow.setAttribute('aria-hidden', 'true');
  document.body.appendChild(pageGlow);
  let glowFrame = null;
  document.addEventListener('pointermove', (event) => {
    if (glowFrame) return;
    glowFrame = requestAnimationFrame(() => {
      glowFrame = null;
      pageGlow.style.setProperty('--pointer-x', `${event.clientX}px`);
      pageGlow.style.setProperty('--pointer-y', `${event.clientY}px`);
      pageGlow.classList.add('is-visible');
    });
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => pageGlow.classList.remove('is-visible'));
}

// Keep the trading guide's highlighted step, timeline and preview in sync with scroll

document.addEventListener("DOMContentLoaded", () => {
  const tradeGuide = document.querySelector(".trade-guide");
  if (!tradeGuide || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  let refreshTimer;
  const refreshAfterViewportChange = () => {
    window.clearTimeout(refreshTimer);
    refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 250);
  };
  window.addEventListener("resize", refreshAfterViewportChange, { passive: true });
  window.visualViewport?.addEventListener("resize", refreshAfterViewportChange, { passive: true });
  const steps = gsap.utils.toArray(".trade-step", tradeGuide);
  const shots = gsap.utils.toArray(".trade-shot", tradeGuide);
  const progress = tradeGuide.querySelector(".trade-rail-progress");
  if (!steps.length) return;
  let activeStep = -1;
  function activateStep(index) {
    index = Math.max(0, Math.min(index, steps.length - 1));
    if (index === activeStep) return;
    activeStep = index;
    steps.forEach((step, i) => {
      const active = i === index;
      step.classList.toggle("is-active", active);
      step.classList.toggle("is-complete", i < index);
      step.setAttribute("aria-current", active ? "step" : "false");
      step.setAttribute("aria-pressed", String(active));
    });
    shots.forEach((shot, i) => {
      shot.classList.toggle("is-active", i === index);
    });
  }
  function updateProgress(value) {
    if (progress) {
      progress.style.height = `${value * 100}%`;
    }
  }
  const mm = gsap.matchMedia();
  // DESKTOP: PINNED SCROLL STORY
  mm.add(
    "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
    () => {
      tradeGuide.classList.add("is-pinned");
      const trigger = ScrollTrigger.create({
        trigger: tradeGuide,
        start: "top top",
        end: () => `+=${(steps.length - 1) * 300}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        refreshPriority: 1,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate(self) {
          const index = Math.min(
            Math.floor(self.progress * steps.length),
            steps.length - 1
          );
          activateStep(index);
          updateProgress(self.progress);
        },
        onRefresh(self) {
          activateStep(
            Math.min(
              Math.floor(self.progress * steps.length),
              steps.length - 1
            )
          );
          updateProgress(self.progress);
        }
      });
      return () => {
        trigger.kill();
        tradeGuide.classList.remove("is-pinned");
      };
    }
  );
  // MOBILE: NORMAL SCROLLING
  mm.add("(max-width: 767px)", () => {
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top - window.innerHeight * 0.48) -
              Math.abs(b.boundingClientRect.top - window.innerHeight * 0.48)
          );
        if (visible.length) {
          activateStep(Number(visible[0].target.dataset.step));
        }
      },
      {
        rootMargin: "-30% 0px -35% 0px",
        threshold: 0
      }
    );
    steps.forEach((step) => observer.observe(step));
    return () => observer.disconnect();
  });
  // KEYBOARD ACCESSIBILITY
  steps.forEach((step, index) => {
    step.addEventListener("focusin", () => activateStep(index));
    step.addEventListener("click", () => {
      activateStep(index);
      updateProgress(steps.length > 1 ? index / (steps.length - 1) : 0);
    });
    step.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      activateStep(index);
      updateProgress(steps.length > 1 ? index / (steps.length - 1) : 0);
    });
  });
  activateStep(0);
  updateProgress(0);
  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
    window.setTimeout(() => ScrollTrigger.refresh(), 500);
  }, { once: true });
});

// FAQ accordion: one open item on mobile, one per column on wider screens.
const faqColumns = Array.from(document.querySelectorAll(".faq-column"));
const faqQuestions = faqColumns.flatMap((column) => Array.from(column.querySelectorAll(".faq-question")));

function setFaqOpen(question, isOpen) {
  const answer = document.getElementById(question.getAttribute("aria-controls"));
  question.setAttribute("aria-expanded", String(isOpen));
  question.closest(".faq-item")?.classList.toggle("is-open", isOpen);
  if (answer) answer.hidden = !isOpen;
}

faqColumns.forEach((column) => {
  const questions = Array.from(column.querySelectorAll(".faq-question"));
  questions.forEach((question) => {
    question.addEventListener("click", () => {
      const shouldOpen = question.getAttribute("aria-expanded") !== "true";
      const affectedQuestions = window.matchMedia("(max-width: 767px)").matches
        ? faqQuestions
        : questions;
      affectedQuestions.forEach((item) => setFaqOpen(item, item === question && shouldOpen));
    });
  });
});

let faqWasMobile = null;
function setFaqDefaultsForViewport() {
  if (!faqQuestions.length) return;
  const isMobile = window.matchMedia("(max-width: 767px)").matches;
  if (faqWasMobile === isMobile) return;
  faqWasMobile = isMobile;
  if (isMobile) {
    faqQuestions.forEach((question, index) => setFaqOpen(question, index === 0));
    return;
  }
  faqColumns.forEach((column) => {
    const questions = Array.from(column.querySelectorAll(".faq-question"));
    questions.forEach((question, index) => setFaqOpen(question, index === 0));
  });
}

setFaqDefaultsForViewport();
window.addEventListener("resize", setFaqDefaultsForViewport);
