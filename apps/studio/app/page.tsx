"use client"

import * as React from "react"

import { TooltipProvider } from "@/components/ui/tooltip"
import { Navbar } from "@/components/studio/navbar"
import { Toolbar } from "@/components/studio/toolbar"
import { JsonEditor } from "@/components/studio/json-editor"
import {
  GraphCanvas,
  type GraphCanvasHandle,
} from "@/components/studio/graph-canvas"
import { ControlPanel } from "@/components/studio/control-panel"
import {
  FilesDrawer,
  type StoredFile,
} from "@/components/studio/files-drawer"
import { buildGraph, layoutGraph, type Graph } from "@/lib/json-graph"
import { SAMPLES, DEFAULT_JSON } from "@/lib/samples"

export default function Page() {
  const [jsonText, setJsonText] = React.useState(DEFAULT_JSON)
  const [graph, setGraph] = React.useState<Graph | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const [showValues, setShowValues] = React.useState(true)
  const [showGrid, setShowGrid] = React.useState(true)
  const [zoom, setZoom] = React.useState(1)

  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const [files, setFiles] = React.useState<StoredFile[]>([
    {
      id: "seed-1",
      name: "fruits-catalog.json",
      content: SAMPLES[0].content,
      savedAt: Date.now() - 1000 * 60 * 60 * 4,
    },
    {
      id: "seed-2",
      name: "api-response.json",
      content: SAMPLES[1].content,
      savedAt: Date.now() - 1000 * 60 * 30,
    },
  ])

  const canvasRef = React.useRef<GraphCanvasHandle>(null)
  const saveCounter = React.useRef(1)

  // Parse + build graph, retaining the last valid graph on error.
  React.useEffect(() => {
    if (!jsonText.trim()) {
      setGraph(null)
      setError(null)
      return
    }
    const timer = window.setTimeout(() => {
      try {
        const parsed = JSON.parse(jsonText)
        setGraph(layoutGraph(buildGraph(parsed)))
        setError(null)
      } catch (e) {
        setError((e as Error).message.replace(/^JSON\.parse:\s*/, ""))
      }
    }, 200)
    return () => window.clearTimeout(timer)
  }, [jsonText])

  const handleFormat = () => {
    try {
      setJsonText(JSON.stringify(JSON.parse(jsonText), null, 2))
    } catch {
      /* keep as-is when invalid */
    }
  }

  const handleMinify = () => {
    try {
      setJsonText(JSON.stringify(JSON.parse(jsonText)))
    } catch {
      /* keep as-is when invalid */
    }
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) setJsonText(text)
    } catch {
      /* clipboard unavailable */
    }
  }

  const handleSave = () => {
    const name = `snapshot-${saveCounter.current++}.json`
    const file: StoredFile = {
      id: `f-${Date.now()}`,
      name,
      content: jsonText,
      savedAt: Date.now(),
    }
    setFiles((prev) => [file, ...prev])
    setActiveId(file.id)
    setDrawerOpen(true)
  }

  const handleLoadSample = (key: string) => {
    const sample = SAMPLES.find((s) => s.key === key)
    if (sample) {
      setJsonText(sample.content)
      setActiveId(null)
    }
  }

  const handleLoadFile = (file: StoredFile) => {
    setJsonText(file.content)
    setActiveId(file.id)
    setDrawerOpen(false)
  }

  const handleDeleteFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
    if (activeId === id) setActiveId(null)
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex h-screen flex-col overflow-hidden bg-background">
        <Navbar />
        <Toolbar
          onUpload={(text) => {
            setJsonText(text)
            setActiveId(null)
          }}
          onPaste={handlePaste}
          onFormat={handleFormat}
          onMinify={handleMinify}
          onClear={() => setJsonText("")}
          onSave={handleSave}
          onLoadSample={handleLoadSample}
          onOpenFiles={() => setDrawerOpen(true)}
          fileCount={files.length}
        />

        <main className="flex min-h-0 flex-1 flex-col gap-3 p-3">
          <section className="h-[34%] min-h-[160px]">
            <JsonEditor
              value={jsonText}
              onChange={setJsonText}
              error={error}
              nodeCount={graph?.nodes.length ?? 0}
            />
          </section>

          <section className="relative min-h-0 flex-1">
            <GraphCanvas
              ref={canvasRef}
              graph={graph}
              error={error}
              showValues={showValues}
              showGrid={showGrid}
              onZoomChange={setZoom}
            />
            <ControlPanel
              zoom={zoom}
              onZoomIn={() => canvasRef.current?.zoomIn()}
              onZoomOut={() => canvasRef.current?.zoomOut()}
              onReset={() => canvasRef.current?.reset()}
              onFit={() => canvasRef.current?.fit()}
              showValues={showValues}
              onToggleValues={setShowValues}
              showGrid={showGrid}
              onToggleGrid={setShowGrid}
            />
          </section>
        </main>

        <FilesDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          files={files}
          activeId={activeId}
          onLoad={handleLoadFile}
          onDelete={handleDeleteFile}
        />
      </div>
    </TooltipProvider>
  )
}
