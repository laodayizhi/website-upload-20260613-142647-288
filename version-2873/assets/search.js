import { movies } from "./search-data.js";

const input = document.getElementById("searchInput");
const results = document.getElementById("searchResults");
const title = document.getElementById("searchTitle");
const count = document.getElementById("searchCount");
const params = new URLSearchParams(window.location.search);
const initialKeyword = params.get("q") || "";

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function card(movie) {
  const tags = movie.tags.slice(0, 3).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");

  return `
<article class="movie-card searchable-card" data-title="${escapeHtml(movie.title)}" data-year="${escapeHtml(movie.year)}" data-region="${escapeHtml(movie.region)}" data-type="${escapeHtml(movie.type)}">
  <a class="card-cover" href="movie/${escapeHtml(movie.id)}.html" aria-label="${escapeHtml(movie.title)}">
    <img src="${escapeHtml(movie.cover)}" alt="${escapeHtml(movie.title)}" loading="lazy">
    <span class="card-badge">${escapeHtml(movie.year)}</span>
  </a>
  <div class="card-body">
    <div class="chip-line">
      <span class="chip chip-blue">${escapeHtml(movie.region)}</span>
      <span class="chip">${escapeHtml(movie.type)}</span>
    </div>
    <h3><a href="movie/${escapeHtml(movie.id)}.html">${escapeHtml(movie.title)}</a></h3>
    <p>${escapeHtml(movie.oneLine)}</p>
    <div class="tag-line">${tags}</div>
  </div>
</article>`;
}

function render(keyword) {
  const query = keyword.trim().toLowerCase();
  let list = movies;

  if (query) {
    list = movies.filter((movie) => {
      const text = [
        movie.title,
        movie.region,
        movie.type,
        movie.year,
        movie.genre,
        movie.oneLine,
        movie.category,
        movie.tags.join(" ")
      ].join(" ").toLowerCase();
      return text.includes(query);
    });
  }

  list = list.slice().sort((a, b) => Number(b.year || 0) - Number(a.year || 0));
  results.innerHTML = list.slice(0, 200).map(card).join("");
  title.textContent = query ? "搜索结果" : "最新推荐";
  count.textContent = query ? `找到 ${list.length} 部相关作品` : "可通过搜索框筛选全部影片。";

  results.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
      image.classList.add("is-missing");
    });
  });
}

if (input) {
  input.value = initialKeyword;
  input.addEventListener("input", () => render(input.value));
  render(initialKeyword);
}
