import { renderShell } from "./app.js";
import { loadContent } from "./content.js";
import { loadState, saveState, exportState, importState, resetState } from "./storage.js";
import { toast, readFileAsText, downloadText } from "./ui.js";

renderShell();
const content = await loadContent();
const state = loadState();

const el = (id)=>document.getElementById(id);

populateCourseOptions();
populateStrengths();

el("examDate").value = state.config.examDate || "";
el("track").value = state.config.track || "geral";
el("language").value = state.config.language || "ingles";
el("sessionMinutes").value = state.config.sessionMinutes || 50;
el("weeklyHoursTarget").value = state.config.weeklyHoursTarget || 18;

for(const [k,v] of Object.entries(state.config.availability || {})){
  const input = el(`av_${k}`);
  if(input) input.value = v;
}

el("track").addEventListener("change", ()=>{
  const isDisc = el("track").value === "discursiva";
  el("discBox").style.display = isDisc ? "block" : "none";
});

el("btnSave").addEventListener("click", ()=>{
  state.config.examDate = el("examDate").value.trim();
  state.config.track = el("track").value;
  state.config.language = el("language").value;
  state.config.sessionMinutes = Number(el("sessionMinutes").value) || 50;
  state.config.weeklyHoursTarget = Number(el("weeklyHoursTarget").value) || 18;

  const course = el("targetCourse").value;
  state.config.targetCourse = course;

  state.config.availability = {
    mon: Number(el("av_mon").value||0),
    tue: Number(el("av_tue").value||0),
    wed: Number(el("av_wed").value||0),
    thu: Number(el("av_thu").value||0),
    fri: Number(el("av_fri").value||0),
    sat: Number(el("av_sat").value||0),
    sun: Number(el("av_sun").value||0),
  };

  // strengths
  state.config.strengths = {};
  document.querySelectorAll("[data-strength]").forEach(sel=>{
    const sid = sel.getAttribute("data-strength");
    state.config.strengths[sid] = Number(sel.value);
  });

  saveState(state);
  toast("Configuração salva ✅");
});

el("btnExport").addEventListener("click", ()=>{
  downloadText("uel_planner_backup.json", exportState());
  toast("Backup baixado.");
});

el("importFile").addEventListener("change", async (e)=>{
  const file = e.target.files?.[0];
  if(!file) return;
  const txt = await readFileAsText(file);
  importState(txt);
  toast("Backup importado. Recarregando…");
  setTimeout(()=>location.reload(), 500);
});

el("btnReset").addEventListener("click", ()=>{
  if(!confirm("Isso apaga seus dados locais (configurações, progresso, tarefas). Continuar?")) return;
  resetState();
  toast("Dados apagados.");
  setTimeout(()=>location.href="./index.html", 400);
});

function populateCourseOptions(){
  const sel = el("targetCourse");
  const opts = Object.keys(content.coursesDiscursive || {}).sort((a,b)=>a.localeCompare(b));
  sel.innerHTML = `<option value="">(opcional) Selecione seu curso</option>` + opts.map(o=>`<option value="${escapeHtml(o)}">${escapeHtml(o)}</option>`).join("");
  sel.value = state.config.targetCourse || "";
  el("discBox").style.display = (el("track").value === "discursiva") ? "block" : "none";
}

function populateStrengths(){
  const box = el("strengths");
  box.innerHTML = content.subjects.filter(s=>!["atu"].includes(s.id)).map(s=>{
    const cur = state.config.strengths?.[s.id] ?? 1;
    return `<div class="card" style="padding:12px;">
      <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;">
        <div>
          <div style="font-weight:800;">${escapeHtml(s.short || s.name)}</div>
          <div style="color:var(--muted);font-size:12px;margin-top:2px;">0 = fraco • 3 = forte</div>
        </div>
        <select data-strength="${s.id}" aria-label="Nível em ${escapeHtml(s.name)}">
          ${[0,1,2,3].map(v=>`<option value="${v}" ${v===cur?"selected":""}>${v}</option>`).join("")}
        </select>
      </div>
    </div>`;
  }).join("");
}

function escapeHtml(str){
  return (str??"").toString().replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
}
