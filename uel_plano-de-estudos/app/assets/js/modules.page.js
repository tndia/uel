import { renderShell } from "./app.js";
import { loadContent } from "./content.js";
import { loadState, saveState } from "./storage.js";
import { toast } from "./ui.js";

renderShell();
const content = await loadContent();
const state = loadState();

const el = (id)=>document.getElementById(id);

el("subjectFilter").innerHTML = `<option value="">Todas as matérias</option>` +
  content.subjects.map(s=>`<option value="${s.id}">${s.short || s.name}</option>`).join("");

el("subjectFilter").addEventListener("change", render);
el("searchModules").addEventListener("input", render);
el("masteryFilter").addEventListener("change", render);

render();

function render(){
  const sid = el("subjectFilter").value;
  const q = el("searchModules").value.trim().toLowerCase();
  const mf = el("masteryFilter").value;

  let list = content.modules.slice();
  if(sid) list = list.filter(m=>m.subjectId===sid);
  if(q) list = list.filter(m=>m.title.toLowerCase().includes(q) || (m.tags||[]).some(t=>t.toLowerCase().includes(q)));
  if(mf!=="") list = list.filter(m => (state.progress.modules[m.id]?.mastery ?? 0) === Number(mf));

  // Sort: due reviews first, then low mastery
  list.sort((a,b)=>{
    const pa = state.progress.modules[a.id] || {};
    const pb = state.progress.modules[b.id] || {};
    const da = pa.nextReview && pa.nextReview <= new Date().toISOString().slice(0,10) ? 1 : 0;
    const db = pb.nextReview && pb.nextReview <= new Date().toISOString().slice(0,10) ? 1 : 0;
    const ma = pa.mastery ?? 0, mb = pb.mastery ?? 0;
    if(da!==db) return db-da;
    if(ma!==mb) return ma-mb;
    return a.title.localeCompare(b.title);
  });

  const box = el("modulesBox");
  box.innerHTML = list.map(m=>{
    const p = state.progress.modules[m.id] || {};
    const mastery = p.mastery ?? 0;
    const due = p.nextReview || "";
    const dueTag = due ? `<span class="pill">rev: ${due}</span>` : "";
    return `<div class="card" style="grid-column: span 6;">
      <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;">
        <div>
          <div style="font-weight:900;">${escapeHtml(m.title)}</div>
          <div class="meta">
            <span class="pill">${m.subjectId.toUpperCase()}</span>
            <span class="pill">domínio: ${mastery}/3</span>
            ${dueTag}
            ${(m.tags||[]).slice(0,3).map(t=>`<span class="pill">${escapeHtml(t)}</span>`).join("")}
          </div>
        </div>
        <a class="btn secondary" href="./module.html?id=${encodeURIComponent(m.id)}">Abrir</a>
      </div>
      <div style="margin-top:10px;color:var(--muted);font-size:13px;">
        ${escapeHtml((m.goals||[])[0] || "—")}
      </div>
    </div>`;
  }).join("");

  el("count").textContent = `${list.length} módulo(s)`;
}

function escapeHtml(str){
  return (str??"").toString().replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
}
