import { renderShell } from "./app.js";
import { loadContent } from "./content.js";
import { loadState, saveState } from "./storage.js";
import { isoToday, toast, fmtDate, clamp } from "./ui.js";
import { nextIntervalDays, addDaysISO } from "./spaced.js";

renderShell();
const content = await loadContent();
const state = loadState();
const today = isoToday();

const el = (id)=>document.getElementById(id);

render();

function dueModules(){
  const due = [];
  for(const [id,p] of Object.entries(state.progress.modules || {})){
    if(p?.nextReview && p.nextReview <= today){
      const m = content.modules.find(x=>x.id===id);
      if(!m) continue;
      due.push({ id, m, p });
    }
  }
  // show lowest mastery first
  due.sort((a,b)=> (a.p.mastery??0) - (b.p.mastery??0));
  return due;
}

function dueCards(){
  return (state.flashcards||[]).filter(c=>c.due && c.due <= today).slice(0, 30);
}

function render(){
  const mods = dueModules();
  const cards = dueCards();
  el("kpiMods").textContent = mods.length.toString();
  el("kpiCards").textContent = cards.length.toString();

  el("modsBox").innerHTML = mods.length ? mods.map(x=>moduleCard(x)).join("") :
    `<div class="notice">Nenhum módulo para revisar hoje. Se você estudou algo, marque "Estudei hoje" no módulo para entrar na revisão espaçada.</div>`;

  el("cardsBox").innerHTML = cards.length ? cards.map(c=>flashCard(c)).join("") :
    `<div class="notice">Sem flashcards vencidos. Você pode criar flashcards no final desta página.</div>`;

  wire();
}

function moduleCard({id,m,p}){
  const mastery = p.mastery ?? 0;
  const last = p.lastStudied ? fmtDate(p.lastStudied) : "—";
  return `<div class="card">
    <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;">
      <div>
        <div style="font-weight:900;">${eh(m.title)}</div>
        <div class="meta">
          <span class="pill">${m.subjectId.toUpperCase()}</span>
          <span class="pill">domínio: ${mastery}/3</span>
          <span class="pill">último: ${last}</span>
        </div>
      </div>
      <a class="btn secondary" href="./module.html?id=${encodeURIComponent(id)}">Abrir</a>
    </div>
    <div style="margin-top:10px;">
      <div style="color:var(--muted);font-size:12px;margin-bottom:6px;">Como foi esta revisão? (0 = errei tudo • 5 = perfeito)</div>
      <div class="row">
        ${[0,1,2,3,4,5].map(q=>`<button class="tab" data-q="${q}" data-mid="${eh(id)}">${q}</button>`).join("")}
      </div>
    </div>
  </div>`;
}

function flashCard(c){
  return `<div class="card">
    <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;">
      <div style="flex:1;">
        <div style="font-weight:900;">${eh(c.front || "(sem frente)")}</div>
        <div style="color:var(--muted);font-size:12px;margin-top:2px;">Deck: ${eh(c.deck||"geral")} • ${c.subjectId ? c.subjectId.toUpperCase() : ""}</div>
        <details style="margin-top:10px;">
          <summary class="pill" style="cursor:pointer;">Mostrar resposta</summary>
          <div style="margin-top:10px;color:var(--muted);white-space:pre-wrap;">${eh(c.back || "")}</div>
        </details>
      </div>
      <div style="min-width:200px;">
        <div style="color:var(--muted);font-size:12px;margin-bottom:6px;">Autoavaliação</div>
        <div class="row">
          ${[0,1,2,3,4,5].map(q=>`<button class="tab" data-cq="${q}" data-cid="${eh(c.id)}">${q}</button>`).join("")}
        </div>
      </div>
    </div>
  </div>`;
}

function wire(){
  document.querySelectorAll("[data-q]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const q = Number(btn.getAttribute("data-q"));
      const id = btn.getAttribute("data-mid");
      gradeModule(id, q);
    });
  });
  document.querySelectorAll("[data-cq]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const q = Number(btn.getAttribute("data-cq"));
      const id = btn.getAttribute("data-cid");
      gradeCard(id, q);
    });
  });

  document.getElementById("btnAddCard").addEventListener("click", ()=>{
    const front = document.getElementById("fcFront").value.trim();
    const back = document.getElementById("fcBack").value.trim();
    const deck = document.getElementById("fcDeck").value.trim() || "geral";
    const subjectId = document.getElementById("fcSubject").value;
    if(!front || !back){ toast("Preencha frente e verso."); return; }
    state.flashcards.push({
      id: `fc_${Date.now()}`,
      front, back, deck, subjectId,
      interval: 0, ef: 2.5,
      due: addDaysISO(today, 1),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    saveState(state);
    document.getElementById("fcFront").value="";
    document.getElementById("fcBack").value="";
    toast("Flashcard criado ✅");
    render();
  });

  // subject options
  const sel = document.getElementById("fcSubject");
  if(sel && !sel._filled){
    sel._filled = true;
    sel.innerHTML = `<option value="">(sem matéria)</option>` + content.subjects.map(s=>`<option value="${s.id}">${s.short||s.name}</option>`).join("");
  }
}

function gradeModule(id, quality){
  const cur = state.progress.modules[id] || { mastery:0, lapses:0 };
  const intervalDays = cur.intervalDays ?? 0;
  const ef = cur.ef ?? 2.5;
  const next = nextIntervalDays({ intervalDays, ef, quality });
  const nextReview = addDaysISO(today, next.intervalDays);

  const lapses = (quality < 3) ? (cur.lapses ?? 0) + 1 : (cur.lapses ?? 0);
  const mastery = clamp((cur.mastery ?? 0) + (quality >= 4 ? 1 : 0) - (quality <= 1 ? 1 : 0), 0, 3);

  state.progress.modules[id] = {
    ...cur,
    intervalDays: next.intervalDays,
    ef: next.ef,
    nextReview,
    lastStudied: today,
    lapses,
    mastery
  };
  saveState(state);
  toast(`Revisão registrada. Próxima: ${nextReview}`);
  render();
}

function gradeCard(id, quality){
  const i = (state.flashcards||[]).findIndex(c=>c.id===id);
  if(i<0) return;
  const c = state.flashcards[i];
  const intervalDays = c.interval ?? 0;
  const ef = c.ef ?? 2.5;
  const next = nextIntervalDays({ intervalDays, ef, quality });
  const nextReview = addDaysISO(today, next.intervalDays);

  state.flashcards[i] = {
    ...c,
    interval: next.intervalDays,
    ef: next.ef,
    due: nextReview,
    updatedAt: new Date().toISOString()
  };
  saveState(state);
  toast(`Flashcard atualizado. Próxima: ${nextReview}`);
  render();
}

function eh(str){ return (str??"").toString().replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"); }
