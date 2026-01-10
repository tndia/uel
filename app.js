(function(){
  'use strict';

  const STORAGE_KEY = "uel_planner_v1";
  const todayISO = () => new Date().toISOString().slice(0,10);

  function loadState(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) return null;
      return JSON.parse(raw);
    }catch(e){
      console.warn("Falha ao ler storage", e);
      return null;
    }
  }
  function saveState(state){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function defaultState(){
    const now = new Date();
    const exam = new Date(now);
    exam.setMonth(exam.getMonth()+9); // sugestão
    return {
      startDate: todayISO(),
      examDate: exam.toISOString().slice(0,10),
      hoursWeek: 18,
      daysWeek: 6,
      track: "B",
      language: "Inglês",
      priority1: "Matemática",
      priority2: "Biologia",
      completedModules: {}, // moduleId: {dateCompleted, subjectId}
      reviews: [] // {moduleId, dueDate, interval, done}
    };
  }

  function fmtDate(iso){
    try{
      const [y,m,d] = iso.split("-").map(Number);
      const dt = new Date(y, m-1, d);
      return dt.toLocaleDateString('pt-BR');
    }catch{
      return iso;
    }
  }

  function daysBetween(aISO, bISO){
    const a = new Date(aISO+"T00:00:00");
    const b = new Date(bISO+"T00:00:00");
    return Math.round((b-a)/(1000*60*60*24));
  }

  function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

  function getSubjectByModuleId(moduleId){
    for(const s of STUDY_DATA.subjects){
      for(const m of s.modules){
        if(m.id === moduleId) return s;
      }
    }
    return null;
  }

  function getModuleById(moduleId){
    for(const s of STUDY_DATA.subjects){
      for(const m of s.modules){
        if(m.id === moduleId) return {...m, subjectId: s.id, subjectName: s.name, area: s.area};
      }
    }
    return null;
  }

  function getTrack(trackId){
    return STUDY_DATA.uel.tracks.find(t => t.id === trackId) || STUDY_DATA.uel.tracks[0];
  }

  function computeWeights(state){
    const track = getTrack(state.track);
    const w = {...track.default_weights};

    // Remove priority weights if track A
    if(state.track === "A"){
      delete w["Prioridade 1"];
      delete w["Prioridade 2"];
    }else{
      // Map priority subjects to increased weights
      const p1 = state.priority1;
      const p2 = state.priority2;
      // push into weights by replacing placeholders, if present
      if(w["Prioridade 1"] != null){
        w[p1] = (w[p1] || 0) + w["Prioridade 1"];
        delete w["Prioridade 1"];
      }
      if(w["Prioridade 2"] != null){
        w[p2] = (w[p2] || 0) + w["Prioridade 2"];
        delete w["Prioridade 2"];
      }
    }
    // Normalize
    const sum = Object.values(w).reduce((a,b)=>a+b,0) || 1;
    for(const k of Object.keys(w)) w[k] = w[k]/sum;
    return w;
  }

    function subjectBuckets(){
    // Mapeia "baldes" (categorias) e também cada disciplina individualmente.
    // Isso permite usar Prioridades (Trilha B) com qualquer disciplina.
    return {
      // Categorias
      "Português & Redação": ["Língua Portuguesa","Redação","Literatura"],
      "Matemática": ["Matemática"],
      "Ciências da Natureza": ["Física","Química","Biologia"],
      "Humanas": ["História","Geografia","Filosofia","Sociologia","Artes"],
      "Língua Estrangeira": ["Língua Estrangeira (Inglês/Espanhol)"],
      "Sociologia (reforço)": ["Sociologia"],
      "Sociologia (obrigatória)": ["Sociologia"],

      // Disciplinas individuais (para Prioridades)
      "Língua Portuguesa": ["Língua Portuguesa","Literatura"],
      "Matemática (disciplina)": ["Matemática"],
      "Física": ["Física"],
      "Química": ["Química"],
      "Biologia": ["Biologia"],
      "História": ["História"],
      "Geografia": ["Geografia"],
      "Filosofia": ["Filosofia"],
      "Sociologia": ["Sociologia"],
      "Artes": ["Artes"],

      // Opções de idioma separadas (mesmo conteúdo/módulos)
      "Língua Estrangeira — Inglês": ["Língua Estrangeira (Inglês/Espanhol)"],
      "Língua Estrangeira — Espanhol": ["Língua Estrangeira (Inglês/Espanhol)"],
    };
  }function getAllModulesFlat(){
    const out = [];
    for(const s of STUDY_DATA.subjects){
      for(const m of s.modules){
        out.push({...m, subjectId: s.id, subjectName: s.name, area: s.area});
      }
    }
    return out;
  }

  function renderIntro(state){
    const meta = STUDY_DATA.meta;
    document.getElementById("subTitle").textContent = meta.notes[0];
    document.getElementById("metaInfo").textContent = `v${meta.version} · gerado em ${fmtDate(meta.generated_on)} · offline`;

    document.getElementById("examDatePill").textContent = state.examDate ? fmtDate(state.examDate) : "—";
    document.getElementById("hoursPill").textContent = state.hoursWeek ? String(state.hoursWeek) : "—";

    const daysLeft = state.examDate ? daysBetween(todayISO(), state.examDate) : null;
    const track = getTrack(state.track);

    const intro = [
      `Este planner organiza seus estudos com foco no modelo mais recente do Vestibular UEL (trilha ${track.id}).`,
      `Você tem ${daysLeft != null ? `<b>${daysLeft}</b> dias` : "—"} até a prova (com base na data configurada).`,
      `A ideia é manter um ciclo simples: <b>conteúdo → questões → revisão programada</b>.`
    ].join(" ");
    document.getElementById("introText").innerHTML = intro;

    // KPIs
    const completedCount = Object.keys(state.completedModules||{}).length;
    const totalModules = getAllModulesFlat().length;
    const pct = totalModules ? Math.round(100*completedCount/totalModules) : 0;

    const reviewsToday = (state.reviews||[]).filter(r => !r.done && r.dueDate <= todayISO()).length;
    const kpis = document.getElementById("kpis");
    kpis.innerHTML = "";
    const items = [
      {label:"Módulos concluídos", value:`${completedCount}/${totalModules}`},
      {label:"Progresso", value:`${pct}%`},
      {label:"Revisões pendentes (hoje)", value:`${reviewsToday}`},
    ];
    for(const it of items){
      const div = document.createElement("div");
      div.className = "kpi";
      div.innerHTML = `<div class="label">${it.label}</div><div class="value">${it.value}</div>`;
      kpis.appendChild(div);
    }

    // Track explain
    const te = document.getElementById("trackExplain");
    const manualUrl = "https://www.cops.uel.br/v2/Portal/pages/arquivos/vestibular/uelManualCandidatoVestibular2026.pdf";
    const obrasUrl  = "https://sites.uel.br/vestibular/wp-content/uploads/2024/08/Obras_Literarias_2025-2026-2027.pdf";
    te.innerHTML = `
      <div class="badge ok">Trilha <strong>${track.id}</strong> — ${track.name.replace(/^Trilha [AB]\s—\s/,'')}</div>
      <div style="margin-top:10px">
        ${track.exam_model.key_points.map(x=>`<div style="margin:6px 0">• ${x}</div>`).join("")}
      </div>
      <div class="muted" style="margin-top:10px">
        Fontes oficiais: <a href="${manualUrl}" target="_blank" rel="noopener">Manual do Candidato (PDF)</a> ·
        <a href="${obrasUrl}" target="_blank" rel="noopener">Obras literárias (PDF)</a>
      </div>
    `;

    // High leverage checklist
    const hl = document.getElementById("highLeverage");
    hl.innerHTML = "";
    const list = [
      "Redação: treino semanal + reescrita (pontua e diferencia).",
      "Interpretação: textos longos e questões de inferência.",
      "Matemática/funções: prática consistente (erro log).",
      "Sociologia: conceitos + exemplos brasileiros (especialmente na trilha B).",
      "Simulados: 1 completo por mês (aumentando na reta final).",
    ];
    for(const item of list){
      const li = document.createElement("li");
      li.textContent = item;
      hl.appendChild(li);
    }
  }

  function fillConfig(state){
    // Default values
    document.getElementById("startDate").value = state.startDate || todayISO();
    document.getElementById("examDate").value = state.examDate || "";
    document.getElementById("hoursWeek").value = state.hoursWeek ?? 18;
    document.getElementById("daysWeek").value = String(state.daysWeek ?? 6);

    // Tracks dropdown
    const trackSel = document.getElementById("track");
    trackSel.innerHTML = "";
    for(const t of STUDY_DATA.uel.tracks){
      const opt = document.createElement("option");
      opt.value = t.id;
      opt.textContent = `${t.id} — ${t.name.replace(/^Trilha [AB]\s—\s/,'')}`;
      if(t.id === state.track) opt.selected = true;
      trackSel.appendChild(opt);
    }

    document.getElementById("language").value = state.language || "Inglês";

    // Priority dropdowns from subject names (excluding Redação? keep)
    const subjectNames = STUDY_DATA.subjects.map(s=>s.name).filter(n => n !== "Redação");
        const p1 = document.getElementById("priority1");
    const p2 = document.getElementById("priority2");

    // Prioridades (Trilha B) — alinhadas ao conjunto de disciplinas do 2º dia.
    // Obs.: Inglês/Espanhol são mostrados separados, mas usam o mesmo conjunto de módulos.
    const priorityOptions = [
      "Artes",
      "Biologia",
      "Filosofia",
      "Física",
      "Geografia",
      "História",
      "Língua Estrangeira — Espanhol",
      "Língua Estrangeira — Inglês",
      "Língua Portuguesa",
      "Matemática",
      "Química",
      "Sociologia",
    ];

    for(const sel of [p1,p2]){
      sel.innerHTML = "";
      for(const name of priorityOptions){
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        sel.appendChild(opt);
      }
    }
    p1.value = state.priority1 || "Matemática";
    p2.value = state.priority2 || "Biologia";

    function togglePriorityVisibility(){
      const isB = trackSel.value === "B";
      p1.disabled = !isB;
      p2.disabled = !isB;
    }
    togglePriorityVisibility();
    trackSel.addEventListener("change", togglePriorityVisibility);
  }

    function generateWeeklyPlan(state){
    const start = new Date((state.startDate||todayISO())+"T00:00:00");
    const planWeeks = 4;

    const hoursWeek = clamp(Number(state.hoursWeek||18), 2, 80);
    const daysWeek = clamp(Number(state.daysWeek||6), 3, 7);
    const hoursPerDay = Math.round((hoursWeek/daysWeek)*10)/10;

    const weights = computeWeights(state);
    const buckets = subjectBuckets();

    // Map bucket keys to modules pool by matching subject names
    const allModules = getAllModulesFlat();
    const pool = {};
    for(const [bucket, subjects] of Object.entries(buckets)){
      const subjectKeys = (subjects||[]);
      pool[bucket] = allModules.filter(m => subjectKeys.includes(m.subjectName));
    }

    // Create ordered queues for each key
    const queues = {};
    for(const [k, mods] of Object.entries(pool)){
      queues[k] = mods.slice().sort((a,b)=>a.id.localeCompare(b.id));
    }

    const dayNames = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
    const plan = []; // weeks -> days -> sessions
    const completed = state.completedModules||{};

    // Study weekdays: assume Mon.. based routine (mais comum)
    const weekdaySets = {
      3: [1,2,3],          // Seg-Qua
      4: [1,2,3,4],        // Seg-Qui
      5: [1,2,3,4,5],      // Seg-Sex
      6: [1,2,3,4,5,6],    // Seg-Sáb
      7: [0,1,2,3,4,5,6],  // Dom-Sáb
    };
    const studyWeekdays = new Set(weekdaySets[daysWeek] || weekdaySets[6]);

    // Pointers per bucket
    const idx = {};
    for(const k of Object.keys(weights)) idx[k]=0;

    function nextModuleFor(bucket){
      const q = queues[bucket] || [];
      if(!q.length) return null;

      // Skip completed modules first
      let tries = 0;
      while(tries < q.length){
        const m = q[idx[bucket] % q.length];
        idx[bucket] = (idx[bucket]+1);
        if(!completed[m.id]) return m;
        tries++;
      }
      // if all completed, return any module (for revisão/problemas)
      return q[idx[bucket] % q.length];
    }

    function makeWeekBuckets(){
      // 2 blocos por dia de estudo
      const slots = daysWeek * 2;

      const keys = Object.keys(weights).sort((a,b)=>a.localeCompare(b));
      const raw = keys.map(k => ({k, w: weights[k], exact: weights[k]*slots}));
      raw.forEach(o => { o.base = Math.floor(o.exact); o.frac = o.exact - o.base; });

      let sumBase = raw.reduce((s,o)=>s+o.base,0);
      let remain = slots - sumBase;

      // Distribui o restante pelas maiores frações (determinístico)
      raw.sort((a,b)=> (b.frac - a.frac) || (b.w - a.w) || a.k.localeCompare(b.k));
      let ptr = 0;
      while(remain > 0 && raw.length){
        raw[ptr % raw.length].base += 1;
        remain--;
        ptr++;
      }

      const counts = {};
      raw.forEach(o => { counts[o.k] = o.base; });

      const seq = [];
      let last = null;
      for(let s=0; s<slots; s++){
        let candidates = raw.map(o=>o.k).filter(k=>counts[k] > 0);
        if(!candidates.length) break;

        candidates.sort((a,b)=>{
          const da = counts[a], db = counts[b];
          if(db !== da) return db - da;
          const wa = weights[a] || 0, wb = weights[b] || 0;
          if(wb !== wa) return wb - wa;
          return a.localeCompare(b);
        });

        let pick = candidates[0];
        if(pick === last && candidates.length > 1) pick = candidates[1];

        seq.push(pick);
        counts[pick]--;
        last = pick;
      }

      // Fallback
      while(seq.length < slots) seq.push(raw[0]?.k || "Português & Redação");
      return seq;
    }

    for(let w=0; w<planWeeks; w++){
      const weekStart = new Date(start);
      weekStart.setDate(start.getDate() + w*7);
      const bucketsSeq = makeWeekBuckets();
      const week = [];

      for(let d=0; d<7; d++){
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate()+d);
        const iso = date.toISOString().slice(0,10);

        const isStudyDay = studyWeekdays.has(date.getDay());
        const sessions = [];

        if(isStudyDay){
          const b1 = bucketsSeq.shift();
          const b2 = bucketsSeq.shift();
          const m1 = nextModuleFor(b1);
          const m2 = nextModuleFor(b2);

          const split = (hoursPerDay >= 2.5) ? [0.55, 0.45] : [0.6, 0.4];
          sessions.push({bucket:b1, module:m1, hours: Math.max(0.5, Math.round(hoursPerDay*split[0]*10)/10), type:"Conteúdo + questões"});
          sessions.push({bucket:b2, module:m2, hours: Math.max(0.5, Math.round(hoursPerDay*split[1]*10)/10), type:"Questões + revisão"});
          sessions.push({bucket:"Revisão", module:null, hours:0.2, type:"Revisão rápida (flashcards/erro log)"});
        }else{
          sessions.push({bucket:"Descanso", module:null, hours:0, type:"Descanso/recuperação"});
        }

        week.push({dateISO: iso, dayName: dayNames[date.getDay()], sessions});
      }
      plan.push(week);
    }

    return {plan, hoursWeek, daysWeek, hoursPerDay, weights};
  }function renderPlanTable(state){
    const out = document.getElementById("planTable");
    const {plan, hoursPerDay} = generateWeeklyPlan(state);

    let html = "";
    plan.forEach((week, wi) => {
      html += `<h3>Semana ${wi+1}</h3>`;
      html += `<table class="table"><thead><tr><th>Dia</th><th>Data</th><th>Sessões (sugestão)</th></tr></thead><tbody>`;
      week.forEach(day => {
        const sessions = day.sessions.map(s => {
          if(!s.module) return `• <span class="tag"><strong>${s.bucket}</strong></span> ${s.type}`;
          const done = (state.completedModules||{})[s.module.id] ? " ✅" : "";
          return `• <span class="tag"><strong>${s.bucket}</strong></span> <b>${s.module.subjectName}</b> — ${s.module.title}${done} <span class="tag">${s.hours}h</span> <span class="tag">${s.type}</span>`;
        }).join("<br/>");
        html += `<tr><td>${day.dayName}</td><td>${fmtDate(day.dateISO)}</td><td>${sessions}</td></tr>`;
      });
      html += `</tbody></table>`;
    });

    html += `<p><small>Estimativa por dia: ~${hoursPerDay}h. Ajuste na Configuração.</small></p>`;
    out.innerHTML = html;
  }

  function renderModules(state){
    const list = document.getElementById("modulesList");
    const q = (document.getElementById("moduleSearch").value || "").trim().toLowerCase();
    const area = document.getElementById("areaFilter").value || "";

    const completed = state.completedModules || {};
    const subjects = STUDY_DATA.subjects
      .filter(s => !area || s.area === area)
      .map(s => ({
        ...s,
        modules: s.modules.filter(m => {
          if(!q) return true;
          const hay = `${s.name} ${m.title} ${(m.outcomes||[]).join(" ")} ${(m.practice||[]).join(" ")}`.toLowerCase();
          return hay.includes(q);
        })
      }))
      .filter(s => s.modules.length);

    list.innerHTML = "";
    for(const s of subjects){
      const doneCount = s.modules.filter(m => completed[m.id]).length;
      const details = document.createElement("details");
      details.open = false;
      details.innerHTML = `
        <summary>
          <div>
            <b>${s.name}</b>
            <div style="margin-top:4px"><span class="badge">${s.area}</span> <span class="badge ok"><strong>${doneCount}/${s.modules.length}</strong> concluídos</span></div>
          </div>
          <span>↕</span>
        </summary>
        <div class="content">
          ${s.modules.map(m => {
            const isDone = !!completed[m.id];
            const doneMeta = isDone ? completed[m.id] : null;
            const outcomes = (m.outcomes||[]).map(x=>`<li>${x}</li>`).join("");
            const practice = (m.practice||[]).map(x=>`<li>${x}</li>`).join("");
            return `
              <div style="padding:10px 0; border-top:1px solid rgba(255,255,255,.08)">
                <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:10px; flex-wrap:wrap">
                  <div>
                    <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap">
                      <span class="badge ${isDone?'ok':'warn'}">${isDone?'Concluído':'Pendente'}</span>
                      <span class="badge"><strong>${m.hours}h</strong> estimadas</span>
                      <span class="badge">${m.id}</span>
                    </div>
                    <div style="margin-top:6px; font-weight:800">${m.title}</div>
                    ${isDone ? `<small>Concluído em ${fmtDate(doneMeta.dateCompleted)}</small>` : `<small>Faça: aprender → praticar → revisar.</small>`}
                  </div>
                  <div class="split">
                    ${isDone ? `<button class="btn small" data-uncomplete="${m.id}">Desmarcar</button>` : `<button class="btn small primary" data-complete="${m.id}">Marcar como estudado</button>`}
                    <button class="btn small" data-jump-ex="${m.id}">Exercícios</button>
                  </div>
                </div>

                <div class="grid" style="margin-top:10px">
                  <div class="col-6">
                    <h3>Objetivos</h3>
                    <ul>${outcomes || "<li>—</li>"}</ul>
                  </div>
                  <div class="col-6">
                    <h3>Prática recomendada</h3>
                    <ul>${practice || "<li>—</li>"}</ul>
                  </div>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      `;
      list.appendChild(details);
    }

    // Buttons
    list.querySelectorAll("[data-complete]").forEach(btn => {
      btn.addEventListener("click", () => completeModule(state, btn.getAttribute("data-complete")));
    });
    list.querySelectorAll("[data-uncomplete]").forEach(btn => {
      btn.addEventListener("click", () => uncompleteModule(state, btn.getAttribute("data-uncomplete")));
    });
    list.querySelectorAll("[data-jump-ex]").forEach(btn => {
      btn.addEventListener("click", () => {
        const mid = btn.getAttribute("data-jump-ex");
        document.getElementById("exerciseModule").value = mid;
        document.getElementById("btnLoadExercises").click();
        window.location.hash = "#exercicios";
      });
    });
  }

  function scheduleReviewsForModule(state, moduleId, completionDateISO){
    const intervals = STUDY_DATA.uel.revision_intervals_days || [1,3,7,14,30];
    const base = new Date(completionDateISO+"T00:00:00");
    for(const days of intervals){
      const due = new Date(base);
      due.setDate(base.getDate()+days);
      const dueISO = due.toISOString().slice(0,10);
      state.reviews.push({moduleId, dueDate: dueISO, interval: days, done:false});
    }
    // de-duplicate (same module+dueDate)
    const seen = new Set();
    state.reviews = state.reviews.filter(r => {
      const k = r.moduleId+"|"+r.dueDate;
      if(seen.has(k)) return false;
      seen.add(k);
      return true;
    }).sort((a,b)=> (a.dueDate.localeCompare(b.dueDate)) || (a.moduleId.localeCompare(b.moduleId)));
  }

  function completeModule(state, moduleId){
    const mod = getModuleById(moduleId);
    if(!mod) return;

    const now = todayISO();
    state.completedModules[moduleId] = {dateCompleted: now, subjectId: mod.subjectId};
    scheduleReviewsForModule(state, moduleId, now);
    saveState(state);
    refreshAll(state);
  }

  function uncompleteModule(state, moduleId){
    delete state.completedModules[moduleId];
    // Keep reviews, but mark them done to not clutter
    for(const r of (state.reviews||[])){
      if(r.moduleId === moduleId) r.done = true;
    }
    saveState(state);
    refreshAll(state);
  }

  function renderReviews(state){
    const reviews = (state.reviews||[]).slice().sort((a,b)=>a.dueDate.localeCompare(b.dueDate));
    const due = reviews.filter(r => !r.done && r.dueDate <= todayISO());
    const upcoming = reviews.filter(r => !r.done && r.dueDate > todayISO()).slice(0,12);

    const todayEl = document.getElementById("todayReviews");
    const upEl = document.getElementById("upcomingReviews");

    function renderList(items, emptyMsg){
      if(!items.length) return `<div class="notice"><div class="title">Tudo em dia</div><div class="muted">${emptyMsg}</div></div>`;
      return items.map(r => {
        const m = getModuleById(r.moduleId);
        const title = m ? `${m.subjectName} — ${m.title}` : r.moduleId;
        return `
          <div style="padding:10px 12px; border-radius:16px; border:1px solid rgba(255,255,255,.10); background:rgba(255,255,255,.04); margin-bottom:10px">
            <div style="display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap; align-items:flex-start">
              <div>
                <div style="font-weight:850">${title}</div>
                <small>Revisão de ${r.interval} dias · vencimento: ${fmtDate(r.dueDate)}</small>
              </div>
              <button class="btn small primary" data-review-done="${r.moduleId}|${r.dueDate}">Marcar feito</button>
            </div>
          </div>
        `;
      }).join("");
    }

    todayEl.innerHTML = renderList(due, "Se sobrar tempo, revise o erro log ou faça 10 questões fáceis para aquecer.");
    upEl.innerHTML = renderList(upcoming, "Sem revisões agendadas. Marque módulos como estudados para criar revisões.");

    document.querySelectorAll("[data-review-done]").forEach(btn => {
      btn.addEventListener("click", () => {
        const [mid, dueDate] = btn.getAttribute("data-review-done").split("|");
        for(const r of state.reviews){
          if(r.moduleId === mid && r.dueDate === dueDate){ r.done = true; break; }
        }
        saveState(state);
        refreshAll(state);
      });
    });
  }

  function fillExerciseDropdown(){
    const sel = document.getElementById("exerciseModule");
    sel.innerHTML = "";
    const flat = getAllModulesFlat();
    for(const m of flat){
      const opt = document.createElement("option");
      opt.value = m.id;
      opt.textContent = `${m.subjectName}: ${m.title}`;
      sel.appendChild(opt);
    }
  }

  function renderExercises(moduleId){
    const wrap = document.getElementById("exerciseList");
    const bank = (STUDY_DATA.exercise_bank.items||[]).find(it => it.module_id === moduleId);
    if(!bank){
      wrap.innerHTML = `<div class="notice"><div class="title">Sem exercícios ainda</div><div class="muted">Por enquanto, este módulo não tem exercícios originais cadastrados. Sugestão: faça 15 questões de prova anterior e registre os erros.</div></div>`;
      return;
    }
    let html = "";
    bank.questions.forEach((q, idx) => {
      if(q.type === "multipla"){
        html += `
          <div style="margin-bottom:14px; padding:12px; border-radius:16px; border:1px solid rgba(255,255,255,.10); background:rgba(255,255,255,.04)">
            <div style="font-weight:850">Q${idx+1}. ${q.prompt}</div>
            <div style="margin-top:8px">
              ${q.options.map((opt,i)=>`
                <label style="display:block; margin:6px 0; cursor:pointer">
                  <input type="radio" name="q_${idx}" value="${i}" style="width:auto; margin-right:8px" />
                  ${opt}
                </label>
              `).join("")}
            </div>
            <div class="split" style="margin-top:10px">
              <button class="btn small primary" data-check="${idx}">Conferir</button>
              <span class="badge" id="qres_${idx}" style="display:none"></span>
            </div>
            <div id="qexp_${idx}" style="display:none; margin-top:10px"><small>${q.explanation||""}</small></div>
          </div>
        `;
      }else{
        html += `
          <div style="margin-bottom:14px; padding:12px; border-radius:16px; border:1px solid rgba(255,255,255,.10); background:rgba(255,255,255,.04)">
            <div style="font-weight:850">Q${idx+1}. (Discursiva) ${q.prompt}</div>
            <div style="margin-top:10px">
              <textarea rows="5" placeholder="Escreva sua resposta aqui..."></textarea>
              <div style="margin-top:10px">
                <button class="btn small" data-toggle-answer="${idx}">Mostrar gabarito sugerido</button>
              </div>
              <div id="ans_${idx}" style="display:none; margin-top:10px" class="notice">
                <div class="title">Gabarito sugerido</div>
                <div class="muted">${q.answer_text||"—"}</div>
              </div>
            </div>
          </div>
        `;
      }
    });
    wrap.innerHTML = html;

    wrap.querySelectorAll("[data-check]").forEach(btn => {
      btn.addEventListener("click", () => {
        const i = Number(btn.getAttribute("data-check"));
        const q = bank.questions[i];
        const chosen = wrap.querySelector(`input[name="q_${i}"]:checked`);
        const badge = wrap.querySelector(`#qres_${i}`);
        const exp = wrap.querySelector(`#qexp_${i}`);
        badge.style.display = "inline-flex";
        exp.style.display = "block";
        if(!chosen){
          badge.className = "badge warn";
          badge.innerHTML = "⚠️ <strong>Escolha uma opção</strong>";
          return;
        }
        const ok = Number(chosen.value) === Number(q.answer);
        badge.className = ok ? "badge ok" : "badge warn";
        badge.innerHTML = ok ? "✅ <strong>Correto</strong>" : "❌ <strong>Incorreto</strong>";
      });
    });

    wrap.querySelectorAll("[data-toggle-answer]").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = btn.getAttribute("data-toggle-answer");
        const box = wrap.querySelector(`#ans_${idx}`);
        const show = box.style.display === "none";
        box.style.display = show ? "block" : "none";
        btn.textContent = show ? "Ocultar gabarito sugerido" : "Mostrar gabarito sugerido";
      });
    });
  }

  function renderLiterature(){
    const lit = STUDY_DATA.uel.literature;
    document.getElementById("litText").innerHTML = `
      A UEL divulga uma lista de leituras indicadas. Abaixo está a lista para o ciclo <b>2025–2026–2027</b>.
      Sugestão: distribua as leituras ao longo do ano e faça fichas curtas após cada uma.
    `;

    const wrap = document.getElementById("litList");
    const rows = lit.items.map((it, i) => {
      const badge = it.type === "álbum" ? "badge warn" : "badge";
      return `
        <tr>
          <td>${i+1}</td>
          <td><b>${it.title}</b><br/><small>${it.author}</small></td>
          <td><span class="${badge}">${it.type}</span></td>
          <td><small>Após concluir: escreva 10 tópicos + 5 perguntas.</small></td>
        </tr>
      `;
    }).join("");
    wrap.innerHTML = `
      <table class="table">
        <thead><tr><th>#</th><th>Leitura</th><th>Tipo</th><th>Estudo sugerido</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  }

  function renderBackup(state){
    const box = document.getElementById("backupBox");
    document.getElementById("btnExport").addEventListener("click", () => {
      box.value = JSON.stringify(state, null, 2);
      box.focus();
      box.select();
    });
    document.getElementById("btnImport").addEventListener("click", () => {
      try{
        const incoming = JSON.parse(box.value);
        saveState(incoming);
        refreshAll(incoming);
        alert("Importado com sucesso.");
      }catch(e){
        alert("JSON inválido. Verifique o conteúdo.");
      }
    });
    document.getElementById("btnClearStorage").addEventListener("click", () => {
      if(confirm("Apagar todos os dados salvos neste navegador?")){
        localStorage.removeItem(STORAGE_KEY);
        const st = defaultState();
        saveState(st);
        refreshAll(st);
      }
    });
  }

  function bindUI(state){
    document.getElementById("btnPrint").addEventListener("click", () => window.print());

    document.getElementById("btnSave").addEventListener("click", () => {
      state.startDate = document.getElementById("startDate").value || todayISO();
      state.examDate = document.getElementById("examDate").value || "";
      state.hoursWeek = clamp(Number(document.getElementById("hoursWeek").value || 18), 2, 80);
      state.daysWeek = clamp(Number(document.getElementById("daysWeek").value || 6), 3, 7);
      state.track = document.getElementById("track").value || "B";
      state.language = document.getElementById("language").value || "Inglês";
      state.priority1 = document.getElementById("priority1").value || "Matemática";
      state.priority2 = document.getElementById("priority2").value || "Biologia";
      saveState(state);
      refreshAll(state);
      window.location.hash = "#plano";
    });

    document.getElementById("btnResetPlan").addEventListener("click", () => {
      if(confirm("Isso vai desmarcar módulos concluídos e limpar revisões. Continuar?")){
        state.completedModules = {};
        state.reviews = [];
        saveState(state);
        refreshAll(state);
      }
    });

    document.getElementById("moduleSearch").addEventListener("input", () => renderModules(state));
    document.getElementById("areaFilter").addEventListener("change", () => renderModules(state));

    document.getElementById("btnLoadExercises").addEventListener("click", () => {
      const mid = document.getElementById("exerciseModule").value;
      renderExercises(mid);
    });

    document.getElementById("btnHideAnswers").addEventListener("click", () => {
      document.querySelectorAll('[id^="ans_"]').forEach(el => el.style.display = "none");
      document.querySelectorAll('[data-toggle-answer]').forEach(btn => btn.textContent = "Mostrar gabarito sugerido");
    });
  }

  function refreshAll(state){
    // header pills + intro
    renderIntro(state);
    // plan
    renderPlanTable(state);
    // modules
    renderModules(state);
    // reviews
    renderReviews(state);
    // exercises dropdown
    fillExerciseDropdown();
    // literature
    renderLiterature();
    // pills again
    document.getElementById("examDatePill").textContent = state.examDate ? fmtDate(state.examDate) : "—";
    document.getElementById("hoursPill").textContent = state.hoursWeek ? String(state.hoursWeek) : "—";
  }

  function init(){
    // Build initial state
    let st = loadState();
    if(!st){
      st = defaultState();
      saveState(st);
    }

    fillConfig(st);
    fillExerciseDropdown();
    bindUI(st);
    renderBackup(st);
    renderLiterature();
    refreshAll(st);

    // Auto-load exercises for first selection
    const mid = document.getElementById("exerciseModule").value;
    renderExercises(mid);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
