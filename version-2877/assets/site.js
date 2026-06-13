(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(function () {
        var toggle = document.querySelector("[data-nav-toggle]");
        var mobileNav = document.querySelector("[data-mobile-nav]");
        if (toggle && mobileNav) {
            toggle.addEventListener("click", function () {
                mobileNav.classList.toggle("is-open");
            });
        }

        document.querySelectorAll("[data-carousel]").forEach(function (carousel) {
            var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-slide]"));
            var buttons = Array.prototype.slice.call(carousel.querySelectorAll("[data-slide-to]"));
            if (!slides.length) {
                return;
            }
            var active = 0;
            function show(index) {
                active = (index + slides.length) % slides.length;
                slides.forEach(function (slide, i) {
                    slide.classList.toggle("is-active", i === active);
                });
                buttons.forEach(function (button, i) {
                    button.classList.toggle("is-active", i === active);
                });
            }
            buttons.forEach(function (button, i) {
                button.addEventListener("click", function () {
                    show(i);
                });
            });
            show(0);
            window.setInterval(function () {
                show(active + 1);
            }, 5200);
        });

        document.querySelectorAll("[data-card-filter]").forEach(function (input) {
            input.addEventListener("input", function () {
                var keyword = input.value.trim().toLowerCase();
                var cards = document.querySelectorAll(".movie-card[data-search]");
                cards.forEach(function (card) {
                    var text = card.getAttribute("data-search").toLowerCase();
                    card.classList.toggle("hidden-by-filter", keyword && text.indexOf(keyword) === -1);
                });
            });
        });

        var searchForm = document.querySelector("[data-search-form]");
        var searchInput = document.querySelector("[data-search-input]");
        var results = document.querySelector("[data-search-results]");
        if (searchForm && searchInput && results && window.SEARCH_INDEX) {
            var params = new URLSearchParams(window.location.search);
            var query = params.get("q") || "";
            searchInput.value = query;
            function render(keyword) {
                var value = keyword.trim().toLowerCase();
                var list = window.SEARCH_INDEX.filter(function (item) {
                    return !value || item.search.indexOf(value) !== -1;
                }).slice(0, 80);
                results.innerHTML = list.map(function (item) {
                    return "<article class=\"movie-card\" data-search=\"" + escapeHtml(item.search) + "\">" +
                        "<a class=\"movie-card-link\" href=\"" + escapeHtml(item.href) + "\">" +
                        "<div class=\"poster-frame\"><img src=\"" + escapeHtml(item.cover) + "\" alt=\"" + escapeHtml(item.title) + "\" loading=\"lazy\"><span class=\"card-year\">" + escapeHtml(item.year) + "</span><span class=\"card-play\">▶</span></div>" +
                        "<div class=\"card-content\"><h3>" + escapeHtml(item.title) + "</h3><p class=\"card-line\">" + escapeHtml(item.line) + "</p><div class=\"card-meta\"><span>" + escapeHtml(item.region) + "</span><span>" + escapeHtml(item.type) + "</span></div><p class=\"card-tags\">" + escapeHtml(item.genre) + "</p></div>" +
                        "</a></article>";
                }).join("");
            }
            function escapeHtml(value) {
                return String(value || "").replace(/[&<>"]/g, function (char) {
                    return {
                        "&": "&amp;",
                        "<": "&lt;",
                        ">": "&gt;",
                        "\"": "&quot;"
                    }[char];
                });
            }
            searchForm.addEventListener("submit", function (event) {
                event.preventDefault();
                var value = searchInput.value.trim();
                var next = value ? "?q=" + encodeURIComponent(value) : window.location.pathname;
                history.replaceState(null, "", next);
                render(value);
            });
            searchInput.addEventListener("input", function () {
                render(searchInput.value);
            });
            render(query);
        }
    });
})();
