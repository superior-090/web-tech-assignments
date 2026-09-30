import { Download, FilePlus2, FolderOpen, Save } from "lucide-react";
function Header({ onNew, onSave, onLoad, onExport }) { return <header className="header"><div className="brand"><div className="brand-mark">∴</div><div><strong>Diagram Forge By Suyash Moon</strong><span>UML class studio</span></div></div><div className="header-actions"><button onClick={onNew}><FilePlus2 size={15} /> New</button><button onClick={onSave}><Save size={15} /> Save</button><button onClick={onLoad}><FolderOpen size={15} /> Load</button><button className="button-accent" onClick={onExport}><Download size={15} /> Export Java</button></div></header>; }
export default Header;

