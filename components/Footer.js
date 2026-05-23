// components/Footer.js
"use client";

import { useState } from "react";
import Link from "next/link";
import { MdArrowForward, MdArrowUpward } from "react-icons/md";

const FOOTER_LINKS = {
  Inventory: [
    { label: "Browse All Cars", href: "/#cars" },
    { label: "Featured Vehicles", href: "/#featured" },
    { label: "New Arrivals", href: "/#cars" },
    { label: "Certified Pre-Owned", href: "/#cars" },
  ],
  Company: [
    { label: "About AutoElite", href: "/#about" },
    { label: "Contact Us", href: "/#contact" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
  ],
  Services: [
    { label: "Financing", href: "#" },
    { label: "Trade-In Valuation", href: "#" },
    { label: "Test Drives", href: "#" },
    { label: "Warranty Plans", href: "#" },
  ],
};

const SOCIALS = [
  { label: "IG", href: "#", title: "Instagram" },
  { label: "TW", href: "#", title: "Twitter / X" },
  { label: "LI", href: "#", title: "LinkedIn" },
  { label: "YT", href: "#", title: "YouTube" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subSent, setSubSent] = useState(false);
  const [hovTop, setHovTop] = useState(false);
  const ease = "cubic-bezier(0.22,1,0.36,1)";

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubSent(true);
    setEmail("");
  };

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <style>{`
        .footer-link { color:rgba(255,255,255,0.38); font-size:0.8125rem; letter-spacing:0.04em; text-decoration:none; transition:all 0.2s; display:flex; align-items:center; gap:6px; padding:2px 0; }
        .footer-link:hover { color:var(--color-gold); padding-left:6px; }
        .footer-link::before { content:''; display:block; width:0; height:1px; background:var(--color-gold); transition:width 0.25s; flex-shrink:0; }
        .footer-link:hover::before { width:12px; }
        .social-btn { width:36px; height:36px; border:1px solid rgba(255,255,255,0.1); border-radius:2px; display:flex; align-items:center; justify-content:center; color:rgba(255,255,255,0.4); font-size:0.6rem; font-weight:700; letter-spacing:0.05em; cursor:pointer; transition:all 0.2s; text-decoration:none; }
        .social-btn:hover { background:var(--color-gold); border-color:var(--color-gold); color:#fff; transform:translateY(-2px); }
        .sub-input { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-right:none; border-radius:2px 0 0 2px; padding:0.75rem 1rem; font-size:0.8125rem; color:#fff; font-family:var(--font-body); outline:none; flex:1; transition:border-color 0.2s; caret-color:var(--color-gold); letter-spacing:0.02em; }
        .sub-input::placeholder { color:rgba(255,255,255,0.2); }
        .sub-input:focus { border-color:rgba(201,168,76,0.5); }
        .sub-btn { background:var(--color-gold); color:#fff; border:none; padding:0.75rem 1.125rem; font-size:0.72rem; font-weight:500; letter-spacing:0.1em; text-transform:uppercase; cursor:pointer; font-family:var(--font-body); border-radius:0 2px 2px 0; transition:all 0.2s; white-space:nowrap; display:flex; align-items:center; gap:6px; }
        .sub-btn:hover { background:#b8963e; }
        .back-top:hover { background:var(--color-gold)!important; border-color:var(--color-gold)!important; transform:translateY(-2px); }
      `}</style>

      <footer
        style={{
          background: "var(--color-deep)",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ── Background texture ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.025,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* ── Newsletter strip ── */}
        <div
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              maxWidth: "1360px",
              margin: "0 auto",
              padding: "2.5rem 2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1.5rem",
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.375rem",
                  fontWeight: 300,
                  color: "#fff",
                  marginBottom: "0.25rem",
                }}
              >
                Stay in the loop
              </p>
              <p
                style={{
                  fontSize: "0.8125rem",
                  color: "rgba(255,255,255,0.38)",
                  letterSpacing: "0.02em",
                }}
              >
                New arrivals and exclusive offers, delivered to your inbox.
              </p>
            </div>

            {subSent ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "var(--color-gold)",
                  fontSize: "0.8125rem",
                  letterSpacing: "0.06em",
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "rgba(201,168,76,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ fontSize: "10px" }}>✓</span>
                </div>
                Subscribed — thank you!
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                style={{
                  display: "flex",
                  minWidth: "320px",
                  maxWidth: "420px",
                  flex: 1,
                }}
              >
                <input
                  className="sub-input"
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="sub-btn">
                  Subscribe
                  <MdArrowForward size={13} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ── Main footer grid ── */}
        <div
          style={{
            maxWidth: "1360px",
            margin: "0 auto",
            padding: "4rem 2rem 3rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3rem" }}
            className="footer-main-grid"
          >
            <style>{`@media(min-width:768px){.footer-main-grid{grid-template-columns:1.5fr 1fr 1fr 1fr!important}}`}</style>

            {/* Brand column */}
            <div>
              <Link
                href="/"
                style={{
                  textDecoration: "none",
                  display: "inline-flex",
                  flexDirection: "column",
                  marginBottom: "1.25rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-accent)",
                    fontSize: "1.5rem",
                    letterSpacing: "0.25em",
                    color: "#fff",
                    lineHeight: 1,
                  }}
                >
                  AutoElite
                </span>
                <span
                  style={{
                    fontSize: "0.52rem",
                    letterSpacing: "0.3em",
                    color: "var(--color-gold)",
                    textTransform: "uppercase",
                    marginTop: "3px",
                  }}
                >
                  Premium Automobiles
                </span>
              </Link>

              <p
                style={{
                  fontSize: "0.8125rem",
                  lineHeight: 1.8,
                  color: "rgba(255,255,255,0.38)",
                  maxWidth: "240px",
                  marginBottom: "1.5rem",
                  letterSpacing: "0.02em",
                }}
              >
                Curating the world's finest vehicles for discerning buyers since
                2009.
              </p>

              {/* Socials */}
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    title={s.title}
                    className="social-btn"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
              <div key={heading}>
                <p
                  style={{
                    fontSize: "0.65rem",
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.55)",
                    fontWeight: 500,
                    marginBottom: "1.25rem",
                  }}
                >
                  {heading}
                </p>
                <nav
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.125rem",
                  }}
                >
                  {links.map((l) => (
                    <Link key={l.label} href={l.href} className="footer-link">
                      {l.label}
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
          </div>

          {/* ── Bottom bar ── */}
          <div
            style={{
              marginTop: "3rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <p
              style={{
                fontSize: "0.72rem",
                color: "rgba(255,255,255,0.25)",
                letterSpacing: "0.06em",
              }}
            >
              © {new Date().getFullYear()} AutoElite LLC — All rights reserved
            </p>

            <div style={{ display: "flex", gap: "1.5rem" }}>
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                (l) => (
                  <a
                    key={l}
                    href="#"
                    style={{
                      fontSize: "0.72rem",
                      color: "rgba(255,255,255,0.25)",
                      textDecoration: "none",
                      letterSpacing: "0.06em",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--color-gold)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "rgba(255,255,255,0.25)")
                    }
                  >
                    {l}
                  </a>
                ),
              )}{" "}
            </div>

            {/* Back to top */}
            <button
              onClick={scrollTop}
              onMouseEnter={() => setHovTop(true)}
              onMouseLeave={() => setHovTop(false)}
              className="back-top"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "2px",
                border: "1px solid rgba(255,255,255,0.12)",
                background: "transparent",
                color: "rgba(255,255,255,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: `all 0.25s ${ease}`,
              }}
              title="Back to top"
            >
              <MdArrowUpward
                size={16}
                color={hovTop ? "#fff" : "rgba(255,255,255,0.5)"}
              />
            </button>
          </div>
        </div>

        {/* ── Giant watermark ── */}
        <div
          style={{
            position: "absolute",
            bottom: "-1rem",
            right: "-1rem",
            fontFamily: "var(--font-accent)",
            fontSize: "clamp(5rem,12vw,11rem)",
            letterSpacing: "0.15em",
            color: "rgba(255,255,255,0.025)",
            lineHeight: 1,
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 0,
          }}
        >
          AUTOELITE
        </div>
      </footer>
    </>
  );
}
