"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Braces } from "lucide-react"

const navLinks = [
  { label: "产品功能", href: "#features" },
  { label: "对比优势", href: "#comparison" },
  { label: "定价方案", href: "#pricing" },
  { label: "常见问题", href: "#faq" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm group-hover:shadow-md transition-shadow">
            <Braces className="size-4" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            JSON<span className="text-primary">Viz</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3.5 py-2 text-sm font-medium text-muted-foreground rounded-md hover:text-foreground hover:bg-accent transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            登录
          </Button>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm">
            免费开始
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "关闭菜单" : "打开菜单"}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 pb-4 pt-2">
          <nav className="flex flex-col gap-1 mb-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 text-sm font-medium text-muted-foreground rounded-md hover:text-foreground hover:bg-accent transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="w-full justify-center">登录</Button>
            <Button className="w-full justify-center bg-primary text-primary-foreground">免费开始</Button>
          </div>
        </div>
      )}
    </header>
  )
}
