// Modified 2026-07-12, based on JSON Crack Apache 2.0
import React from "react";
import type { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { generateNextSeo } from "next-seo/pages";
import { SEO } from "../constants/seo";
import styled from "styled-components";

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
  return (
    <PageRoot>
      <Head>{generateNextSeo({ ...SEO, canonical: "https://jsonviz.dev" })}</Head>

      <TopBar>
        <Wrap>
          <TopBarInner>
            <Brand href="/">
              <BrandDot>J</BrandDot>
              JSONViz
            </Brand>

            <Nav>
              <a href="#features">产品功能</a>
              <a href="#comparison">对比优势</a>
              <a href="#pricing">定价方案</a>
              <a href="#faq">常见问题</a>
            </Nav>

            <RightActions>
              <TextBtn href="/editor">登录</TextBtn>
              <PrimaryBtn href="/editor">开始使用</PrimaryBtn>
            </RightActions>
          </TopBarInner>
        </Wrap>
      </TopBar>

      <Hero>
        <Wrap>
          <HeroGrid>
            <div>
              <HeroBadge>全新 v2.0 发布</HeroBadge>
              <HeroTitle>
                让 JSON 数据
                <span style={{ display: "block", color: "#0f766e" }}>一目了然</span>
              </HeroTitle>
              <HeroSub>
                JSONViz 将复杂结构快速转化为可读视图，支持搜索、校验、导出与分享，帮助你在开发、排错和协作中更快定位关键数据。
              </HeroSub>
              <HeroButtons>
                <PrimaryBtn href="/editor">立即开始使用</PrimaryBtn>
                <SecondaryBtn href="/docs">查看文档</SecondaryBtn>
              </HeroButtons>
              <HeroMeta>无需注册 · 免费使用 · 月活用户 50K+</HeroMeta>
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
            <SmallTag>核心功能</SmallTag>
            <h2>专为开发者打造的每一项功能</h2>
            <p>从输入原始 JSON 到可视化分析，全链路都围绕高频开发场景设计。</p>
          </SectionHeader>

          <FeatureGrid>
            {[
              ["树形可视化", "层级结构可展开，复杂嵌套也能快速定位。", false],
              ["表格视图", "对象数组自动转表格，便于筛选与比对。", false],
              ["全局搜索", "支持关键词和路径定位，检索更精准。", true],
              ["思维导图", "用导图方式表达结构，沟通更直观。", false],
              ["实时解析", "输入即渲染，保持流畅交互反馈。", false],
              ["一键分享", "快速生成链接，团队同步上下文。", false],
              ["多格式导出", "支持 PNG、SVG、CSV、YAML。", false],
              ["本地安全处理", "核心能力本地运行，降低泄露风险。", false],
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
            <SmallTag>对比优势</SmallTag>
            <h2>为什么选择 JSONViz?</h2>
            <p>覆盖从解析到导出的完整流程，兼顾易用性和专业性。</p>
          </SectionHeader>

          <TableWrap>
            <CompareTable>
              <thead>
                <tr>
                  <th>能力项</th>
                  <th style={{ color: "#0f766e" }}>JSONViz</th>
                  <th>JSON Editor Online</th>
                  <th>jsonformatter.org</th>
                  <th>Postman</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["可视化方式", "树图 + 结构图", "树图", "文本", "调试"],
                  ["搜索能力", "关键词 + 路径", "关键词", "有限", "关键词"],
                  ["大文件处理", "优化", "一般", "弱", "一般"],
                  ["导出格式", "PNG/SVG/CSV", "PNG", "无", "PNG"],
                  ["本地安全", "本地优先", "混合", "在线", "混合"],
                  ["上手成本", "低", "中", "低", "中"],
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
              ["50K+", "活跃用户"],
              ["<10ms", "平均响应"],
              ["99.9%", "稳定性"],
              ["0 上传", "本地处理"],
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
            <SmallTag>定价方案</SmallTag>
            <h2>简单透明，按需选择</h2>
            <p>所有方案都围绕 JSON 工作流设计，可随业务规模逐步升级。</p>
          </SectionHeader>

          <PricingGrid>
            <Plan>
              <h3>免费版</h3>
              <strong>¥0</strong>
              <p>适合个人和入门场景</p>
              <ul>
                <li>基础可视化</li>
                <li>关键词搜索</li>
                <li>PNG 导出</li>
                <li>本地隐私处理</li>
              </ul>
              <PlanBtn href="/editor">立即免费使用</PlanBtn>
            </Plan>
            <Plan $focus>
              <h3>专业版</h3>
              <strong>¥29</strong>
              <p>适合高频开发与调试</p>
              <ul>
                <li>包含免费版功能</li>
                <li>高级搜索能力</li>
                <li>更多导出格式</li>
                <li>分享与历史记录</li>
              </ul>
              <PlanBtn href="/editor" $focus>
                开始 14 天试用
              </PlanBtn>
            </Plan>
            <Plan>
              <h3>团队版</h3>
              <strong>¥99</strong>
              <p>适合多人协作团队</p>
              <ul>
                <li>包含专业版功能</li>
                <li>团队协作治理</li>
                <li>更高配额支持</li>
                <li>优先服务响应</li>
              </ul>
              <PlanBtn href="/docs">查看文档</PlanBtn>
            </Plan>
          </PricingGrid>
        </Wrap>
      </Section>

      <Section id="faq">
        <Wrap>
          <SectionHeader>
            <SmallTag>常见问题</SmallTag>
            <h2>你可能想知道的</h2>
          </SectionHeader>

          <FaqWrap>
            {[
              ["JSONViz 是否需要注册？", "核心可视化能力可直接使用。"],
              ["数据会被上传到服务器吗？", "默认本地处理，不强制上传原始数据。"],
              ["支持哪些格式？", "支持 JSON，并提供多格式处理与导出能力。"],
              ["如何开始使用？", "点击顶部或文中的按钮进入 /editor。"],
              ["文档入口在哪里？", "可从 /docs 查看详细用法说明。"],
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
              <p>将复杂 JSON 数据转化为直观可视化视图的开发者工具。</p>
            </div>
            <div>
              <h4>产品</h4>
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
              <h4>法律</h4>
              <p>
                <Link href="/legal/privacy">Privacy</Link>
              </p>
              <p>
                <Link href="/legal/terms">Terms</Link>
              </p>
            </div>
            <div>
              <h4>支持</h4>
              <p>
                <a href="#faq">FAQ</a>
              </p>
              <p>
                <a href="mailto:hello@jsonviz.dev">hello@jsonviz.dev</a>
              </p>
            </div>
            <div>
              <h4>资源</h4>
              <p>
                <Link href="/docs">文档</Link>
              </p>
              <p>
                <Link href="/editor">登录</Link>
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
