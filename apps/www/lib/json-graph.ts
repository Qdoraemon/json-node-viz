// Converts an arbitrary parsed JSON value into a node/edge graph.
// Each object/array becomes a node whose rows list its primitive key/values,
// and nested objects/arrays become child nodes connected by edges.

export type GraphRow = { key: string; value: string; kind: ValueKind };

export type GraphNode = {
  id: string;
  title: string;
  rows: GraphRow[];
  path: (string | number)[];
  // layout fields (filled by the D3 tree pass)
  x: number;
  y: number;
  width: number;
  height: number;
};

export type GraphEdge = {
  id: string;
  source: string;
  target: string;
  label: string;
};

export type Graph = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

export type ValueKind = "string" | "number" | "boolean" | "null" | "object" | "array";

const NODE_WIDTH = 240;
const ROW_HEIGHT = 26;
const HEADER_HEIGHT = 34;

function kindOf(value: unknown): ValueKind {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value as ValueKind;
}

function isContainer(value: unknown): value is object {
  return value !== null && typeof value === "object";
}

function formatPrimitive(value: unknown): string {
  if (typeof value === "string") return `"${value}"`;
  if (value === null) return "null";
  return String(value);
}

export function buildGraph(root: unknown): Graph {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  let counter = 0;

  function nextId() {
    counter += 1;
    return `n${counter}`;
  }

  // Recursively walks a value, emitting a node for every container.
  function walk(value: unknown, title: string, path: (string | number)[] = []): string {
    const id = nextId();
    const rows: GraphRow[] = [];
    const children: { key: string; value: unknown }[] = [];

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (isContainer(item)) {
          children.push({ key: String(index), value: item });
        } else {
          rows.push({
            key: String(index),
            value: formatPrimitive(item),
            kind: kindOf(item),
          });
        }
      });
    } else if (isContainer(value)) {
      for (const [key, item] of Object.entries(value)) {
        if (isContainer(item)) {
          children.push({ key, value: item });
        } else {
          rows.push({
            key,
            value: formatPrimitive(item),
            kind: kindOf(item),
          });
        }
      }
    } else {
      rows.push({ key: title, value: formatPrimitive(value), kind: kindOf(value) });
    }

    const node: GraphNode = {
      id,
      title,
      rows,
      path: [...path],
      x: 0,
      y: 0,
      width: NODE_WIDTH,
      height: HEADER_HEIGHT + Math.max(rows.length, 0) * ROW_HEIGHT + 8,
    };
    nodes.push(node);

    for (const child of children) {
      const childTitle = Array.isArray(value) ? `${title}[${child.key}]` : child.key;
      const childPath = [...path, Array.isArray(value) ? Number(child.key) : child.key];
      const childId = walk(child.value, childTitle, childPath);
      edges.push({
        id: `${id}-${childId}`,
        source: id,
        target: childId,
        label: child.key,
      });
    }

    return id;
  }

  walk(root, "root");
  return { nodes, edges };
}

export const NODE_METRICS = { NODE_WIDTH, ROW_HEIGHT, HEADER_HEIGHT };

export const SAMPLE_JSON = `{
  "app": "Nodeflow",
  "version": "1.4.0",
  "active": true,
  "owner": {
    "name": "Ada Lovelace",
    "role": "admin",
    "contact": {
      "email": "ada@nodeflow.dev",
      "verified": true
    }
  },
  "services": [
    { "name": "api", "port": 8080, "healthy": true },
    { "name": "worker", "port": 9090, "healthy": false }
  ],
  "tags": ["json", "graph", "d3"]
}`;
