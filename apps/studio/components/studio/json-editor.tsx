"use client"

import * as React from "react"
import {
  IconCircleCheckFilled,
  IconAlertTriangleFilled,
  IconCopy,
  IconCheck,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"

interface JsonEditorProps {
  value: string
  onChange: (v: string) => void
  error: string | null
  nodeCount: number
}

export function JsonEditor({
  value,
  onChange,
  error,
  nodeCount,
}: JsonEditorProps) {
  const [copied, setCopied] = React.useState(false)
  const lines = React.useMemo(() => value.split("\n").length, [value])
  const sizeKb = React.useMemo(
    () => (new Blob([value]).size / 1024).toFixed(1),
    [value]
  )
  const gutterRef = React.useRef<HTMLDivElement>(null)

  const syncScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (gutterRef.current) {
      gutterRef.current.scrollTop = e.currentTarget.scrollTop
    }
  }

  const copy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card">
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="flex size-2 rounded-full bg-primary" />
          <span className="text-xs font-medium text-muted-foreground">
            input.json
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] tabular-nums text-muted-foreground">
            {lines} lines · {sizeKb} KB
          </span>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={copy}
            aria-label="Copy JSON"
          >
            {copied ? (
              <IconCheck className="size-4 text-primary" />
            ) : (
              <IconCopy className="size-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1">
        <div
          ref={gutterRef}
          aria-hidden
          className="scroll-thin select-none overflow-hidden border-r border-border bg-muted/30 py-3 text-right font-mono text-xs leading-6 text-muted-foreground/60"
          style={{ width: 48 }}
        >
          {Array.from({ length: lines }).map((_, i) => (
            <div key={i} className="px-2">
              {i + 1}
            </div>
          ))}
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={syncScroll}
          spellCheck={false}
          placeholder="Paste or type JSON here…"
          className="scroll-thin flex-1 resize-none bg-transparent px-3 py-3 font-mono text-xs leading-6 text-foreground outline-none placeholder:text-muted-foreground/50"
        />
      </div>

      <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs">
        {error ? (
          <span className="flex items-center gap-1.5 font-medium text-destructive">
            <IconAlertTriangleFilled className="size-3.5" />
            {error}
          </span>
        ) : (
          <span className="flex items-center gap-1.5 font-medium text-primary">
            <IconCircleCheckFilled className="size-3.5" />
            Valid JSON
          </span>
        )}
        <span className="tabular-nums text-muted-foreground">
          {nodeCount} nodes
        </span>
      </div>
    </div>
  )
}
