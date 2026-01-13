import { renderShell } from "./app.js";
import { loadContent } from "./content.js";
import { loadState, saveState } from "./storage.js";
import { isoToday, toast, fmtDate } from "./ui.js";
import { generateWeekPlan } from "./planner.js";

renderShell();
const content = await loadContent();
const state = loadState();

const el = (id)=>document.getElementById(id);
const today = isoToday();

el("weekStart").value = today;
render();

el("btnGenerate").addEventListener("click", render);

el("btnAdopt").addEventListener("click", ()=>{
  const plan = render._last;
  if(!plan){ toast("Gere um plano primeiro."); return; }
  // merge tasks: replace tasks in the week generated (same dates & auto type)
  const weekDates = plan.plan.map(d=>d.date);
  const keep = state.tasks.filter(t=>!weekDates.includes(t.date) || t.type==="custom");
  const newTasks = plan.plan.flatMap(d=>d.items);
  state.tasks = [...keep, ...newTasks];
  saveState(state);
  toast("Plano salvo no Calendário ✅");
});

function render(){
  const start = el("weekStart").value || today;
  const plan = generateWeekPlan({ content, state, weekStartISO: start });
  render._last = plan;

  el("phaseName").textContent = `${plan.phase.name} — ${plan.phase.focus}`;
  el("sessionsInfo").textContent = `${plan.weekSessions} sessões de ~${plan.sessionMin}min`;

  const box = el("weekBox");
  box.innerHTML = plan.plan.map(day=>{
    const rows = day.items.map(it=>`<tr>
      <td style="width:96px;"><span class="pill">${it.type}</span></td>
      <td>${escapeHtml(it.title)} ${it.moduleId?`<div style="color:var(--muted);font-size:12px;margin-top:4px;">${escapeHtml(it.moduleId)}</div>`:""}</td>
      <td style="width:90px;">${it.durationMin} min</td>
    </tr>`).join("");
    return `<div class="card" style="grid-column: span 6;">
      <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;">
        <div>
          <div style="font-weight:900;">${day.label} • ${fmtDate(day.date)}</div>
          <div style="color:var(--muted);font-size:12px;margin-top:2px;">${day.items.length} sessão(ões)</div>
        </div>
        <a class="btn secondary" href="./calendar.html#${day.date}">Ver no calendário</a>
      </div>
      <div style="margin-top:10px;">
        <table class="table" aria-label="Sessões do dia ${day.label}">
          <thead><tr><th>Tipo</th><th>Conteúdo</th><th>Duração</th></tr></thead>
          <tbody>${rows || `<tr><td colspan="3" style="color:var(--muted);">Sem sessões</td></tr>`}</tbody>
        </table>
      </div>
    </div>`;
  }).join("");
}

function escapeHtml(str){
  return (str??"").toString().replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
}
