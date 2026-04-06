const header = document.querySelector(".site-header");
const revealElements = document.querySelectorAll(".reveal");

/* HEADER SHADOW ON SCROLL */
if (header) {
  window.addEventListener(
    "scroll",
    () => {
      header.classList.toggle("scrolled", window.scrollY > 20);
    },
    { passive: true }
  );
}

/* REVEAL ANIMATION */
if (revealElements.length) {
  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    revealElements.forEach((element) => element.classList.add("active"));
  } else {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealElements.forEach((element) => observer.observe(element));
  }
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

function getVisibleImages() {
  return Array.from(
    document.querySelectorAll(".gallery-item.lightbox-trigger:not(.hidden)")
  );
}

function updateLightbox(index) {
  const visibleImages = getVisibleImages();
  if (!visibleImages.length || !lightboxImage || !lightboxCaption) return;

  currentIndex = index;
  const currentItem = visibleImages[currentIndex];
  const img = currentItem.querySelector("img");
  const caption = currentItem.querySelector(".gallery-overlay span");

  if (!img) return;

  lightboxImage.src = img.src;
  lightboxImage.alt = img.alt;
  lightboxCaption.textContent = caption ? caption.textContent : img.alt;
}

function openLightbox(index) {
  if (!lightbox) return;
  updateLightbox(index);
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function showNext() {
  const visibleImages = getVisibleImages();
  if (!visibleImages.length) return;

  currentIndex = (currentIndex + 1) % visibleImages.length;
  updateLightbox(currentIndex);
}

function showPrev() {
  const visibleImages = getVisibleImages();
  if (!visibleImages.length) return;

  currentIndex = (currentIndex - 1 + visibleImages.length) % visibleImages.length;
  updateLightbox(currentIndex);
}

if (lightboxTriggers.length) {
  lightboxTriggers.forEach((item) => {
    item.addEventListener("click", () => {
      const visibleImages = getVisibleImages();
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
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (!lightbox || !lightbox.classList.contains("open")) return;

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowRight") showNext();
  if (event.key === "ArrowLeft") showPrev();
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
        const shouldShow = filter === "all" || category === filter;

        item.classList.toggle("hidden", !shouldShow);
      });

      if (lightbox && lightbox.classList.contains("open")) {
        closeLightbox();
      }
    });
  });
}

/* PREMIUM MOBILE MENU */
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const menuOverlay = document.querySelector(".menu-overlay");
const navLinks = document.querySelectorAll(".site-nav a");

if (menuToggle && siteNav && menuOverlay) {
  const openMenu = () => {
    menuToggle.classList.add("active");
    siteNav.classList.add("active");
    menuOverlay.classList.add("active");
    document.body.classList.add("menu-open");
    menuToggle.setAttribute("aria-expanded", "true");
  };

  const closeMenu = () => {
    menuToggle.classList.remove("active");
    siteNav.classList.remove("active");
    menuOverlay.classList.remove("active");
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  const toggleMenu = () => {
    if (siteNav.classList.contains("active")) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  menuToggle.addEventListener("click", toggleMenu);
  menuOverlay.addEventListener("click", closeMenu);

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && siteNav.classList.contains("active")) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });
}

/* PREVIEW STAGGER ANIMATION */
const previewCards = document.querySelectorAll(".preview-card");

if (previewCards.length) {
  const previewObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  previewCards.forEach((card) => previewObserver.observe(card));
}

/* CONTACT FORM - FORMSPREE */
const contactForm = document.querySelector(".contact-form");
const formSuccess = document.querySelector(".form-success");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        contactForm.reset();

        if (formSuccess) {
          formSuccess.style.display = "block";
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  });
}