'use client'

import {
  IconArrowsHorizontal,
  IconArrowsVertical,
  IconFocusCentered,
  IconMaximize,
  IconPlus,
  IconMinus,
  IconRefresh,
  IconVectorBezier2,
  IconLine,
  IconTag,
  IconTagOff,
} from '@tabler/icons-react'
import type { GraphSettings } from '@/components/graph-canvas'
import { cn } from '@/lib/utils'

type Props = {
  settings: GraphSettings
  onChange: (settings: GraphSettings) => void
  onZoomIn: () => void
  onZoomOut: () => void
  onFit: () => void
  onReset: () => void
  stats: { nodes: number; edges: number }
}

export function ControlPanel({
  settings,
  onChange,
  onZoomIn,
  onZoomOut,
  onFit,
  onReset,
  stats,
}: Props) {
  function set<K extends keyof GraphSettings>(key: K, value: GraphSettings[K]) {
    onChange({ ...settings, [key]: value })
  }

  return (
    <div className="pointer-events-auto w-60 rounded-3xl border border-border bg-card/90 p-3 shadow-lg shadow-black/5 backdrop-blur-md">
      <div className="mb-3 flex items-center justify-between px-1">
        <span className="text-xs font-semibold tracking-wide text-foreground">
          图形控制
        </span>
        <span className="font-mono text-[10px] text-muted-foreground">
          {stats.nodes} 节点 · {stats.edges} 边
        </span>
      </div>

      {/* Zoom cluster */}
      <div className="mb-2 grid grid-cols-4 gap-1.5">
        <PanelButton label="放大" onClick={onZoomIn}>
          <IconPlus size={18} />
        </PanelButton>
        <PanelButton label="缩小" onClick={onZoomOut}>
          <IconMinus size={18} />
        </PanelButton>
        <PanelButton label="适应" onClick={onFit}>
          <IconMaximize size={18} />
        </PanelButton>
        <PanelButton label="重置" onClick={onReset}>
          <IconRefresh size={18} />
        </PanelButton>
      </div>

      <Divider />

      {/* Direction */}
      <SectionLabel>布局方向</SectionLabel>
      <div className="mb-2 grid grid-cols-2 gap-1.5">
        <SegButton
          active={settings.direction === 'horizontal'}
          onClick={() => set('direction', 'horizontal')}
        >
          <IconArrowsHorizontal size={16} />
          横向
        </SegButton>
        <SegButton
          active={settings.direction === 'vertical'}
          onClick={() => set('direction', 'vertical')}
        >
          <IconArrowsVertical size={16} />
          纵向
        </SegButton>
      </div>

      {/* Edge style */}
      <SectionLabel>连线样式</SectionLabel>
      <div className="mb-2 grid grid-cols-2 gap-1.5">
        <SegButton active={settings.curved} onClick={() => set('curved', true)}>
          <IconVectorBezier2 size={16} />
          曲线
        </SegButton>
        <SegButton active={!settings.curved} onClick={() => set('curved', false)}>
          <IconLine size={16} />
          直线
        </SegButton>
      </div>

      {/* Edge labels */}
      <SectionLabel>连线标签</SectionLabel>
      <div className="mb-3 grid grid-cols-2 gap-1.5">
        <SegButton
          active={settings.showEdgeLabels}
          onClick={() => set('showEdgeLabels', true)}
        >
          <IconTag size={16} />
          显示
        </SegButton>
        <SegButton
          active={!settings.showEdgeLabels}
          onClick={() => set('showEdgeLabels', false)}
        >
          <IconTagOff size={16} />
          隐藏
        </SegButton>
      </div>

      <Divider />

      {/* Spacing sliders */}
      <SectionLabel>水平间距</SectionLabel>
      <Slider
        min={0}
        max={200}
        value={settings.spacingX}
        onChange={(v) => set('spacingX', v)}
      />
      <SectionLabel>垂直间距</SectionLabel>
      <Slider
        min={0}
        max={120}
        value={settings.spacingY}
        onChange={(v) => set('spacingY', v)}
      />
    </div>
  )
}

function PanelButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex aspect-square items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
    >
      {children}
    </button>
  )
}

function SegButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center justify-center gap-1.5 rounded-xl border px-2 py-1.5 text-xs font-medium transition-colors',
        active
          ? 'border-primary/50 bg-primary/15 text-primary'
          : 'border-border bg-background text-muted-foreground hover:bg-muted',
      )}
    >
      {children}
    </button>
  )
}

function Slider({
  min,
  max,
  value,
  onChange,
}: {
  min: number
  max: number
  value: number
  onChange: (value: number) => void
}) {
  return (
    <div className="mb-3 flex items-center gap-2 px-1">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
      />
      <span className="w-8 text-right font-mono text-[10px] text-muted-foreground">
        {value}
      </span>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1.5 px-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
      {children}
    </p>
  )
}

function Divider() {
  return <div className="my-2.5 h-px bg-border" />
}
