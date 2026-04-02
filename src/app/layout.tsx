import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Umar Abdullah | Senior Software & AI Engineer",
  description:
    "Senior Software Engineer & AI Engineer specializing in AI-powered automation systems and SaaS platforms. Expert in Node.js, Next.js, React, Python, LangChain, and modern AI/ML technologies.",
  keywords: [
    "Umar Abdullah",
    "Senior Software Engineer",
    "AI Engineer",
    "Full Stack Developer",
    "Node.js",
    "Next.js",
    "React",
    "Python",
    "LangChain",
    "AI/ML",
    "SaaS",
  ],
  authors: [{ name: "Umar Abdullah" }],
  creator: "Umar Abdullah",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Umar Abdullah | Senior Software & AI Engineer",
    description:
      "Senior Software Engineer & AI Engineer specializing in AI-powered automation systems and SaaS platforms.",
    siteName: "Umar Abdullah Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Umar Abdullah | Senior Software & AI Engineer",
    description:
      "Senior Software Engineer & AI Engineer specializing in AI-powered automation systems and SaaS platforms.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased bg-[#0a0a0f] text-slate-200`}>
        {children}
      </body>
    </html>
  );
}
