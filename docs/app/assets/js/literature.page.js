import { renderShell } from "./app.js";
import { loadContent } from "./content.js";
import { loadState, saveState } from "./storage.js";
import { isoToday, toast } from "./ui.js";

renderShell();
const content = await loadContent();
const state = loadState();

const el = (id)=>document.getElementById(id);

renderWorks();

el("planStart").value = isoToday();
el("planEnd").value = state.config.examDate || "";

el("btnGeneratePlan").addEventListener("click", generatePlan);
el("btnAdoptPlan").addEventListener("click", adoptPlan);

function renderWorks(){
  const works = content.literature || [];
  el("works").innerHTML = works.map(w=>{
    const tags = (w.focus||[]).map(t=>`<span class="pill">${eh(t)}</span>`).join("");
    return `<div class="card" style="grid-column: span 6;">
      <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;">
        <div>
          <div style="font-weight:900;">${eh(w.title)}</div>
          <div style="color:var(--muted);font-size:12px;margin-top:2px;">${eh(w.author)} • ${eh(w.year||"")}</div>
          <div class="meta" style="margin-top:10px;">${tags}</div>
        </div>
        <a class="btn secondary" href="./modules.html?lit=${encodeURIComponent(w.title)}">Ver módulo</a>
      </div>
      <div style="margin-top:10px;color:var(--muted);">
        <strong>Como estudar:</strong> fichamento (enredo/estrutura/linguagem) + 20 flashcards + 1 mini-ensaio para redação.
      </div>
    </div>`;
  }).join("");
}

function generatePlan(){
  const start = el("planStart").value || isoToday();
  const end = el("planEnd").value;
  const minutesPerDay = Number(el("minutesPerDay").value||30);
  if(!end){
    toast("Defina uma data final (idealmente a data da prova).");
    return;
  }
  const s = new Date(start); const e = new Date(end);
  s.setHours(0,0,0,0); e.setHours(0,0,0,0);
  const days = Math.max(1, Math.round((e-s)/(1000*60*60*24))+1);

  const works = content.literature || [];
  // Each work gets a number of sessions: 6 for books/plays, 4 for poems/album (shorter)
  const sessions = works.map(w=>{
    const base = (w.type==="obra") ? 6 : 4;
    return { w, sessions: base };
  });
  const totalSessions = sessions.reduce((a,b)=>a+b.sessions,0);

  const sessionsPerDay = Math.max(1, Math.round(minutesPerDay / 30)); // 30-min blocks
  const maxSessions = days * sessionsPerDay;
  const scale = maxSessions / totalSessions;

  // Scale sessions if too tight
  const planItems = [];
  let cursor = new Date(start);
  let workIdx = 0;
  let remaining = Math.max(1, Math.round(sessions[0].sessions * scale));

  for(let day=0; day<days; day++){
    const date = cursor.toISOString().slice(0,10);
    const items = [];
    for(let s=0; s<sessionsPerDay; s++){
      const w = sessions[workIdx]?.w;
      if(!w) break;
      items.push({
        date, title: `Obra UEL: ${w.title} — sessão de leitura/análise`,
        type:"literatura", subjectId:"lit", moduleId:"lit-"+slug(w.title),
        durationMin: 30, status:"todo", notes:""
      });
      remaining--;
      if(remaining<=0){
        workIdx++;
        if(workIdx >= sessions.length) break;
        remaining = Math.max(1, Math.round(sessions[workIdx].sessions * scale));
      }
    }
    planItems.push({date, items});
    cursor.setDate(cursor.getDate()+1);
  }

  generatePlan._last = planItems;

  el("planBox").innerHTML = planItems.slice(0, 21).map(d=>{
    return `<div class="card" style="padding:12px;">
      <div style="font-weight:900;">${d.date}</div>
      <ul>${d.items.map(it=>`<li>${eh(it.title)}</li>`).join("") || "<li style='color:var(--muted)'>Sem sessão</li>"}</ul>
    </div>`;
  }).join("") + (planItems.length>21 ? `<div class="notice">Mostrando os primeiros 21 dias. Salve para ver tudo no Calendário.</div>`:"");

  toast("Plano de leitura gerado.");
}

function adoptPlan(){
  const plan = generatePlan._last;
  if(!plan){ toast("Gere um plano primeiro."); return; }
  // Merge, keep custom tasks
  const dates = plan.map(x=>x.date);
  const keep = state.tasks.filter(t=>!dates.includes(t.date) || t.type==="custom");
  const newTasks = plan.flatMap(x=>x.items.map(it=>({id:`task_${Math.random().toString(16).slice(2)}_${Date.now()}`, ...it})));
  state.tasks = [...keep, ...newTasks];
  saveState(state);
  toast("Plano de leitura salvo no calendário ✅");
}

function slug(t){
  return (t||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
}
function eh(str){ return (str??"").toString().replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"); }
