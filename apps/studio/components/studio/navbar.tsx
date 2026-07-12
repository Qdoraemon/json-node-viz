"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import {
  IconBinaryTree2,
  IconMoon,
  IconSun,
  IconBrandGithub,
  IconSparkles,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === "dark"

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Toggle color theme"
          onClick={() => setTheme(isDark ? "light" : "dark")}
        >
          {mounted && isDark ? (
            <IconSun className="size-[18px]" />
          ) : (
            <IconMoon className="size-[18px]" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{isDark ? "Light mode" : "Dark mode"}</TooltipContent>
    </Tooltip>
  )
}

export function Navbar() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-card/60 px-4 backdrop-blur">
      <div className="flex items-center gap-2.5">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <IconBinaryTree2 className="size-5" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-tight">Nodeflow</p>
          <p className="text-[11px] text-muted-foreground">
            JSON Visualization Studio
          </p>
        </div>
      </div>

      <nav className="hidden items-center gap-1 md:flex">
        {["Editor", "Docs", "Pricing", "Changelog"].map((item, idx) => (
          <Button
            key={item}
            variant="ghost"
            size="sm"
            className={idx === 0 ? "text-foreground" : "text-muted-foreground"}
          >
            {item}
          </Button>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="secondary"
          className="hidden gap-1.5 sm:inline-flex"
        >
          <IconSparkles className="size-4 text-primary" />
          Upgrade
        </Button>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" aria-label="GitHub repository">
              <IconBrandGithub className="size-[18px]" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>View source</TooltipContent>
        </Tooltip>
        <ThemeToggle />
      </div>
    </header>
  )
}
