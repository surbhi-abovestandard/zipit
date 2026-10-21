
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
// ===============================backtop button==================================
const backToTopButton = document.querySelector(".back-to-top");
if (backToTopButton) {
  const updateBackToTopVisibility = () => {
    backToTopButton.classList.toggle("is-visible", window.scrollY > 320);
  };
  window.addEventListener("scroll", updateBackToTopVisibility, { passive: true });
  updateBackToTopVisibility();
  backToTopButton.addEventListener("click", () => {
    if (window.lenis) {
      window.lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
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
        navigation: {
          prevEl: grid.querySelector('.popular-skin-prev'),
          nextEl: grid.querySelector('.popular-skin-next')
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

// Reveal the market checker extension section when it enters the viewport.
const extensionSection = document.querySelector('.extension-section');
if (extensionSection && 'IntersectionObserver' in window) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    extensionSection.classList.add('is-visible');
  } else {
    const extensionObserver = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      extensionSection.classList.add('is-visible');
      extensionObserver.disconnect();
    }, { threshold: 0.2 });
    extensionObserver.observe(extensionSection);
  }
}

// Shared GSAP reveals for text, buttons, and images on every page using this script.
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const revealTargets = 'h1, h2, h3, h4, p, li, label, .bonus, .skin-action-link, .skin-art-label, .skin-price-tag, .nav-link, .currency-text, .slide-title, .slide-text, .card-info .title, .popular-skin-condition, .popular-skin-price, .popular-skin-float, .buy-market-filter-group a, .common-btn, .btn, .button, button, input[type="button"], input[type="submit"], [role="button"], img';
  const gsapSource = 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js';
  const scrollTriggerSource = 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js';
  const animated = new WeakSet();
  const revealed = new WeakSet();
  const animatedFooters = new WeakSet();

  const loadScript = (source) => new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${source}"]`);
    if (existing) {
      if (existing.dataset.loaded === 'true') return resolve();
      existing.addEventListener('load', resolve, { once: true });
      existing.addEventListener('error', reject, { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = source;
    script.async = true;
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      resolve();
    }, { once: true });
    script.addEventListener('error', reject, { once: true });
    document.head.appendChild(script);
  });

  const initReveal = () => {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    const animateFooter = (footer) => {
      if (animatedFooters.has(footer)) return false;
      animatedFooters.add(footer);
      const footerTargets = Array.from(footer.querySelectorAll(
        '.footer-brand, .footer-main h2, .footer-main p, .footer-menu a, .footer-socials a, .footer-payment, .footer-currency-dropdown, .footer-copyright'
      ));
      if (!footerTargets.length) return false;

      const reveal = () => {
        gsap.killTweensOf(footerTargets);
        gsap.fromTo(footerTargets,
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.035,
            ease: 'power2.out',
            overwrite: 'auto',
            onComplete: () => gsap.set(footerTargets, { clearProps: 'opacity,visibility,transform' })
          }
        );
      };

      const bounds = footer.getBoundingClientRect();
      if (bounds.top < window.innerHeight * 0.85 && bounds.bottom > 0) reveal();

      ScrollTrigger.create({
        trigger: footer,
        start: 'top 85%',
        onEnter: reveal,
        onEnterBack: reveal
      });
      return true;
    };

    const animate = (element) => {
      if (animated.has(element) || element.closest('[hidden]')) return false;
      if (element.closest('.site-footer')) return false;
      // Drop item art is positioned by its card; GSAP transform reveals override its centering transform.
      if (element.matches('.drop-item-image')) return false;
      if (element.closest('.popular-skin-actions')) return false;
      if (element.matches('img') && element.closest('.common-btn, .btn, .button, button, [role="button"]')) return false;
      animated.add(element);

      const isImage = element.matches('img');
      const isButton = element.matches('.common-btn, button, [role="button"]');
      const from = isImage ? { autoAlpha: 0, y: 18, scale: 0.97 }
        : isButton ? { autoAlpha: 0, y: 10, scale: 0.97 }
          : { autoAlpha: 0, y: 14 };

      const reveal = () => {
        if (revealed.has(element)) return;
        revealed.add(element);
        gsap.killTweensOf(element);
        gsap.set(element, from);
        gsap.to(element, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: isImage ? 0.7 : 0.55,
          ease: 'power2.out',
          overwrite: 'auto',
          onComplete: () => gsap.set(element, { clearProps: 'opacity,visibility,transform' })
        });
      };
      const bounds = element.getBoundingClientRect();
      const startsInView = bounds.top < window.innerHeight * 0.94 && bounds.bottom > 0;
      if (startsInView) reveal();

      ScrollTrigger.create({
        trigger: element,
        start: 'top 94%',
        end: 'bottom 6%',
        onEnter: reveal,
        onEnterBack: reveal
      });
      return true;
    };

    const scan = (node) => {
      if (!(node instanceof Element)) return false;
      let hasNewTarget = node.matches(revealTargets) ? animate(node) : false;
      node.querySelectorAll(revealTargets).forEach((element) => {
        hasNewTarget = animate(element) || hasNewTarget;
      });
      const footers = node.matches('.site-footer') ? [node] : Array.from(node.querySelectorAll('.site-footer'));
      footers.forEach((footer) => {
        hasNewTarget = animateFooter(footer) || hasNewTarget;
      });
      return hasNewTarget;
    };

    scan(document.body);
    new MutationObserver((records) => {
      let hasNewTarget = false;
      records.forEach((record) => record.addedNodes.forEach((node) => {
        hasNewTarget = scan(node) || hasNewTarget;
      }));
      if (hasNewTarget) requestAnimationFrame(() => ScrollTrigger.refresh());
    }).observe(document.body, { childList: true, subtree: true });
  };

  if (window.gsap && window.ScrollTrigger) {
    initReveal();
  } else {
    loadScript(gsapSource)
      .then(() => window.ScrollTrigger ? undefined : loadScript(scrollTriggerSource))
      .then(initReveal)
      .catch(() => {});
  }
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
    `url('images/bg-img-${bgIndex}.png')`;

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

  let activeDockCard = null;
  const resetDock = () => {
    dropGrid.querySelectorAll(".drop-card").forEach((card) => {
      card.style.transform = "scale(1) translateY(0px)";
      card.style.zIndex = "0";
    });
    activeDockCard = null;
  };

  const setDockFocus = (card) => {
    if (activeDockCard === card) return;
    const cards = [...dropGrid.querySelectorAll(".drop-card")];
    const index = cards.indexOf(card);
    resetDock();
    card.style.transform = "scale(1.14) translateY(-10px)";
    card.style.marginInline = "12px";
    card.style.zIndex = "20";
    [-1, 1].forEach((offset) => {
      const sideCard = cards[index + offset];
      if (!sideCard) return;
      sideCard.style.transform = "scale(1.1) translateY(-6px)";
      sideCard.style.marginInline = "9px";
      sideCard.style.zIndex = "10";
    });
  };

  dropGrid.addEventListener("pointerover", (event) => {
    if (event.pointerType === "touch") return;
    const card = event.target.closest(".drop-card");
    if (card && dropGrid.contains(card)) setDockFocus(card);
  });
  dropGrid.addEventListener("pointerleave", resetDock);
  dropGrid.addEventListener("focusin", (event) => {
    const card = event.target.closest(".drop-card");
    if (card) setDockFocus(card);
  });
  dropGrid.addEventListener("focusout", (event) => {
    if (!dropGrid.contains(event.relatedTarget)) resetDock();
  });

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
    const horizontalGesture = e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY);
    if (!hovering || !horizontalGesture) return;

    const delta = e.shiftKey ? e.deltaY : e.deltaX;
    const maxScroll = dropGrid.scrollWidth - dropGrid.clientWidth;
    const atStart = dropGrid.scrollLeft <= 0 && delta < 0;
    const atEnd = dropGrid.scrollLeft >= maxScroll && delta > 0;
    if (atStart || atEnd) return;
    e.preventDefault();
    dropGrid.scrollLeft += delta;
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

const currencyDropdowns = Array.from(document.querySelectorAll(".currency-dropdown"));

currencyDropdowns.forEach((dropdown) => {
  const box = dropdown.querySelector(".currency-box");
  const menu = dropdown.querySelector(".currency-menu");
  const currencyText = dropdown.querySelector(".currency-text");
  if (!box || !menu || !currencyText) return;

  currencies.forEach((currency) => {
    const option = document.createElement("button");
    option.type = "button";
    option.innerHTML = `<img src="${currency.flag}" alt="${currency.name}"><span>${currency.symbol} ${currency.code}</span>`;
    option.addEventListener("click", (event) => {
      event.stopPropagation();
      document.querySelectorAll(".currency-text").forEach((text) => {
        text.textContent = `${currency.symbol} ${currency.code}`;
      });
      document.querySelectorAll("#currencyFlag").forEach((flag) => {
        flag.src = currency.flag;
        flag.alt = `${currency.name} Flag`;
      });
      document.querySelectorAll(".currency-menu").forEach((currencyMenu) => currencyMenu.classList.remove("show"));
      document.querySelectorAll(".currency-box").forEach((currencyBox) => currencyBox.setAttribute("aria-expanded", "false"));
    });
    menu.appendChild(option);
  });

  document.body.appendChild(menu);
  const positionMenu = () => {
    const rect = box.getBoundingClientRect();
    const menuHeight = menu.offsetHeight;
    const openAbove = dropdown.classList.contains("footer-currency-dropdown") || rect.bottom + menuHeight + 8 > window.innerHeight;
    menu.style.left = `${Math.max(8, rect.right - menu.offsetWidth)}px`;
    menu.style.top = `${openAbove ? Math.max(8, rect.top - menuHeight - 8) : rect.bottom + 8}px`;
  };

  box.addEventListener("click", (event) => {
    event.stopPropagation();
    document.querySelectorAll(".currency-menu").forEach((otherMenu) => {
      if (otherMenu !== menu) otherMenu.classList.remove("show");
    });
    const isOpen = menu.classList.toggle("show");
    if (isOpen) positionMenu();
    box.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (event) => {
    if (!menu.contains(event.target) && !box.contains(event.target)) {
      menu.classList.remove("show");
      box.setAttribute("aria-expanded", "false");
    }
  });
  window.addEventListener("resize", () => menu.classList.contains("show") && positionMenu());
  window.addEventListener("scroll", () => menu.classList.contains("show") && positionMenu());
});

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

const buyUserToggle = document.querySelector(".buy-user-toggle");
const buyUserDropdown = document.querySelector(".buy-user-dropdown");
if (buyUserToggle && buyUserDropdown) {
  const setUserMenuOpen = (open) => {
    buyUserDropdown.classList.toggle("is-open", open);
    buyUserToggle.setAttribute("aria-expanded", String(open));
  };
  buyUserToggle.addEventListener("click", () => {
    setUserMenuOpen(!buyUserDropdown.classList.contains("is-open"));
  });
  document.addEventListener("click", (event) => {
    if (event.target instanceof Node && !buyUserDropdown.contains(event.target) && !buyUserToggle.contains(event.target)) {
      setUserMenuOpen(false);
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setUserMenuOpen(false);
  });
}


// ============================== hero slider ===========================
const heroSlider = document.querySelector('.hero-slider');

if (heroSlider) {
  const heroDots = heroSlider.parentElement.querySelector('.hero-dots');
  const heroSlides = Array.from(heroSlider.querySelectorAll('.hero-track > .slide'));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activeHeroSlide = 0;

  if (heroDots && heroSlides.length) {
    heroSlider.classList.add('is-enhanced', 'is-native');
    heroDots.innerHTML = heroSlides.map((_, index) =>
      `<button type="button" class="hero-dot${index === 0 ? ' is-active' : ''}" aria-label="Show slide ${index + 1}" aria-current="${index === 0}"></button>`
    ).join('');
    const heroDotButtons = Array.from(heroDots.querySelectorAll('.hero-dot'));

    function showHeroSlide(index) {
      activeHeroSlide = (index + heroSlides.length) % heroSlides.length;
      heroSlides.forEach((slide, slideIndex) => {
        const active = slideIndex === activeHeroSlide;
        slide.classList.toggle('swiper-slide-active', active);
        slide.setAttribute('aria-hidden', String(!active));
        slide.inert = !active;
      });
      heroDotButtons.forEach((dot, dotIndex) => {
        const active = dotIndex === activeHeroSlide;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-current', String(active));
      });
    }

    heroDots.addEventListener('click', (event) => {
      const dotIndex = heroDotButtons.indexOf(event.target.closest('.hero-dot'));
      if (dotIndex >= 0) showHeroSlide(dotIndex);
    });

    let touchStartX = 0;
    heroSlider.addEventListener('touchstart', (event) => {
      touchStartX = event.changedTouches[0]?.clientX ?? 0;
    }, { passive: true });
    heroSlider.addEventListener('touchend', (event) => {
      const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX;
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > 45) {
        showHeroSlide(activeHeroSlide + (swipeDistance < 0 ? 1 : -1));
      }
    }, { passive: true });

    showHeroSlide(0);
    if (!reduceMotion.matches && heroSlides.length > 1) {
      let heroAutoplay = null;
      const startHeroAutoplay = () => {
        if (heroAutoplay !== null) return;
        heroAutoplay = window.setInterval(() => showHeroSlide(activeHeroSlide + 1), 4500);
      };
      const pauseHeroAutoplay = () => {
        window.clearInterval(heroAutoplay);
        heroAutoplay = null;
      };
      heroSlider.addEventListener('mouseenter', pauseHeroAutoplay);
      heroSlider.addEventListener('mouseleave', startHeroAutoplay);
      if (!heroSlider.matches(':hover')) startHeroAutoplay();
    }
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
  // Keep the pinned scroll story on tablet and desktop widths (768px+).
  mm.add(
    "(min-width: 768px)",
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
  // Desktop changes with pinned scroll; mobile changes only on explicit selection.
  const desktopViewport = window.matchMedia("(min-width: 768px)");
  steps.forEach((step, index) => {
    step.addEventListener("click", () => {
      if (desktopViewport.matches) return;
      activateStep(index);
      updateProgress(steps.length > 1 ? index / (steps.length - 1) : 0);
    });
    step.addEventListener("keydown", (event) => {
      if (desktopViewport.matches) return;
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

// Reveal the app feature rows, store links, and community cards as they scroll into view.
(() => {
  const animatedSections = [
    {
      section: document.querySelector(".app-promo"),
      items: ".app-promo-features li, .app-promo-stores a"
    },
    {
      section: document.querySelector(".community-section"),
      items: ".community-card"
    }
  ].filter(({ section }) => section);
  if (!animatedSections.length || !("IntersectionObserver" in window)) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-section-visible", entry.isIntersecting);
    });
  }, { threshold: 0.16, rootMargin: "0px 0px -35px 0px" });

  animatedSections.forEach(({ section, items }) => {
    const targets = Array.from(section.querySelectorAll(items));
    if (!targets.length) return;
    section.classList.add("has-scroll-motion");
    targets.forEach((target, index) => {
      target.style.setProperty("--motion-delay", `${(index % 5) * 100}ms`);
      observer.observe(target);
    });
  });
})();

// Collapse the buy sidebar into a mobile filter panel.
(() => {
  const sidebar = document.querySelector('.buy-market-sidebar');
  if (!sidebar) return;

  const toggle = document.querySelector('.buy-market-filter-toggle');
  const back = sidebar.querySelector('.buy-market-filter-back');
  const compactViewport = window.matchMedia('(max-width: 767px)');
  if (!toggle || !back) return;

  let closeTimer;
  const setOpen = (open) => {
    window.clearTimeout(closeTimer);
    if (open) {
      sidebar.classList.remove('is-closing');
      sidebar.classList.add('is-open');
      document.body.classList.toggle('buy-market-filter-open', compactViewport.matches);
      toggle.setAttribute('aria-expanded', 'true');
      back.focus();
      return;
    }

    toggle.setAttribute('aria-expanded', 'false');
    if (!sidebar.classList.contains('is-open')) return;

    sidebar.classList.add('is-closing');
    const closingDelay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 280;
    closeTimer = window.setTimeout(() => {
      sidebar.classList.remove('is-open', 'is-closing');
      document.body.classList.remove('buy-market-filter-open');
      toggle.focus();
    }, closingDelay);
  };

  toggle.addEventListener('click', () => setOpen(true));
  back.addEventListener('click', () => setOpen(false));
  sidebar.querySelectorAll('.buy-market-filter-row').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && sidebar.classList.contains('is-open')) setOpen(false);
  });
  compactViewport.addEventListener('change', (event) => {
    if (!event.matches) setOpen(false);
  });
})();
