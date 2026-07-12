export type ValueType =
  | "string"
  | "number"
  | "boolean"
  | "null"
  | "object"
  | "array"

export interface GraphRow {
  id: string
  key: string | null
  value: string | null
  valueType: ValueType
  childId: string | null
}

export interface GraphNode {
  id: string
  kind: "object" | "array" | "primitive"
  rows: GraphRow[]
  parentId: string | null
  children: string[]
  depth: number
  // layout
  width: number
  height: number
  blockHeight: number
  x: number
  y: number
}

export interface GraphEdge {
  id: string
  source: string
  sourceRow: string
  target: string
}

export interface Graph {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

const ROW_HEIGHT = 30
const NODE_PADDING_Y = 12
const CHAR_WIDTH = 7.3
const MIN_WIDTH = 120
const MAX_WIDTH = 320
const MAX_VALUE_LEN = 34

function typeOf(v: unknown): ValueType {
  if (v === null) return "null"
  if (Array.isArray(v)) return "array"
  return typeof v as ValueType
}

function truncate(s: string): string {
  return s.length > MAX_VALUE_LEN ? s.slice(0, MAX_VALUE_LEN - 1) + "…" : s
}

function formatPrimitive(v: unknown, t: ValueType): string {
  if (t === "string") return `"${v}"`
  if (t === "null") return "null"
  return String(v)
}

/** Convert parsed JSON into a node/edge graph. */
export function buildGraph(root: unknown): Graph {
  const nodes: GraphNode[] = []
  const edges: GraphEdge[] = []
  let counter = 0
  const nextId = () => `n${counter++}`

  function measure(node: GraphNode) {
    let max = MIN_WIDTH
    for (const row of node.rows) {
      const keyPart = row.key !== null ? `${row.key}: ` : ""
      const valPart = row.childId
        ? row.valueType === "array"
          ? "[ … ]"
          : "{ … }"
        : row.value ?? ""
      const len = (keyPart.length + valPart.length) * CHAR_WIDTH + 40
      max = Math.max(max, len)
    }
    node.width = Math.min(MAX_WIDTH, Math.round(max))
    node.height = node.rows.length * ROW_HEIGHT + NODE_PADDING_Y
  }

  function build(
    value: unknown,
    parentId: string | null,
    depth: number
  ): string {
    const t = typeOf(value)
    const node: GraphNode = {
      id: nextId(),
      kind: t === "array" ? "array" : t === "object" ? "object" : "primitive",
      rows: [],
      parentId,
      children: [],
      depth,
      width: MIN_WIDTH,
      height: ROW_HEIGHT,
      blockHeight: 0,
      x: 0,
      y: 0,
    }
    nodes.push(node)

    const entries: [string, unknown][] =
      t === "array"
        ? (value as unknown[]).map((v, i) => [String(i), v])
        : t === "object"
          ? Object.entries(value as Record<string, unknown>)
          : []

    if (t !== "object" && t !== "array") {
      node.rows.push({
        id: `${node.id}-r0`,
        key: null,
        value: formatPrimitive(value, t),
        valueType: t,
        childId: null,
      })
    } else {
      entries.forEach(([k, v], i) => {
        const vt = typeOf(v)
        const rowId = `${node.id}-r${i}`
        if (vt === "object" || vt === "array") {
          const childId = build(v, node.id, depth + 1)
          node.children.push(childId)
          node.rows.push({
            id: rowId,
            key: k,
            value: null,
            valueType: vt,
            childId,
          })
          edges.push({
            id: `${node.id}->${childId}`,
            source: node.id,
            sourceRow: rowId,
            target: childId,
          })
        } else {
          node.rows.push({
            id: rowId,
            key: k,
            value: truncate(formatPrimitive(v, vt)),
            valueType: vt,
            childId: null,
          })
        }
      })
    }

    if (node.rows.length === 0) {
      node.rows.push({
        id: `${node.id}-r0`,
        key: null,
        value: t === "array" ? "[]" : "{}",
        valueType: t,
        childId: null,
      })
    }

    measure(node)
    return node.id
  }

  build(root, null, 0)
  return { nodes, edges }
}

const V_GAP = 26
const H_GAP = 80

/** Tidy left-to-right tree layout with variable node heights. */
export function layoutGraph(graph: Graph): Graph {
  const map = new Map(graph.nodes.map((n) => [n.id, n]))
  const rootNode = graph.nodes.find((n) => n.parentId === null)
  if (!rootNode) return graph

  function computeBlock(node: GraphNode): number {
    if (node.children.length === 0) {
      node.blockHeight = node.height
      return node.blockHeight
    }
    let total = 0
    node.children.forEach((cid, idx) => {
      const child = map.get(cid)!
      total += computeBlock(child)
      if (idx < node.children.length - 1) total += V_GAP
    })
    node.blockHeight = Math.max(node.height, total)
    return node.blockHeight
  }

  function assign(node: GraphNode, x: number, top: number) {
    node.x = x
    if (node.children.length === 0) {
      node.y = top + (node.blockHeight - node.height) / 2
      return
    }
    let childrenTotal = 0
    node.children.forEach((cid, idx) => {
      childrenTotal += map.get(cid)!.blockHeight
      if (idx < node.children.length - 1) childrenTotal += V_GAP
    })
    let cursor = top + (node.blockHeight - childrenTotal) / 2
    const centers: number[] = []
    for (const cid of node.children) {
      const child = map.get(cid)!
      assign(child, x + node.width + H_GAP, cursor)
      centers.push(child.y + child.height / 2)
      cursor += child.blockHeight + V_GAP
    }
    node.y =
      (centers[0] + centers[centers.length - 1]) / 2 - node.height / 2
  }

  computeBlock(rootNode)
  assign(rootNode, 0, 0)
  return graph
}

export const ROW_H = ROW_HEIGHT
export const NODE_PAD_Y = NODE_PADDING_Y
