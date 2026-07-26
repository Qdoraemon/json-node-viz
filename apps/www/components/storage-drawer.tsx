'use client'

import {
  IconX,
  IconFileTypeJs,
  IconTrash,
  IconDeviceFloppy,
  IconClockHour4,
  IconFolderOpen,
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'

export type StoredFile = {
  id: string
  name: string
  size: number
  updatedAt: number
  content: string
}

type Props = {
  open: boolean
  onClose: () => void
  files: StoredFile[]
  activeId: string | null
  onOpenFile: (file: StoredFile) => void
  onDeleteFile: (id: string) => void
  onSaveCurrent: () => void
}

export function StorageDrawer({
  open,
  onClose,
  files,
  activeId,
  onOpenFile,
  onDeleteFile,
  onSaveCurrent,
}: Props) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-40 bg-foreground/10 backdrop-blur-[2px] transition-opacity',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      <aside
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full w-80 flex-col border-l border-border bg-card transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <IconFolderOpen size={18} className="text-primary" />
            <h2 className="text-sm font-semibold text-foreground">文件存储</h2>
          </div>
          <button
            type="button"
            aria-label="关闭"
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <IconX size={18} />
          </button>
        </header>

        <div className="border-b border-border p-4">
          <button
            type="button"
            onClick={onSaveCurrent}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <IconDeviceFloppy size={16} />
            保存当前 JSON
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          {files.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
              <div className="rounded-2xl bg-muted p-4">
                <IconFileTypeJs size={26} className="text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">暂无已保存文件</p>
              <p className="text-xs text-muted-foreground">
                保存当前 JSON 后会显示在这里，数据存储于本地浏览器。
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {files.map((file) => (
                <li key={file.id}>
                  <div
                    className={cn(
                      'group flex items-center gap-3 rounded-2xl border p-3 transition-colors',
                      activeId === file.id
                        ? 'border-primary/50 bg-primary/10'
                        : 'border-border bg-background hover:bg-muted',
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => onOpenFile(file)}
                      className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    >
                      <div className="rounded-xl bg-chart-1/15 p-2 text-chart-1">
                        <IconFileTypeJs size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {file.name}
                        </p>
                        <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <IconClockHour4 size={11} />
                          {formatTime(file.updatedAt)} · {formatSize(file.size)}
                        </p>
                      </div>
                    </button>
                    <button
                      type="button"
                      aria-label="删除文件"
                      onClick={() => onDeleteFile(file.id)}
                      className="rounded-lg p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                    >
                      <IconTrash size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  )
}

function formatTime(ts: number) {
  const d = new Date(ts)
  return d.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  return `${(bytes / 1024).toFixed(1)} KB`
}
