/** storage.js — local-first state with versioning */
export const STORAGE_KEY = "uel_planner_pro:v2";

const defaultState = () => ({
  meta: { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), version: "2.0.0" },
  config: {
    examDate: "", // YYYY-MM-DD
    track: "geral", // geral | discursiva
    targetCourse: "",
    language: "ingles", // ingles | espanhol
    sessionMinutes: 50,
    weeklyHoursTarget: 18,
    availability: { mon: 120, tue: 120, wed: 120, thu: 120, fri: 90, sat: 180, sun: 120 },
    strengths: {}, // subjectId -> 0..3 (0 fraco, 3 forte)
  },
  progress: {
    modules: {}, // moduleId -> { mastery:0..3, lastStudied?:ISO, nextReview?:ISO, lapses:number }
    streak: { current: 0, best: 0, lastActive: "" },
    pomodoro: { totalMinutes: 0, sessions: [] }, // sessions: {date, minutes, subjectId?}
  },
  tasks: [], // {id,title,date,type,subjectId,moduleId?,durationMin,status,notes}
  flashcards: [], // {id,front,back,deck,subjectId,interval,ef,due,createdAt,updatedAt}
  submissions: [], // redação {id, date, theme, text, selfScore?, notes?}
  errors: [], // {id,date,subjectId,moduleId?,what,why,fix}
});

export function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return defaultState();
    const data = JSON.parse(raw);
    return migrate(data);
  }catch(e){
    console.warn("loadState failed", e);
    return defaultState();
  }
}

export function saveState(state){
  state.meta.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetState(){
  localStorage.removeItem(STORAGE_KEY);
}

export function exportState(){
  return JSON.stringify(loadState(), null, 2);
}

export function importState(jsonText){
  const data = JSON.parse(jsonText);
  const migrated = migrate(data);
  saveState(migrated);
  return migrated;
}

function migrate(data){
  // Minimal forward compatibility: keep unknown keys, ensure required structure exists
  const base = defaultState();
  const merged = {
    ...base,
    ...data,
    meta: { ...base.meta, ...(data.meta || {}) },
    config: { ...base.config, ...(data.config || {}) },
    progress: { ...base.progress, ...(data.progress || {}) },
  };
  merged.progress.modules = merged.progress.modules || {};
  merged.tasks = Array.isArray(merged.tasks) ? merged.tasks : [];
  merged.flashcards = Array.isArray(merged.flashcards) ? merged.flashcards : [];
  merged.submissions = Array.isArray(merged.submissions) ? merged.submissions : [];
  merged.errors = Array.isArray(merged.errors) ? merged.errors : [];
  return merged;
}

export function uid(prefix="id"){
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}
