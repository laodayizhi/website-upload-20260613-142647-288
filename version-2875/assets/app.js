(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    var toggle = document.querySelector('.menu-toggle');
    var mobileNav = document.querySelector('.mobile-nav');
    if (toggle && mobileNav) {
      toggle.addEventListener('click', function () {
        var open = mobileNav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
      var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
      var current = 0;
      function show(index) {
        if (!slides.length) return;
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle('active', i === current);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle('active', i === current);
        });
      }
      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
          show(i);
        });
      });
      window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    var libraries = document.querySelectorAll('.library-section');
    libraries.forEach(function (section) {
      var input = section.querySelector('.library-search');
      var clear = section.querySelector('.search-clear');
      var selects = Array.prototype.slice.call(section.querySelectorAll('.filter-select'));
      var cards = Array.prototype.slice.call(section.querySelectorAll('[data-movie-card]'));
      var empty = section.querySelector('[data-empty-state]');
      function normalize(value) {
        return String(value || '').toLowerCase().trim();
      }
      function apply() {
        var term = normalize(input ? input.value : '');
        var filters = {};
        selects.forEach(function (select) {
          filters[select.getAttribute('data-filter')] = select.value;
        });
        var visible = 0;
        cards.forEach(function (card) {
          var matchTerm = !term || normalize(card.getAttribute('data-search')).indexOf(term) !== -1;
          var matchFilters = Object.keys(filters).every(function (key) {
            return !filters[key] || card.getAttribute('data-' + key) === filters[key];
          });
          var show = matchTerm && matchFilters;
          card.hidden = !show;
          if (show) visible += 1;
        });
        if (empty) {
          empty.classList.toggle('show', visible === 0);
        }
      }
      if (input) {
        input.addEventListener('input', apply);
      }
      if (clear) {
        clear.addEventListener('click', function () {
          if (input) input.value = '';
          selects.forEach(function (select) {
            select.value = '';
          });
          apply();
        });
      }
      selects.forEach(function (select) {
        select.addEventListener('change', apply);
      });
      section.querySelectorAll('[data-search-chip]').forEach(function (chip) {
        chip.addEventListener('click', function () {
          if (input) {
            input.value = chip.getAttribute('data-search-chip') || chip.textContent;
            apply();
            input.focus();
          }
        });
      });
      apply();
    });

    document.querySelectorAll('[data-player]').forEach(function (player) {
      var video = player.querySelector('video');
      var cover = player.querySelector('.player-cover');
      var sourceUrl = player.getAttribute('data-url');
      var hls = null;
      var attached = false;
      function attach() {
        if (!video || !sourceUrl || attached) return;
        attached = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = sourceUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hls.loadSource(sourceUrl);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (!data || !data.fatal) return;
            if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
              hls.startLoad();
            } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
              hls.recoverMediaError();
            } else {
              hls.destroy();
            }
          });
        } else {
          video.src = sourceUrl;
        }
      }
      function play() {
        attach();
        player.classList.add('is-playing');
        video.controls = true;
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
          promise.catch(function () {});
        }
      }
      if (cover) {
        cover.addEventListener('click', play);
      }
      if (video) {
        video.addEventListener('click', function () {
          if (!attached) play();
        });
      }
      window.addEventListener('pagehide', function () {
        if (hls) hls.destroy();
      });
    });
  });
})();
