'use client'

import Link from 'next/link'
import { useRef } from 'react'
import useConfig from '@/src/store/useConfig'
import {
  IconBinaryTree2,
  IconMoon,
  IconSun,
  IconFolderOpen,
  IconUpload,
  IconClipboard,
  IconWand,
  IconMinimize,
  IconCopy,
  IconDownload,
  IconTrash,
} from '@tabler/icons-react'

type Props = {
  onOpenStorage: () => void
  fileCount: number
  onUpload: (name: string, content: string) => void
  onPaste: () => void
  onFormat: () => void
  onMinify: () => void
  onCopy: () => void
  onDownload: () => void
  onClear: () => void
}

export function TopNav({
  onOpenStorage,
  fileCount,
  onUpload,
  onPaste,
  onFormat,
  onMinify,
  onCopy,
  onDownload,
  onClear,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onUpload(file.name, String(reader.result ?? ''))
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border bg-card px-4">
      <input
        ref={inputRef}
        type="file"
        accept=".json,application/json,text/plain"
        onChange={handleFile}
        className="hidden"
      />

      <Link href="/" className="flex items-center gap-2.5 rounded-xl px-1 py-0.5 hover:bg-muted/60">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <IconBinaryTree2 size={20} />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-foreground">JsonViz</p>
          <p className="text-[11px] text-muted-foreground">JSON 可视化工具</p>
        </div>
        <span className="ml-2 hidden rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
          v1.4.0
        </span>
      </Link>

      <div className="min-w-0 flex items-center gap-1.5 overflow-x-auto">
        <IconButton label="上传" onClick={() => inputRef.current?.click()}>
          <IconUpload size={16} />
        </IconButton>
        <IconButton label="粘贴" onClick={onPaste}>
          <IconClipboard size={16} />
        </IconButton>
        <IconButton label="格式化" onClick={onFormat}>
          <IconWand size={16} />
        </IconButton>
        <IconButton label="压缩" onClick={onMinify}>
          <IconMinimize size={16} />
        </IconButton>
        <IconButton label="复制" onClick={onCopy}>
          <IconCopy size={16} />
        </IconButton>
        <IconButton label="下载" onClick={onDownload}>
          <IconDownload size={16} />
        </IconButton>
        <IconButton label="清空" onClick={onClear}>
          <IconTrash size={16} />
        </IconButton>

        <button
          type="button"
          onClick={onOpenStorage}
          className="relative flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <IconFolderOpen size={16} />
          <span className="hidden sm:inline">存储</span>
          {fileCount > 0 && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 font-mono text-[10px] text-primary-foreground">
              {fileCount}
            </span>
          )}
        </button>
        <ThemeToggle />
      </div>
    </header>
  )
}

function IconButton({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {children}
    </button>
  )
}

function ThemeToggle() {
  const isDark = useConfig((state) => state.darkmodeEnabled)
  const toggleDarkMode = useConfig((state) => state.toggleDarkMode)

  return (
    <button
      type="button"
      aria-label="切换主题"
      onClick={() => toggleDarkMode(!isDark)}
      className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {isDark ? <IconSun size={16} /> : <IconMoon size={16} />}
    </button>
  )
}
