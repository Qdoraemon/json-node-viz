import type { DefaultSeoProps } from "next-seo/pages";

export const SEO: DefaultSeoProps = {
  title: "JsonViz | Online JSON Viewer",
  description:
    "JsonViz is a browser-based tool for visualizing, editing, validating, converting, and exporting structured data.",
  themeColor: "#36393E",
  openGraph: {
    type: "website",
    images: [
      {
        url: "https://jsonviz.dev/assets/og.png",
        width: 1200,
        height: 627,
      },
    ],
  },
  twitter: {
    handle: "@jsonviz",
    cardType: "summary_large_image",
  },
  additionalLinkTags: [
    {
      rel: "manifest",
      href: "/manifest.json",
    },
    {
      rel: "icon",
      href: "/favicon.ico",
      sizes: "48x48",
    },
  ],
};
