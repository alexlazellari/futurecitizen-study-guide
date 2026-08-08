import type { Metadata } from "next";
import { Suspense } from "react";
import { getPageMap } from "nextra/page-map";
import { Layout, Navbar, Footer } from "nextra-theme-docs";
import { Head } from "nextra/components";
import "./globals.css";
import "./nextra.css";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";

import { StudyGuideCtaButton } from "@/components/study-guide/StudyGuideCtaButton";
import { StudyGuideFooter } from "@/components/study-guide/StudyGuideFooter";
import { StudyGuideLogo } from "@/components/study-guide/StudyGuideLogo";
import { TargetHighlighter } from "@/components/study-guide/TargetHighlighter";

// No webfont in this zone at all, deliberately.
//
// nextra-theme-docs ships none of its own — it reads --x-default-font-family
// and falls back to `ui-sans-serif, system-ui, sans-serif`, so the body text
// has always rendered in whatever the reader's OS provides. That is why these
// pages never flicker: there is nothing to wait for.
//
// Two were being declared here regardless. Geist was set on <body> as
// --font-geist-sans and referenced by no CSS anywhere, so browsers never even
// fetched it. Space Grotesk was real — 22KB on every page, on font-display:
// swap, for the four words of the wordmark, which visibly flipped while the
// body text around it did not. The wordmark now inherits the same system stack
// as everything else.

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.futurecitizen.co.uk"
).replace(/\/+$/, "");
const metadataBase = new URL("/study-guide/", siteUrl);

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: "Life in the UK Study Guide",
    // No brand suffix. It cost 16 characters on all 30 pages and pushed the
    // keywords rightward for no return: a brand suffix earns clicks only from
    // people who already recognise the brand, and nobody searches
    // "Future Citizen" yet. Dropping it took the pages over Google's ~60
    // character title limit from 13 to 2. Google derives the site name from the
    // homepage and often shows it alongside the title anyway, so this does not
    // give up brand presence in the results. Worth revisiting if brand search
    // volume ever appears.
    template: "%s | Life in the UK Test",
  },
  description:
    "Read the Life in the UK study guide by chapter with clear summaries to prepare for citizenship and settlement.",
  alternates: {
    canonical: "./",
  },
  openGraph: {
    type: "website",
    title: "Study Guide | Future Citizen",
    description:
      "Chapter-by-chapter Life in the UK study guide to support your test revision.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Study Guide | Future Citizen",
    description:
      "Study the Life in the UK handbook content with a clear online guide.",
  },
};

const navbar = (
  <Navbar
    logo={
      <StudyGuideLogo size="md" asLink={true} />
    }
    logoLink={false}
  >
    <div className="flex items-center gap-4">
      <StudyGuideCtaButton />
    </div>
  </Navbar>
);

const footer = (
  <Footer>
    <StudyGuideFooter />
  </Footer>
);

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pageMap = await getPageMap("/");

  return (
    <html lang="en" suppressHydrationWarning>
      <Head />
      <body className="antialiased">
        <div className="study-guide-root">
          <Layout
            navbar={navbar}
            footer={footer}
            copyPageButton={false}
            editLink={null}
            feedback={{ content: null }}
            sidebar={{ toggleButton: false }}
            pageMap={pageMap}
          >
            {children}
          </Layout>
        </div>
        <TargetHighlighter />
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
      </body>
    </html>
  );
}
