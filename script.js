
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
  img.closest(".photo-lightbox") ||
  img.closest(".book-section") ||
  img.closest(".recital-report")
) {
  return;
}

      img.style.cursor = "zoom-in";

img.addEventListener("click", function (event) {

  // フォトブック内の写真ではページめくりとの干渉を防ぐ
  if (img.closest(".book-section")) {
    event.stopPropagation();
  }

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
// ========================================
// フォトブック写真の拡大表示
// ========================================

let bookTouchStart = null;

// 写真を拡大表示する共通処理
function openBookPhoto(img) {
  if (!img || !photoLightbox || !photoLightboxImage) return;

  photoLightboxImage.src = img.currentSrc || img.src;
  photoLightboxImage.alt = img.alt || "リサイタル写真";

  photoLightbox.classList.add("is-open");
  photoLightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
}

// PC：クリックで拡大
document.addEventListener("click", function (event) {
  const img = event.target.closest(".book-section .photo-page img");

  if (!img) return;

  event.preventDefault();
  event.stopPropagation();

  openBookPhoto(img);
}, true);

// スマホ：写真へのタッチ開始を検知
document.addEventListener("touchstart", function (event) {
  const img = event.target.closest(".book-section .photo-page img");

  if (!img) {
    bookTouchStart = null;
    return;
  }

  bookTouchStart = {
    img: img,
    x: event.touches[0].clientX,
    y: event.touches[0].clientY
  };

  // ページめくりライブラリへの伝播を止める
  event.stopPropagation();

}, { capture: true, passive: true });

// スマホ：タッチ終了時に拡大
document.addEventListener("touchend", function (event) {
  if (!bookTouchStart) return;

  const touch = event.changedTouches[0];
  const moveX = Math.abs(touch.clientX - bookTouchStart.x);
  const moveY = Math.abs(touch.clientY - bookTouchStart.y);

  const img = bookTouchStart.img;
  bookTouchStart = null;

  // 指を大きく動かした場合は拡大しない
  if (moveX > 15 || moveY > 15) return;

  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  openBookPhoto(img);

}, { capture: true, passive: false });

// タッチキャンセル時
document.addEventListener("touchcancel", function () {
  bookTouchStart = null;
}, true);
}, { capture: true, passive: false });
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

// 第13回リサイタル写真
".recital-report-heading > *",
".recital-photo-grid > .recital-photo-card",
".recital-report-heading > *",
".recital-photo-card",
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

  // ========================================
  // 第13回リサイタル専用ライトボックス
  // ========================================

  const recitalLightbox = document.getElementById("recitalLightbox");
  const recitalLightboxImage = document.getElementById("recitalLightboxImage");
  const recitalLightboxClose = document.getElementById("recitalLightboxClose");
  const recitalLightboxPrev = document.getElementById("recitalLightboxPrev");
  const recitalLightboxNext = document.getElementById("recitalLightboxNext");
  const recitalLightboxCaption = document.getElementById("recitalLightboxCaption");
  const recitalLightboxCounter = document.getElementById("recitalLightboxCounter");

  const recitalPhotoCards = Array.from(
    document.querySelectorAll(".recital-photo-card")
  );

  let currentRecitalPhoto = 0;
  let touchStartX = 0;

  if (
    recitalLightbox &&
    recitalLightboxImage &&
    recitalLightboxClose &&
    recitalLightboxPrev &&
    recitalLightboxNext
  ) {

    function showRecitalPhoto(index) {
      const total = recitalPhotoCards.length;

      if (total === 0) return;

      currentRecitalPhoto = (index + total) % total;

      const card = recitalPhotoCards[currentRecitalPhoto];
      const img = card.querySelector("img");

      if (!img) return;

      recitalLightboxImage.src = img.currentSrc || img.src;
      recitalLightboxImage.alt = img.alt || "リサイタル写真";

      if (recitalLightboxCaption) {
        recitalLightboxCaption.textContent =
          "第13回リサイタル｜写真 " +
          String(currentRecitalPhoto + 1).padStart(2, "0");
      }

      if (recitalLightboxCounter) {
        recitalLightboxCounter.textContent =
          String(currentRecitalPhoto + 1).padStart(2, "0") +
          " / " +
          String(total).padStart(2, "0");
      }
    }

    function openRecitalLightbox(index) {
      showRecitalPhoto(index);

      recitalLightbox.classList.add("is-open");
      recitalLightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("lightbox-open");
    }

    function closeRecitalLightbox() {
      recitalLightbox.classList.remove("is-open");
      recitalLightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("lightbox-open");

      setTimeout(function () {
        if (!recitalLightbox.classList.contains("is-open")) {
          recitalLightboxImage.src = "";
        }
      }, 300);
    }

    recitalPhotoCards.forEach(function (card, index) {
      card.addEventListener("click", function () {
        openRecitalLightbox(index);
      });
    });

    recitalLightboxClose.addEventListener(
      "click",
      closeRecitalLightbox
    );

    recitalLightboxPrev.addEventListener("click", function () {
      showRecitalPhoto(currentRecitalPhoto - 1);
    });

    recitalLightboxNext.addEventListener("click", function () {
      showRecitalPhoto(currentRecitalPhoto + 1);
    });

    recitalLightbox.addEventListener("click", function (event) {
      if (event.target === recitalLightbox) {
        closeRecitalLightbox();
      }
    });

    // キーボード操作
    document.addEventListener("keydown", function (event) {
      if (!recitalLightbox.classList.contains("is-open")) return;

      if (event.key === "Escape") {
        closeRecitalLightbox();
      }

      if (event.key === "ArrowLeft") {
        showRecitalPhoto(currentRecitalPhoto - 1);
      }

      if (event.key === "ArrowRight") {
        showRecitalPhoto(currentRecitalPhoto + 1);
      }
    });

    // スマートフォンのスワイプ操作
    recitalLightbox.addEventListener("touchstart", function (event) {
      touchStartX = event.changedTouches[0].screenX;
    }, { passive: true });

    recitalLightbox.addEventListener("touchend", function (event) {
      const touchEndX = event.changedTouches[0].screenX;
      const difference = touchEndX - touchStartX;

      if (Math.abs(difference) < 50) return;

      if (difference > 0) {
        showRecitalPhoto(currentRecitalPhoto - 1);
      } else {
        showRecitalPhoto(currentRecitalPhoto + 1);
      }
    }, { passive: true });

  }

});

// ========================================
// 第13回リサイタル PHOTO BOOK
// ========================================

document.addEventListener("DOMContentLoaded", function () {
  const bookElement = document.getElementById("book");

  if (!bookElement) return;

  // StPageFlipが読み込まれているか確認
  if (typeof St === "undefined" || !St.PageFlip) {
    console.error("フォトブックのライブラリが読み込まれていません。");
    return;
  }

  const pageFlip = new St.PageFlip(bookElement, {
    width: 320,
    height: 410,
    size: "stretch",
    minWidth: 250,
    maxWidth: 500,
    minHeight: 320,
    maxHeight: 640,
    showCover: true,
    maxShadowOpacity: 0.35,
    mobileScrollSupport: false
  });

  // HTML内のページを読み込む
  pageFlip.loadFromHTML(
    bookElement.querySelectorAll(":scope > div")
  );

  const pageNumber = document.getElementById("pageNumber");
  const prevButton = document.getElementById("prevPage");
  const nextButton = document.getElementById("nextPage");

  // ページ番号を更新
  function updatePage() {
    const current = pageFlip.getCurrentPageIndex();
    const total = pageFlip.getPageCount();

    if (current === 0) {
      pageNumber.textContent = "表紙";
    } else if (current === total - 1) {
      pageNumber.textContent = "裏表紙";
    } else {
      pageNumber.textContent = current + " / " + (total - 1);
    }
  }

  // 前のページ
  if (prevButton) {
    prevButton.addEventListener("click", function () {
      pageFlip.flipPrev();
    });
  }

  // 次のページ
  if (nextButton) {
    nextButton.addEventListener("click", function () {
      pageFlip.flipNext();
    });
  }

  // ページがめくられたとき
  pageFlip.on("flip", updatePage);

  // 最初のページ番号
  updatePage();
});
