'use client'

import { useEffect, useImperativeHandle, useMemo, useRef, forwardRef } from 'react'
import * as d3 from 'd3'
import {
  buildGraph,
  NODE_METRICS,
  type Graph,
  type GraphNode,
  type ValueKind,
} from '@/lib/json-graph'

export type GraphSettings = {
  direction: 'horizontal' | 'vertical'
  spacingX: number
  spacingY: number
  showEdgeLabels: boolean
  curved: boolean
}

export type GraphCanvasHandle = {
  zoomIn: () => void
  zoomOut: () => void
  fit: () => void
  center: () => void
  reset: () => void
}

type Props = {
  data: unknown
  settings: GraphSettings
  onStats?: (stats: { nodes: number; edges: number }) => void
  onNodeClick?: (path: (string | number)[]) => void
}

const KIND_COLOR: Record<ValueKind, string> = {
  string: 'var(--chart-1)',
  number: 'var(--chart-2)',
  boolean: 'var(--chart-4)',
  null: 'var(--muted-foreground)',
  object: 'var(--chart-3)',
  array: 'var(--chart-5)',
}

type Positioned = Graph & { width: number; height: number }

// Runs a d3 tree layout over the graph (which is a strict tree by construction).
function layout(graph: Graph, settings: GraphSettings): Positioned {
  if (graph.nodes.length === 0) {
    return { ...graph, width: 0, height: 0 }
  }

  const byId = new Map(graph.nodes.map((n) => [n.id, n]))
  const root = graph.nodes[0]

  const stratify = d3
    .stratify<GraphNode>()
    .id((d) => d.id)
    .parentId((d) => {
      const edge = graph.edges.find((e) => e.target === d.id)
      return edge?.source
    })

  const hierarchy = stratify(graph.nodes)

  const horizontal = settings.direction === 'horizontal'
  // Cross-axis size must clear the tallest node so siblings never overlap.
  const maxNodeHeight = Math.max(...graph.nodes.map((n) => n.height), 120)
  const nodeSize: [number, number] = horizontal
    ? [maxNodeHeight + settings.spacingY, NODE_METRICS.NODE_WIDTH + 120 + settings.spacingX]
    : [NODE_METRICS.NODE_WIDTH + settings.spacingX, maxNodeHeight + 60 + settings.spacingY]

  const tree = d3.tree<GraphNode>().nodeSize(nodeSize)
  const laidOut = tree(hierarchy)

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  laidOut.each((d) => {
    const node = byId.get(d.id as string)!
    // In horizontal mode swap axes so the tree grows left→right.
    const px = horizontal ? d.y : d.x
    const py = horizontal ? d.x : d.y
    node.x = px
    node.y = py
    minX = Math.min(minX, px)
    minY = Math.min(minY, py)
    maxX = Math.max(maxX, px + node.width)
    maxY = Math.max(maxY, py + node.height)
  })

  // Normalize so the top-left is at padding.
  const pad = 80
  graph.nodes.forEach((n) => {
    n.x = n.x - minX + pad
    n.y = n.y - minY + pad
  })

  return {
    ...graph,
    width: maxX - minX + pad * 2,
    height: maxY - minY + pad * 2,
  }
}

export const GraphCanvas = forwardRef<GraphCanvasHandle, Props>(
  function GraphCanvas({ data, settings, onStats, onNodeClick }, ref) {
    const svgRef = useRef<SVGSVGElement>(null)
    const gRef = useRef<SVGGElement>(null)
    const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null)

    const positioned = useMemo(() => {
      const graph = buildGraph(data)
      return layout(graph, settings)
    }, [data, settings])

    useEffect(() => {
      onStats?.({
        nodes: positioned.nodes.length,
        edges: positioned.edges.length,
      })
    }, [positioned, onStats])

    // Set up zoom / pan behaviour once.
    useEffect(() => {
      if (!svgRef.current || !gRef.current) return
      const svg = d3.select(svgRef.current)
      const g = d3.select(gRef.current)

      const zoom = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 3])
        .on('zoom', (event) => {
          g.attr('transform', event.transform.toString())
        })

      zoomRef.current = zoom
      svg.call(zoom)
      svg.on('dblclick.zoom', null)

      return () => {
        svg.on('.zoom', null)
      }
    }, [])

    // Fit content into view whenever the graph changes.
    const fitToView = useMemo(
      () => () => {
        if (!svgRef.current || !zoomRef.current) return
        const svg = svgRef.current
        const { width, height } = positioned
        if (width === 0 || height === 0) return
        const bounds = svg.getBoundingClientRect()
        const scale = Math.min(
          bounds.width / width,
          bounds.height / height,
          1.2,
        )
        const tx = (bounds.width - width * scale) / 2
        const ty = (bounds.height - height * scale) / 2
        d3.select(svg)
          .transition()
          .duration(400)
          .call(
            zoomRef.current.transform,
            d3.zoomIdentity.translate(tx, ty).scale(scale),
          )
      },
      [positioned],
    )

    useEffect(() => {
      const t = setTimeout(fitToView, 60)
      return () => clearTimeout(t)
    }, [fitToView])

    useImperativeHandle(ref, () => ({
      zoomIn: () => {
        if (svgRef.current && zoomRef.current) {
          d3.select(svgRef.current)
            .transition()
            .duration(200)
            .call(zoomRef.current.scaleBy, 1.3)
        }
      },
      zoomOut: () => {
        if (svgRef.current && zoomRef.current) {
          d3.select(svgRef.current)
            .transition()
            .duration(200)
            .call(zoomRef.current.scaleBy, 0.7)
        }
      },
      fit: fitToView,
      center: fitToView,
      reset: () => {
        if (svgRef.current && zoomRef.current) {
          d3.select(svgRef.current)
            .transition()
            .duration(300)
            .call(zoomRef.current.transform, d3.zoomIdentity)
        }
      },
    }))

    const nodeById = useMemo(
      () => new Map(positioned.nodes.map((n) => [n.id, n])),
      [positioned],
    )

    function edgePath(sourceId: string, targetId: string) {
      const s = nodeById.get(sourceId)
      const t = nodeById.get(targetId)
      if (!s || !t) return ''
      const horizontal = settings.direction === 'horizontal'
      let x1: number, y1: number, x2: number, y2: number
      if (horizontal) {
        x1 = s.x + s.width
        y1 = s.y + s.height / 2
        x2 = t.x
        y2 = t.y + t.height / 2
      } else {
        x1 = s.x + s.width / 2
        y1 = s.y + s.height
        x2 = t.x + t.width / 2
        y2 = t.y
      }
      if (!settings.curved) {
        return `M${x1},${y1} L${x2},${y2}`
      }
      if (horizontal) {
        const mx = (x1 + x2) / 2
        return `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`
      }
      const my = (y1 + y2) / 2
      return `M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`
    }

    return (
      <div data-export="graph-canvas" className="canvas-grid relative h-full w-full overflow-hidden rounded-3xl">
        <svg ref={svgRef} className="h-full w-full cursor-grab active:cursor-grabbing">
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--border)" />
            </marker>
          </defs>
          <g ref={gRef}>
            {/* Edges */}
            {positioned.edges.map((e) => (
              <g key={e.id}>
                <path
                  d={edgePath(e.source, e.target)}
                  fill="none"
                  stroke="var(--border)"
                  strokeWidth={1.75}
                  markerEnd="url(#arrow)"
                />
                {settings.showEdgeLabels && (
                  <EdgeLabel
                    path={edgePath(e.source, e.target)}
                    label={e.label}
                  />
                )}
              </g>
            ))}

            {/* Nodes */}
            {positioned.nodes.map((n) => (
              <NodeCard key={n.id} node={n} onClick={() => onNodeClick?.(n.path)} />
            ))}
          </g>
        </svg>
      </div>
    )
  },
)

function EdgeLabel({ path, label }: { path: string; label: string }) {
  // Rough midpoint from the path's move + last coordinate.
  const match = path.match(/M([\d.-]+),([\d.-]+).*?([\d.-]+),([\d.-]+)$/)
  if (!match) return null
  const mx = (parseFloat(match[1]) + parseFloat(match[3])) / 2
  const my = (parseFloat(match[2]) + parseFloat(match[4])) / 2
  return (
    <text
      x={mx}
      y={my}
      textAnchor="middle"
      className="fill-muted-foreground font-mono"
      fontSize={10}
      dy={-4}
    >
      {label}
    </text>
  )
}

function NodeCard({ node, onClick }: { node: GraphNode; onClick?: () => void }) {
  const { HEADER_HEIGHT, ROW_HEIGHT } = NODE_METRICS
  return (
    <g
      transform={`translate(${node.x}, ${node.y})`}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : undefined }}
    >
      <rect
        width={node.width}
        height={node.height}
        rx={16}
        className="fill-card stroke-border"
        strokeWidth={1.5}
      />
      {/* Header */}
      <rect
        width={node.width}
        height={HEADER_HEIGHT}
        rx={16}
        className="fill-primary/10"
      />
      <rect
        y={HEADER_HEIGHT - 16}
        width={node.width}
        height={16}
        className="fill-primary/10"
      />
      <circle cx={16} cy={HEADER_HEIGHT / 2} r={4} className="fill-primary" />
      <text
        x={30}
        y={HEADER_HEIGHT / 2}
        dominantBaseline="central"
        className="fill-foreground font-mono font-medium"
        fontSize={12}
      >
        {truncate(node.title, 26)}
      </text>

      {/* Rows */}
      {node.rows.map((row, i) => {
        const ry = HEADER_HEIGHT + i * ROW_HEIGHT + ROW_HEIGHT / 2 + 4
        return (
          <g key={row.key + i}>
            <text
              x={16}
              y={ry}
              dominantBaseline="central"
              className="fill-muted-foreground font-mono"
              fontSize={11}
            >
              {truncate(row.key, 14)}
            </text>
            <text
              x={node.width - 14}
              y={ry}
              textAnchor="end"
              dominantBaseline="central"
              className="font-mono"
              fontSize={11}
              fill={KIND_COLOR[row.kind]}
            >
              {truncate(row.value, 18)}
            </text>
          </g>
        )
      })}
    </g>
  )
}

function truncate(str: string, max: number) {
  return str.length > max ? str.slice(0, max - 1) + '…' : str
}
