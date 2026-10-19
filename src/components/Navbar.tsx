"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./SiteNavbar.module.css";

const links = [
  { label: "Profile", href: "/#about" },
  { label: "Expertise", href: "/#expertise" },
  { label: "Work", href: "/work" },
  { label: "Experience", href: "/#experience" },
  { label: "Journal", href: "/blog" },
];

const menuLinks = [{ label: "Home", href: "/" }, ...links, { label: "Contact", href: "/#contact" }];

// In-page anchors never mark the current page; section pages also cover their children.
function currentState(pathname: string, href: string) {
  if (href.includes("#")) return undefined;
  if (pathname === href) return "page" as const;
  if (href !== "/" && pathname.startsWith(`${href}/`)) return "true" as const;
  return undefined;
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    // The overlay covers the page, so the page behind it leaves the tab order.
    const background = Array.from(document.querySelectorAll<HTMLElement>("main, footer"));
    background.forEach((element) => { element.inert = true; });
    document.body.style.overflow = "hidden";
    document.querySelector<HTMLElement>("#site-menu a")?.focus();

    const close = () => setOpen(false);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      close();
      menuButton.current?.focus();
    };
    const desktop = window.matchMedia("(min-width: 961px)");
    const onViewportChange = () => { if (desktop.matches) close(); };

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onViewportChange);
    return () => {
      background.forEach((element) => { element.inert = false; });
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onViewportChange);
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
            <Link key={link.href} href={link.href} aria-current={currentState(pathname, link.href)}>{link.label}</Link>
          ))}
        </div>

        <Link href="/#contact" className={styles.contactLink}>
          <span aria-hidden="true" /> Contact
        </Link>

        <button
          ref={menuButton}
          type="button"
          className={`${styles.menuButton} ${open ? styles.menuButtonOpen : ""}`}
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? "Close navigation" : "Open navigation"}
        >
          <i />
          <i />
        </button>
      </nav>

      <div id="site-menu" className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`} aria-hidden={!open}>
        <div className={styles.overlayGrid}>
          <p>Navigation / System map</p>
          <div className={styles.overlayLinks}>
            {menuLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={currentState(pathname, link.href)}
                onClick={() => setOpen(false)}
                style={{ transitionDelay: open ? `${90 + index * 55}ms` : "0ms" }}
              >
                <span className={styles.menuIndex} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <span className={styles.menuLabel}>{link.label}</span>
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
