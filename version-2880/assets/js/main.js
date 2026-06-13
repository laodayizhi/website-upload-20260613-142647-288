(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var toggle = document.querySelector("[data-menu-toggle]");
        var menu = document.querySelector("[data-mobile-menu]");

        if (toggle && menu) {
            toggle.addEventListener("click", function () {
                menu.classList.toggle("is-open");
            });
        }

        document.querySelectorAll("[data-back-top]").forEach(function (button) {
            button.addEventListener("click", function () {
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        });

        document.querySelectorAll("[data-hero-slider]").forEach(function (slider) {
            var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
            var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
            var index = 0;

            function show(nextIndex) {
                index = nextIndex;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("is-active", slideIndex === index);
                });
                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle("is-active", dotIndex === index);
                });
            }

            dots.forEach(function (dot, dotIndex) {
                dot.addEventListener("click", function () {
                    show(dotIndex);
                });
            });

            if (slides.length > 1) {
                window.setInterval(function () {
                    show((index + 1) % slides.length);
                }, 5600);
            }
        });

        document.querySelectorAll("[data-search-input]").forEach(function (input) {
            var scopeSelector = input.getAttribute("data-search-scope");
            var scope = scopeSelector ? document.querySelector(scopeSelector) : document;
            if (!scope) {
                return;
            }
            var items = Array.prototype.slice.call(scope.querySelectorAll(".search-item"));
            var empty = scope.querySelector(".empty-state");

            input.addEventListener("input", function () {
                var keyword = input.value.trim().toLowerCase();
                var visibleCount = 0;

                items.forEach(function (item) {
                    var text = (item.getAttribute("data-search") || item.textContent || "").toLowerCase();
                    var visible = !keyword || text.indexOf(keyword) !== -1;
                    item.style.display = visible ? "" : "none";
                    if (visible) {
                        visibleCount += 1;
                    }
                });

                if (empty) {
                    empty.classList.toggle("is-visible", visibleCount === 0);
                }
            });
        });
    });
})();
