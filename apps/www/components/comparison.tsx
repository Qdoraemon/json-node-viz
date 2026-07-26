import { Check, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const features = [
  "实时树形可视化",
  "思维导图视图",
  "全局关键词搜索",
  "正则路径匹配",
  "一键分享短链接",
  "多格式导出（PNG/SVG/CSV）",
  "本地隐私处理，不上传服务器",
  "超大文件懒加载（>10MB）",
  "深色模式",
  "团队协作注释",
]

const tools = [
  {
    name: "JSONViz",
    badge: "推荐",
    values: [true, true, true, true, true, true, true, true, true, true],
    highlight: true,
  },
  {
    name: "JSON Editor Online",
    values: [true, false, true, false, false, true, false, false, true, false],
    highlight: false,
  },
  {
    name: "jsonformatter.org",
    values: [true, false, false, false, false, false, false, false, false, false],
    highlight: false,
  },
  {
    name: "Postman",
    values: [true, false, true, false, false, false, false, true, true, true],
    highlight: false,
  },
]

export function Comparison() {
  return (
    <section id="comparison" className="py-20 md:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">对比优势</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            为什么选择 JSONViz？
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-base text-muted-foreground leading-relaxed">
            与同类工具全面对比，看看 JSONViz 为你带来哪些差异化优势。
          </p>
        </div>

        {/* Table wrapper */}
        <div className="overflow-x-auto rounded-2xl border border-border shadow-sm">
          <table className="w-full min-w-[700px] border-collapse text-sm">
            {/* Head */}
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left py-4 px-5 font-semibold text-foreground w-1/3">功能特性</th>
                {tools.map((tool) => (
                  <th key={tool.name} className="py-4 px-4 text-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <span
                        className={`text-sm font-bold ${
                          tool.highlight ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {tool.name}
                      </span>
                      {tool.badge && (
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] px-2 py-0">
                          {tool.badge}
                        </Badge>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {features.map((feat, fi) => (
                <tr
                  key={feat}
                  className={`border-t border-border transition-colors hover:bg-muted/30 ${
                    fi % 2 === 0 ? "bg-card" : "bg-muted/10"
                  }`}
                >
                  <td className="py-3.5 px-5 font-medium text-foreground">{feat}</td>
                  {tools.map((tool) => (
                    <td key={tool.name} className="py-3.5 px-4 text-center">
                      {tool.values[fi] ? (
                        <span className="inline-flex items-center justify-center size-6 rounded-full bg-primary/12 mx-auto">
                          <Check className="size-3.5 text-primary" strokeWidth={2.5} />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center size-6 rounded-full bg-muted mx-auto">
                          <X className="size-3.5 text-muted-foreground/50" strokeWidth={2} />
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom stat row */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-5">
          {[
            { value: "50K+", label: "月活跃用户" },
            { value: "< 10ms", label: "平均解析速度" },
            { value: "99.9%", label: "服务可用率" },
            { value: "0 上传", label: "数据完全本地" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-5 text-center hover:border-primary/30 transition-colors"
            >
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
