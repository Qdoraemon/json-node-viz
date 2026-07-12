"use client"

import * as React from "react"
import {
  IconX,
  IconFileCode,
  IconTrash,
  IconDownload,
  IconFolderOpen,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet"

export interface StoredFile {
  id: string
  name: string
  content: string
  savedAt: number
}

interface FilesDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  files: StoredFile[]
  activeId: string | null
  onLoad: (file: StoredFile) => void
  onDelete: (id: string) => void
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function sizeOf(content: string) {
  return (new Blob([content]).size / 1024).toFixed(1) + " KB"
}

export function FilesDrawer({
  open,
  onOpenChange,
  files,
  activeId,
  onLoad,
  onDelete,
}: FilesDrawerProps) {
  const download = (file: StoredFile) => {
    const blob = new Blob([file.content], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = file.name.endsWith(".json") ? file.name : `${file.name}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-secondary text-primary">
              <IconFolderOpen className="size-[18px]" />
            </div>
            <div>
              <SheetTitle>Saved files</SheetTitle>
              <SheetDescription className="text-xs">
                {files.length} item{files.length === 1 ? "" : "s"} in this
                workspace
              </SheetDescription>
            </div>
          </div>
          <SheetClose asChild>
            <Button variant="ghost" size="icon-sm" aria-label="Close drawer">
              <IconX className="size-4" />
            </Button>
          </SheetClose>
        </div>

        <div className="scroll-thin flex-1 space-y-2 overflow-y-auto p-3">
          {files.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-2 py-16 text-center">
              <IconFileCode className="size-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No saved files yet.
              </p>
              <p className="text-xs text-muted-foreground/70">
                Use Save in the toolbar to store snapshots here.
              </p>
            </div>
          )}

          {files.map((file) => {
            const isActive = file.id === activeId
            return (
              <div
                key={file.id}
                className={`group rounded-2xl border p-3 transition-colors ${
                  isActive
                    ? "border-primary/50 bg-accent/50"
                    : "border-border bg-card hover:border-primary/30 hover:bg-secondary/50"
                }`}
              >
                <button
                  onClick={() => onLoad(file)}
                  className="flex w-full items-start gap-2.5 text-left"
                >
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                    <IconFileCode className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {file.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {sizeOf(file.content)} · {formatTime(file.savedAt)}
                    </p>
                  </div>
                </button>
                <div className="mt-2 flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-7 flex-1 text-xs"
                    onClick={() => onLoad(file)}
                  >
                    Open
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    aria-label="Download file"
                    onClick={() => download(file)}
                  >
                    <IconDownload className="size-4" />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    aria-label="Delete file"
                    onClick={() => onDelete(file.id)}
                  >
                    <IconTrash className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </SheetContent>
    </Sheet>
  )
}
