import { H as Hls } from "./hls.js";

export function initMoviePlayer(videoSource) {
  const video = document.getElementById("moviePlayer");
  const button = document.getElementById("playerStart");
  let hls = null;
  let ready = false;

  if (!video || !button || !videoSource) {
    return;
  }

  const prepare = () => {
    if (ready) {
      return;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoSource;
    } else if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(videoSource);
      hls.attachMedia(video);
    } else {
      video.src = videoSource;
    }

    ready = true;
  };

  const start = () => {
    prepare();
    button.classList.add("is-hidden");
    video.play().catch(() => {});
  };

  button.addEventListener("click", start);

  video.addEventListener("play", () => {
    button.classList.add("is-hidden");
  });

  window.addEventListener("pagehide", () => {
    if (hls) {
      hls.destroy();
      hls = null;
    }
  });
}
