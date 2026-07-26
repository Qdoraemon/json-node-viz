import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Play, Sparkles } from "lucide-react"

const JSON_DEMO = `{
  "user": {
    "id": 1024,
    "name": "张三",
    "role": "developer",
    "skills": [
      "TypeScript",
      "React",
      "Node.js"
    ],
    "active": true
  }
}`

const TREE_LINES = [
  { indent: 0, key: "user", type: "object", connector: "" },
  { indent: 1, key: "id", value: "1024", type: "number", connector: "├─" },
  { indent: 1, key: "name", value: '"张三"', type: "string", connector: "├─" },
  { indent: 1, key: "role", value: '"developer"', type: "string", connector: "├─" },
  { indent: 1, key: "skills", type: "array", connector: "├─" },
  { indent: 2, key: "0", value: '"TypeScript"', type: "string", connector: "├─" },
  { indent: 2, key: "1", value: '"React"', type: "string", connector: "├─" },
  { indent: 2, key: "2", value: '"Node.js"', type: "string", connector: "└─" },
  { indent: 1, key: "active", value: "true", type: "boolean", connector: "└─" },
]

const typeColors: Record<string, string> = {
  object: "text-amber-400",
  array: "text-violet-400",
  string: "text-emerald-400",
  number: "text-sky-400",
  boolean: "text-rose-400",
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.51 0.145 196) 1px, transparent 1px), linear-gradient(90deg, oklch(0.51 0.145 196) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Teal glow top-right */}
      <div className="pointer-events-none absolute -right-32 -top-32 size-[600px] rounded-full bg-primary/8 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 size-[400px] rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-16 lg:flex-row lg:items-center lg:gap-12">
          {/* Left: copy */}
          <div className="flex-1 text-center lg:text-left">
            <div className="mb-5 inline-flex">
              <Badge className="gap-1.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 px-3 py-1 text-xs font-medium">
                <Sparkles className="size-3" />
                全新 v2.0 发布
              </Badge>
            </div>

            <h1 className="mb-5 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl text-balance">
              让 JSON 数据
              <br />
              <span className="text-primary">一目了然</span>
            </h1>

            <p className="mb-8 max-w-xl mx-auto lg:mx-0 text-base leading-relaxed text-muted-foreground sm:text-lg text-pretty">
              JSONViz 将复杂嵌套的 JSON 数据即时转化为树形图、表格与思维导图视图，支持搜索、过滤与导出，让每一位开发者都能高效处理数据。
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg transition-all gap-2 px-7"
              >
                免费开始使用
                <ArrowRight className="size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border hover:bg-accent gap-2 px-7"
              >
                <Play className="size-4 fill-current" />
                观看演示
              </Button>
            </div>

            <p className="mt-5 text-xs text-muted-foreground">
              无需注册 · 免费使用 · 每月活跃用户 <span className="font-semibold text-foreground">50,000+</span>
            </p>
          </div>

          {/* Right: code preview */}
          <div className="flex-1 w-full max-w-2xl lg:max-w-none">
            <div className="rounded-2xl overflow-hidden border border-border shadow-2xl">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/60 border-b border-border">
                <span className="size-3 rounded-full bg-rose-400" />
                <span className="size-3 rounded-full bg-amber-400" />
                <span className="size-3 rounded-full bg-emerald-400" />
                <span className="ml-3 text-xs font-medium text-muted-foreground font-mono">
                  data.json — JSONViz
                </span>
              </div>

              {/* Split pane */}
              <div className="grid grid-cols-1 sm:grid-cols-2 min-h-[320px]">
                {/* Raw JSON */}
                <div className="bg-[oklch(0.12_0.02_200)] p-4 border-b sm:border-b-0 sm:border-r border-[oklch(0.22_0.03_200)]">
                  <p className="text-[10px] font-mono text-muted-foreground mb-3 uppercase tracking-widest">原始 JSON</p>
                  <pre className="text-xs font-mono leading-5 text-emerald-300 overflow-auto">
                    {JSON_DEMO}
                  </pre>
                </div>

                {/* Tree view */}
                <div className="bg-[oklch(0.10_0.018_202)] p-4">
                  <p className="text-[10px] font-mono text-muted-foreground mb-3 uppercase tracking-widest">树形视图</p>
                  <div className="space-y-1 font-mono text-xs">
                    {TREE_LINES.map((line, i) => (
                      <div
                        key={i}
                        className="flex items-baseline gap-1.5"
                        style={{ paddingLeft: `${line.indent * 16}px` }}
                      >
                        {line.connector && (
                          <span className="text-muted-foreground/50 select-none">{line.connector}</span>
                        )}
                        <span className="text-sky-300">{line.key}</span>
                        {line.value ? (
                          <>
                            <span className="text-muted-foreground/40">:</span>
                            <span className={typeColors[line.type] ?? "text-foreground"}>
                              {line.value}
                            </span>
                          </>
                        ) : (
                          <span className={`${typeColors[line.type]} opacity-70 text-[10px]`}>
                            {line.type === "array" ? "[ ]" : "{ }"}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status bar */}
              <div className="flex items-center justify-between px-4 py-2 bg-muted/40 border-t border-border">
                <span className="text-[10px] font-mono text-muted-foreground">9 个节点 · 1 层嵌套</span>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-primary">
                  <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                  实时解析
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
