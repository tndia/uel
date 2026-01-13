import { renderShell } from "./app.js";
import { loadReferences, loadContent } from "./content.js";
import { loadState } from "./storage.js";

renderShell();
const refs = await loadReferences();
const content = await loadContent();
const state = loadState();

document.getElementById("version").textContent = content.meta?.version || "—";
document.getElementById("generatedAt").textContent = content.meta?.generatedAt || "—";

document.getElementById("configSummary").textContent = [
  state.config.track ? `Trilha: ${state.config.track}` : "",
  state.config.targetCourse ? `Curso: ${state.config.targetCourse}` : "",
  state.config.examDate ? `Prova: ${state.config.examDate}` : "",
].filter(Boolean).join(" • ") || "Sem configuração salva.";

document.getElementById("refs").innerHTML = refs.map(group=>{
  return `<div class="card" style="grid-column: span 12;">
    <h3>${eh(group.category)}</h3>
    <ul>
      ${group.items.map(it=>`<li><a href="${eh(it.url)}" target="_blank" rel="noopener">${eh(it.title)}</a></li>`).join("")}
    </ul>
  </div>`;
}).join("");

function eh(str){ return (str??"").toString().replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"); }
