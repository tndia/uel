/** planner.js — generates a weekly plan based on config & module pool */
import { isoToday, daysBetween, clamp } from "./ui.js";
import { uid } from "./storage.js";

export function computePhase(daysLeft){
  if(daysLeft >= 160) return { name:"Fundação", focus:"base + constância", ratio:{conteudo:0.55, questoes:0.30, revisao:0.15} };
  if(daysLeft >= 90)  return { name:"Consolidação", focus:"conteúdo + muitos exercícios", ratio:{conteudo:0.45, questoes:0.40, revisao:0.15} };
  if(daysLeft >= 35)  return { name:"Intensivo", focus:"questões + revisão espaçada", ratio:{conteudo:0.30, questoes:0.50, revisao:0.20} };
  return              { name:"Reta final", focus:"simulados + revisão + redação", ratio:{conteudo:0.20, questoes:0.45, revisao:0.25, simulado:0.10} };
}

export function subjectWeights({track, strengths, language, targetCourse, coursesDiscursive}){
  // base weights (sum doesn't matter; we'll normalize later)
  const w = {
    lp: 1.4, lit: 1.1, red: 1.6,
    mat: 1.3, fis: 1.0, qui: 1.0, bio: 1.0,
    his: 0.95, geo: 0.95, fil: 0.7, soc: 0.7,
    lin: 0.7, art: 0.55, atu: 0.65,
  };

  // language choice boosts reading practice a bit
  w.lin += 0.1;

  // track "discursiva": boost sociology + the 2 priority disciplines (from course mapping or user selection)
  if(track === "discursiva" && targetCourse && coursesDiscursive?.[targetCourse]){
    const pri = coursesDiscursive[targetCourse].prioritarias || [];
    const map = { "Biologia":"bio","Química":"qui","Física":"fis","Matemática":"mat","Língua Portuguesa e Literaturas":"lp", "Artes":"art", "Filosofia":"fil","História":"his","Geografia":"geo","Inglês":"lin","Espanhol":"lin" };
    pri.forEach(name => { const sid = map[name]; if(sid) w[sid] = (w[sid]||0)+0.7; });
    w.soc += 0.6;
  }

  // strengths: weaker subjects get more weight
  // 0 fraco → +35%, 1 → +20%, 2 → +0%, 3 forte → -15%
  for(const [sid,val] of Object.entries(strengths || {})){
    const s = Number(val);
    const mult = s===0?1.35 : s===1?1.20 : s===3?0.85 : 1.0;
    if(w[sid]!=null) w[sid] *= mult;
  }

  return normalize(w);
}

function normalize(obj){
  const total = Object.values(obj).reduce((a,b)=>a+b,0);
  const out = {};
  for(const k of Object.keys(obj)) out[k] = obj[k]/total;
  return out;
}

export function generateWeekPlan({content, state, weekStartISO}){
  const cfg = state.config;
  const exam = cfg.examDate || "";
  const today = isoToday();
  const start = weekStartISO || today;
  const daysLeft = exam ? daysBetween(today, exam) : 120; // fallback
  const phase = computePhase(daysLeft);

  const weights = subjectWeights({
    track: cfg.track,
    strengths: cfg.strengths,
    language: cfg.language,
    targetCourse: cfg.targetCourse,
    coursesDiscursive: content.coursesDiscursive
  });

  const sessionMin = clamp(Number(cfg.sessionMinutes)||50, 25, 90);
  const weekMinutes = Object.values(cfg.availability || {}).reduce((a,b)=>a+Number(b||0),0);
  const weekSessions = Math.max(6, Math.round(weekMinutes / sessionMin));

  // Build module pool by subject
  const modulesBySubject = {};
  for(const m of content.modules){
    (modulesBySubject[m.subjectId] ||= []).push(m);
  }

  // Deterministic choice per week (so it doesn't reshuffle every refresh)
  const seed = hash(`${start}|${cfg.track}|${cfg.targetCourse}|${Object.values(cfg.strengths||{}).join(",")}`);
  const rng = mulberry32(seed);

  const dayKeys = ["mon","tue","wed","thu","fri","sat","sun"];
  const dayLabels = {mon:"Seg",tue:"Ter",wed:"Qua",thu:"Qui",fri:"Sex",sat:"Sáb",sun:"Dom"};
  const plan = [];

  // allocate sessions per subject by weight
  const alloc = allocateSubjects(weights, weekSessions);

  // distribute across days by availability
  const sessionsPerDay = distributeSessions(cfg.availability, sessionMin);

  for(const dayKey of dayKeys){
    const n = sessionsPerDay[dayKey] || 0;
    const items = [];
    for(let i=0;i<n;i++){
      const sid = pickWeighted(alloc, rng);
      const type = pickType(phase, rng, sid);
      const m = pickModule(modulesBySubject[sid] || [], state, rng);
      items.push({
        id: uid("task"),
        title: taskTitle(type, sid, m?.title),
        date: dateOfWeek(start, dayKey),
        type,
        subjectId: sid,
        moduleId: m?.id || "",
        durationMin: sessionMin,
        status: "todo",
        notes: ""
      });
    }
    plan.push({ dayKey, label: dayLabels[dayKey], date: dateOfWeek(start, dayKey), items });
  }

  return { start, daysLeft, phase, weekSessions, sessionMin, plan };
}

function allocateSubjects(weights, totalSessions){
  // Build a bag-like distribution
  const bag = [];
  for(const [sid,w] of Object.entries(weights)){
    const n = Math.max(0, Math.round(w * totalSessions));
    for(let i=0;i<n;i++) bag.push(sid);
  }
  // Ensure minimum coverage of key areas
  ["lp","red","mat"].forEach(sid => { if(!bag.includes(sid)) bag.push(sid); });
  // If still low, pad with the highest weight
  while(bag.length < totalSessions){
    const maxSid = Object.entries(weights).sort((a,b)=>b[1]-a[1])[0][0];
    bag.push(maxSid);
  }
  // If too many, trim random (but deterministic shuffle later)
  return bag.slice(0, totalSessions);
}

function distributeSessions(availability, sessionMin){
  const days = ["mon","tue","wed","thu","fri","sat","sun"];
  const out = {};
  for(const d of days){
    const mins = Number(availability?.[d] || 0);
    out[d] = Math.max(0, Math.round(mins / sessionMin));
  }
  return out;
}

function pickWeighted(bag, rng){
  // bag already represents weights
  return bag[Math.floor(rng() * bag.length)];
}

function pickType(phase, rng, subjectId){
  // Redação always appears as practice or revisão, not "conteúdo" only
  const r = rng();
  if(subjectId === "red"){
    return r < 0.55 ? "redacao" : (r < 0.8 ? "revisao" : "questoes");
  }
  if(r < (phase.ratio?.conteudo ?? 0.4)) return "conteudo";
  if(r < (phase.ratio?.conteudo ?? 0.4) + (phase.ratio?.questoes ?? 0.4)) return "questoes";
  if(phase.ratio?.simulado && r > 0.93) return "simulado";
  return "revisao";
}

function pickModule(modules, state, rng){
  if(!modules.length) return null;
  // prefer modules not mastered yet
  const scored = modules.map(m=>{
    const p = state.progress.modules[m.id];
    const mastery = p?.mastery ?? 0;
    const due = p?.nextReview || "";
    const dueScore = (due && due <= isoToday()) ? 1 : 0;
    return { m, score: (3-mastery)*2 + dueScore*1.5 + rng()*0.2 };
  }).sort((a,b)=>b.score-a.score);
  return scored[0].m;
}

function taskTitle(type, sid, moduleTitle){
  const pretty = {
    conteudo: "Conteúdo",
    questoes: "Questões",
    revisao: "Revisão",
    redacao: "Redação",
    simulado: "Simulado"
  }[type] || "Sessão";
  const subj = sid.toUpperCase();
  return moduleTitle ? `${pretty} · ${subj} — ${moduleTitle}` : `${pretty} · ${subj}`;
}

function dateOfWeek(weekStartISO, dayKey){
  const map = {mon:0,tue:1,wed:2,thu:3,fri:4,sat:5,sun:6};
  const d = new Date(weekStartISO);
  d.setDate(d.getDate() + (map[dayKey] || 0));
  return d.toISOString().slice(0,10);
}

function hash(str){
  let h = 2166136261;
  for(let i=0;i<str.length;i++){
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(a){
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}
