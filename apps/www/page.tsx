// Modified 2026-07-12, based on JSON Crack Apache 2.0
import Link from "next/link"

const navItems = [
  { label: "Features", href: "#features" },
  { label: "Compare", href: "#comparison" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
]

const featureItems = [
  { title: "Interactive Tree View", text: "Expand nested JSON into collapsible node graphs for instant structure clarity." },
  { title: "Table View", text: "Auto-detect arrays into sortable tables for quick filtering and side-by-side comparison." },
  { title: "Full-Text Search", text: "Keyword and path-based search with instant jump-to-node navigation.", hot: true },
  { title: "Mind Map", text: "Visualize structural relationships in a mind-map layout — great for walkthroughs and reviews." },
  { title: "Real-Time Parsing", text: "Parse and render on every keystroke with sub-10ms latency." },
  { title: "One-Click Share", text: "Generate shareable links so your team stays in sync instantly." },
  { title: "Multi-Format Export", text: "Export to PNG, SVG, CSV, YAML and more." },
  { title: "Local-First Security", text: "All processing stays in your browser — your data never leaves your device." },
]

const compareRows = [
  { name: "Visualization", ours: "Tree + Graph", a: "Tree only", b: "Formatted text", c: "Debug view" },
  { name: "Search & Navigation", ours: "Keyword + Path", a: "Keyword", b: "Limited", c: "Keyword" },
  { name: "Large File Handling", ours: "Optimized", a: "Average", b: "Weak", c: "Average" },
  { name: "Export Options", ours: "PNG/SVG/CSV", a: "PNG", b: "None", c: "PNG" },
  { name: "Data Processing", ours: "Local-first", a: "Mixed", b: "Server-side", c: "Mixed" },
  { name: "Learning Curve", ours: "Low", a: "Medium", b: "Low", c: "Medium" },
]

const pricing = [
  {
    name: "Free",
    price: "Free",
    note: "For individuals and light use",
    list: ["Basic visualization", "Keyword search", "PNG export", "Local privacy processing"],
    cta: "Get started free",
    href: "/editor",
    featured: false,
  },
  {
    name: "Pro",
    price: "$29",
    note: "For heavy JSON workflows & collaboration",
    list: ["Everything in Free", "Advanced search", "More export formats", "History & sharing"],
    cta: "Start 14-day trial",
    href: "/editor",
    featured: true,
  },
  {
    name: "Team",
    price: "$99",
    note: "For teams & organizations",
    list: ["Everything in Pro", "Collaboration governance", "Higher quotas", "Priority support"],
    cta: "View docs",
    href: "/docs",
    featured: false,
  },
]

const faqs = [
  ["Do I need an account?", "No — jump straight into the editor and start using core features instantly."],
  ["Is my JSON data uploaded?", "All processing is local by default. Your raw data never leaves your browser."],
  ["How large a JSON file can I work with?", "Handles medium-to-large payloads smoothly. Try it in the editor to see how it scales."],
  ["What export formats are supported?", "PNG, SVG, CSV, and YAML are supported out of the box."],
  ["Where can I find docs or integration guides?", "Head to the Docs page for detailed usage and integration guides."],
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
              Sign in
            </Link>
            <Link href="/editor" className="rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground hover:opacity-90">
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-24 pt-12 sm:px-6 lg:grid-cols-2 lg:items-center lg:pt-16">
          <div>
            <p className="inline-flex rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
              New v2.0 release
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Make JSON data
              <span className="block text-primary">crystal clear</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              From raw JSON to structured visualization in seconds. Lightweight, fast, and built for everyday debugging and communication.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Link href="/editor" className="rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90">
                Start using now
              </Link>
              <Link href="/docs" className="rounded-md border border-border bg-card px-4 py-2 text-xs font-semibold hover:bg-accent">
                View docs
              </Link>
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground">No sign-up · Free to use · 50K+ monthly users</p>
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
              <span>4 nodes · 2 levels deep</span>
              <span className="text-primary">Live parsing</span>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Core Features</p>
            <h2 className="mt-2 text-3xl font-bold">Every feature built for developers</h2>
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
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Compare</p>
            <h2 className="mt-2 text-3xl font-bold">Why JSONViz?</h2>
          </div>
          <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full min-w-[760px] text-xs">
              <thead>
                <tr className="bg-muted/45 text-left">
                  <th className="px-4 py-3 font-semibold">Capability</th>
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
              ["50K+", "Active users"],
              ["<10ms", "Avg. response"],
              ["99.9%", "Uptime"],
              ["0 uploads", "Local processing"],
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
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Pricing</p>
            <h2 className="mt-2 text-3xl font-bold">Simple, transparent, pick what fits</h2>
            <div className="mt-4 inline-flex rounded-full border border-border bg-card p-1 text-[11px]">
              <span className="rounded-full bg-primary px-3 py-1 font-semibold text-primary-foreground">Monthly</span>
              <span className="px-3 py-1 text-muted-foreground">Annual — save 35%</span>
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
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">FAQ</p>
            <h2 className="mt-2 text-3xl font-bold">What you might be wondering</h2>
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
              <p className="mt-2 max-w-sm text-muted-foreground">A developer tool that turns complex JSON data into clear, interactive visualizations.</p>
            </div>
            <div>
              <p className="font-semibold">Product</p>
              <div className="mt-2 space-y-1.5 text-muted-foreground">
                <Link href="/editor" className="block hover:text-foreground">Editor</Link>
                <Link href="/docs" className="block hover:text-foreground">Docs</Link>
                <a href="#pricing" className="block hover:text-foreground">Pricing</a>
              </div>
            </div>
            <div>
              <p className="font-semibold">Legal</p>
              <div className="mt-2 space-y-1.5 text-muted-foreground">
                <Link href="/legal/privacy" className="block hover:text-foreground">Privacy</Link>
                <Link href="/legal/terms" className="block hover:text-foreground">Terms</Link>
              </div>
            </div>
            <div>
              <p className="font-semibold">Contact</p>
              <a href="mailto:hello@jsonviz.dev" className="mt-2 block text-muted-foreground hover:text-foreground">hello@jsonviz.dev</a>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-2 border-t border-border pt-4 text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} JsonViz. Built from open-source foundations. Licensed under Apache 2.0.</p>
            <div className="flex gap-3">
              <Link href="/legal/privacy" className="hover:text-foreground">Privacy Policy</Link>
              <Link href="/legal/terms" className="hover:text-foreground">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
