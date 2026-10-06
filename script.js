const hero = document.querySelector(".hero");
const title = document.querySelector(".hero__title");
const dishName = document.querySelector(".hero__dish");
const menuItems = [...document.querySelectorAll(".menu__item")];
const plates = [...document.querySelectorAll(".plate")];

const OUT_DELAY = 420;
let current = 0;
let turn = 0;
let swapTimer;

function splitWords(text) {
  return text
    .split(" ")
    .map((word, index) => `<span class="word"><span style="--i:${index}">${word}</span></span>`)
    .join(" ");
}

function reveal(element, text) {
  element.innerHTML = splitWords(text);
  element.classList.remove("is-out");
  void element.offsetWidth;
  element.classList.add("is-in");
}

function enterPlate(plate, dir) {
  plate.style.transition = "none";
  plate.style.setProperty("--dir", dir);
  plate.classList.remove("is-leaving");
  void plate.offsetWidth;
  plate.style.transition = "";
  plate.classList.add("is-active");
}

function leavePlate(plate, dir) {
  plate.style.setProperty("--dir", dir);
  plate.classList.remove("is-active");
  plate.classList.add("is-leaving");
}

function shortestStep(from, to) {
  const total = menuItems.length;
  const diff = (to - from + total) % total;
  return diff > total / 2 ? diff - total : diff;
}

function select(index) {
  if (index === current) return;

  const dir = index > current ? 1 : -1;
  const next = menuItems[index];

  hero.dataset.dir = dir;
  turn += shortestStep(current, index);
  hero.style.setProperty("--turn", turn);
  clearTimeout(swapTimer);

  leavePlate(plates[current], dir);
  enterPlate(plates[index], dir);

  menuItems[current].classList.remove("is-active");
  menuItems[current].setAttribute("aria-pressed", "false");
  next.classList.add("is-active");
  next.setAttribute("aria-pressed", "true");

  dishName.classList.remove("is-in");
  dishName.classList.add("is-out");
  swapTimer = setTimeout(() => reveal(dishName, next.dataset.name), OUT_DELAY);

  current = index;
}

menuItems.forEach((item, index) => {
  item.addEventListener("click", () => select(index));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") select(Math.min(current + 1, menuItems.length - 1));
  if (event.key === "ArrowLeft") select(Math.max(current - 1, 0));
});

plates.forEach((plate) => {
  const preload = new Image();
  preload.src = plate.src;
});

reveal(title, title.textContent.trim());
setTimeout(() => reveal(dishName, menuItems[0].dataset.name), 350);

const WHATSAPP = "5500000000000";

document.querySelectorAll("[data-wa]").forEach((link) => {
  link.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(link.dataset.wa)}`;
});

const dishRows = [...document.querySelectorAll(".dish")];
const previewImages = [...document.querySelectorAll(".preview img")];

function showDish(index) {
  dishRows.forEach((row, i) => row.classList.toggle("is-current", i === index));
  previewImages.forEach((image, i) => image.classList.toggle("is-on", i === index));
}

const rowObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) showDish(dishRows.indexOf(entry.target));
    });
  },
  { rootMargin: "-45% 0px -45% 0px" }
);

dishRows.forEach((row) => {
  rowObserver.observe(row);
  row.addEventListener("mouseenter", () => showDish(dishRows.indexOf(row)));
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries
      .filter((entry) => entry.isIntersecting)
      .forEach((entry, order) => {
        entry.target.style.transitionDelay = `${order * 120}ms`;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
  },
  { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
);

document.querySelectorAll("[data-reveal]").forEach((element) => revealObserver.observe(element));

const floatButton = document.querySelector(".wa-float");

new IntersectionObserver(([entry]) => {
  floatButton.classList.toggle("is-shown", !entry.isIntersecting);
}).observe(hero);

const bands = [...document.querySelectorAll(".band")];
let ticking = false;

function moveBands() {
  bands.forEach((band) => {
    const rect = band.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > innerHeight) return;
    const progress = (rect.top + rect.height / 2 - innerHeight / 2) / (innerHeight / 2 + rect.height / 2);
    band.firstElementChild.style.transform = `translateY(${progress * -rect.height * 0.13}px)`;
  });
  ticking = false;
}

if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(moveBands);
    },
   {passive: true}
  );
  moveBands();
  }