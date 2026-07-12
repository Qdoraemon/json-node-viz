// Modified 2026-07-12, based on JSON Crack Apache 2.0
import Link from "next/link"

const navItems = [
  { label: "产品功能", href: "#features" },
  { label: "对比优势", href: "#comparison" },
  { label: "定价方案", href: "#pricing" },
  { label: "常见问题", href: "#faq" },
]

const featureItems = [
  { title: "树形可视化", text: "把层级 JSON 转成可展开节点图，路径与字段一眼看清。" },
  { title: "表格视图", text: "自动识别数组结构，快速筛选和横向对比数据差异。" },
  { title: "全文搜索", text: "支持关键词与路径定位，复杂对象也能秒级跳转。", hot: true },
  { title: "思维导图", text: "以导图方式展示结构关系，适合方案讲解和评审。" },
  { title: "实时解析", text: "输入即渲染，保持低延迟交互，调试更顺畅。" },
  { title: "一键分享", text: "生成可共享链接，团队协作时同步上下文更高效。" },
  { title: "多格式导出", text: "支持 PNG、SVG、CSV、YAML 等导出格式。" },
  { title: "本地安全", text: "核心处理在浏览器完成，减少敏感数据外泄风险。" },
]

const compareRows = [
  { name: "可视化方式", ours: "树图 + 结构图", a: "单树图", b: "格式化文本", c: "调试型" },
  { name: "搜索与定位", ours: "关键词 + 路径", a: "关键词", b: "有限", c: "关键词" },
  { name: "大文件处理", ours: "优化", a: "一般", b: "弱", c: "一般" },
  { name: "导出能力", ours: "PNG/SVG/CSV", a: "PNG", b: "无", c: "PNG" },
  { name: "数据处理方式", ours: "本地优先", a: "混合", b: "在线", c: "混合" },
  { name: "上手成本", ours: "低", a: "中", b: "低", c: "中" },
]

const pricing = [
  {
    name: "免费版",
    price: "¥0",
    note: "适合入门和轻量使用",
    list: ["基础可视化", "关键词搜索", "PNG 导出", "本地隐私处理"],
    cta: "立即免费使用",
    href: "/editor",
    featured: false,
  },
  {
    name: "专业版",
    price: "¥29",
    note: "适合高频调试与协作",
    list: ["包含免费版功能", "高级搜索", "多格式导出", "历史记录与分享"],
    cta: "开始 14 天试用",
    href: "/editor",
    featured: true,
  },
  {
    name: "团队版",
    price: "¥99",
    note: "适合多人团队流程",
    list: ["包含专业版功能", "协作治理", "更高配额", "优先支持"],
    cta: "查看文档",
    href: "/docs",
    featured: false,
  },
]

const faqs = [
  ["JSONViz 需要注册吗？", "可直接进入编辑器体验核心功能。"],
  ["会上传我的 JSON 数据吗？", "默认本地处理，不强制上传原始数据。"],
  ["支持多大 JSON 文件？", "支持中大型结构，具体能力可在编辑器中测试。"],
  ["可以导出哪些格式？", "支持 PNG、SVG、CSV、YAML 等常用格式。"],
  ["有文档或集成说明吗？", "可在 Docs 页面查看详细接入说明。"],
]

export default function Page() {
  return (
    <div className="min-h-screen bg-[oklch(0.965_0.01_190)] text-foreground">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(rgba(14,116,120,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(14,116,120,0.05) 1px, transparent 1px)",
          backgroundSize: "38px 38px",
        }}
      />

      <header className="sticky top-0 z-50 border-b border-border/60 bg-[oklch(0.975_0.01_190/.88)] backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary text-[10px] font-bold text-primary-foreground">
              J
            </span>
            JSONViz
          </Link>

          <nav className="hidden items-center gap-5 md:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="text-xs text-muted-foreground transition-colors hover:text-foreground">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/editor" className="hidden rounded-md px-2.5 py-1 text-xs text-muted-foreground hover:bg-accent sm:inline-flex">
              登录
            </Link>
            <Link href="/editor" className="rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground hover:opacity-90">
              开始使用
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-24 pt-12 sm:px-6 lg:grid-cols-2 lg:items-center lg:pt-16">
          <div>
            <p className="inline-flex rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
              全新 v2.0 发布
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              让 JSON 数据
              <span className="block text-primary">一目了然</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              从粘贴原始 JSON 到结构可视化，只需几秒。更轻、更快、更适合开发者日常排查和沟通。
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Link href="/editor" className="rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90">
                立即开始使用
              </Link>
              <Link href="/docs" className="rounded-md border border-border bg-card px-4 py-2 text-xs font-semibold hover:bg-accent">
                查看文档
              </Link>
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground">无需注册 · 免费使用 · 月活 50K+</p>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[0_20px_45px_-30px_rgba(2,132,199,.35)]">
            <div className="flex items-center gap-1.5 border-b border-border bg-muted/40 px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-rose-400" />
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="ml-2 text-[10px] text-muted-foreground">data.json - JSONViz</span>
            </div>
            <div className="grid min-h-[230px] sm:grid-cols-2">
              <pre className="overflow-auto border-b border-border bg-[oklch(0.13_0.02_205)] p-3 text-[11px] leading-5 text-[oklch(0.84_0.08_165)] sm:border-b-0 sm:border-r">{`{
  "user": {
    "id": 1024,
    "name": "jsonviz",
    "active": true
  }
}`}</pre>
              <div className="space-y-1.5 bg-[oklch(0.11_0.02_202)] p-3 text-[11px]">
                <p className="text-sky-300">user</p>
                <p className="pl-3 text-emerald-300">id: <span className="text-sky-300">1024</span></p>
                <p className="pl-3 text-emerald-300">name: <span className="text-cyan-100">jsonviz</span></p>
                <p className="pl-3 text-emerald-300">active: <span className="text-emerald-400">true</span></p>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-border bg-muted/30 px-3 py-1.5 text-[10px] text-muted-foreground">
              <span>4 个节点 · 2 层嵌套</span>
              <span className="text-primary">实时解析</span>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">核心能力</p>
            <h2 className="mt-2 text-3xl font-bold">专为开发者打造的每一项功能</h2>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {featureItems.map((item) => (
              <article
                key={item.title}
                className={[
                  "rounded-xl border p-4",
                  item.hot
                    ? "border-primary/45 bg-primary/5 shadow-[0_0_0_1px_rgba(20,184,166,.1)]"
                    : "border-border bg-card",
                ].join(" ")}
              >
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="comparison" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">对比优势</p>
            <h2 className="mt-2 text-3xl font-bold">为什么选择 JSONViz?</h2>
          </div>
          <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full min-w-[760px] text-xs">
              <thead>
                <tr className="bg-muted/45 text-left">
                  <th className="px-4 py-3 font-semibold">能力项</th>
                  <th className="px-4 py-3 font-semibold text-primary">JSONViz</th>
                  <th className="px-4 py-3 font-semibold">JSON Editor Online</th>
                  <th className="px-4 py-3 font-semibold">jsonformatter.org</th>
                  <th className="px-4 py-3 font-semibold">Postman</th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row, idx) => (
                  <tr key={row.name} className={idx % 2 === 0 ? "bg-background/70" : "bg-muted/20"}>
                    <td className="border-t border-border px-4 py-2.5 font-medium">{row.name}</td>
                    <td className="border-t border-border px-4 py-2.5 text-primary">{row.ours}</td>
                    <td className="border-t border-border px-4 py-2.5 text-muted-foreground">{row.a}</td>
                    <td className="border-t border-border px-4 py-2.5 text-muted-foreground">{row.b}</td>
                    <td className="border-t border-border px-4 py-2.5 text-muted-foreground">{row.c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["50K+", "活跃用户"],
              ["<10ms", "平均响应"],
              ["99.9%", "稳定性"],
              ["0 上传", "本地处理"],
            ].map(([v, l]) => (
              <div key={l} className="rounded-lg border border-border bg-card px-3 py-3 text-center">
                <p className="text-lg font-bold text-primary">{v}</p>
                <p className="text-[11px] text-muted-foreground">{l}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">定价方案</p>
            <h2 className="mt-2 text-3xl font-bold">简单透明，按需选择</h2>
            <div className="mt-4 inline-flex rounded-full border border-border bg-card p-1 text-[11px]">
              <span className="rounded-full bg-primary px-3 py-1 font-semibold text-primary-foreground">月付</span>
              <span className="px-3 py-1 text-muted-foreground">年付 省 35%</span>
            </div>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {pricing.map((plan) => (
              <article
                key={plan.name}
                className={[
                  "rounded-xl border bg-card p-5",
                  plan.featured ? "border-primary shadow-[0_15px_40px_-25px_rgba(13,148,136,.7)]" : "border-border",
                ].join(" ")}
              >
                <h3 className="text-sm font-semibold">{plan.name}</h3>
                <p className="mt-1 text-3xl font-bold text-foreground">{plan.price}</p>
                <p className="mt-1 text-xs text-muted-foreground">{plan.note}</p>
                <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                  {plan.list.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={[
                    "mt-5 inline-flex w-full items-center justify-center rounded-md px-3 py-2 text-xs font-semibold",
                    plan.featured ? "bg-primary text-primary-foreground" : "border border-border hover:bg-accent",
                  ].join(" ")}
                >
                  {plan.cta}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">常见问题</p>
            <h2 className="mt-2 text-3xl font-bold">你可能想知道的</h2>
          </div>
          <div className="mt-7 space-y-2.5">
            {faqs.map(([q, a]) => (
              <details key={q} className="rounded-lg border border-border bg-card px-4 py-3">
                <summary className="cursor-pointer list-none text-sm font-medium">{q}</summary>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-[oklch(0.97_0.01_190)]">
        <div className="mx-auto max-w-6xl px-4 py-10 text-xs sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <p className="text-sm font-semibold">JSONViz</p>
              <p className="mt-2 max-w-sm text-muted-foreground">将复杂 JSON 数据转化为直观可视化视图的开发者工具。</p>
            </div>
            <div>
              <p className="font-semibold">产品</p>
              <div className="mt-2 space-y-1.5 text-muted-foreground">
                <Link href="/editor" className="block hover:text-foreground">Editor</Link>
                <Link href="/docs" className="block hover:text-foreground">Docs</Link>
                <a href="#pricing" className="block hover:text-foreground">Pricing</a>
              </div>
            </div>
            <div>
              <p className="font-semibold">法律</p>
              <div className="mt-2 space-y-1.5 text-muted-foreground">
                <Link href="/legal/privacy" className="block hover:text-foreground">Privacy</Link>
                <Link href="/legal/terms" className="block hover:text-foreground">Terms</Link>
              </div>
            </div>
            <div>
              <p className="font-semibold">联系</p>
              <a href="mailto:hello@jsonviz.dev" className="mt-2 block text-muted-foreground hover:text-foreground">hello@jsonviz.dev</a>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-2 border-t border-border pt-4 text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} JsonViz. Built from open-source foundations. Licensed under Apache 2.0.</p>
            <div className="flex gap-3">
              <Link href="/legal/privacy" className="hover:text-foreground">隐私政策</Link>
              <Link href="/legal/terms" className="hover:text-foreground">服务条款</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
