document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".mobile-toggle");
  const panel = document.querySelector(".mobile-panel");

  if (toggle && panel) {
    toggle.addEventListener("click", () => {
      panel.classList.toggle("is-open");
    });
  }

  document.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
      image.classList.add("is-missing");
    });
  });

  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  const dots = Array.from(document.querySelectorAll(".hero-dot"));

  if (slides.length > 1) {
    let index = 0;

    const showSlide = (next) => {
      slides[index].classList.remove("is-active");
      dots[index].classList.remove("is-active");
      index = next;
      slides[index].classList.add("is-active");
      dots[index].classList.add("is-active");
    };

    dots.forEach((dot, dotIndex) => {
      dot.addEventListener("click", () => showSlide(dotIndex));
    });

    window.setInterval(() => {
      showSlide((index + 1) % slides.length);
    }, 5000);
  }

  const filterInput = document.querySelector(".local-filter");
  const sortSelect = document.querySelector(".local-sort");
  const target = document.querySelector(".filter-target");

  if (filterInput && target) {
    const cards = Array.from(target.querySelectorAll(".searchable-card"));

    const applyFilter = () => {
      const keyword = filterInput.value.trim().toLowerCase();
      cards.forEach((item) => {
        const text = item.textContent.toLowerCase();
        item.classList.toggle("is-hidden-by-filter", keyword && !text.includes(keyword));
      });
    };

    filterInput.addEventListener("input", applyFilter);

    if (sortSelect) {
      sortSelect.addEventListener("change", () => {
        const sorted = [...cards];
        const mode = sortSelect.value;
        sorted.sort((a, b) => {
          const ay = Number(a.dataset.year || 0);
          const by = Number(b.dataset.year || 0);
          const at = a.dataset.title || "";
          const bt = b.dataset.title || "";

          if (mode === "year-desc") return by - ay;
          if (mode === "year-asc") return ay - by;
          if (mode === "title") return at.localeCompare(bt, "zh-Hans-CN");
          return 0;
        });
        sorted.forEach((item) => target.appendChild(item));
      });
    }
  }
});
