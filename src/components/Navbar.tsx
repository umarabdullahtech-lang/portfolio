"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./SiteNavbar.module.css";

const links = [
  { label: "Profile", href: "/#about" },
  { label: "Expertise", href: "/#expertise" },
  { label: "Work", href: "/work" },
  { label: "Journal", href: "/blog" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <nav className={styles.nav} aria-label="Primary navigation">
        <Link href="/" className={styles.identity} onClick={() => setOpen(false)}>
          <span className={styles.mark} aria-hidden="true">UA</span>
          <span>
            <strong>Umar Abdullah</strong>
            <small>Software × Intelligence</small>
          </span>
        </Link>

        <div className={styles.desktopLinks}>
          {links.map((link) => (
            <Link key={link.href} href={link.href}>{link.label}</Link>
          ))}
        </div>

        <Link href="/#contact" className={styles.availability}>
          <span aria-hidden="true" /> Available
        </Link>

        <button
          type="button"
          className={`${styles.menuButton} ${open ? styles.menuButtonOpen : ""}`}
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? "Close navigation" : "Open navigation"}
        >
          <i />
          <i />
        </button>
      </nav>

      <div className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`} aria-hidden={!open}>
        <div className={styles.overlayGrid}>
          <p>Navigation / System map</p>
          <div className={styles.overlayLinks}>
            {[{ label: "Home", href: "/" }, ...links, { label: "Contact", href: "/#contact" }].map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                style={{ transitionDelay: open ? `${90 + index * 55}ms` : "0ms" }}
              >
                <span>0{index + 1}</span>
                {link.label}
              </Link>
            ))}
          </div>
          <div className={styles.overlayMeta}>
            <span>10 years software engineering</span>
            <span>5 years AI engineering</span>
            <span>Remote / Worldwide</span>
          </div>
        </div>
      </div>
    </>
  );
}
