import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Head } from "nextra/components";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Life in the UK Study Guide",
  description: "Chapter-by-chapter Life in the UK study guide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head />
      <body className={`${geistSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
