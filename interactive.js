const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

// Theme toggle
$("#themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("theme-night");
});

// Show current time
$("#timeBtn").addEventListener("click", () => {
  $("#timeDisplay").textContent = new Date().toLocaleTimeString();
});

// Rating stars
const stars = $$(".star");
function setRating(n) {
  stars.forEach((s, i) => s.classList.toggle("active", i < n));
  $("#ratingValue").textContent = ` ${n}/5`;
}
stars.forEach(st => st.addEventListener("click", e => setRating(Number(e.target.dataset.value))));

// Random quote loader
$("#loadMoreBtn").addEventListener("click", async () => {
  const res = await fetch("quotes.json");
  const data = await res.json();
  const q = data[Math.floor(Math.random() * data.length)];
  const div = document.createElement("div");
  div.textContent = `"${q.text}" — ${q.author}`;
  $("#feed").prepend(div);
});
