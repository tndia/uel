/** ui.js — tiny UI helpers (toast, modal, date utils) */
export function $(sel, root=document){ return root.querySelector(sel); }
export function $all(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

export function fmtDate(iso){
  if(!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year:"numeric", month:"short", day:"2-digit" });
}
export function isoToday(){
  const d = new Date();
  d.setHours(0,0,0,0);
  return d.toISOString().slice(0,10);
}
export function daysBetween(aISO, bISO){
  const a = new Date(aISO); const b = new Date(bISO);
  a.setHours(0,0,0,0); b.setHours(0,0,0,0);
  return Math.round((b-a)/(1000*60*60*24));
}
export function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }

export function toast(msg){
  let wrap = document.querySelector(".toast-wrap");
  if(!wrap){
    wrap = document.createElement("div");
    wrap.className = "toast-wrap";
    document.body.appendChild(wrap);
  }
  const t = document.createElement("div");
  t.className = "toast";
  t.innerHTML = `<p>${escapeHtml(msg)}</p>`;
  wrap.appendChild(t);
  setTimeout(()=>{ t.style.opacity = "0"; t.style.transform = "translateY(6px)"; }, 2300);
  setTimeout(()=>{ t.remove(); }, 3000);
}

export function escapeHtml(str){
  return (str ?? "").toString()
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

export function downloadText(filename, text, mime="application/json"){
  const blob = new Blob([text], {type:mime});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 1200);
}

export function readFileAsText(file){
  return new Promise((resolve, reject)=>{
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsText(file);
  });
}
