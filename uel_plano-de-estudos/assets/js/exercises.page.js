import { renderShell } from "./app.js";
import { loadContent, loadExercises } from "./content.js";
import { loadState, saveState } from "./storage.js";
import { toast, isoToday } from "./ui.js";

renderShell();
const content = await loadContent();
const bank = await loadExercises();
const state = loadState();

const el = (id)=>document.getElementById(id);

el("subject").innerHTML = `<option value="">Todas as matérias</option>` +
  content.subjects.map(s=>`<option value="${s.id}">${s.short||s.name}</option>`).join("");

el("btnStart").addEventListener("click", start);

el("btnResetQuiz").addEventListener("click", ()=>{
  el("quizBox").innerHTML = "";
  el("summary").innerHTML = "";
});

function start(){
  const sid = el("subject").value;
  const n = Math.min(30, Math.max(5, Number(el("count").value||10)));
  let list = bank.exercises.slice();
  if(sid) list = list.filter(q=>q.subjectId===sid);
  shuffle(list);
  list = list.slice(0, n);

  let idx = 0;
  let right = 0;
  const answers = [];

  renderQ();

  function renderQ(){
    const q = list[idx];
    if(!q) return finish();
    el("quizBox").innerHTML = `
      <div class="card">
        <div class="meta"><span class="pill">${(q.subjectId||"").toUpperCase()}</span><span class="pill">Questão ${idx+1}/${list.length}</span></div>
        <h3 style="margin-top:10px;">${eh(q.stem)}</h3>
        <div style="display:flex;flex-direction:column;gap:10px;margin-top:10px;">
          ${q.choices.map((c,i)=>`
            <button class="btn secondary" data-choice="${i}" style="text-align:left;justify-content:flex-start;">
              <span class="kbd">${String.fromCharCode(65+i)}</span> ${eh(c)}
            </button>
          `).join("")}
        </div>
        <div class="row" style="margin-top:12px;justify-content:space-between;">
          <span class="pill">Dica: registre seus erros para revisar</span>
          <button class="btn ghost" id="btnSkip">Pular</button>
        </div>
      </div>
    `;
    document.querySelectorAll("[data-choice]").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const chosen = Number(btn.getAttribute("data-choice"));
        const ok = chosen === q.answerIndex;
        answers.push({ id:q.id, ok, chosen });
        if(ok) right++;
        showFeedback(ok, q, chosen);
      });
    });
    document.getElementById("btnSkip").addEventListener("click", ()=>{
      answers.push({ id:q.id, ok:false, chosen:null, skipped:true });
      showFeedback(false, q, null, true);
    });
  }

  function showFeedback(ok, q, chosen, skipped=false){
    el("quizBox").innerHTML = `
      <div class="card">
        <div class="meta"><span class="pill">${(q.subjectId||"").toUpperCase()}</span><span class="pill">${ok ? "✅ Acertou" : (skipped ? "⏭️ Pulou" : "❌ Errou")}</span></div>
        <h3 style="margin-top:10px;">${eh(q.stem)}</h3>
        <div style="margin-top:10px;">
          ${q.choices.map((c,i)=>{
            const mark = i===q.answerIndex ? "✅" : (i===chosen ? "❌" : "•");
            return `<div class="notice" style="margin-top:8px;">
              <strong>${mark} ${String.fromCharCode(65+i)}</strong> — ${eh(c)}
            </div>`;
          }).join("")}
        </div>
        <div class="notice" style="margin-top:12px;">
          <strong>Explicação:</strong> ${eh(q.explanation)}
        </div>

        <div class="row" style="margin-top:12px;justify-content:space-between;">
          <button class="btn secondary" id="btnLogError">Registrar como erro</button>
          <button class="btn" id="btnNext">${idx+1===list.length ? "Finalizar" : "Próxima"}</button>
        </div>
      </div>
    `;

    document.getElementById("btnNext").addEventListener("click", ()=>{
      idx++;
      renderQ();
    });

    document.getElementById("btnLogError").addEventListener("click", ()=>{
      state.errors.push({
        id: `err_${Date.now()}`,
        date: isoToday(),
        subjectId: q.subjectId,
        moduleId: "",
        what: q.stem,
        why: ok ? "Acerto, mas quero fixar." : "Errei / dúvida no conceito.",
        fix: `Rever teoria + refazer questões do tema. Explicação: ${q.explanation}`
      });
      saveState(state);
      toast("Erro registrado para revisão.");
    });
  }

  function finish(){
    el("quizBox").innerHTML = "";
    const pct = Math.round((right / list.length) * 100);
    el("summary").innerHTML = `
      <div class="card">
        <div class="kpi">
          <div>
            <div class="value">${pct}%</div>
            <div class="label">Aproveitamento</div>
          </div>
          <div style="text-align:right;">
            <div style="font-weight:900;">${right}/${list.length}</div>
            <div class="label">Acertos</div>
          </div>
        </div>
        <div class="row" style="margin-top:12px;">
          <a class="btn" href="./stats.html">Ver estatísticas</a>
          <a class="btn secondary" href="./reviews.html">Fazer revisões</a>
        </div>
      </div>
    `;
  }
}

function shuffle(a){
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
}
function eh(str){ return (str??"").toString().replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"); }
