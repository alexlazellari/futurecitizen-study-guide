import type { Metadata } from "next";
import { getPageMap } from "nextra/page-map";
import { Layout, Navbar, Footer } from "nextra-theme-docs";
import "@/app/study-guide/nextra.css";

import { StudyGuideCtaButton } from "@/components/study-guide/StudyGuideCtaButton";
import { StudyGuideFooter } from "@/components/study-guide/StudyGuideFooter";
import { StudyGuideLogo } from "@/components/study-guide/StudyGuideLogo";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.lifeukprep.co.uk"
).replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Study Guide",
  description:
    "Read the Life in the UK study guide by chapter with clear summaries to prepare for citizenship and settlement.",
  alternates: {
    canonical: `${siteUrl}/study-guide`,
  },
  openGraph: {
    type: "website",
    title: "Study Guide | Life in the UK Prep",
    description:
      "Chapter-by-chapter Life in the UK study guide to support your test revision.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Study Guide | Life in the UK Prep",
    description:
      "Study the Life in the UK handbook content with a clear online guide.",
  },
};

const navbar = (
  <Navbar
    logo={
      <StudyGuideLogo
        size="sm"
        textClassName="flex flex-col leading-none"
        asLink={true}
      />
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

export default async function StudyGuideLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const pageMap = await getPageMap("/study-guide");

  return (
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
  );
}
