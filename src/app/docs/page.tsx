import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/lib/data";
import { apiDocs } from "./data";
import DocsClient from "./docs-client";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "API Documentation | Umar Abdullah",
  description:
    "Complete REST API documentation for umar-abdullah.com. Covers public endpoints, authentication, blog, projects, experiences, skills, and admin APIs with examples.",
};

export default async function DocsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <div className="pt-[72px]">
        <DocsClient groups={apiDocs} />
      </div>
      <Footer settings={settings} />
    </div>
  );
}
