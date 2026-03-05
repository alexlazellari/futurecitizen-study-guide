import type { NextConfig } from "next";
import nextra from "nextra";
import path from "path";

const withNextra = nextra({
  contentDirBasePath: "/",
});

const nextConfig: NextConfig = {
  basePath: "/study-guide",
  turbopack: {
    root: path.resolve(__dirname),
    resolveAlias: {
      "next-mdx-import-source-file": "./mdx-components.ts",
    },
  },
};

export default withNextra(nextConfig);
