/** spaced.js — spaced repetition for modules & flashcards (SM-2 inspired) */
import { clamp, isoToday } from "./ui.js";

export function nextIntervalDays({intervalDays, ef, quality}){
  // quality: 0..5
  const q = clamp(quality, 0, 5);
  let e = ef ?? 2.5;
  let i = intervalDays ?? 0;

  if(q < 3){
    i = 1;
  }else{
    if(i === 0) i = 1;
    else if(i === 1) i = 3;
    else i = Math.round(i * e);
  }

  // EF update
  e = e + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  e = clamp(e, 1.3, 2.7);

  return { intervalDays: i, ef: e };
}

export function addDaysISO(iso, days){
  const d = new Date(iso || isoToday());
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0,10);
}

export function moduleDefaultSchedule(){
  // a good baseline that works with "conteúdo + revisão"
  return [1, 3, 7, 14, 30, 60];
}
