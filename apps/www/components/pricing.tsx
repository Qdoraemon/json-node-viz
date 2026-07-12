"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Check, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "免费版",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "适合个人开发者日常使用",
    badge: null,
    highlight: false,
    features: [
      "树形视图 & 表格视图",
      "文件大小上限 1MB",
      "基础关键词搜索",
      "PNG 格式导出",
      "深色 / 浅色主题",
      "本地隐私处理",
    ],
    cta: "立即免费使用",
    ctaVariant: "outline" as const,
  },
  {
    name: "专业版",
    monthlyPrice: 29,
    yearlyPrice: 19,
    description: "适合频繁处理 JSON 的工程师",
    badge: "最受欢迎",
    highlight: true,
    features: [
      "包含免费版全部功能",
      "文件大小上限 100MB",
      "思维导图视图",
      "正则 & 路径搜索",
      "一键分享短链接（30天）",
      "PNG / SVG / CSV / YAML 导出",
      "历史记录（最近 100 条）",
      "优先邮件支持",
    ],
    cta: "开始 14 天试用",
    ctaVariant: "default" as const,
  },
  {
    name: "团队版",
    monthlyPrice: 99,
    yearlyPrice: 79,
    description: "适合多人协作的开发团队",
    badge: null,
    highlight: false,
    features: [
      "包含专业版全部功能",
      "无限文件大小",
      "团队协作注释",
      "分享链接永久有效",
      "SSO 单点登录",
      "API 接入（每月 10K 次）",
      "专属客户成功经理",
      "SLA 99.9% 保障",
    ],
    cta: "联系销售",
    ctaVariant: "outline" as const,
  },
]

export function Pricing() {
  const [yearly, setYearly] = useState(false)

  return (
    <section id="pricing" className="py-20 md:py-28 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">定价方案</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            简单透明，按需选择
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-base text-muted-foreground leading-relaxed">
            所有方案均可免费试用，无需绑定信用卡。
          </p>

          {/* Toggle */}
          <div className="mt-7 inline-flex items-center gap-3 rounded-full border border-border bg-card px-2 py-1.5">
            <button
              onClick={() => setYearly(false)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                !yearly
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              月付
            </button>
            <button
              onClick={() => setYearly(true)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-all flex items-center gap-2",
                yearly
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              年付
              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                省 35%
              </span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "relative flex flex-col overflow-hidden border transition-all duration-300",
                plan.highlight
                  ? "border-primary shadow-xl shadow-primary/10 scale-[1.02]"
                  : "border-border hover:border-primary/30 hover:shadow-lg"
              )}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
              )}
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold text-card-foreground">
                    {plan.name}
                  </CardTitle>
                  {plan.badge && (
                    <Badge className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5">
                      <Zap className="size-2.5 mr-1" />
                      {plan.badge}
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-sm text-muted-foreground">
                  {plan.description}
                </CardDescription>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-foreground">
                    ¥{yearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {plan.monthlyPrice === 0 ? "永久免费" : `/ 月`}
                  </span>
                </div>
                {yearly && plan.yearlyPrice > 0 && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    按年付费，原价 ¥{plan.monthlyPrice}/月
                  </p>
                )}
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-2.5">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-sm text-card-foreground">
                      <Check className="size-4 text-primary mt-0.5 shrink-0" strokeWidth={2.5} />
                      {feat}
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-6">
                <Button
                  variant={plan.ctaVariant}
                  className={cn(
                    "w-full",
                    plan.highlight && "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                  )}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          所有方案均支持 14 天无理由退款 · 支持支付宝 / 微信支付 / 信用卡
        </p>
      </div>
    </section>
  )
}
