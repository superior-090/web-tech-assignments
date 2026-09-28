import { Maximize, Minus, Plus, Redo2, Trash2, Undo2 } from "lucide-react";
function Toolbar({ onZoomIn, onZoomOut, onFit, onUndo, onRedo, onDelete, canUndo, canRedo }) { return <div className="toolbar"><div className="toolbar-context"><span className="status-dot" />Untitled diagram<span className="toolbar-separator" />{canUndo ? "Unsaved changes" : "Ready"}</div><div className="toolbar-actions"><button title="Zoom in" onClick={onZoomIn}><Plus size={15} /></button><button title="Zoom out" onClick={onZoomOut}><Minus size={15} /></button><button title="Fit diagram" onClick={onFit}><Maximize size={15} /></button><span className="toolbar-separator" /><button title="Undo" onClick={onUndo} disabled={!canUndo}><Undo2 size={15} /></button><button title="Redo" onClick={onRedo} disabled={!canRedo}><Redo2 size={15} /></button><button className="danger-icon" title="Delete selected" onClick={onDelete}><Trash2 size={15} /></button></div></div>; }

export default Toolbar;

