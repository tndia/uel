/** content.js — loads static JSON data (subjects, modules, exam model, etc.) */
let cache = null;

export async function loadContent(){
  if(cache) return cache;
  const res = await fetch("./assets/data/content.json", {cache:"no-store"});
  cache = await res.json();
  return cache;
}

export async function loadExercises(){
  const res = await fetch("./assets/data/exercises.json", {cache:"no-store"});
  return await res.json();
}

export async function loadWritingPrompts(){
  const res = await fetch("./assets/data/writing_prompts.json", {cache:"no-store"});
  return await res.json();
}

export async function loadReferences(){
  const res = await fetch("./assets/data/references.json", {cache:"no-store"});
  return await res.json();
}

export function subjectName(content, subjectId){
  return content.subjects.find(s=>s.id===subjectId)?.name || subjectId;
}
