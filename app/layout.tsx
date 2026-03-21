import type { Metadata } from "next";
import { Geist, Space_Grotesk } from "next/font/google";
import { getPageMap } from "nextra/page-map";
import { Layout, Navbar, Footer } from "nextra-theme-docs";
import { Head } from "nextra/components";
import "./globals.css";
import "./nextra.css";

import { StudyGuideCtaButton } from "@/components/study-guide/StudyGuideCtaButton";
import { StudyGuideFooter } from "@/components/study-guide/StudyGuideFooter";
import { StudyGuideLogo } from "@/components/study-guide/StudyGuideLogo";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"] });

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.futurecitizen.co.uk"
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
    title: "Study Guide | FutureCitizen",
    description:
      "Chapter-by-chapter Life in the UK study guide to support your test revision.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Study Guide | FutureCitizen",
    description:
      "Study the Life in the UK handbook content with a clear online guide.",
  },
};

const navbar = (
  <Navbar
    logo={
      <StudyGuideLogo
        size="md"
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pageMap = await getPageMap("/");

  return (
    <html lang="en" suppressHydrationWarning>
      <Head />
      <body className={`${geistSans.variable} ${spaceGrotesk.variable} antialiased`}>
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
      </body>
    </html>
  );
}
