// Modified 2026-07-12, based on JSON Crack Apache 2.0
import React, { useEffect, useState } from "react";
import type { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { generateNextSeo } from "next-seo/pages";
import { SEO } from "../constants/seo";
import styled from "styled-components";
import { AuthModal } from "../components/AuthModal";
import { getCurrentUser, logout, type AuthUser } from "../lib/auth";

const PageRoot = styled.main`
  min-height: 100vh;
  color: #0f172a;
  background:
    linear-gradient(rgba(20, 184, 166, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(20, 184, 166, 0.06) 1px, transparent 1px),
    linear-gradient(180deg, #eff7f7 0%, #edf6f6 45%, #eef7f7 100%);
  background-size: 38px 38px, 38px 38px, auto;
`;

const Wrap = styled.div`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 16px;
`;

const TopBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(239, 247, 247, 0.88);
  backdrop-filter: blur(6px);
`;

const TopBarInner = styled.div`
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Brand = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: inline-flex;
  gap: 8px;
  align-items: center;
  font-size: 13px;
  font-weight: 700;
`;

const BrandDot = styled.span`
  width: 20px;
  height: 20px;
  border-radius: 6px;
  background: #0f766e;
  color: white;
  font-size: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const Nav = styled.nav`
  display: none;
  align-items: center;
  gap: 20px;

  a {
    text-decoration: none;
    color: #475569;
    font-size: 12px;
  }

  a:hover {
    color: #0f172a;
  }

  @media (min-width: 880px) {
    display: inline-flex;
  }
`;

const RightActions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const TextBtn = styled(Link)`
  text-decoration: none;
  color: #475569;
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 8px;

  &:hover {
    background: rgba(15, 23, 42, 0.05);
    color: #0f172a;
  }
`;

const PrimaryBtn = styled(Link)`
  text-decoration: none;
  border-radius: 8px;
  border: 1px solid #0f766e;
  background: #0f766e;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 10px;
`;

const ActionButton = styled.button<{ $primary?: boolean }>`
  appearance: none;
  border-radius: 8px;
  border: 1px solid ${(p) => (p.$primary ? "#0f766e" : "transparent")};
  background: ${(p) => (p.$primary ? "#0f766e" : "transparent")};
  color: ${(p) => (p.$primary ? "#ffffff" : "#475569")};
  font-size: 12px;
  font-weight: ${(p) => (p.$primary ? 700 : 400)};
  padding: ${(p) => (p.$primary ? "6px 10px" : "6px 10px")};
  cursor: pointer;

  &:hover {
    background: ${(p) => (p.$primary ? "#0d6b63" : "rgba(15, 23, 42, 0.05)")};
    color: ${(p) => (p.$primary ? "#ffffff" : "#0f172a")};
  }
`;

const InlineUser = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #475569;
  font-size: 12px;
`;

const Hero = styled.section`
  padding: 34px 0 56px;
`;

const HeroGrid = styled.div`
  display: grid;
  gap: 24px;

  @media (min-width: 980px) {
    grid-template-columns: 1fr 1fr;
    align-items: center;
  }
`;

const HeroBadge = styled.span`
  display: inline-flex;
  align-items: center;
  border: 1px solid rgba(13, 148, 136, 0.2);
  background: rgba(13, 148, 136, 0.1);
  color: #0f766e;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
`;

const HeroTitle = styled.h1`
  margin: 12px 0 10px;
  font-size: clamp(34px, 6vw, 56px);
  line-height: 0.95;
  letter-spacing: -0.03em;
`;

const HeroSub = styled.p`
  margin: 0;
  color: #4b5563;
  font-size: 13px;
  line-height: 1.75;
  max-width: 540px;
`;

const HeroButtons = styled.div`
  margin-top: 12px;
  display: inline-flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const SecondaryBtn = styled(Link)`
  text-decoration: none;
  border-radius: 8px;
  border: 1px solid rgba(15, 23, 42, 0.15);
  background: rgba(255, 255, 255, 0.76);
  color: #0f172a;
  font-size: 12px;
  font-weight: 700;
  padding: 8px 12px;
`;

const HeroMeta = styled.p`
  margin: 10px 0 0;
  color: #6b7280;
  font-size: 11px;
`;

const PreviewCard = styled.div`
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: #f8fbfb;
  box-shadow: 0 22px 40px -28px rgba(15, 23, 42, 0.48);
`;

const WindowBar = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  border-bottom: 1px solid rgba(15, 23, 42, 0.12);
  background: rgba(255, 255, 255, 0.8);
  padding: 8px 10px;

  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
  }

  span:nth-child(1) {
    background: #fb7185;
  }

  span:nth-child(2) {
    background: #facc15;
  }

  span:nth-child(3) {
    background: #4ade80;
  }

  em {
    margin-left: 8px;
    color: #6b7280;
    font-size: 10px;
    font-style: normal;
  }
`;

const PreviewGrid = styled.div`
  display: grid;
  min-height: 260px;

  @media (min-width: 620px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const RawPane = styled.pre`
  margin: 0;
  padding: 14px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: #04131a;
  color: #7dd3fc;
  font-size: 11px;
  line-height: 1.5;
  overflow: auto;
`;

const TreePane = styled.div`
  margin: 0;
  padding: 14px;
  background: #05161c;
  color: #93c5fd;
  font-size: 11px;
  line-height: 1.7;
`;

const Section = styled.section`
  padding: 56px 0;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 22px;

  h2 {
    margin: 8px 0 0;
    font-size: clamp(26px, 4.2vw, 38px);
    line-height: 1.1;
  }

  p {
    margin: 8px auto 0;
    max-width: 680px;
    color: #64748b;
    font-size: 13px;
  }
`;

const SmallTag = styled.span`
  display: inline-block;
  color: #0f766e;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
`;

const FeatureGrid = styled.div`
  display: grid;
  gap: 10px;

  @media (min-width: 620px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: 980px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const FeatureCard = styled.article<{ $active?: boolean }>`
  border-radius: 10px;
  border: 1px solid ${(p) => (p.$active ? "rgba(13, 148, 136, 0.4)" : "rgba(15, 23, 42, 0.12)")};
  background: ${(p) => (p.$active ? "rgba(13, 148, 136, 0.08)" : "rgba(255, 255, 255, 0.72)")};
  padding: 12px;

  h3 {
    margin: 0;
    font-size: 14px;
  }

  p {
    margin: 6px 0 0;
    color: #64748b;
    font-size: 12px;
    line-height: 1.6;
  }
`;

const TableWrap = styled.div`
  overflow-x: auto;
  border: 1px solid rgba(15, 23, 42, 0.12);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.76);
`;

const CompareTable = styled.table`
  width: 100%;
  min-width: 760px;
  border-collapse: collapse;

  th,
  td {
    border-top: 1px solid rgba(15, 23, 42, 0.08);
    font-size: 12px;
    text-align: left;
    padding: 10px 12px;
  }

  thead th {
    border-top: none;
    font-size: 11px;
    color: #334155;
    background: rgba(15, 23, 42, 0.04);
  }

  tbody tr:nth-child(2n) {
    background: rgba(15, 23, 42, 0.02);
  }
`;

const Stats = styled.div`
  margin-top: 10px;
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media (min-width: 720px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const StatItem = styled.div`
  border-radius: 9px;
  border: 1px solid rgba(15, 23, 42, 0.1);
  background: rgba(255, 255, 255, 0.75);
  text-align: center;
  padding: 10px;

  strong {
    display: block;
    color: #0f766e;
    font-size: 18px;
  }

  span {
    color: #64748b;
    font-size: 11px;
  }
`;

const PricingGrid = styled.div`
  display: grid;
  gap: 10px;

  @media (min-width: 900px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const Plan = styled.article<{ $focus?: boolean }>`
  border-radius: 10px;
  border: 1px solid ${(p) => (p.$focus ? "rgba(13, 148, 136, 0.55)" : "rgba(15, 23, 42, 0.12)")};
  background: rgba(255, 255, 255, 0.84);
  box-shadow: ${(p) => (p.$focus ? "0 20px 36px -28px rgba(13, 148, 136, 0.9)" : "none")};
  padding: 14px;

  h3 {
    margin: 0;
    font-size: 14px;
  }

  p {
    margin: 4px 0 0;
    color: #64748b;
    font-size: 12px;
  }

  strong {
    display: block;
    margin-top: 8px;
    font-size: 34px;
    line-height: 1;
  }

  ul {
    margin: 10px 0 0;
    padding-left: 16px;
    color: #475569;
    font-size: 12px;
    line-height: 1.8;
  }
`;

const PlanBtn = styled(Link)<{ $focus?: boolean }>`
  margin-top: 12px;
  display: inline-flex;
  width: 100%;
  justify-content: center;
  text-decoration: none;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 12px;
  font-weight: 700;
  color: ${(p) => (p.$focus ? "#ffffff" : "#0f172a")};
  border: 1px solid ${(p) => (p.$focus ? "#0f766e" : "rgba(15, 23, 42, 0.2)")};
  background: ${(p) => (p.$focus ? "#0f766e" : "rgba(255, 255, 255, 0.75)")};
`;

const PlanActionBtn = styled.button<{ $focus?: boolean }>`
  margin-top: 12px;
  display: inline-flex;
  width: 100%;
  justify-content: center;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  color: ${(p) => (p.$focus ? "#ffffff" : "#0f172a")};
  border: 1px solid ${(p) => (p.$focus ? "#0f766e" : "rgba(15, 23, 42, 0.2)")};
  background: ${(p) => (p.$focus ? "#0f766e" : "rgba(255, 255, 255, 0.75)")};
`;

const FaqWrap = styled.div`
  max-width: 760px;
  margin: 0 auto;
  display: grid;
  gap: 8px;
`;

const FaqItem = styled.details`
  border-radius: 8px;
  border: 1px solid rgba(15, 23, 42, 0.11);
  background: rgba(255, 255, 255, 0.78);
  padding: 10px 12px;

  summary {
    cursor: pointer;
    list-style: none;
    font-size: 12px;
    font-weight: 700;
  }

  p {
    margin: 7px 0 0;
    color: #64748b;
    font-size: 12px;
    line-height: 1.7;
  }
`;

const Footer = styled.footer`
  border-top: 1px solid rgba(15, 23, 42, 0.1);
  margin-top: 24px;
  padding: 28px 0 22px;
  background: rgba(240, 247, 247, 0.75);
`;

const FooterCols = styled.div`
  display: grid;
  gap: 14px;

  @media (min-width: 760px) {
    grid-template-columns: 1.8fr repeat(4, 1fr);
  }

  h4 {
    margin: 0;
    font-size: 12px;
  }

  p,
  a {
    margin: 0;
    color: #64748b;
    text-decoration: none;
    font-size: 12px;
    line-height: 1.8;
  }

  a:hover {
    color: #0f172a;
  }
`;

const FooterBottom = styled.div`
  margin-top: 14px;
  border-top: 1px solid rgba(15, 23, 42, 0.08);
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  p,
  a {
    color: #64748b;
    font-size: 11px;
    text-decoration: none;
  }

  @media (min-width: 760px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

export const HomePage = () => {
  const [authOpened, setAuthOpened] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    let active = true;
    getCurrentUser()
      .then((user) => {
        if (active) setCurrentUser(user);
      })
      .catch(() => {
        if (active) setCurrentUser(null);
      });

    return () => {
      active = false;
    };
  }, []);

  const openAuth = (mode: "login" | "register") => {
    setAuthMode(mode);
    setAuthOpened(true);
  };

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
  };

  return (
    <PageRoot>
      <Head>{generateNextSeo({ ...SEO, canonical: "https://jsonviz.dev" })}</Head>

      <AuthModal
        opened={authOpened}
        initialMode={authMode}
        onClose={() => setAuthOpened(false)}
        onAuthed={setCurrentUser}
      />

      <TopBar>
        <Wrap>
          <TopBarInner>
            <Brand href="/">
              <BrandDot>J</BrandDot>
              JSONViz
            </Brand>

            <Nav>
              <a href="#features">Features</a>
              <a href="#comparison">Compare</a>
              <a href="#pricing">Pricing</a>
              <a href="#faq">FAQ</a>
            </Nav>

            <RightActions>
              {currentUser ? (
                <>
                  <InlineUser>{currentUser.email}</InlineUser>
                  <TextBtn href="/editor">Open editor</TextBtn>
                  <ActionButton onClick={handleLogout}>退出</ActionButton>
                </>
              ) : (
                <>
                  <ActionButton onClick={() => openAuth("login")}>Sign in</ActionButton>
                  <ActionButton $primary onClick={() => openAuth("register")}>Get started</ActionButton>
                </>
              )}
            </RightActions>
          </TopBarInner>
        </Wrap>
      </TopBar>

      <Hero>
        <Wrap>
          <HeroGrid>
            <div>
              <HeroBadge>New v2.0 release</HeroBadge>
              <HeroTitle>
                Make JSON data
                <span style={{ display: "block", color: "#0f766e" }}>crystal clear</span>
              </HeroTitle>
              <HeroSub>
                JSONViz turns complex structures into readable visualizations instantly. Search, validate, export and share — everything you need to navigate data during development, debugging and team reviews.
              </HeroSub>
              <HeroButtons>
                {currentUser ? (
                  <PrimaryBtn href="/editor">Start using now</PrimaryBtn>
                ) : (
                  <ActionButton $primary onClick={() => openAuth("register")}>Start using now</ActionButton>
                )}
                <SecondaryBtn href="/docs">View docs</SecondaryBtn>
              </HeroButtons>
              <HeroMeta>
                {currentUser ? "Logged in · Ready for editor" : "Register with email verification · Free to use · 50K+ monthly users"}
              </HeroMeta>
            </div>

            <PreviewCard>
              <WindowBar>
                <span />
                <span />
                <span />
                <em>data.json - JSONViz</em>
              </WindowBar>
              <PreviewGrid>
                <RawPane>{`{
  "user": {
    "id": 1024,
    "name": "JSONViz",
    "role": "developer",
    "active": true
  }
}`}</RawPane>
                <TreePane>
                  <div>user</div>
                  <div style={{ paddingLeft: 14 }}>id: 1024</div>
                  <div style={{ paddingLeft: 14 }}>name: "JSONViz"</div>
                  <div style={{ paddingLeft: 14 }}>role: "developer"</div>
                  <div style={{ paddingLeft: 14 }}>active: true</div>
                </TreePane>
              </PreviewGrid>
            </PreviewCard>
          </HeroGrid>
        </Wrap>
      </Hero>

      <Section id="features">
        <Wrap>
          <SectionHeader>
            <SmallTag>Core Features</SmallTag>
            <h2>Every feature built for developers</h2>
            <p>From raw JSON input to visual analysis — the entire workflow is designed around real-world dev scenarios.</p>
          </SectionHeader>

          <FeatureGrid>
            {[
              ["Interactive Tree View", "Expand nested JSON into collapsible node graphs for instant structure clarity.", false],
              ["Table View", "Auto-detect arrays into sortable tables for quick filtering and side-by-side comparison.", false],
              ["Full-Text Search", "Keyword and path-based search with instant jump-to-node navigation.", true],
              ["Mind Map", "Visualize structural relationships in a mind-map layout — great for walkthroughs and reviews.", false],
              ["Real-Time Parsing", "Parse and render on every keystroke with sub-10ms latency.", false],
              ["One-Click Share", "Generate shareable links so your team stays in sync instantly.", false],
              ["Multi-Format Export", "Export to PNG, SVG, CSV, YAML and more.", false],
              ["Local-First Security", "All processing stays in your browser — your data never leaves your device.", false],
            ].map(([title, desc, active]) => (
              <FeatureCard key={String(title)} $active={Boolean(active)}>
                <h3>{title}</h3>
                <p>{desc}</p>
              </FeatureCard>
            ))}
          </FeatureGrid>
        </Wrap>
      </Section>

      <Section id="comparison">
        <Wrap>
          <SectionHeader>
            <SmallTag>Compare</SmallTag>
            <h2>Why JSONViz?</h2>
            <p>A complete workflow from parsing to export — built for both ease of use and professional depth.</p>
          </SectionHeader>

          <TableWrap>
            <CompareTable>
              <thead>
                <tr>
                  <th>Capability</th>
                  <th style={{ color: "#0f766e" }}>JSONViz</th>
                  <th>JSON Editor Online</th>
                  <th>jsonformatter.org</th>
                  <th>Postman</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Visualization", "Tree + Graph", "Tree only", "Formatted text", "Debug view"],
                  ["Search & Navigation", "Keyword + Path", "Keyword", "Limited", "Keyword"],
                  ["Large File Handling", "Optimized", "Average", "Weak", "Average"],
                  ["Export Options", "PNG/SVG/CSV", "PNG", "None", "PNG"],
                  ["Local Security", "Local-first", "Mixed", "Server-side", "Mixed"],
                  ["Learning Curve", "Low", "Medium", "Low", "Medium"],
                ].map((row) => (
                  <tr key={String(row[0])}>
                    <td>{row[0]}</td>
                    <td style={{ color: "#0f766e", fontWeight: 700 }}>{row[1]}</td>
                    <td>{row[2]}</td>
                    <td>{row[3]}</td>
                    <td>{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </CompareTable>
          </TableWrap>

          <Stats>
            {[
              ["50K+", "Active users"],
              ["<10ms", "Avg. response"],
              ["99.9%", "Uptime"],
              ["0 uploads", "Local processing"],
            ].map((item) => (
              <StatItem key={String(item[1])}>
                <strong>{item[0]}</strong>
                <span>{item[1]}</span>
              </StatItem>
            ))}
          </Stats>
        </Wrap>
      </Section>

      <Section id="pricing">
        <Wrap>
          <SectionHeader>
            <SmallTag>Pricing</SmallTag>
            <h2>Simple, transparent, pick what fits</h2>
            <p>Every plan is designed around your JSON workflow — upgrade as your needs grow.</p>
          </SectionHeader>

          <PricingGrid>
            <Plan>
              <h3>Free</h3>
              <strong>Free</strong>
              <p>For individuals and light use</p>
              <ul>
                <li>Basic visualization</li>
                <li>Keyword search</li>
                <li>PNG export</li>
                <li>Local privacy processing</li>
              </ul>
              {currentUser ? (
                <PlanBtn href="/editor">Get started free</PlanBtn>
              ) : (
                <PlanActionBtn onClick={() => openAuth("register")}>Get started free</PlanActionBtn>
              )}
            </Plan>
            <Plan $focus>
              <h3>Pro</h3>
              <strong>$29</strong>
              <p>For heavy JSON workflows</p>
              <ul>
                <li>Everything in Free</li>
                <li>Advanced search</li>
                <li>More export formats</li>
                <li>History & sharing</li>
              </ul>
              {currentUser ? (
                <PlanBtn href="/editor" $focus>
                  Start 14-day trial
                </PlanBtn>
              ) : (
                <PlanActionBtn $focus onClick={() => openAuth("register")}>
                  Start 14-day trial
                </PlanActionBtn>
              )}
            </Plan>
            <Plan>
              <h3>Team</h3>
              <strong>$99</strong>
              <p>For teams & organizations</p>
              <ul>
                <li>Everything in Pro</li>
                <li>Collaboration governance</li>
                <li>Higher quotas</li>
                <li>Priority support</li>
              </ul>
              <PlanBtn href="/docs">View docs</PlanBtn>
            </Plan>
          </PricingGrid>
        </Wrap>
      </Section>

      <Section id="faq">
        <Wrap>
          <SectionHeader>
            <SmallTag>FAQ</SmallTag>
            <h2>What you might be wondering</h2>
          </SectionHeader>

          <FaqWrap>
            {[
              ["Do I need an account?", "No — jump straight into the editor and start using core features instantly."],
              ["Is my JSON data uploaded?", "All processing is local by default. Your raw data never leaves your browser."],
              ["What formats are supported?", "JSON is the core format, with multi-format processing and export capabilities."],
              ["How do I get started?", "Click any of the buttons above to open /editor directly."],
              ["Where can I find documentation?", "Head to /docs for detailed usage guides and integration instructions."],
            ].map(([q, a]) => (
              <FaqItem key={String(q)}>
                <summary>{q}</summary>
                <p>{a}</p>
              </FaqItem>
            ))}
          </FaqWrap>
        </Wrap>
      </Section>

      <Footer>
        <Wrap>
          <FooterCols>
            <div>
              <h4>JSONViz</h4>
              <p>Turn complex JSON data into clear, interactive visualizations — a developer tool you can rely on.</p>
            </div>
            <div>
              <h4>Product</h4>
              <p>
                <Link href="/editor">Editor</Link>
              </p>
              <p>
                <Link href="/docs">Docs</Link>
              </p>
              <p>
                <a href="#pricing">Pricing</a>
              </p>
            </div>
            <div>
              <h4>Legal</h4>
              <p>
                <Link href="/legal/privacy">Privacy</Link>
              </p>
              <p>
                <Link href="/legal/terms">Terms</Link>
              </p>
            </div>
            <div>
              <h4>Support</h4>
              <p>
                <a href="#faq">FAQ</a>
              </p>
              <p>
                <a href="mailto:hello@jsonviz.dev">hello@jsonviz.dev</a>
              </p>
            </div>
            <div>
              <h4>Resources</h4>
              <p>
                <Link href="/docs">Docs</Link>
              </p>
              <p>
                {currentUser ? (
                  <Link href="/editor">Open editor</Link>
                ) : (
                  <ActionButton onClick={() => openAuth("login")}>Sign in</ActionButton>
                )}
              </p>
            </div>
          </FooterCols>

          <FooterBottom>
            <p>© {new Date().getFullYear()} JsonViz. Built from open-source foundations. Licensed under Apache 2.0.</p>
            <div>
              <Link href="/legal/privacy">隐私政策</Link> · <Link href="/legal/terms">服务条款</Link>
            </div>
          </FooterBottom>
        </Wrap>
      </Footer>
    </PageRoot>
  );
};

export default HomePage;

export const getStaticProps = (async () => {
  return {
    props: {},
  };
}) satisfies GetStaticProps<Record<string, never>>;
