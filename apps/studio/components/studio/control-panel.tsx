"use client"

import * as React from "react"
import {
  IconPlus,
  IconMinus,
  IconMaximize,
  IconFocusCentered,
  IconEye,
  IconGridDots,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ControlPanelProps {
  zoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
  onFit: () => void
  showValues: boolean
  onToggleValues: (v: boolean) => void
  showGrid: boolean
  onToggleGrid: (v: boolean) => void
}

export function ControlPanel({
  zoom,
  onZoomIn,
  onZoomOut,
  onReset,
  onFit,
  showValues,
  onToggleValues,
  showGrid,
  onToggleGrid,
}: ControlPanelProps) {
  return (
    <div className="pointer-events-auto absolute right-4 top-4 z-20 flex w-56 flex-col gap-3 rounded-3xl border border-border bg-card/80 p-3 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-semibold text-muted-foreground">
          Graph controls
        </span>
        <span className="tabular-nums rounded-md bg-secondary px-1.5 py-0.5 text-[11px] font-medium text-secondary-foreground">
          {Math.round(zoom * 100)}%
        </span>
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary" size="icon" onClick={onZoomIn} aria-label="Zoom in">
              <IconPlus className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom in</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary" size="icon" onClick={onZoomOut} aria-label="Zoom out">
              <IconMinus className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom out</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary" size="icon" onClick={onFit} aria-label="Fit to screen">
              <IconMaximize className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Fit to view</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary" size="icon" onClick={onReset} aria-label="Reset view">
              <IconFocusCentered className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reset view</TooltipContent>
        </Tooltip>
      </div>

      <div className="h-px bg-border" />

      <div className="flex flex-col gap-2">
        <label className="flex cursor-pointer items-center justify-between rounded-xl px-1 py-1 text-sm">
          <span className="flex items-center gap-2 text-foreground">
            <IconEye className="size-4 text-muted-foreground" />
            Show values
          </span>
          <Switch checked={showValues} onCheckedChange={onToggleValues} />
        </label>
        <label className="flex cursor-pointer items-center justify-between rounded-xl px-1 py-1 text-sm">
          <span className="flex items-center gap-2 text-foreground">
            <IconGridDots className="size-4 text-muted-foreground" />
            Dot grid
          </span>
          <Switch checked={showGrid} onCheckedChange={onToggleGrid} />
        </label>
      </div>
    </div>
  )
}
