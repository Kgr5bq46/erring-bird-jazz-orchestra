
document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const header = document.querySelector(".header");

  const photoLightbox = document.getElementById("photoLightbox");
  const photoLightboxImage = document.getElementById("photoLightboxImage");
  const photoLightboxClose = document.getElementById("photoLightboxClose");

  // ========================================
  // ハンバーガーメニュー
  // ========================================

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      const isOpen = mainNav.classList.toggle("is-open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "メニューを閉じる" : "メニューを開く"
      );
      menuToggle.textContent = isOpen ? "×" : "☰";
    });

    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "メニューを開く");
        menuToggle.textContent = "☰";
      });
    });
  }

  // ========================================
  // スクロール時のヘッダー表示
  // ========================================

  function updateHeader() {
    if (!header) return;

    if (window.scrollY > 120) {
      header.classList.add("is-visible");
    } else {
      header.classList.remove("is-visible");
    }
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  // ========================================
  // 写真ライトボックス
  // ========================================

  if (photoLightbox && photoLightboxImage && photoLightboxClose) {

    document.querySelectorAll("img").forEach(function (img) {
      if (
        img === photoLightboxImage ||
        img.closest(".header") ||
        img.closest("footer") ||
        img.closest(".photo-lightbox")
      ) {
        return;
      }

      img.style.cursor = "zoom-in";

      img.addEventListener("click", function (event) {
        const link = img.closest("a");

        if (link) {
          const href = link.getAttribute("href") || "";
          const isImageLink =
            /\.(jpg|jpeg|png|gif|webp|avif)(\?.*)?$/i.test(href);

          if (!isImageLink) return;

          event.preventDefault();
        }

        photoLightboxImage.src = img.currentSrc || img.src;
        photoLightboxImage.alt = img.alt || "拡大写真";

        photoLightbox.classList.add("is-open");
        photoLightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("lightbox-open");
      });
    });

    function closeLightbox() {
      photoLightbox.classList.remove("is-open");
      photoLightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("lightbox-open");

      setTimeout(function () {
        if (!photoLightbox.classList.contains("is-open")) {
          photoLightboxImage.src = "";
        }
      }, 350);
    }

    photoLightboxClose.addEventListener("click", closeLightbox);

    photoLightbox.addEventListener("click", function (event) {
      if (event.target === photoLightbox) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (
        event.key === "Escape" &&
        photoLightbox.classList.contains("is-open")
      ) {
        closeLightbox();
      }
    });
  }

  // ========================================
  // スクロール時の順次表示アニメーション
  // ========================================

  const revealSelector = [
    ".hero-content > *",
    ".hero-note",

    ".section-label",

    ".about .section-content > *",
    ".about-body > p",
    ".about-name-story > *",

    ".members .section-content > .eyebrow",
    ".members .section-content > h2",
    ".members-intro",
    ".members-grid .member-card",
    ".members-message",

    ".concert-photo",
    ".concert-info > *",
    ".next-concert-heading > *",
    ".next-concert-layout > *",

    ".section-heading > *",
    ".gallery-grid > img",

    ".history .section-content > .eyebrow",
    ".history .section-content > h2",
    ".history .section-content > p",
    ".history-category > *",
    ".live-list > .live-card",
    ".event-list > .live-card",

    ".recruit-box > *",

    ".contact .section-content > .eyebrow",
    ".contact .section-content > h2",
    ".contact .section-content > p",
    ".contact-links > *"
  ].join(",");

  const revealTargets = Array.from(
    document.querySelectorAll(revealSelector)
  );

  // 同じ親要素の中で順番に表示
  const delayCounts = new Map();

  revealTargets.forEach(function (element) {
    const parent = element.parentElement;
    const count = delayCounts.get(parent) || 0;

    element.classList.add("scroll-reveal");
    element.style.transitionDelay = (count * 0.12) + "s";

    delayCounts.set(parent, count + 1);
  });

  // IntersectionObserverで画面内に入ったら表示
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -30px 0px"
      }
    );

    revealTargets.forEach(function (element) {
      revealObserver.observe(element);
    });

  } else {
    // 対応していないブラウザでは通常表示
    revealTargets.forEach(function (element) {
      element.classList.add("is-visible");
    });
  }

});
