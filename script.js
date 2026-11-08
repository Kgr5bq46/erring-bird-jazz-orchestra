
document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const header = document.querySelector(".header");

  const photoLightbox = document.getElementById("photoLightbox");
  const photoLightboxImage = document.getElementById("photoLightboxImage");
  const photoLightboxClose = document.getElementById("photoLightboxClose");

  // ========================================
  // ハンバーガーメニューの開閉
  // ========================================

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      const isOpen = mainNav.classList.toggle("is-open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
      menuToggle.textContent = isOpen ? "×" : "☰";
    });

    // メニュー項目を押したら閉じる
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

    // 写真をクリックしたら拡大
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
        // 別ページへのリンク画像は、そのままリンクを有効にする
        const link = img.closest("a");

        if (link) {
          const href = link.getAttribute("href") || "";
          const isImageLink = /\.(jpg|jpeg|png|gif|webp|avif)(\?.*)?$/i.test(href);

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

    // ライトボックスを閉じる
    function closeLightbox() {
      photoLightbox.classList.remove("is-open");
      photoLightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("lightbox-open");

      // フェードアウト後に画像を空にする
      setTimeout(function () {
        if (!photoLightbox.classList.contains("is-open")) {
          photoLightboxImage.src = "";
        }
      }, 350);
    }

    // ×ボタンで閉じる
    photoLightboxClose.addEventListener("click", closeLightbox);

    // 背景部分をクリックして閉じる
    photoLightbox.addEventListener("click", function (event) {
      if (event.target === photoLightbox) {
        closeLightbox();
      }
    });

    // Escキーで閉じる
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && photoLightbox.classList.contains("is-open")) {
        closeLightbox();
      }
    });
  }
});
