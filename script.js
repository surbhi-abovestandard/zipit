
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

const DROP_INTERVAL = 1300;
const CARDS_PER_DROP = 2;
const MAX_CARDS = 26;

// ===== CREATE CARD =====
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

if (heroSlider) {
  const heroTrack = heroSlider.querySelector('.hero-track');
  const heroSlides = heroTrack ? Array.from(heroTrack.children) : [];
  const heroDots = heroSlider.parentElement.querySelector('.hero-dots');

  if (heroTrack && heroDots && heroSlides.length > 1) {
    let activeSlide = 0;
    let autoplayTimer;

    const dots = heroSlides.map((slide, index) => {
      const dot = document.createElement('button');
      dot.className = 'hero-dot';
      dot.type = 'button';
      dot.setAttribute('aria-label', `Show slide ${index + 1}`);
      dot.addEventListener('click', () => showSlide(index));
      heroDots.appendChild(dot);
      return dot;
    });

    function showSlide(index) {
      activeSlide = (index + heroSlides.length) % heroSlides.length;
      heroTrack.style.transform = `translateX(-${activeSlide * 100}%)`;
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      heroSlides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === activeSlide;
        slide.setAttribute('aria-hidden', String(!isActive));
        slide.inert = !isActive;
        dots[slideIndex].setAttribute('aria-current', String(isActive));

        const smoke = slide.querySelector('.slide-smoke');
        if (!smoke) return;

        if (isActive && !reduceMotion) {
          smoke.play().catch(() => {});
        } else {
          smoke.pause();
        }
      });
    }

    function startAutoplay() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      window.clearInterval(autoplayTimer);
      autoplayTimer = window.setInterval(() => showSlide(activeSlide + 1), 5000);
    }

    heroSlider.classList.add('is-enhanced');
    showSlide(0);
    startAutoplay();
    heroSlider.addEventListener('mouseenter', () => window.clearInterval(autoplayTimer));
    heroSlider.addEventListener('mouseleave', startAutoplay);
    heroSlider.addEventListener('focusin', () => window.clearInterval(autoplayTimer));
    heroSlider.addEventListener('focusout', (event) => {
      if (!heroSlider.contains(event.relatedTarget)) startAutoplay();
    });
  }
}

// Keep the trading guide's highlighted step, timeline and preview in sync with scroll
const tradeGuide = document.querySelector(".trade-guide");

if (tradeGuide && window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  const steps = gsap.utils.toArray(".trade-step", tradeGuide);
  const shots = gsap.utils.toArray(".trade-shot", tradeGuide);
  const progress = tradeGuide.querySelector(".trade-rail-progress");

  let activeStep = -1;

  function activateStep(index) {
    if (index === activeStep) return;
    activeStep = index;

    steps.forEach((step, i) => {
      step.classList.toggle("is-active", i === index);
      step.classList.toggle("is-complete", i < index);
      step.setAttribute("aria-current", i === index ? "step" : "false");
    });

    shots.forEach((shot, i) => {
      shot.classList.toggle("is-active", i === index);
    });

    if (progress) {
      progress.style.height =
        `${(index / Math.max(steps.length - 1, 1)) * 100}%`;
    }
  }

  const mm = gsap.matchMedia();
  mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
    ScrollTrigger.create({
      trigger: tradeGuide,
      start: "top top",
      end: () => `+=${window.innerHeight * steps.length}`,
      pin: true,
      scrub: 0.5,
      invalidateOnRefresh: true,
      onUpdate(self) {
        const index = Math.min(
          Math.floor(self.progress * steps.length),
          steps.length - 1
        );
        activateStep(index);
        if (progress) {
          progress.style.height = `${self.progress * 100}%`;
        }
      }
    });
  });

  mm.add("(max-width: 767px)", () => {
    const activateOnHover = steps.map((step, index) => {
      const onMouseEnter = () => activateStep(index);
      step.addEventListener("mouseenter", onMouseEnter);
      return { step, onMouseEnter };
    });

    return () => {
      activateOnHover.forEach(({ step, onMouseEnter }) => {
        step.removeEventListener("mouseenter", onMouseEnter);
      });
    };
  });
  steps.forEach((step, index) => {
    step.addEventListener("focusin", () => activateStep(index));
  });
  activateStep(0);
  ScrollTrigger.refresh();
}