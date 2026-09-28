
import { Copy, Download } from "lucide-react";
function CodePanel({ files }) { const file = files[0]; const copy = () => navigator.clipboard?.writeText(file?.content || ""); const download = () => { if (!file) return; const url = URL.createObjectURL(new Blob([file.content], { type: "text/plain" })); const link = document.createElement("a"); link.href = url; link.download = file.name; link.click(); URL.revokeObjectURL(url); }; return <section className="code-panel"><div className="code-header"><div><div className="eyebrow">OUTPUT / JAVA</div><div className="code-file-name">{file?.name || "CanvasDiagram.java"}</div></div><div className="code-actions"><button onClick={copy}><Copy size={14} /> Copy all</button><button onClick={download} disabled={!file}><Download size={14} /> Download Java</button></div></div><pre><code>{file?.content || "Add a class to generate Java source."}</code></pre></section>; }

export default CodePanel;

