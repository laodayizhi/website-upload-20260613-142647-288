(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    document.querySelectorAll("[data-player]").forEach(function (player) {
      var video = player.querySelector("video");
      var url = player.getAttribute("data-play");
      var playButtons = player.querySelectorAll("[data-play-toggle]");
      var muteButton = player.querySelector("[data-mute-toggle]");
      var fullscreenButton = player.querySelector("[data-fullscreen-toggle]");
      var hls;
      var loaded = false;

      if (!video || !url) {
        return;
      }

      player.classList.add("is-paused");

      function load() {
        if (loaded) {
          return;
        }

        loaded = true;

        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(url);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.ERROR, function (_, data) {
            if (!data || !data.fatal) {
              return;
            }

            if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
              hls.startLoad();
            } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
              hls.recoverMediaError();
            } else {
              hls.destroy();
            }
          });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = url;
        } else {
          video.src = url;
        }
      }

      function play() {
        load();
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
          promise.catch(function () {});
        }
      }

      function toggle() {
        if (video.paused) {
          play();
        } else {
          video.pause();
        }
      }

      playButtons.forEach(function (button) {
        button.addEventListener("click", function (event) {
          event.preventDefault();
          event.stopPropagation();
          toggle();
        });
      });

      player.addEventListener("click", function (event) {
        if (event.target.closest("button")) {
          return;
        }
        toggle();
      });

      video.addEventListener("play", function () {
        player.classList.add("is-playing");
        player.classList.remove("is-paused");
        playButtons.forEach(function (button) {
          button.textContent = button.classList.contains("big-play") ? "▶" : "暂停";
        });
      });

      video.addEventListener("pause", function () {
        player.classList.remove("is-playing");
        player.classList.add("is-paused");
        playButtons.forEach(function (button) {
          button.textContent = button.classList.contains("big-play") ? "▶" : "播放";
        });
      });

      if (muteButton) {
        muteButton.addEventListener("click", function (event) {
          event.stopPropagation();
          video.muted = !video.muted;
          muteButton.textContent = video.muted ? "取消静音" : "静音";
        });
      }

      if (fullscreenButton) {
        fullscreenButton.addEventListener("click", function (event) {
          event.stopPropagation();
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else if (video.requestFullscreen) {
            video.requestFullscreen();
          }
        });
      }

      window.addEventListener("beforeunload", function () {
        if (hls) {
          hls.destroy();
        }
      });
    });
  });
})();
