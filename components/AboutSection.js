// components/AboutSection.js
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MdArrowForward, MdCheck } from "react-icons/md";

const STATS = [
  { v: "500+", l: "Cars Sold", d: "Since launch" },
  { v: "4.9", l: "Avg. Rating", d: "2,400+ reviews" },
  { v: "30", l: "Day Returns", d: "No questions" },
  { v: "24/7", l: "Support", d: "Always on" },
];

const PILLARS = [
  {
    n: "01",
    title: "Rigorous Inspection",
    body: "Every vehicle undergoes a 120-point mechanical and cosmetic inspection before listing.",
  },
  {
    n: "02",
    title: "Full History Reports",
    body: "Comprehensive documentation — service records, ownership history, and accident reports.",
  },
  {
    n: "03",
    title: "Transparent Pricing",
    body: "No hidden fees. The price you see is the price you negotiate — nothing more.",
  },
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

export default function AboutSection() {
  const [secRef, secVisible] = useInView();
  const ease = "cubic-bezier(0.22,1,0.36,1)";

  return (
    <>
      <style>{`
        @keyframes aboutFadeUp  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes aboutSlideL  { from{opacity:0;transform:translateX(-24px)} to{opacity:1;transform:translateX(0)} }
        @keyframes aboutSlideR  { from{opacity:0;transform:translateX(24px)} to{opacity:1;transform:translateX(0)} }
        @keyframes lineExpand   { from{width:0} to{width:48px} }
        @keyframes countUp      { from{opacity:0;transform:translateY(10px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        .about-stat-card        { transition:all 0.3s ${ease}; }
        .about-stat-card:hover  { transform:translateY(-3px); border-color:var(--color-gold)!important; }
        .pillar-card            { transition:all 0.3s ${ease}; }
        .pillar-card:hover      { border-color:var(--color-gold)!important; background:rgba(201,168,76,0.03)!important; }
        .about-img-wrap::after  {
          content:'';
          position:absolute; bottom:-16px; right:-16px;
          width:60%; height:60%;
          border:1px solid var(--color-gold);
          border-radius:2px;
          pointer-events:none;
          z-index:0;
        }
      `}</style>

      <section
        id="about"
        ref={secRef}
        style={{
          background: "var(--color-deep)",
          color: "#fff",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* ── Decorative background texture ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            backgroundImage:
              "radial-gradient(circle at 80% 20%, rgba(201,168,76,0.06) 0%, transparent 50%), radial-gradient(circle at 10% 80%, rgba(201,168,76,0.04) 0%, transparent 50%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            opacity: 0.03,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.4) 1px,transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* ── Top section ── */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "1360px",
            margin: "0 auto",
            padding: "6rem 2rem 0",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "4rem",
              alignItems: "center",
            }}
            className="about-top-grid"
          >
            <style>{`@media(min-width:1024px){.about-top-grid{grid-template-columns:1fr 1fr!important}}`}</style>

            {/* Left — Text */}
            <div>
              {/* Eyebrow */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "1.5rem",
                  opacity: secVisible ? 1 : 0,
                  animation: secVisible
                    ? `aboutSlideL 0.7s ${ease} 0.1s both`
                    : "none",
                }}
              >
                <div
                  style={{
                    height: "1px",
                    background: "var(--color-gold)",
                    width: secVisible ? "48px" : "0px",
                    transition: `width 0.6s ${ease} 0.3s`,
                  }}
                />
                <span
                  style={{
                    fontSize: "0.65rem",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "var(--color-gold)",
                    fontWeight: 500,
                  }}
                >
                  Who We Are
                </span>
              </div>

              {/* Headline */}
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2.75rem,5.5vw,4.5rem)",
                  fontWeight: 300,
                  lineHeight: 0.92,
                  letterSpacing: "-0.01em",
                  color: "#fff",
                  marginBottom: "1.75rem",
                  opacity: secVisible ? 1 : 0,
                  animation: secVisible
                    ? `aboutFadeUp 0.8s ${ease} 0.2s both`
                    : "none",
                }}
              >
                The Premium
                <br />
                <em
                  style={{ fontStyle: "italic", color: "var(--color-gold-lt)" }}
                >
                  Automobile
                </em>
                <br />
                Standard
              </h2>

              <p
                style={{
                  fontSize: "0.9375rem",
                  lineHeight: 1.9,
                  color: "rgba(255,255,255,0.5)",
                  maxWidth: "440px",
                  marginBottom: "2rem",
                  opacity: secVisible ? 1 : 0,
                  animation: secVisible
                    ? `aboutFadeUp 0.8s ${ease} 0.3s both`
                    : "none",
                }}
              >
                AutoElite was founded on the belief that buying a premium
                automobile should be as refined as driving one. We curate only
                the finest vehicles — every car meticulously inspected and
                documented.
              </p>

              {/* Checkpoints */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  marginBottom: "2.5rem",
                  opacity: secVisible ? 1 : 0,
                  animation: secVisible
                    ? `aboutFadeUp 0.8s ${ease} 0.4s both`
                    : "none",
                }}
              >
                {[
                  "120-point inspection on every vehicle",
                  "Full transparency on pricing and history",
                  "Dedicated specialist for every buyer",
                ].map((pt) => (
                  <div
                    key={pt}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        background: "rgba(201,168,76,0.15)",
                        border: "1px solid rgba(201,168,76,0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: "1px",
                      }}
                    >
                      <MdCheck size={11} color="var(--color-gold)" />
                    </div>
                    <span
                      style={{
                        fontSize: "0.875rem",
                        color: "rgba(255,255,255,0.55)",
                        lineHeight: 1.6,
                      }}
                    >
                      {pt}
                    </span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  opacity: secVisible ? 1 : 0,
                  animation: secVisible
                    ? `aboutFadeUp 0.8s ${ease} 0.5s both`
                    : "none",
                }}
              >
                <Link
                  href="/#cars"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "var(--color-gold)",
                    color: "#fff",
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "0.9375rem 1.875rem",
                    borderRadius: "2px",
                    textDecoration: "none",
                    boxShadow: "0 6px 24px rgba(201,168,76,0.3)",
                    transition: `all 0.25s ${ease}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#b8963e";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 32px rgba(201,168,76,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--color-gold)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 24px rgba(201,168,76,0.3)";
                  }}
                >
                  View Inventory
                  <MdArrowForward size={15} />
                </Link>
              </div>
            </div>

            {/* Right — Image + frame */}
            <div
              style={{
                position: "relative",
                opacity: secVisible ? 1 : 0,
                animation: secVisible
                  ? `aboutSlideR 0.9s ${ease} 0.35s both`
                  : "none",
              }}
              className="hidden lg:block"
            >
              <div
                className="about-img-wrap"
                style={{
                  position: "relative",
                  borderRadius: "4px",
                  overflow: "hidden",
                  aspectRatio: "4/5",
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&q=85"
                  alt="Luxury automobile"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    display: "block",
                  }}
                />
                {/* Overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(14,14,14,0.5) 0%, transparent 50%)",
                  }}
                />

                {/* Floating tag */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "2rem",
                    left: "2rem",
                    background: "rgba(14,14,14,0.85)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(201,168,76,0.25)",
                    borderRadius: "3px",
                    padding: "1rem 1.25rem",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.75rem",
                      fontWeight: 300,
                      color: "#fff",
                      lineHeight: 1,
                    }}
                  >
                    2009
                  </p>
                  <p
                    style={{
                      fontSize: "0.65rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "var(--color-gold)",
                      marginTop: "0.375rem",
                    }}
                  >
                    Est. AutoElite
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats bar ── */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            borderTop: "1px solid rgba(255,255,255,0.07)",
            marginTop: "5rem",
          }}
        >
          <div
            style={{ maxWidth: "1360px", margin: "0 auto", padding: "0 2rem" }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2,1fr)",
                gap: "1px",
                background: "rgba(255,255,255,0.07)",
                borderLeft: "1px solid rgba(255,255,255,0.07)",
                borderRight: "1px solid rgba(255,255,255,0.07)",
              }}
              className="stats-bar-grid"
            >
              <style>{`@media(min-width:768px){.stats-bar-grid{grid-template-columns:repeat(4,1fr)!important}}`}</style>

              {STATS.map((s, i) => (
                <div
                  key={s.l}
                  className="about-stat-card"
                  style={{
                    padding: "2.5rem 2rem",
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                    cursor: "default",
                    opacity: secVisible ? 1 : 0,
                    animation: secVisible
                      ? `countUp 0.7s ${ease} ${0.5 + i * 0.1}s both`
                      : "none",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "3rem",
                      fontWeight: 300,
                      color: "#fff",
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {s.v}
                  </p>
                  <p
                    style={{
                      fontSize: "0.68rem",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "var(--color-gold)",
                      marginTop: "0.625rem",
                    }}
                  >
                    {s.l}
                  </p>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "rgba(255,255,255,0.3)",
                      marginTop: "0.25rem",
                    }}
                  >
                    {s.d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Our Pillars ── */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "1360px",
            margin: "0 auto",
            padding: "5rem 2rem 6rem",
          }}
        >
          <div style={{ marginBottom: "3rem" }}>
            <p
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "var(--color-gold)",
                fontWeight: 500,
                marginBottom: "0.75rem",
              }}
            >
              Our Promise
            </p>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.75rem,3vw,2.5rem)",
                fontWeight: 300,
                color: "#fff",
                letterSpacing: "-0.01em",
              }}
            >
              Why buyers choose AutoElite
            </h3>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
              gap: "1px",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            {PILLARS.map((p, i) => (
              <div
                key={p.n}
                className="pillar-card"
                style={{
                  padding: "2rem",
                  background: "rgba(255,255,255,0.01)",
                  borderRight:
                    i < PILLARS.length - 1
                      ? "1px solid rgba(255,255,255,0.07)"
                      : "none",
                  cursor: "default",
                  opacity: secVisible ? 1 : 0,
                  animation: secVisible
                    ? `aboutFadeUp 0.7s ${ease} ${0.6 + i * 0.12}s both`
                    : "none",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-accent)",
                    fontSize: "2rem",
                    letterSpacing: "0.1em",
                    color: "rgba(201,168,76,0.3)",
                    display: "block",
                    marginBottom: "1.25rem",
                    lineHeight: 1,
                  }}
                >
                  {p.n}
                </span>
                <h4
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.25rem",
                    fontWeight: 400,
                    color: "#fff",
                    marginBottom: "0.75rem",
                    letterSpacing: "0.01em",
                  }}
                >
                  {p.title}
                </h4>
                <p
                  style={{
                    fontSize: "0.875rem",
                    lineHeight: 1.8,
                    color: "rgba(255,255,255,0.45)",
                  }}
                >
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
