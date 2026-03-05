import type { NextConfig } from "next";
import nextra from "nextra";
import path from "path";

const withNextra = nextra({
  contentDirBasePath: "/study-guide",
});

const nextConfig: NextConfig = {
  output: "export",
  assetPrefix:
    process.env.NODE_ENV === "production"
      ? "https://lifeintheuk-study-guide.vercel.app"
      : undefined,
  images: { unoptimized: true },
  turbopack: {
    root: path.resolve(__dirname),
    resolveAlias: {
      "next-mdx-import-source-file": "./mdx-components.ts",
    },
  },
};

export default withNextra(nextConfig);
