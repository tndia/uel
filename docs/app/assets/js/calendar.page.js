import { renderShell } from "./app.js";
import { loadContent } from "./content.js";
import { loadState, saveState, uid } from "./storage.js";
import { isoToday, toast, fmtDate } from "./ui.js";

renderShell();
const content = await loadContent();
const state = loadState();

const el = (id)=>document.getElementById(id);
const today = isoToday();

el("date").value = location.hash?.slice(1) || today;
el("btnAdd").addEventListener("click", addTask);
el("date").addEventListener("change", render);
render();

function render(){
  const date = el("date").value || today;
  const tasks = (state.tasks||[]).filter(t=>t.date===date).sort((a,b)=>a.status.localeCompare(b.status));
  el("dayTitle").textContent = `${fmtDate(date)} (${tasks.length} tarefa(s))`;

  el("dayBox").innerHTML = tasks.map(t=>`
    <div class="card" style="padding:12px;">
      <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;">
        <div style="flex:1;">
          <div style="font-weight:900; ${t.status==="done"?"text-decoration:line-through;opacity:.75;":""}">${eh(t.title)}</div>
          <div class="meta">
            ${t.type?`<span class="pill">${eh(t.type)}</span>`:""}
            ${t.subjectId?`<span class="pill">${t.subjectId.toUpperCase()}</span>`:""}
            ${t.durationMin?`<span class="pill">${t.durationMin} min</span>`:""}
            ${t.moduleId?`<a class="pill" href="./module.html?id=${encodeURIComponent(t.moduleId)}">abrir módulo</a>`:""}
          </div>
          ${t.notes ? `<div style="margin-top:10px;color:var(--muted);white-space:pre-wrap;">${eh(t.notes)}</div>` : ""}
        </div>
        <div class="row" style="justify-content:flex-end;">
          <button class="btn secondary" data-done="${eh(t.id)}">${t.status==="done"?"Desfazer":"Concluir"}</button>
          <button class="btn ghost" data-move="${eh(t.id)}">Mover</button>
          <button class="btn ghost" data-del="${eh(t.id)}">Excluir</button>
        </div>
      </div>
    </div>
  `).join("") || `<div class="notice">Nada agendado para este dia. Use o Plano semanal ou adicione uma tarefa.</div>`;

  // next 14 days
  const upcoming = rangeDates(today, 14).map(d=>{
    const n = (state.tasks||[]).filter(t=>t.date===d && t.status!=="done").length;
    return {d,n};
  }).filter(x=>x.n>0);

  el("upcoming").innerHTML = upcoming.map(x=>`
    <div class="card" style="padding:12px;">
      <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;">
        <div>
          <div style="font-weight:900;">${fmtDate(x.d)}</div>
          <div style="color:var(--muted);font-size:12px;margin-top:2px;">${x.n} pendente(s)</div>
        </div>
        <a class="btn secondary" href="./calendar.html#${x.d}">Abrir</a>
      </div>
    </div>
  `).join("") || `<div class="notice">Sem pendências nos próximos 14 dias (ou tudo está concluído).</div>`;

  wire();
}

function wire(){
  document.querySelectorAll("[data-done]").forEach(b=>{
    b.addEventListener("click", ()=>{
      const id = b.getAttribute("data-done");
      const t = state.tasks.find(x=>x.id===id);
      if(!t) return;
      t.status = (t.status==="done") ? "todo" : "done";
      saveState(state);
      toast("Atualizado.");
      render();
    });
  });
  document.querySelectorAll("[data-move]").forEach(b=>{
    b.addEventListener("click", ()=>{
      const id = b.getAttribute("data-move");
      const t = state.tasks.find(x=>x.id===id);
      if(!t) return;
      const next = prompt("Nova data (YYYY-MM-DD):", t.date);
      if(!next) return;
      t.date = next;
      saveState(state);
      toast("Movido.");
      render();
    });
  });
  document.querySelectorAll("[data-del]").forEach(b=>{
    b.addEventListener("click", ()=>{
      const id = b.getAttribute("data-del");
      if(!confirm("Excluir esta tarefa?")) return;
      state.tasks = state.tasks.filter(x=>x.id!==id);
      saveState(state);
      toast("Excluído.");
      render();
    });
  });
}

function addTask(){
  const date = el("date").value || today;
  const title = el("newTitle").value.trim();
  if(!title){ toast("Digite um título."); return; }
  state.tasks.push({
    id: uid("task"),
    title,
    date,
    type: el("newType").value || "custom",
    subjectId: el("newSubject").value || "",
    moduleId: "",
    durationMin: Number(el("newDur").value||state.config.sessionMinutes||50),
    status:"todo",
    notes: el("newNotes").value.trim()
  });
  saveState(state);
  el("newTitle").value="";
  el("newNotes").value="";
  toast("Adicionado.");
  render();
}

function rangeDates(startISO, days){
  const out = [];
  const d = new Date(startISO);
  for(let i=0;i<=days;i++){
    const x = new Date(d);
    x.setDate(d.getDate()+i);
    out.push(x.toISOString().slice(0,10));
  }
  return out;
}
function eh(str){ return (str??"").toString().replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"); }
