import { renderShell } from "./app.js";
import { loadContent } from "./content.js";
import { loadState, saveState } from "./storage.js";
import { isoToday, daysBetween, fmtDate, toast } from "./ui.js";

renderShell();

const state = loadState();
const content = await loadContent();

const today = isoToday();
const exam = state.config.examDate || "";
const daysLeft = exam ? daysBetween(today, exam) : null;

document.getElementById("kpiDays").textContent = (daysLeft==null) ? "—" : daysLeft.toString();
document.getElementById("kpiExam").textContent = exam ? fmtDate(exam) : "Defina em Configuração";

const due = dueItems(state, today);
document.getElementById("kpiDue").textContent = due.length.toString();

const minutesTarget = Object.values(state.config.availability||{}).reduce((a,b)=>a+Number(b||0),0);
document.getElementById("kpiWeek").textContent = `${Math.round(minutesTarget/60)}h`;

renderToday(due);
renderNextSteps();

document.getElementById("btnPrint")?.addEventListener("click", ()=>{
  toast("Dica: use 'Salvar como PDF' no diálogo de impressão.");
  window.print();
});

document.getElementById("btnQuickAdd")?.addEventListener("click", ()=>{
  const title = prompt("Título da tarefa (ex.: Questões de Matemática - Funções)");
  if(!title) return;
  state.tasks.push({ id: `task_${Date.now()}`, title, date: today, type:"custom", subjectId:"", moduleId:"", durationMin: state.config.sessionMinutes||50, status:"todo", notes:"" });
  saveState(state);
  toast("Tarefa adicionada para hoje.");
  location.reload();
});

function dueItems(state, today){
  const dueModules = Object.entries(state.progress.modules || {})
    .filter(([id,p])=> p?.nextReview && p.nextReview <= today)
    .map(([id,p])=>({ kind:"module", id, title: content.modules.find(m=>m.id===id)?.title || id, subjectId: content.modules.find(m=>m.id===id)?.subjectId || "" }));

  const dueCards = (state.flashcards||[]).filter(c=>c.due && c.due <= today).map(c=>({kind:"card", id:c.id, title:c.front, subjectId:c.subjectId || ""}));
  const dueTasks = (state.tasks||[]).filter(t=>t.date===today && t.status!=="done").map(t=>({kind:"task", id:t.id, title:t.title, subjectId:t.subjectId || ""}));

  return [...dueTasks, ...dueModules, ...dueCards].slice(0, 18);
}

function renderToday(items){
  const box = document.getElementById("todayList");
  if(!items.length){
    box.innerHTML = `<div class="notice">Sem pendências para hoje. Use o Plano semanal para gerar uma agenda — ou adicione uma tarefa rápida.</div>`;
    return;
  }
  box.innerHTML = items.map(it=>{
    const badge = it.kind === "module" ? "Revisão de módulo" : (it.kind === "card" ? "Flashcard" : "Tarefa");
    const link = it.kind === "module"
      ? `./module.html?id=${encodeURIComponent(it.id)}`
      : (it.kind === "task" ? `./calendar.html#today` : `./reviews.html#cards`);
    return `<div class="card" style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;">
      <div>
        <div style="font-weight:800;">${escapeHtml(it.title)}</div>
        <div class="meta"><span class="pill">${badge}</span>${it.subjectId?`<span class="pill">${it.subjectId.toUpperCase()}</span>`:""}</div>
      </div>
      <a class="btn secondary" href="${link}" style="white-space:nowrap;">Abrir</a>
    </div>`;
  }).join("");
}

function renderNextSteps(){
  const box = document.getElementById("nextSteps");
  const missing = [];
  if(!state.config.examDate) missing.push("Defina a data da prova");
  if(!state.config.targetCourse && state.config.track==="discursiva") missing.push("Escolha o curso (para priorizar a discursiva)");
  const configured = missing.length === 0;

  box.innerHTML = configured
    ? `<div class="notice">Configuração pronta. Agora gere seu plano semanal, estude e use a Revisão espaçada todos os dias.</div>
       <div class="row" style="margin-top:10px;">
         <a class="btn" href="./planner.html">Gerar plano semanal</a>
         <a class="btn secondary" href="./reviews.html">Fazer revisões</a>
       </div>`
    : `<div class="notice"><strong>Quase lá:</strong> ${missing.map(x=>`<span class="pill">${x}</span>`).join(" ")}</div>
       <div class="row" style="margin-top:10px;"><a class="btn" href="./setup.html">Abrir configuração</a></div>`;
}

function escapeHtml(str){
  return (str??"").toString().replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
}
