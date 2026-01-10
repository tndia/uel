import { renderShell } from "./app.js";
import { loadContent } from "./content.js";
import { loadState, saveState } from "./storage.js";
import { isoToday, toast, fmtDate, escapeHtml as _eh } from "./ui.js";
import { moduleDefaultSchedule, addDaysISO } from "./spaced.js";

renderShell();
const content = await loadContent();
const state = loadState();

const params = new URLSearchParams(location.search);
const id = params.get("id") || "";
const mod = content.modules.find(m=>m.id===id);

const el = (x)=>document.getElementById(x);

if(!mod){
  el("title").textContent = "Módulo não encontrado";
  el("body").innerHTML = `<div class="notice">Verifique o link ou volte para <a href="./modules.html">Módulos</a>.</div>`;
}else{
  render();
}

function render(){
  el("title").textContent = mod.title;
  const p = state.progress.modules[id] || { mastery: 0, lapses: 0 };
  const schedule = moduleDefaultSchedule();

  el("body").innerHTML = `
    <div class="grid">
      <div class="card" style="grid-column: span 7;">
        <h3>Objetivos</h3>
        <ul>${(mod.goals||[]).map(x=>`<li>${eh(x)}</li>`).join("")}</ul>

        <h3 style="margin-top:14px;">Checklist (pronto quando concluir)</h3>
        <ul>${(mod.checklist||[]).map(x=>`<li>${eh(x)}</li>`).join("")}</ul>

        <hr class="sep"/>
        <div class="row">
          <button class="btn" id="btnStudied">Estudei hoje</button>
          <button class="btn secondary" id="btnAddTask">Adicionar como tarefa</button>
          <a class="btn ghost" href="./reviews.html">Ir para revisões</a>
        </div>
      </div>

      <div class="card" style="grid-column: span 5;">
        <h3>Status</h3>
        <div class="kpi" style="margin-top:8px;">
          <div>
            <div class="value">${p.mastery ?? 0}/3</div>
            <div class="label">Domínio do módulo</div>
          </div>
          <div style="text-align:right;">
            <div style="font-weight:800;">${p.nextReview ? fmtDate(p.nextReview) : "—"}</div>
            <div class="label">Próxima revisão</div>
          </div>
        </div>

        <div style="margin-top:12px;" class="field">
          <label for="mastery">Ajustar domínio (0–3)</label>
          <select id="mastery">
            ${[0,1,2,3].map(v=>`<option value="${v}" ${v===(p.mastery??0)?"selected":""}>${v}</option>`).join("")}
          </select>
        </div>

        <div class="notice" style="margin-top:12px;">
          Sugestão de revisões após estudar: ${schedule.join(" → ")} dias.
        </div>

        <hr class="sep"/>
        <h3>Recursos</h3>
        ${(mod.resources||[]).length ? `
          <ul>${mod.resources.map(r=>`<li><a href="${eh(r.url)}" target="_blank" rel="noopener">${eh(r.label)}</a></li>`).join("")}</ul>
        ` : `<div class="notice">Sem links fixos aqui. Use provas anteriores e seu material.</div>`}

        <h3 style="margin-top:14px;">Prática guiada</h3>
        <ul>${(mod.practice||[]).map(x=>`<li>${eh(x)}</li>`).join("")}</ul>

        <hr class="sep"/>
        <h3>Registrar um erro</h3>
        <div class="field">
          <label>O que errou?</label>
          <textarea id="errWhat" placeholder="Ex.: confundi Kc e Kp; errei por não identificar reagente limitante."></textarea>
        </div>
        <div class="field">
          <label>Por que errou?</label>
          <textarea id="errWhy" placeholder="Ex.: pulei etapa; não conferi unidade; não desenhei diagrama."></textarea>
        </div>
        <div class="field">
          <label>Como vai corrigir?</label>
          <textarea id="errFix" placeholder="Ex.: criar checklist; revisar teoria; refazer 10 questões semelhantes."></textarea>
        </div>
        <div class="row" style="margin-top:10px;">
          <button class="btn secondary" id="btnSaveError">Salvar erro</button>
          <a class="btn ghost" href="./stats.html#erros">Ver erros</a>
        </div>
      </div>
    </div>
  `;

  document.getElementById("btnStudied").addEventListener("click", ()=>{
    const today = isoToday();
    const cur = state.progress.modules[id] || { mastery:0, lapses:0 };
    const mastery = Math.min(3, (cur.mastery ?? 0) + 1);
    state.progress.modules[id] = {
      ...cur,
      mastery,
      lastStudied: today,
      nextReview: addDaysISO(today, schedule[0]),
      lapses: cur.lapses ?? 0
    };
    saveState(state);
    toast("Registrado: estudou hoje ✅ Próxima revisão agendada.");
    render();
  });

  document.getElementById("mastery").addEventListener("change", (e)=>{
    const v = Number(e.target.value);
    const cur = state.progress.modules[id] || { mastery:0, lapses:0 };
    state.progress.modules[id] = { ...cur, mastery: v };
    saveState(state);
    toast("Domínio atualizado.");
    render();
  });

  document.getElementById("btnAddTask").addEventListener("click", ()=>{
    const date = prompt("Data (YYYY-MM-DD) para a tarefa:", isoToday());
    if(!date) return;
    state.tasks.push({
      id: `task_${Date.now()}`,
      title: `Estudar módulo: ${mod.title}`,
      date,
      type:"conteudo",
      subjectId: mod.subjectId,
      moduleId: mod.id,
      durationMin: state.config.sessionMinutes || 50,
      status:"todo",
      notes:""
    });
    saveState(state);
    toast("Tarefa adicionada.");
  });

  document.getElementById("btnSaveError").addEventListener("click", ()=>{
    const what = document.getElementById("errWhat").value.trim();
    const why = document.getElementById("errWhy").value.trim();
    const fix = document.getElementById("errFix").value.trim();
    if(!what){ toast("Descreva o erro."); return; }
    state.errors.push({ id:`err_${Date.now()}`, date: isoToday(), subjectId: mod.subjectId, moduleId: mod.id, what, why, fix });
    saveState(state);
    toast("Erro salvo (ótimo para não repetir).");
    document.getElementById("errWhat").value="";
    document.getElementById("errWhy").value="";
    document.getElementById("errFix").value="";
  });
}

function eh(s){ return (s??"").toString().replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"); }
