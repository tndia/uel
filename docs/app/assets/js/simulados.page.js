import { renderShell } from "./app.js";
import { loadContent } from "./content.js";
import { loadState, saveState } from "./storage.js";
import { toast, isoToday } from "./ui.js";

renderShell();
const content = await loadContent();
const state = loadState();
const el = (id)=>document.getElementById(id);

const model = content.examModel;

el("day1Info").textContent = `${model.day1.objectiveQuestions} questões objetivas + redação • ${model.day1.date} • início ${model.day1.startTime}`;
el("day2Info").textContent = `2º dia (quando exigida): ${model.day2.discursiveQuestions} discursivas • ${model.day2.date} • início ${model.day2.startTime}`;

let timer = null;
let seconds = 0;

el("btnStart").addEventListener("click", ()=>{
  const mins = Number(el("minutes").value||60);
  seconds = mins*60;
  timer && clearInterval(timer);
  timer = setInterval(tick, 1000);
  tick();
  toast("Simulado iniciado.");
});
el("btnStop").addEventListener("click", ()=>{
  timer && clearInterval(timer);
  timer = null;
  toast("Pausado.");
});
el("btnReset").addEventListener("click", ()=>{
  timer && clearInterval(timer);
  timer = null;
  seconds = 0;
  el("timer").textContent = "00:00";
});

el("btnSave").addEventListener("click", ()=>{
  const kind = el("kind").value;
  const score = el("score").value.trim();
  const notes = el("notes").value.trim();
  state.progress.simulados = state.progress.simulados || [];
  state.progress.simulados.unshift({ id:`sim_${Date.now()}`, date: isoToday(), kind, score, notes });
  saveState(state);
  toast("Resultado salvo.");
  el("score").value="";
  el("notes").value="";
  renderHistory();
});

renderHistory();

function tick(){
  if(seconds <= 0){
    el("timer").textContent = "00:00";
    timer && clearInterval(timer);
    timer = null;
    toast("Tempo!");
    return;
  }
  const m = Math.floor(seconds/60);
  const s = seconds%60;
  el("timer").textContent = `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  seconds--;
}

function renderHistory(){
  const list = state.progress.simulados || [];
  el("historyCount").textContent = `${list.length} registrado(s)`;
  el("history").innerHTML = list.slice(0, 12).map(x=>`
    <div class="card" style="padding:12px;">
      <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;">
        <div>
          <div style="font-weight:900;">${x.kind}</div>
          <div style="color:var(--muted);font-size:12px;margin-top:2px;">${x.date} • ${x.score || "sem nota"}</div>
          ${x.notes ? `<div style="color:var(--muted);margin-top:10px;white-space:pre-wrap;">${eh(x.notes)}</div>`:""}
        </div>
      </div>
    </div>
  `).join("") || `<div class="notice">Sem simulados salvos. Faça um por semana na fase final.</div>`;
}

function eh(str){ return (str??"").toString().replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"); }
