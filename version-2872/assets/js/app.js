(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-toggle]");
    var mobilePanel = document.querySelector("[data-mobile-panel]");

    if (menuButton && mobilePanel) {
      menuButton.addEventListener("click", function () {
        mobilePanel.classList.toggle("is-open");
      });
    }

    document.querySelectorAll("img").forEach(function (image) {
      image.addEventListener("error", function () {
        var holder = image.closest(".poster");
        if (holder) {
          holder.classList.add("no-art");
        }
      });
    });

    var hero = document.querySelector("[data-hero]");
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var previous = hero.querySelector("[data-hero-prev]");
      var next = hero.querySelector("[data-hero-next]");
      var active = 0;
      var timer;

      function show(index) {
        if (!slides.length) {
          return;
        }

        active = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === active);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === active);
        });
      }

      function start() {
        window.clearInterval(timer);
        timer = window.setInterval(function () {
          show(active + 1);
        }, 5000);
      }

      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          show(Number(dot.getAttribute("data-hero-dot")) || 0);
          start();
        });
      });

      if (previous) {
        previous.addEventListener("click", function () {
          show(active - 1);
          start();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          show(active + 1);
          start();
        });
      }

      start();
    }

    document.querySelectorAll("[data-filter-scope]").forEach(function (scope) {
      var buttons = Array.prototype.slice.call(scope.querySelectorAll("[data-filter]"));
      var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card"));

      buttons.forEach(function (button) {
        button.addEventListener("click", function () {
          var value = button.getAttribute("data-filter") || "all";
          buttons.forEach(function (item) {
            item.classList.toggle("is-active", item === button);
          });
          cards.forEach(function (card) {
            var matched = value === "all" || card.getAttribute("data-category") === value;
            card.classList.toggle("is-hidden", !matched);
          });
        });
      });
    });

    document.querySelectorAll("[data-search-page]").forEach(function (page) {
      var search = page.querySelector("[data-search-input]");
      var yearFilter = page.querySelector("[data-year-filter]");
      var categoryFilter = page.querySelector("[data-category-filter]");
      var cards = Array.prototype.slice.call(page.querySelectorAll(".movie-card"));
      var params = new URLSearchParams(window.location.search);
      var keyword = params.get("q") || "";

      if (search && keyword) {
        search.value = keyword;
      }

      function apply() {
        var query = search ? search.value.trim().toLowerCase() : "";
        var year = yearFilter ? yearFilter.value : "all";
        var category = categoryFilter ? categoryFilter.value : "all";

        cards.forEach(function (card) {
          var haystack = (card.getAttribute("data-search") || "").toLowerCase();
          var cardYear = card.getAttribute("data-year") || "";
          var cardCategory = card.getAttribute("data-category") || "";
          var matched = true;

          if (query && haystack.indexOf(query) === -1) {
            matched = false;
          }
          if (year !== "all" && cardYear !== year) {
            matched = false;
          }
          if (category !== "all" && cardCategory !== category) {
            matched = false;
          }

          card.classList.toggle("is-hidden", !matched);
        });
      }

      [search, yearFilter, categoryFilter].forEach(function (control) {
        if (control) {
          control.addEventListener("input", apply);
          control.addEventListener("change", apply);
        }
      });

      apply();
    });

    document.querySelectorAll("[data-share]").forEach(function (button) {
      button.addEventListener("click", function () {
        var title = document.querySelector("h1") ? document.querySelector("h1").textContent : document.title;
        if (navigator.share) {
          navigator.share({ title: title, url: window.location.href });
        } else if (navigator.clipboard) {
          navigator.clipboard.writeText(window.location.href);
          button.textContent = "已复制";
          window.setTimeout(function () {
            button.textContent = "分享";
          }, 1600);
        }
      });
    });
  });
})();
