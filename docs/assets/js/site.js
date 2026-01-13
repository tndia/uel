(function(){
  const docEl = document.documentElement;
  const stored = localStorage.getItem("theme") || "auto";
  function applyTheme(t){
    docEl.setAttribute("data-theme", t);
    localStorage.setItem("theme", t);
  }
  applyTheme(stored);

  // toggle theme (auto -> dark -> light -> auto)
  const themeBtn = document.querySelector('[data-toggle="theme"]');
  if(themeBtn){
    themeBtn.addEventListener("click", () => {
      const cur = docEl.getAttribute("data-theme") || "auto";
      const next = cur === "auto" ? "dark" : (cur === "dark" ? "light" : "auto");
      applyTheme(next);
    });
  }

  // canonical + og:url
  const canonical = document.querySelector('link[rel="canonical"]');
  if(canonical) canonical.href = location.href.split("#")[0];
  const og = document.querySelector('meta[property="og:url"]');
  if(og) og.setAttribute("content", location.href.split("#")[0]);

  // mobile nav
  const navBtn = document.querySelector('[data-toggle="nav"]');
  if(navBtn){
    navBtn.addEventListener("click", () => document.body.classList.toggle("nav-open"));
    document.addEventListener("keydown", (e) => {
      if(e.key === "Escape") document.body.classList.remove("nav-open");
    });
    document.addEventListener("click", (e) => {
      if(!document.body.classList.contains("nav-open")) return;
      const sidebar = document.getElementById("sidebar");
      if(!sidebar) return;
      const clickedInside = sidebar.contains(e.target) || navBtn.contains(e.target);
      if(!clickedInside) document.body.classList.remove("nav-open");
    });
  }

  // back to top
  const topBtn = document.querySelector('[data-toggle="top"]');
  function onScroll(){
    if(!topBtn) return;
    const show = window.scrollY > 700;
    topBtn.hidden = !show;
  }
  window.addEventListener("scroll", onScroll, {passive:true});
  if(topBtn){
    topBtn.addEventListener("click", () => window.scrollTo({top:0, behavior:"smooth"}));
  }
  onScroll();

  // search
  const inputDesktop = document.getElementById("site-search");
  const inputMobile = document.getElementById("site-search-mobile");
  const resultsEl = document.getElementById("search-results");
  let pages = null;

  async function ensureIndex(){
    if(pages) return pages;
    try{
      const res = await fetch((window.__ROOT__ || "") + "assets/search-index.json", {cache:"no-store"});
      pages = await res.json();
      return pages;
    }catch(err){
      console.warn("Search index load failed", err);
      pages = [];
      return pages;
    }
  }

  function scorePage(q, p){
    const text = (p.title + " " + (p.content || "")).toLowerCase();
    let score = 0;
    for(const token of q){
      if(!token) continue;
      const hits = text.split(token).length - 1;
      score += hits * (token.length >= 3 ? 3 : 1);
      if(p.title.toLowerCase().includes(token)) score += 10;
    }
    return score;
  }

  function escapeHtml(s){
    return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function renderResults(items){
    if(!resultsEl) return;
    if(!items.length){
      resultsEl.innerHTML = '<div style="padding:10px 12px; color: var(--muted);">Nada encontrado.</div>';
      resultsEl.hidden = false;
      return;
    }
    const html = items.slice(0, 8).map(it => {
      return `<a href="${(window.__ROOT__||"") + it.url}"><strong>${escapeHtml(it.title)}</strong><span class="meta">${escapeHtml(it.section || "")}</span></a>`;
    }).join("");
    resultsEl.innerHTML = html;
    resultsEl.hidden = false;
  }

  async function onSearch(value){
    const q = value.trim().toLowerCase().split(/\s+/).slice(0, 6);
    if(!q.length || !q[0]){
      if(resultsEl){ resultsEl.hidden = true; resultsEl.innerHTML = ""; }
      return;
    }
    const idx = await ensureIndex();
    const scored = idx.map(p => ({...p, _score: scorePage(q, p)}))
                      .filter(p => p._score > 0)
                      .sort((a,b)=> b._score - a._score);
    renderResults(scored);
  }

  function wireInput(inp){
    if(!inp) return;
    inp.addEventListener("input", (e)=> onSearch(e.target.value));
    inp.addEventListener("focus", (e)=> { if(e.target.value) onSearch(e.target.value); });
    inp.addEventListener("keydown", (e)=>{
      if(e.key === "Escape"){
        e.target.value = "";
        if(resultsEl){ resultsEl.hidden = true; }
        e.target.blur();
      }
    });
  }
  wireInput(inputDesktop);
  wireInput(inputMobile);

  document.addEventListener("click", (e)=>{
    if(!resultsEl) return;
    if(resultsEl.hidden) return;
    const inBox = (inputDesktop && inputDesktop.contains(e.target)) ||
                  (resultsEl && resultsEl.contains(e.target)) ||
                  (inputMobile && inputMobile.contains(e.target));
    if(!inBox) resultsEl.hidden = true;
  });

  // Ctrl/Cmd + K
  document.addEventListener("keydown", (e)=>{
    const isK = (e.key || "").toLowerCase() === "k";
    if(!isK) return;
    if(!(e.ctrlKey || e.metaKey)) return;
    e.preventDefault();
    if(window.innerWidth < 980 && inputMobile){
      document.body.classList.add("nav-open");
      setTimeout(()=> inputMobile.focus(), 50);
    }else if(inputDesktop){
      inputDesktop.focus();
    }
  });
})();
