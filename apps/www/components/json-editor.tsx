'use client'

import { useRef } from 'react'
import { IconAlertTriangle, IconCircleCheck } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

type Props = {
  value: string
  onChange: (value: string) => void
  error: string | null
  lineCount: number
}

export function JsonEditor({ value, onChange, error, lineCount }: Props) {
  const taRef = useRef<HTMLTextAreaElement>(null)
  const gutterRef = useRef<HTMLDivElement>(null)

  function syncScroll() {
    if (gutterRef.current && taRef.current) {
      gutterRef.current.scrollTop = taRef.current.scrollTop
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Tab') {
      e.preventDefault()
      const el = e.currentTarget
      const start = el.selectionStart
      const end = el.selectionEnd
      const next = value.slice(0, start) + '  ' + value.slice(end)
      onChange(next)
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 2
      })
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-chart-1" />
          <span className="font-mono text-xs font-medium text-muted-foreground">
            input.json
          </span>
        </div>
        {error ? (
          <span className="flex items-center gap-1.5 text-xs font-medium text-destructive">
            <IconAlertTriangle size={14} />
            {error}
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-xs font-medium text-primary">
            <IconCircleCheck size={14} />
            有效的 JSON
          </span>
        )}
      </div>

      <div className="relative flex min-h-0 flex-1">
        <div
          ref={gutterRef}
          aria-hidden
          className="select-none overflow-hidden border-r border-border bg-muted/40 px-3 py-3 text-right font-mono text-xs leading-6 text-muted-foreground/60"
        >
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <textarea
          ref={taRef}
          value={value}
          spellCheck={false}
          onScroll={syncScroll}
          onKeyDown={handleKeyDown}
          onChange={(e) => onChange(e.target.value)}
          placeholder="在此粘贴或输入 JSON…"
          className={cn(
            'min-h-0 flex-1 resize-none bg-transparent px-4 py-3 font-mono text-sm leading-6 text-foreground outline-none',
            'placeholder:text-muted-foreground/50',
          )}
        />
      </div>
    </div>
  )
}
