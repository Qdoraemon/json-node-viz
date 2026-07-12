'use client'

import { useRef } from 'react'
import {
  IconUpload,
  IconClipboard,
  IconWand,
  IconMinimize,
  IconTrash,
  IconCopy,
  IconDownload,
} from '@tabler/icons-react'

type Props = {
  onUpload: (name: string, content: string) => void
  onPaste: () => void
  onFormat: () => void
  onMinify: () => void
  onClear: () => void
  onCopy: () => void
  onDownload: () => void
}

export function UploadToolbar({
  onUpload,
  onPaste,
  onFormat,
  onMinify,
  onClear,
  onCopy,
  onDownload,
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
    <div className="flex shrink-0 flex-wrap items-center gap-1.5 border-b border-border bg-card px-4 py-2.5">
      <input
        ref={inputRef}
        type="file"
        accept=".json,application/json,text/plain"
        onChange={handleFile}
        className="hidden"
      />
      <ToolButton primary icon={<IconUpload size={16} />} onClick={() => inputRef.current?.click()}>
        上传文件
      </ToolButton>
      <ToolButton icon={<IconClipboard size={16} />} onClick={onPaste}>
        粘贴
      </ToolButton>

      <Sep />

      <ToolButton icon={<IconWand size={16} />} onClick={onFormat}>
        格式化
      </ToolButton>
      <ToolButton icon={<IconMinimize size={16} />} onClick={onMinify}>
        压缩
      </ToolButton>

      <Sep />

      <ToolButton icon={<IconCopy size={16} />} onClick={onCopy}>
        复制
      </ToolButton>
      <ToolButton icon={<IconDownload size={16} />} onClick={onDownload}>
        下载
      </ToolButton>

      <div className="ml-auto">
        <ToolButton icon={<IconTrash size={16} />} onClick={onClear} destructive>
          清空
        </ToolButton>
      </div>
    </div>
  )
}

function ToolButton({
  children,
  icon,
  onClick,
  primary,
  destructive,
}: {
  children: React.ReactNode
  icon: React.ReactNode
  onClick: () => void
  primary?: boolean
  destructive?: boolean
}) {
  const base =
    'flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-colors'
  const variant = primary
    ? 'bg-primary text-primary-foreground hover:opacity-90'
    : destructive
      ? 'border border-border bg-background text-muted-foreground hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive'
      : 'border border-border bg-background text-foreground hover:bg-muted'
  return (
    <button type="button" onClick={onClick} className={`${base} ${variant}`}>
      {icon}
      <span className="hidden sm:inline">{children}</span>
    </button>
  )
}

function Sep() {
  return <div className="mx-1 hidden h-5 w-px bg-border sm:block" />
}
