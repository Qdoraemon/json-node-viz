"use client"

import * as React from "react"
import {
  IconUpload,
  IconClipboard,
  IconBraces,
  IconMinus,
  IconTrash,
  IconDeviceFloppy,
  IconFileText,
  IconChevronDown,
  IconFlask,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SAMPLES } from "@/lib/samples"

interface ToolbarProps {
  onUpload: (text: string, name: string) => void
  onPaste: () => void
  onFormat: () => void
  onMinify: () => void
  onClear: () => void
  onSave: () => void
  onLoadSample: (key: string) => void
  onOpenFiles: () => void
  fileCount: number
}

export function Toolbar({
  onUpload,
  onPaste,
  onFormat,
  onMinify,
  onClear,
  onSave,
  onLoadSample,
  onOpenFiles,
  fileCount,
}: ToolbarProps) {
  const fileInput = React.useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    onUpload(text, file.name)
    e.target.value = ""
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border bg-card/40 px-4 py-2.5">
      <input
        ref={fileInput}
        type="file"
        accept=".json,application/json,.txt"
        className="hidden"
        onChange={handleFile}
      />

      <Button size="sm" onClick={() => fileInput.current?.click()}>
        <IconUpload className="size-4" />
        Upload JSON
      </Button>

      <Button size="sm" variant="outline" onClick={onPaste}>
        <IconClipboard className="size-4" />
        Paste
      </Button>

      <div className="mx-1 h-6 w-px bg-border" />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="sm" variant="ghost" onClick={onFormat}>
            <IconBraces className="size-4" />
            Format
          </Button>
        </TooltipTrigger>
        <TooltipContent>Beautify with 2-space indent</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="sm" variant="ghost" onClick={onMinify}>
            <IconMinus className="size-4" />
            Minify
          </Button>
        </TooltipTrigger>
        <TooltipContent>Strip whitespace</TooltipContent>
      </Tooltip>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="ghost">
            <IconFlask className="size-4" />
            Samples
            <IconChevronDown className="size-3.5 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Example datasets</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {SAMPLES.map((s) => (
            <DropdownMenuItem key={s.key} onClick={() => onLoadSample(s.key)}>
              <IconFileText className="size-4" />
              {s.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button size="sm" variant="ghost" onClick={onClear}>
        <IconTrash className="size-4" />
        Clear
      </Button>

      <div className="ml-auto flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={onSave}>
          <IconDeviceFloppy className="size-4" />
          Save
        </Button>
        <Button size="sm" variant="secondary" onClick={onOpenFiles}>
          <IconFileText className="size-4" />
          Files
          <span className="ml-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
            {fileCount}
          </span>
        </Button>
      </div>
    </div>
  )
}
