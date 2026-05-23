// components/Navbar.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdMenu, MdClose } from "react-icons/md";

const NAV_LINKS = [
  { label: "Showroom", href: "/#cars"     },
  { label: "Featured", href: "/#featured" },
  { label: "About",    href: "/#about"    },
  { label: "Contact",  href: "/#contact"  },
];

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [mounted,   setMounted]   = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => setMounted(true), 60);
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <>
      <style>{`
        @keyframes navDrop { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes mobileSlide { from{opacity:0;transform:translateX(100%)} to{opacity:1;transform:translateX(0)} }

        .nav-item {
          position: relative;
          font-size: 0.78rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #4A4A4A;
          font-weight: 400;
          text-decoration: none;
          padding-bottom: 2px;
          transition: color 0.2s;
        }
        .nav-item::after {
          content: '';
          position: absolute;
          bottom: -1px; left: 0;
          width: 0; height: 1px;
          background: var(--color-gold);
          transition: width 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .nav-item:hover        { color: var(--color-deep); }
        .nav-item:hover::after { width: 100%; }

        .nav-admin {
          font-size: 0.72rem; letter-spacing: 0.14em; text-transform: uppercase;
          color: #9A9690; border: 1px solid #D8D4CC;
          padding: 0.45rem 0.875rem; border-radius: 2px;
          transition: all 0.2s; text-decoration: none;
        }
        .nav-admin:hover { color: var(--color-deep); border-color: var(--color-deep); }

        .nav-cta {
          font-size: 0.72rem; letter-spacing: 0.14em; text-transform: uppercase;
          color: #fff; background: var(--color-deep);
          padding: 0.5rem 1.25rem; border-radius: 2px;
          transition: all 0.2s; text-decoration: none; font-weight: 500;
        }
        .nav-cta:hover { background: var(--color-gold); }
      `}</style>

      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: scrolled ? "rgba(247,245,240,0.96)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(226,221,214,0.8)" : "none",
          transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
          animation: mounted
            ? "navDrop 0.6s cubic-bezier(0.22,1,0.36,1) both"
            : "none",
        }}
      >
        <div
          style={{
            maxWidth: "1360px",
            margin: "0 auto",
            padding: scrolled ? "1rem 2rem" : "1.5rem 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transition: "padding 0.4s",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-accent)",
                fontSize: "1.5rem",
                letterSpacing: "0.25em",
                color: "var(--color-deep)",
                lineHeight: 1,
              }}
            >
              AutoElite
            </span>
            <span
              style={{
                fontSize: "0.52rem",
                letterSpacing: "0.35em",
                color: "var(--color-gold)",
                textTransform: "uppercase",
                marginTop: "2px",
              }}
            >
              Premium Automobiles
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="nav-item">
                {l.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/admin" className="nav-admin">
              Admin
            </Link>
            <Link href="/#cars" className="nav-cta">
              View Cars
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex md:hidden items-center justify-center"
            style={{
              width: "38px",
              height: "38px",
              border: "1px solid var(--color-border)",
              borderRadius: "2px",
              color: "var(--color-deep)",
              cursor: "pointer",
              background: "transparent",
            }}
          >
            {menuOpen ? <MdClose size={18} /> : <MdMenu size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "80vw",
              maxWidth: "320px",
              background: "var(--color-surface)",
              borderLeft: "1px solid var(--color-border)",
              zIndex: 200,
              display: "flex",
              flexDirection: "column",
              padding: "5rem 2rem 2rem",
              animation:
                "mobileSlide 0.35s cubic-bezier(0.22,1,0.36,1) forwards",
              boxShadow: "-20px 0 60px rgba(0,0,0,0.08)",
            }}
          >
            {/* Logo in drawer */}
            <div
              style={{
                marginBottom: "2.5rem",
                paddingBottom: "1.5rem",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-accent)",
                  fontSize: "1.25rem",
                  letterSpacing: "0.25em",
                  color: "var(--color-deep)",
                }}
              >
                AutoElite
              </span>
            </div>

            <nav style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    fontSize: "0.8125rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--color-muted)",
                    padding: "0.875rem 0",
                    borderBottom: "1px solid var(--color-border)",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--color-deep)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--color-muted)")
                  }
                >
                  {l.label}
                </a>
              ))}
            </nav>

            <div
              style={{
                marginTop: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                style={{
                  textAlign: "center",
                  padding: "0.75rem",
                  border: "1px solid var(--color-border)",
                  borderRadius: "2px",
                  color: "var(--color-muted)",
                  fontSize: "0.78rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                }}
              >
                Admin Panel
              </Link>
              <Link
                href="/#cars"
                onClick={() => setMenuOpen(false)}
                style={{
                  textAlign: "center",
                  padding: "0.75rem",
                  borderRadius: "2px",
                  background: "var(--color-deep)",
                  color: "#fff",
                  fontSize: "0.78rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                  textDecoration: "none",
                }}
              >
                Browse Cars
              </Link>
            </div>
          </div>
          <div
            onClick={() => setMenuOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.2)",
              zIndex: 199,
              backdropFilter: "blur(2px)",
            }}
          />
        </>
      )}
    </>
  );
}