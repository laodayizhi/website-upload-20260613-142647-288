(function () {
    function attach(video, playbackUrl) {
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = playbackUrl;
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            var hls = new Hls({
                enableWorker: true,
                lowLatencyMode: false
            });
            hls.loadSource(playbackUrl);
            hls.attachMedia(video);
            return;
        }

        video.src = playbackUrl;
    }

    window.initMoviePlayer = function (videoId, playbackUrl, overlayId) {
        var video = document.getElementById(videoId);
        var overlay = document.getElementById(overlayId);

        if (!video) {
            return;
        }

        attach(video, playbackUrl);

        function play() {
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
            var promise = video.play();
            if (promise && typeof promise.catch === "function") {
                promise.catch(function () {});
            }
        }

        if (overlay) {
            overlay.addEventListener("click", play);
        }

        video.addEventListener("click", function () {
            if (video.paused) {
                play();
            }
        });

        video.addEventListener("play", function () {
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
        });

        video.addEventListener("pause", function () {
            if (overlay && !video.ended) {
                overlay.classList.remove("is-hidden");
            }
        });

        video.addEventListener("ended", function () {
            if (overlay) {
                overlay.classList.remove("is-hidden");
            }
        });
    };
})();
