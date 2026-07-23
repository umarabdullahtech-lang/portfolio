import type { Metadata } from "next";
import { Instrument_Sans, JetBrains_Mono, Outfit } from "next/font/google";
import MotionProvider from "@/components/MotionProvider";
import "./globals.css";

const display = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Umar Abdullah | Senior Software & AI Engineer",
  description:
    "Software engineer with 10 years of experience and 5 years specializing in AI engineering, building AI-powered automation systems and scalable SaaS platforms.",
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
      "10 years in software engineering, including 5 years specializing in production AI systems and scalable SaaS platforms.",
    siteName: "Umar Abdullah Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Umar Abdullah | Senior Software & AI Engineer",
    description:
      "10 years in software engineering, including 5 years specializing in production AI systems and scalable SaaS platforms.",
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
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${display.variable} ${body.variable} ${mono.variable} antialiased`}>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
