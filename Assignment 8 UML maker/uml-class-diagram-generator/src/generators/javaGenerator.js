const visibility = { public: "public", private: "private", protected: "protected", package: "" };
const identifier = (value, fallback) => /^[A-Za-z_$][\w$]*$/.test(value || "") ? value : fallback;

function classCode(item, diagram, isPublic) {
  const inheritance = diagram.relationships.find((relationship) => relationship.type === "inheritance" && relationship.source === item.id);
  const lines = [`${isPublic ? "public " : ""}class ${identifier(item.name, "UnnamedClass")}${inheritance ? ` extends ${identifier(diagram.classes.find((entry) => entry.id === inheritance.target)?.name, "BaseClass")}` : ""} {`, ""];
  (item.attributes || []).forEach((attribute) => lines.push(`    ${visibility[attribute.visibility] ? `${visibility[attribute.visibility]} ` : ""}${attribute.type || "Object"} ${identifier(attribute.name, "field")};`));
  diagram.relationships.filter((relationship) => relationship.source === item.id && relationship.type !== "inheritance").forEach((relationship) => { const target = diagram.classes.find((entry) => entry.id === relationship.target); if (target) lines.push(`    private ${target.name} ${target.name.toLowerCase()};`); });
  if (item.attributes?.length || diagram.relationships.some((relationship) => relationship.source === item.id && relationship.type !== "inheritance")) lines.push("");
  (item.methods || []).forEach((method) => { const params = (method.parameters || []).map((parameter) => `${parameter.type || "Object"} ${identifier(parameter.name, "value")}`).join(", "); lines.push(`    ${visibility[method.visibility] || "public"} ${method.returnType || "void"} ${identifier(method.name, "method")}(${params}) {`); lines.push("    }"); lines.push(""); });
  lines.push("}");
  return lines.join("\n");
}

export function generateJavaFiles(diagram) {
  const content = diagram.classes.length
    ? diagram.classes.map((item, index) => classCode(item, diagram, index === 0)).join("\n\n")
    : "// Add a class to generate Java source.";
  const fileName = diagram.classes.length ? `${identifier(diagram.classes[0].name, "CanvasDiagram")}.java` : "CanvasDiagram.java";
  return [{ name: fileName, content }];
}

const parseVisibility = (value) => value === "public" || value === "protected" || value === "private" ? value : "package";

export function parseJavaSource(source) {
  const classes = [];
  const classPattern = /(?:public\s+)?class\s+([A-Za-z_$][\w$]*)(?:\s+extends\s+([A-Za-z_$][\w$]*))?\s*\{/g;
  let match;
  while ((match = classPattern.exec(source))) {
    const bodyStart = classPattern.lastIndex;
    let depth = 1;
    let cursor = bodyStart;
    while (cursor < source.length && depth) {
      if (source[cursor] === "{") depth += 1;
      if (source[cursor] === "}") depth -= 1;
      cursor += 1;
    }
    const body = source.slice(bodyStart, cursor - 1);
    classes.push({ id: `class-${classes.length + 1}`, name: match[1], position: { x: 100 + (classes.length % 3) * 260, y: 100 + Math.floor(classes.length / 3) * 220 }, attributes: [], methods: [], parentName: match[2] || "" });
    const current = classes[classes.length - 1];
    const methodRanges = [];
    const methodPattern = /^\s*(public|private|protected)?\s*([\w.$<>, ?]+(?:\[\])?)\s+(\w+)\s*\(([^)]*)\)\s*\{/gm;
    let methodMatch;
    while ((methodMatch = methodPattern.exec(body))) {
      methodRanges.push([methodMatch.index, methodPattern.lastIndex]);
      current.methods.push({ id: `method-${current.id}-${current.methods.length + 1}`, visibility: parseVisibility(methodMatch[1]), name: methodMatch[3], returnType: methodMatch[2].trim(), parameters: methodMatch[4].trim() ? methodMatch[4].split(",").map((parameter, index) => { const parts = parameter.trim().split(/\s+/); return { id: `parameter-${index + 1}`, name: parts.pop() || "value", type: parts.join(" ") || "Object" }; }) : [] });
    }
    const fieldPattern = /^\s*(public|private|protected)?\s*([\w.$<>, ?]+(?:\[\])?)\s+(\w+)\s*;\s*$/gm;
    let fieldMatch;
    while ((fieldMatch = fieldPattern.exec(body))) {
      if (methodRanges.some(([start, end]) => fieldMatch.index >= start && fieldMatch.index < end)) continue;
      current.attributes.push({ id: `attribute-${current.id}-${current.attributes.length + 1}`, visibility: parseVisibility(fieldMatch[1]), name: fieldMatch[3], type: fieldMatch[2].trim() });
    }
  }
  if (!classes.length) throw new Error("No Java classes found");
  const classByName = new Map(classes.map((item) => [item.name, item]));
  const relationships = [];
  classes.forEach((item) => {
    if (item.parentName && classByName.has(item.parentName)) relationships.push({ id: `relationship-${relationships.length + 1}`, source: item.id, target: classByName.get(item.parentName).id, type: "inheritance", label: "inherits" });
    item.attributes.forEach((attribute) => {
      const listMatch = attribute.type.match(/^List<\s*([A-Za-z_$][\w$]*)\s*>$/);
      const targetName = listMatch ? listMatch[1] : attribute.type.replace(/\[\]$/, "");
      if (classByName.has(targetName)) relationships.push({ id: `relationship-${relationships.length + 1}`, source: item.id, target: classByName.get(targetName).id, type: listMatch ? "aggregation" : "association", label: listMatch ? "aggregates" : "association" });
    });
    delete item.parentName;
  });
  return { classes, relationships };
}
