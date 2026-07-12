import React from "react";
import type { GetStaticProps } from "next";
import Head from "next/head";
import { generateNextSeo } from "next-seo/pages";
import { SEO } from "../constants/seo";
import { FAQ } from "../layout/Landing/FAQ";
import { Features } from "../layout/Landing/Features";
import { HeroPreview } from "../layout/Landing/HeroPreview";
import { HeroSection } from "../layout/Landing/HeroSection";
import { Section1 } from "../layout/Landing/Section1";
import { Section2 } from "../layout/Landing/Section2";
import { Section3 } from "../layout/Landing/Section3";
import Layout from "../layout/PageLayout";

export const HomePage = () => {
  return (
    <Layout>
      <Head>{generateNextSeo({ ...SEO, canonical: "https://jsonviz.dev" })}</Head>
      <HeroSection />
      <HeroPreview />
      <Section1 />
      <Section2 />
      <Section3 />
      <Features />
      <FAQ />
    </Layout>
  );
};

export default HomePage;

export const getStaticProps = (async () => {
  return {
    props: {},
  };
}) satisfies GetStaticProps<Record<string, never>>;
