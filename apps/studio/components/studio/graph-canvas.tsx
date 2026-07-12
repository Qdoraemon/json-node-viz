"use client"

import * as React from "react"
import * as d3 from "d3"

import {
  type Graph,
  type GraphNode,
  ROW_H,
  NODE_PAD_Y,
} from "@/lib/json-graph"
import { cn } from "@/lib/utils"

export interface GraphCanvasHandle {
  zoomIn: () => void
  zoomOut: () => void
  reset: () => void
  fit: () => void
}

interface GraphCanvasProps {
  graph: Graph | null
  error: string | null
  showValues: boolean
  showGrid: boolean
  onZoomChange?: (zoom: number) => void
}

const valueClass = (t: string) => {
  switch (t) {
    case "string":
      return "fill-[var(--node-key)]"
    case "number":
      return "fill-foreground"
    case "boolean":
      return "fill-primary"
    default:
      return "fill-muted-foreground"
  }
}

export const GraphCanvas = React.forwardRef<
  GraphCanvasHandle,
  GraphCanvasProps
>(function GraphCanvas(
  { graph, error, showValues, showGrid, onZoomChange },
  ref
) {
  const svgRef = React.useRef<SVGSVGElement | null>(null)
  const gRef = React.useRef<SVGGElement | null>(null)
  const zoomRef = React.useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(
    null
  )

  const nodeMap = React.useMemo(() => {
    const m = new Map<string, GraphNode>()
    graph?.nodes.forEach((n) => m.set(n.id, n))
    return m
  }, [graph])

  const bounds = React.useMemo(() => {
    if (!graph || graph.nodes.length === 0) return null
    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity
    for (const n of graph.nodes) {
      minX = Math.min(minX, n.x)
      minY = Math.min(minY, n.y)
      maxX = Math.max(maxX, n.x + n.width)
      maxY = Math.max(maxY, n.y + n.height)
    }
    return { minX, minY, maxX, maxY }
  }, [graph])

  const fit = React.useCallback(() => {
    const svg = svgRef.current
    const zoom = zoomRef.current
    if (!svg || !zoom || !bounds) return
    const { width, height } = svg.getBoundingClientRect()
    const gw = bounds.maxX - bounds.minX
    const gh = bounds.maxY - bounds.minY
    const pad = 80
    const scale = Math.min(
      (width - pad) / gw,
      (height - pad) / gh,
      1.4
    )
    const s = Math.max(0.1, scale)
    const tx = width / 2 - (bounds.minX + gw / 2) * s
    const ty = height / 2 - (bounds.minY + gh / 2) * s
    d3.select(svg)
      .transition()
      .duration(400)
      .call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(s))
  }, [bounds])

  React.useImperativeHandle(
    ref,
    () => ({
      zoomIn: () => {
        const svg = svgRef.current
        if (svg && zoomRef.current)
          d3.select(svg).transition().duration(200).call(zoomRef.current.scaleBy, 1.3)
      },
      zoomOut: () => {
        const svg = svgRef.current
        if (svg && zoomRef.current)
          d3.select(svg).transition().duration(200).call(zoomRef.current.scaleBy, 1 / 1.3)
      },
      reset: () => {
        const svg = svgRef.current
        if (svg && zoomRef.current)
          d3.select(svg)
            .transition()
            .duration(300)
            .call(zoomRef.current.transform, d3.zoomIdentity.translate(60, 60))
      },
      fit,
    }),
    [fit]
  )

  // set up zoom behavior
  React.useEffect(() => {
    const svg = svgRef.current
    const g = gRef.current
    if (!svg || !g) return

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .on("zoom", (event) => {
        g.setAttribute("transform", event.transform.toString())
        onZoomChange?.(event.transform.k)
      })

    zoomRef.current = zoom
    const sel = d3.select(svg)
    sel.call(zoom)
    sel.on("dblclick.zoom", null)

    return () => {
      sel.on(".zoom", null)
    }
  }, [onZoomChange])

  // fit whenever the graph changes
  React.useEffect(() => {
    if (graph) {
      const id = window.setTimeout(fit, 60)
      return () => window.clearTimeout(id)
    }
  }, [graph, fit])

  const edgePath = (sx: number, sy: number, tx: number, ty: number) => {
    const mx = (sx + tx) / 2
    return `M${sx},${sy} C${mx},${sy} ${mx},${ty} ${tx},${ty}`
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl bg-canvas">
      {showGrid && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(color-mix(in oklch, var(--muted-foreground) 34%, transparent) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
      )}

      {error && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center p-6">
          <div className="pointer-events-auto max-w-sm rounded-2xl border border-destructive/30 bg-card px-5 py-4 text-center shadow-sm">
            <p className="text-sm font-semibold text-destructive">
              Invalid JSON
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{error}</p>
          </div>
        </div>
      )}

      {!error && (!graph || graph.nodes.length === 0) && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Paste JSON above to render the graph.
          </p>
        </div>
      )}

      <svg
        ref={svgRef}
        className="h-full w-full cursor-grab active:cursor-grabbing"
        role="img"
        aria-label="JSON node graph"
      >
        <g ref={gRef}>
          {/* edges */}
          <g fill="none">
            {graph?.edges.map((edge) => {
              const source = nodeMap.get(edge.source)
              const target = nodeMap.get(edge.target)
              if (!source || !target) return null
              const rowIndex = source.rows.findIndex(
                (r) => r.id === edge.sourceRow
              )
              const sy =
                source.y +
                NODE_PAD_Y / 2 +
                rowIndex * ROW_H +
                ROW_H / 2
              const sx = source.x + source.width
              const tx = target.x
              const ty = target.y + target.height / 2
              return (
                <path
                  key={edge.id}
                  d={edgePath(sx, sy, tx, ty)}
                  className="stroke-edge"
                  strokeWidth={1.75}
                />
              )
            })}
          </g>

          {/* nodes */}
          {graph?.nodes.map((node) => (
            <g key={node.id} transform={`translate(${node.x},${node.y})`}>
              <rect
                width={node.width}
                height={node.height}
                rx={16}
                ry={16}
                className="fill-node stroke-node-border"
                strokeWidth={1.25}
              />
              {/* teal accent bar */}
              <rect
                x={0}
                y={10}
                width={4}
                height={Math.max(8, node.height - 20)}
                rx={2}
                className="fill-primary"
              />
              {node.rows.map((row, i) => {
                const cy = NODE_PAD_Y / 2 + i * ROW_H + ROW_H / 2 + 4
                return (
                  <text
                    key={row.id}
                    x={16}
                    y={cy}
                    className="font-mono"
                    style={{ fontSize: 12 }}
                  >
                    {row.key !== null && (
                      <tspan className="fill-node-key" fontWeight={600}>
                        {row.key}
                        {row.value !== null || row.childId ? ": " : ""}
                      </tspan>
                    )}
                    {row.childId ? (
                      <tspan className="fill-muted-foreground">
                        {row.valueType === "array" ? "[ … ]" : "{ … }"}
                      </tspan>
                    ) : (
                      showValues &&
                      row.value !== null && (
                        <tspan className={cn(valueClass(row.valueType))}>
                          {row.value}
                        </tspan>
                      )
                    )}
                  </text>
                )
              })}
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
})
