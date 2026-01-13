import { renderShell } from "./app.js";
import { loadWritingPrompts } from "./content.js";
import { loadState, saveState } from "./storage.js";
import { toast, isoToday, downloadText } from "./ui.js";

renderShell();
const data = await loadWritingPrompts();
const state = loadState();

const el = (id)=>document.getElementById(id);

el("axis").innerHTML = `<option value="">Todos os eixos</option>` +
  [...new Set(data.prompts.map(p=>p.axis))].map(a=>`<option value="${eh(a)}">${eh(a)}</option>`).join("");

el("axis").addEventListener("change", renderList);
el("search").addEventListener("input", renderList);
el("btnSave").addEventListener("click", saveSubmission);
el("btnExportSubs").addEventListener("click", ()=>{
  downloadText("redacoes_uel_planner.json", JSON.stringify(state.submissions||[], null, 2));
  toast("Exportado.");
});

let timer = null;
let secondsLeft = 0;

el("btnStartTimer").addEventListener("click", ()=>{
  const min = Number(el("timerMin").value||60);
  secondsLeft = min*60;
  tick();
  timer && clearInterval(timer);
  timer = setInterval(tick, 1000);
  toast("Timer iniciado.");
});
el("btnStopTimer").addEventListener("click", ()=>{
  timer && clearInterval(timer);
  timer = null;
  toast("Timer pausado.");
});

function tick(){
  secondsLeft = Math.max(0, secondsLeft);
  const m = Math.floor(secondsLeft/60);
  const s = secondsLeft%60;
  el("timer").textContent = `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  if(secondsLeft===0){
    timer && clearInterval(timer);
    timer = null;
    toast("Tempo!");
  }else{
    secondsLeft--;
  }
}

function renderList(){
  const axis = el("axis").value;
  const q = el("search").value.trim().toLowerCase();
  let list = data.prompts.slice();
  if(axis) list = list.filter(p=>p.axis===axis);
  if(q) list = list.filter(p => p.theme.toLowerCase().includes(q) || p.prompt.toLowerCase().includes(q));
  list = list.slice(0, 30);

  el("promptList").innerHTML = list.map(p=>`
    <div class="card" style="padding:12px;">
      <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;">
        <div>
          <div style="font-weight:900;">${eh(p.theme)}</div>
          <div style="color:var(--muted);font-size:12px;margin-top:2px;">${eh(p.axis)}</div>
        </div>
        <button class="btn secondary" data-pick="${eh(p.id)}">Usar</button>
      </div>
      <div style="margin-top:10px;color:var(--muted);white-space:pre-wrap;">${eh(p.prompt)}</div>
      <div class="meta">${(p.checkpoints||[]).map(c=>`<span class="pill">${eh(c)}</span>`).join("")}</div>
    </div>
  `).join("");

  document.querySelectorAll("[data-pick]").forEach(b=>{
    b.addEventListener("click", ()=>{
      const id = b.getAttribute("data-pick");
      const p = data.prompts.find(x=>x.id===id);
      if(!p) return;
      el("theme").value = p.theme;
      el("prompt").value = p.prompt;
      toast("Tema carregado no editor.");
      window.scrollTo({top:0, behavior:"smooth"});
    });
  });
}

renderList();
renderSubs();

el("text").addEventListener("input", ()=>{
  const text = el("text").value;
  el("wordCount").textContent = `${countWords(text)} palavras`;
});

function saveSubmission(){
  const theme = el("theme").value.trim();
  const prompt = el("prompt").value.trim();
  const text = el("text").value.trim();
  if(!theme || !text){
    toast("Preencha pelo menos o tema e o texto.");
    return;
  }
  state.submissions.unshift({
    id: `sub_${Date.now()}`,
    date: isoToday(),
    theme,
    prompt,
    text,
    selfScore: Number(el("selfScore").value || 0),
    notes: el("notes").value.trim()
  });
  saveState(state);
  toast("Redação salva ✅");
  el("text").value = "";
  el("notes").value = "";
  renderSubs();
}

function renderSubs(){
  const subs = state.submissions || [];
  el("subsCount").textContent = `${subs.length} salva(s)`;
  el("subs").innerHTML = subs.slice(0, 12).map(s=>`
    <div class="card" style="padding:12px;">
      <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;">
        <div>
          <div style="font-weight:900;">${eh(s.theme)}</div>
          <div style="color:var(--muted);font-size:12px;margin-top:2px;">${eh(s.date)} • auto: ${s.selfScore||0}/5</div>
        </div>
        <button class="btn secondary" data-open="${eh(s.id)}">Abrir</button>
      </div>
    </div>
  `).join("") || `<div class="notice">Nenhuma redação salva ainda. Escreva e salve para acompanhar sua evolução.</div>`;

  document.querySelectorAll("[data-open]").forEach(b=>{
    b.addEventListener("click", ()=>{
      const id = b.getAttribute("data-open");
      const s = subs.find(x=>x.id===id);
      if(!s) return;
      showModal(s);
    });
  });
}

function showModal(s){
  const dlg = el("dlg");
  el("dlgTitle").textContent = s.theme;
  el("dlgBody").textContent = s.text;
  el("dlgMeta").textContent = `${s.date} • autoavaliação: ${s.selfScore||0}/5`;
  dlg.showModal();
  el("dlgClose").onclick = ()=>dlg.close();
}

function countWords(text){
  return (text.trim().match(/\S+/g) || []).length;
}
function eh(str){ return (str??"").toString().replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"); }
