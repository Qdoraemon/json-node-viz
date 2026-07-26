import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  TreeDeciduous,
  Table2,
  Search,
  Share2,
  Zap,
  ShieldCheck,
  Download,
  GitFork,
} from "lucide-react"

const features = [
  {
    icon: TreeDeciduous,
    title: "树形可视化",
    description: "将嵌套 JSON 渲染为交互式树形结构，点击展开/折叠任意节点，层级关系一目了然。",
    highlight: false,
  },
  {
    icon: Table2,
    title: "表格视图",
    description: "自动将数组对象转换为标准表格，支持列排序与筛选，方便横向比较数据字段。",
    highlight: false,
  },
  {
    icon: Search,
    title: "全局搜索",
    description: "在数千行 JSON 中即时定位键值，支持正则表达式与路径匹配，快速聚焦目标节点。",
    highlight: true,
  },
  {
    icon: GitFork,
    title: "思维导图",
    description: "自动生成思维导图布局，结构化展示层级关系，让复杂配置文件变得直观可读。",
    highlight: false,
  },
  {
    icon: Zap,
    title: "实时解析",
    description: "输入即渲染，解析速度 < 10ms，支持超大 JSON 文件分片懒加载，无卡顿体验。",
    highlight: false,
  },
  {
    icon: Share2,
    title: "一键分享",
    description: "生成唯一短链接，将可视化结果分享给团队成员，无需对方安装任何工具。",
    highlight: false,
  },
  {
    icon: Download,
    title: "多格式导出",
    description: "支持导出为 PNG、SVG、CSV 与 YAML 格式，轻松嵌入文档或直接用于项目配置。",
    highlight: false,
  },
  {
    icon: ShieldCheck,
    title: "本地安全处理",
    description: "所有数据仅在浏览器本地处理，不上传服务器，企业级敏感数据安全无忧。",
    highlight: false,
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 md:py-28 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">核心功能</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            专为开发者打造的每一项功能
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-base text-muted-foreground leading-relaxed text-pretty">
            从原始 JSON 到清晰视图，JSONViz 提供你真正需要的工具链，而不是功能堆砌。
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feat) => {
            const Icon = feat.icon
            return (
              <Card
                key={feat.title}
                className={`group relative overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  feat.highlight
                    ? "border-primary/40 bg-primary/5 shadow-md"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                {feat.highlight && (
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />
                )}
                <CardHeader className="pb-2">
                  <div
                    className={`mb-3 flex size-10 items-center justify-center rounded-xl transition-colors ${
                      feat.highlight
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent text-accent-foreground group-hover:bg-primary group-hover:text-primary-foreground"
                    }`}
                  >
                    <Icon className="size-5" />
                  </div>
                  <CardTitle className="text-base font-semibold text-card-foreground">
                    {feat.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                    {feat.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
