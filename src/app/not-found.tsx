import Link from "next/link";
import { connection } from "next/server";
import { ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "./not-found.module.css";

// Renders for unknown URLs and for notFound() calls. It needs no data, so it still
// works when the database is unavailable. Rendering per request lets the proxy's CSP
// nonce reach its scripts; a prerendered copy would have them blocked.
export default async function NotFound() {
  await connection();
  return (
    <div className={styles.page}>
      <Navbar />
      <main id="main-content" className={styles.main}>
        <p className={styles.eyebrow}>404 / Page not found</p>
        <h1>This page is not in the system.</h1>
        <p className={styles.lead}>The link may be out of date, or the page has moved. Pick up from one of these instead.</p>
        <nav aria-label="Ways back into the site" className={styles.actions}>
          <Link href="/work" className={styles.primary}>Browse the work archive <ArrowUpRight aria-hidden="true" /></Link>
          <Link href="/">Go to the homepage</Link>
          <Link href="/blog">Read the journal</Link>
        </nav>
      </main>
      <Footer />
    </div>
  );
}
