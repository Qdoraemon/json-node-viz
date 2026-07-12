// footer component
import { Separator } from "@/components/ui/separator"
import { Braces, Code2, Globe, MessageSquare } from "lucide-react"

const footerLinks = {
  产品: [
    { label: "功能介绍", href: "#features" },
    { label: "定价方案", href: "#pricing" },
    { label: "更新日志", href: "#" },
    { label: "路线图", href: "#" },
  ],
  开发者: [
    { label: "API 文档", href: "#" },
    { label: "SDK 下载", href: "#" },
    { label: "示例项目", href: "#" },
    { label: "开源地址", href: "#" },
  ],
  公司: [
    { label: "关于我们", href: "#" },
    { label: "博客", href: "#" },
    { label: "联系我们", href: "#" },
    { label: "加入团队", href: "#" },
  ],
  支持: [
    { label: "帮助中心", href: "#" },
    { label: "常见问题", href: "#faq" },
    { label: "隐私政策", href: "#" },
    { label: "服务条款", href: "#" },
  ],
}

const socials = [
  { icon: Code2, label: "GitHub", href: "#" },
  { icon: Globe, label: "Twitter / X", href: "#" },
  { icon: MessageSquare, label: "微信群", href: "#" },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer grid */}
        <div className="py-14 grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-5">
          {/* Brand col */}
          <div className="col-span-2 sm:col-span-3 md:col-span-1 flex flex-col gap-4">
            <a href="#" className="flex items-center gap-2.5 w-fit group">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Braces className="size-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                JSON<span className="text-primary">Viz</span>
              </span>
            </a>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[200px]">
              将复杂 JSON 数据转化为直观可视化视图的开发者工具。
            </p>
            <div className="flex items-center gap-3 mt-1">
              {socials.map((s) => {
                const Icon = s.icon
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                  >
                    <Icon className="size-4" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Link cols */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-foreground">
                {category}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="bg-border" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-6">
          <p className="text-xs text-muted-foreground">
            © 2024 JSONViz. 保留所有权利。
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              隐私政策
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              服务条款
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Cookie 设置
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
