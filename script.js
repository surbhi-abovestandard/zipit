const dropData = {
  wow: [
    { meta: "Superconductor", name: "Superconductor" },
    { meta: "Heat treated", name: "Heat treated" },
    { meta: "Gamma Doppler (phase 1)", name: "Gamma Doppler (phase 1)" },
    { meta: "Army sheen", name: "Army sheen" },
    { meta: "Safety net", name: "Safety net" },
    { meta: "Spectre", name: "Spectre" }
  ],
  live: [
    { meta: "Titan", name: "Titan" },
    { meta: "Royal legion", name: "Royal legion" },
    { meta: "Chromatic aberration", name: "Chromatic aberration" },
    { meta: "Brass", name: "Brass" },
    { meta: "Phosphor", name: "Phosphor" },
  ]
};

const WOW_COUNT = 3;   // WOW DROP me kitne cards (fixed, bina animation)
 
/* card banane ka common function (wow + live dono use karte hain) */
let skinImageIndex = 0;

function createCard(item, bgIndex, isNew) {
  const card = document.createElement('article');
  card.className = 'drop-card' + (isNew ? ' is-new' : '');
 
  const visual = document.createElement('div');
  visual.className = 'visual';
  visual.style.backgroundImage = "linear-gradient(180deg, rgba(28,19,34,.08), rgba(7,9,20,.2)), url('images/bg-img-" + bgIndex + ".png')";

  const itemImage = document.createElement('img');
  itemImage.className = 'drop-item-image';
  itemImage.src = `images/img-${(skinImageIndex++ % 11) + 1}.png`;
  itemImage.alt = '';
  itemImage.setAttribute('aria-hidden', 'true');
 
  const info = document.createElement('div');
  info.className = 'card-info';
  info.innerHTML = `
    <div class="title">${item.name || 'Featured item'}</div>
  `;
  card.append(visual, itemImage, info);
  return card;
}
 
document.querySelectorAll('.drop-row').forEach((row) => {
  const grid = document.createElement('div');
  grid.className = 'drop-row-grid';
  [...dropData.wow.slice(0, WOW_COUNT), ...dropData.live].forEach((item, i) => grid.appendChild(createCard(item, i % 5 + 1, false)));
  row.appendChild(grid);
});
 
/* ===== LIVE DROP: naye cards upar se aate hain, hover par scroll ===== */
const DROP_INTERVAL = 1300;   // ms - kam karo = tez
const CARDS_PER_DROP = 2;     // ek baar me kitne cards
const MAX_CARDS = 26;
 
const liveRow  = document.querySelector('.drop-row[data-row="combined"]');
const liveGrid = liveRow.querySelector('.drop-row-grid');
const pool = dropData.live.concat([
  { meta: "AK-47", name: "Redline" }, { meta: "AWP", name: "Asiimov" },
  { meta: "Desert Eagle", name: "Blaze" }, { meta: "Glock-18", name: "Fade" },
  { meta: "M4A4", name: "Howl" }, { meta: "★ Butterfly Knife", name: "Doppler" }
]);
let hovering = false, n = 0;
 
liveRow.addEventListener('mouseenter', () => { hovering = true; });
liveRow.addEventListener('mouseleave', () => { hovering = false; liveGrid.scrollTo({ left: 0, behavior: 'smooth' }); });
 
/* mouse wheel se horizontal scroll (sirf hover me) */
liveGrid.addEventListener('wheel', e => {
  if (!hovering) return;
  e.preventDefault();
  liveGrid.scrollLeft += e.deltaY + e.deltaX;
}, { passive: false });
 
function addDrops() {
  if (hovering) return;                       // hover me naye cards band
  for (let i = 0; i < CARDS_PER_DROP; i++) {
    const item = pool[Math.floor(Math.random() * pool.length)];
    const card = createCard(item, (n++ % 5) + 1, true);
    card.style.animationDelay = (i ? 0 : 0.18) + 's';   // ek ke peeche doosra
    liveGrid.prepend(card);
  }
  while (liveGrid.children.length > MAX_CARDS) liveGrid.lastElementChild.remove();
}
setInterval(addDrops, DROP_INTERVAL);


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