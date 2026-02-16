// ====== Theme Toggle ======
const toggleTheme = document.getElementById("toggleTheme");

toggleTheme.addEventListener("click", () => {
  document.body.classList.toggle("light");

  const isLight = document.body.classList.contains("light");
  localStorage.setItem("tbote_theme", isLight ? "light" : "dark");
});

// Load theme
(function initTheme(){
  const saved = localStorage.getItem("tbote_theme");
  if(saved === "light"){
    document.body.classList.add("light");
  }
})();


// ====== Accordion ======
const accItems = document.querySelectorAll(".acc-item");

accItems.forEach((btn) => {
  btn.addEventListener("click", () => {
    const panel = btn.nextElementSibling;
    const icon = btn.querySelector("i");

    // close others
    document.querySelectorAll(".acc-panel").forEach((p) => {
      if(p !== panel){
        p.classList.remove("open");
      }
    });

    // toggle this
    panel.classList.toggle("open");
    icon.textContent = panel.classList.contains("open") ? "−" : "+";
  });
});


// ====== Reveal on Scroll ======
const revealEls = document.querySelectorAll(".reveal");

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if(entry.isIntersecting){
      entry.target.classList.add("show");
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => io.observe(el));


// ====== Search System ======
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const searchResults = document.getElementById("searchResults");

function highlight(text, q){
  const safe = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const reg = new RegExp(`(${safe})`, "gi");
  return text.replace(reg, `<mark>$1</mark>`);
}

function doSearch(){
  const q = searchInput.value.trim().toLowerCase();
  searchResults.innerHTML = "";

  if(!q){
    return;
  }

  const items = document.querySelectorAll(".searchable");
  let found = 0;

  items.forEach((el) => {
    const raw = el.innerText;
    const text = raw.toLowerCase();

    if(text.includes(q)){
      found++;

      const title = el.querySelector("h3")?.innerText || el.innerText.split("\n")[0];
      const snippet = raw.substring(0, 180) + (raw.length > 180 ? "..." : "");

      const div = document.createElement("div");
      div.className = "result";
      div.innerHTML = `
        <h4>${highlight(title, q)}</h4>
        <p>${highlight(snippet, q)}</p>
        <button class="btn ghost small">Go</button>
      `;

      div.querySelector("button").addEventListener("click", () => {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("pulse");
        setTimeout(() => el.classList.remove("pulse"), 700);
      });

      searchResults.appendChild(div);
    }
  });

  if(found === 0){
    searchResults.innerHTML = `
      <div class="result">
        <h4>ไม่พบข้อมูล</h4>
        <p>ลองค้นด้วยคำอื่น เช่น “แกน”, “เผ่า”, “มิติ”, “ต้องห้าม”, “องค์กร”</p>
      </div>
    `;
  }
}

searchBtn.addEventListener("click", doSearch);
searchInput.addEventListener("keydown", (e) => {
  if(e.key === "Enter") doSearch();
});