import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { addEdge, ReactFlowProvider, useEdgesState, useNodesState, useReactFlow } from "@xyflow/react";
import Header from "./components/Header";
import Toolbar from "./components/Toolbar";
import Sidebar from "./components/Sidebar";
import DiagramCanvas from "./components/DiagramCanvas";
import PropertiesPanel from "./components/PropertiesPanel";
import CodePanel from "./components/CodePanel";
import { generateJavaFiles, parseJavaSource } from "./generators/javaGenerator";

const makeClass = (id, name, position) => ({ id, type: "umlClass", position, data: { name, attributes: [], methods: [] } });
const initialNodes = [makeClass("person", "Person", { x: 120, y: 100 }), makeClass("student", "Student", { x: 410, y: 300 }), makeClass("course", "Course", { x: 700, y: 100 })];
initialNodes[0].data.attributes = [{ id: "name", visibility: "private", name: "name", type: "String" }];
initialNodes[1].data.attributes = [{ id: "rollNo", visibility: "private", name: "rollNo", type: "int" }];
initialNodes[1].data.methods = [{ id: "study", visibility: "public", name: "study", returnType: "void", parameters: [] }];
const relationshipLabels = { association: "association", inheritance: "inherits", aggregation: "aggregates", composition: "composes", dependency: "depends on" };
const makeEdge = (id, source, target, type = "association") => ({ id, source, target, type: "umlRelationship", label: relationshipLabels[type], data: { relationshipType: type }, style: { stroke: type === "dependency" ? "#ef8354" : "#40566f", strokeWidth: 2, strokeDasharray: type === "dependency" ? "6 5" : undefined } });

function Editor() {
  const flow = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([makeEdge("rel-1", "student", "person", "inheritance")]);
  const [selectedId, setSelectedId] = useState("student");
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const [connectionStart, setConnectionStart] = useState(null);
  const [relationshipType, setRelationshipType] = useState(null);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const fileInput = useRef(null);
  const diagram = useMemo(() => ({ classes: nodes.map(({ id, position, data }) => ({ id, position, ...data })), relationships: edges.map((edge) => ({ id: edge.id, source: edge.source, target: edge.target, type: edge.data?.relationshipType || "association", label: edge.label || "" })) }), [nodes, edges]);
  const files = useMemo(() => generateJavaFiles(diagram), [diagram]);
  const snapshot = useCallback(() => ({ nodes: structuredClone(nodes), edges: structuredClone(edges) }), [nodes, edges]);
  const commit = useCallback((nextNodes, nextEdges = edges) => { setHistory((items) => [...items.slice(-30), snapshot()]); setFuture([]); setNodes(nextNodes); setEdges(nextEdges); }, [edges, setEdges, setNodes, snapshot]);
  const updateNode = useCallback((data) => commit(nodes.map((node) => node.id === selectedId ? { ...node, data: { ...node.data, ...data } } : node)), [commit, nodes, selectedId]);
  const addClass = useCallback(() => { const id = `class-${Date.now()}`; commit([...nodes, makeClass(id, `Class${nodes.length + 1}`, { x: 100 + (nodes.length % 3) * 250, y: 100 + Math.floor(nodes.length / 3) * 220 })]); setSelectedId(id); }, [commit, nodes]);
  const deleteSelected = useCallback(() => { if (selectedEdgeId) { commit(nodes, edges.filter((edge) => edge.id !== selectedEdgeId)); setSelectedEdgeId(null); return; } if (!selectedId) return; commit(nodes.filter((node) => node.id !== selectedId), edges.filter((edge) => edge.source !== selectedId && edge.target !== selectedId)); setSelectedId(null); }, [commit, edges, nodes, selectedEdgeId, selectedId]);
  const undo = useCallback(() => { const previous = history.at(-1); if (!previous) return; setFuture((items) => [...items, snapshot()]); setHistory((items) => items.slice(0, -1)); setNodes(previous.nodes); setEdges(previous.edges); }, [history, setEdges, setNodes, snapshot]);
  const redo = useCallback(() => { const next = future.at(-1); if (!next) return; setHistory((items) => [...items, snapshot()]); setFuture((items) => items.slice(0, -1)); setNodes(next.nodes); setEdges(next.edges); }, [future, setEdges, setNodes, snapshot]);
  const onConnect = useCallback((connection) => { if (!relationshipType || connection.source === connection.target) return; commit(nodes, addEdge(makeEdge(`rel-${Date.now()}`, connection.source, connection.target, relationshipType), edges)); setConnectionStart(null); setRelationshipType(null); }, [commit, edges, nodes, relationshipType]);
  const onNodeSelect = useCallback((nodeId) => { if (!relationshipType) { setSelectedId(nodeId); setSelectedEdgeId(null); return; } if (!connectionStart) { setConnectionStart(nodeId); setSelectedId(nodeId); return; } if (connectionStart === nodeId) { setConnectionStart(null); return; } onConnect({ source: connectionStart, target: nodeId }); }, [connectionStart, onConnect, relationshipType]);
  const selectRelationshipTool = useCallback((type) => { setRelationshipType(type); setConnectionStart(null); setSelectedEdgeId(null); }, []);
  const save = useCallback(() => { const url = URL.createObjectURL(new Blob([JSON.stringify(diagram, null, 2)], { type: "application/json" })); const link = document.createElement("a"); link.href = url; link.download = "uml-diagram.json"; link.click(); URL.revokeObjectURL(url); }, [diagram]);
  const load = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onerror = () => window.alert("The diagram file could not be read.");
    reader.onload = () => {
      try {
        const text = String(reader.result || "");
        const imported = file.name.toLowerCase().endsWith(".java") ? parseJavaSource(text) : JSON.parse(text);
        const classes = Array.isArray(imported.classes) ? imported.classes : [];
        if (!classes.length) throw new Error("No classes found");
        const importedNodes = classes.filter((item) => item?.id).map((item, index) => ({ id: String(item.id), type: "umlClass", position: item.position || { x: 100 + (index % 3) * 250, y: 100 + Math.floor(index / 3) * 220 }, data: { name: item.name || `Class${index + 1}`, attributes: Array.isArray(item.attributes) ? item.attributes : [], methods: Array.isArray(item.methods) ? item.methods : [] } }));
        const validIds = new Set(importedNodes.map((node) => node.id));
        const importedRelationships = Array.isArray(imported.relationships) ? imported.relationships : [];
        const importedEdges = importedRelationships.filter((item) => item?.id && validIds.has(String(item.source)) && validIds.has(String(item.target)) && item.source !== item.target).map((item) => { const edge = makeEdge(String(item.id), String(item.source), String(item.target), item.type || "association"); return { ...edge, label: item.label || edge.label }; });
        setNodes(importedNodes);
        setEdges(importedEdges);
        setSelectedId(importedNodes[0]?.id || null);
        setSelectedEdgeId(null);
        setConnectionStart(null);
        setRelationshipType(null);
        setHistory([]);
        setFuture([]);
      } catch {
        window.alert("Invalid UML diagram. Load a JSON file created with Save.");
      }
    };
    reader.readAsText(file);
  };
  const newDiagram = () => { if (nodes.length && !window.confirm("Start a new diagram? Unsaved changes will be cleared.")) return; setNodes([]); setEdges([]); setSelectedId(null); };
  useEffect(() => { const handler = (event) => { const tag = event.target.tagName; if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z" && tag !== "INPUT" && tag !== "TEXTAREA") { event.preventDefault(); undo(); } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "y") { event.preventDefault(); redo(); } else if ((event.key === "Delete" || event.key === "Backspace") && tag !== "INPUT" && tag !== "TEXTAREA") deleteSelected(); }; window.addEventListener("keydown", handler); return () => window.removeEventListener("keydown", handler); }, [deleteSelected, redo, undo]);
  const selected = nodes.find((node) => node.id === selectedId);
  const exportJava = () => { const file = files[0]; if (!file) return; const url = URL.createObjectURL(new Blob([file.content], { type: "text/plain" })); const link = document.createElement("a"); link.href = url; link.download = file.name; link.click(); URL.revokeObjectURL(url); };
  return <div className="app">
    <Header onNew={newDiagram} onSave={save} onLoad={() => fileInput.current?.click()} onExport={exportJava} />
    <input ref={fileInput} className="hidden-input" type="file" accept=".json,.java,application/json,text/x-java-source" onChange={load} />
    <div className="main-layout">
      <Sidebar onAddClass={addClass} relationshipType={relationshipType} onRelationship={selectRelationshipTool} connectionStart={connectionStart} />
      <main className="workspace">
        <Toolbar onZoomIn={() => flow.zoomIn()} onZoomOut={() => flow.zoomOut()} onFit={() => flow.fitView({ padding: 0.2 })} onUndo={undo} onRedo={redo} onDelete={deleteSelected} canUndo={history.length > 0} canRedo={future.length > 0} />
        <DiagramCanvas nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} onSelect={onNodeSelect} onEdgeSelect={(edgeId) => { setSelectedEdgeId(edgeId); setSelectedId(null); }} selectedId={selectedId} selectedEdgeId={selectedEdgeId} relationshipType={relationshipType} connectionStart={connectionStart} />
      </main>
      <PropertiesPanel node={selected} onUpdate={updateNode} onDelete={deleteSelected} />
    </div>
    <CodePanel files={files} />
  </div>;
}
export default function App() { return <ReactFlowProvider><Editor /></ReactFlowProvider>; }

