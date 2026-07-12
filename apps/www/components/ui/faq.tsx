import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    q: "JSONViz 是否完全免费？",
    a: "免费版包含树形视图、表格视图、基础搜索等核心功能，永久免费无使用时限。专业版和团队版提供更强大的功能，可免费试用 14 天。",
  },
  {
    q: "我的数据会被上传到服务器吗？",
    a: "绝对不会。JSONViz 的所有解析与渲染均在浏览器本地完成，JSON 数据不会经过我们的服务器。即使是分享功能，也只会上传加密后的数据片段，并在 30 天后自动删除。",
  },
  {
    q: "支持多大的 JSON 文件？",
    a: "免费版支持最大 1MB 的文件，专业版最大 100MB，团队版不限制文件大小。对于超大文件，JSONViz 采用分片懒加载技术，保证流畅无卡顿。",
  },
  {
    q: "可以处理格式不规范的 JSON 吗？",
    a: "可以。JSONViz 内置了自动修复能力，能处理常见的格式问题，如末尾多余逗号、单引号键名等。遇到无法自动修复的问题，会高亮显示具体错误行并给出修复建议。",
  },
  {
    q: "团队版的 API 如何使用？",
    a: "团队版提供 RESTful API，可以通过 HTTP 请求将 JSON 数据发送给 JSONViz，直接获取可视化截图或数据分析结果，方便集成到 CI/CD 流程或内部工具中。",
  },
  {
    q: "支持哪些导出格式？",
    a: "免费版支持 PNG 导出；专业版和团队版额外支持 SVG（矢量图）、CSV（表格数据）和 YAML 格式，满足文档编写、数据迁移等多种场景需求。",
  },
  {
    q: "如何升级或降级套餐？",
    a: "随时可以在账户设置中切换套餐，升级立即生效，降级将在当前计费周期结束后生效，差额部分会折算为账户余额用于下期抵扣。",
  },
  {
    q: "提供发票吗？",
    a: "支持，专业版和团队版用户可在账户中心申请增值税电子普通发票或专用发票，通常 3 个工作日内处理完成。",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="py-20 md:py-28 bg-background">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">常见问题</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            你可能想知道的
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            没找到答案？随时通过
            <a
              href="mailto:support@jsonviz.app"
              className="text-primary hover:underline ml-1"
            >
              support@jsonviz.app
            </a>{" "}
            联系我们。
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="rounded-xl border border-border bg-card px-5 data-[state=open]:border-primary/30 data-[state=open]:bg-primary/3 transition-colors"
            >
              <AccordionTrigger className="py-4 text-left text-sm font-semibold text-card-foreground hover:no-underline hover:text-primary transition-colors">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
