const header = document.querySelector(".site-header");
const revealElements = document.querySelectorAll(".reveal");

window.addEventListener("scroll", () => {
  if (!header) return;

  if (window.scrollY > 20) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

if (revealElements.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  revealElements.forEach((element) => {
    observer.observe(element);
  });
}

/* LIGHTBOX */
const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxCaption = document.querySelector(".lightbox-caption");
const lightboxTriggers = document.querySelectorAll(".lightbox-trigger");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxPrev = document.querySelector(".lightbox-prev");
const lightboxNext = document.querySelector(".lightbox-next");

let currentIndex = 0;
let visibleImages = [];

function getVisibleImages() {
  return Array.from(
    document.querySelectorAll(".gallery-item.lightbox-trigger:not(.hidden)")
  );
}

function openLightbox(index) {
  if (!lightbox || !lightboxImage || !lightboxCaption) return;

  visibleImages = getVisibleImages();
  if (!visibleImages.length) return;

  currentIndex = index;
  const image = visibleImages[currentIndex];
  const img = image.querySelector("img");

  if (!img) return;

  lightboxImage.src = img.src;
  lightboxImage.alt = img.alt;
  lightboxCaption.textContent = img.alt;
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  if (!lightbox) return;

  lightbox.classList.remove("open");
  document.body.style.overflow = "";
}

function showNext() {
  visibleImages = getVisibleImages();
  if (!visibleImages.length) return;

  currentIndex = (currentIndex + 1) % visibleImages.length;
  openLightbox(currentIndex);
}

function showPrev() {
  visibleImages = getVisibleImages();
  if (!visibleImages.length) return;

  currentIndex = (currentIndex - 1 + visibleImages.length) % visibleImages.length;
  openLightbox(currentIndex);
}

if (lightboxTriggers.length) {
  lightboxTriggers.forEach((item) => {
    item.addEventListener("click", () => {
      visibleImages = getVisibleImages();
      const index = visibleImages.indexOf(item);

      if (index !== -1) {
        openLightbox(index);
      }
    });
  });
}

if (lightboxClose) {
  lightboxClose.addEventListener("click", closeLightbox);
}

if (lightboxNext) {
  lightboxNext.addEventListener("click", showNext);
}

if (lightboxPrev) {
  lightboxPrev.addEventListener("click", showPrev);
}

if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
}

document.addEventListener("keydown", (e) => {
  if (!lightbox || !lightbox.classList.contains("open")) return;

  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") showNext();
  if (e.key === "ArrowLeft") showPrev();
});

/* FILTERS */
const filterButtons = document.querySelectorAll(".filter-btn");
const galleryItems = document.querySelectorAll(".gallery-item");

if (filterButtons.length && galleryItems.length) {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      galleryItems.forEach((item) => {
        const category = item.dataset.category;

        if (filter === "all" || category === filter) {
          item.classList.remove("hidden");
        } else {
          item.classList.add("hidden");
        }
      });

      if (lightbox && lightbox.classList.contains("open")) {
        closeLightbox();
      }
    });
  });
}