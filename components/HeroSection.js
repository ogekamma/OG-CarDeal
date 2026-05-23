// components/HeroSection.js
"use client";

import { useState, useEffect, useRef } from "react";
import { MdArrowForward, MdKeyboardArrowDown } from "react-icons/md";

const SLIDES = [
  {
    img: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1800&q=85",
    make: "BMW",
    model: "M8 Competition",
    tagline: "The art of performance",
  },
  {
    img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1800&q=85",
    make: "Porsche",
    model: "911 Turbo S",
    tagline: "Engineered to thrill",
  },
  {
    img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1800&q=85",
    make: "Ferrari",
    model: "Roma Spider",
    tagline: "La dolce vita on four wheels",
  },
  {
    img: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1800&q=85",
    make: "Lamborghini",
    model: "Huracán EVO",
    tagline: "Born to be extraordinary",
  },
];

const MARQUEE = [
  "BMW",
  "Mercedes-Benz",
  "Porsche",
  "Ferrari",
  "Lamborghini",
  "Bentley",
  "McLaren",
  "Rolls-Royce",
  "Aston Martin",
  "Bugatti",
  "Maserati",
  "Audi",
];

export default function HeroSection({ stats }) {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState(null);
  const [phase, setPhase] = useState(0);
  const [tick, setTick] = useState(0);
  const heroRef = useRef(null);
  const ease = "cubic-bezier(0.22,1,0.36,1)";

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 80);
    const t2 = setTimeout(() => setPhase(2), 400);
    const t3 = setTimeout(() => setPhase(3), 800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      setPrev(active);
      setActive((i) => (i + 1) % SLIDES.length);
      setTick((t) => t + 1);
    }, 6000);
    return () => clearInterval(iv);
  }, [active]);

  const goTo = (i) => {
    setPrev(active);
    setActive(i);
  };

  return (
    <>
      <style>{`
        @keyframes imgReveal    { from{clip-path:inset(0 100% 0 0)} to{clip-path:inset(0 0% 0 0)} }
        @keyframes imgPan       { from{transform:scale(1.08)} to{transform:scale(1)} }
        @keyframes fadeSlideUp  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeSlideL   { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes lineGrow     { from{width:0} to{width:100%} }
        @keyframes tickProgress { from{width:0%} to{width:100%} }
        @keyframes marquee      { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes bounceY      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(5px)} }
        @keyframes counterUp    { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

        .slide-img-enter { animation: imgPan 8s ease forwards; }
        .hero-stat { animation: counterUp 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .marquee-brand { color: rgba(14,14,14,0.22); letter-spacing:0.22em; text-transform:uppercase; font-size:0.68rem; font-weight:500; padding:0 2.5rem; white-space:nowrap; transition:color 0.2s; cursor:default; }
        .marquee-brand:hover { color: var(--color-gold); }
        .slide-dot { width:28px; height:2px; background:rgba(14,14,14,0.2); cursor:pointer; transition:all 0.3s ease; border:none; padding:0; }
        .slide-dot.active { background:var(--color-gold); width:44px; }
        .slide-dot:hover  { background:rgba(14,14,14,0.4); }
        .hero-cta-main {
          display:inline-flex; align-items:center; gap:10px;
          background:var(--color-deep); color:#fff;
          font-size:0.78rem; font-weight:500; letter-spacing:0.12em; text-transform:uppercase;
          padding:0.9375rem 2rem; border-radius:2px; text-decoration:none;
          transition:all 0.25s; min-height:50px;
        }
        .hero-cta-main:hover { background:var(--color-gold); transform:translateY(-1px); box-shadow:0 8px 24px rgba(0,0,0,0.12); }
        .hero-cta-ghost {
          display:inline-flex; align-items:center; gap:10px;
          background:transparent; color:var(--color-deep);
          font-size:0.78rem; font-weight:500; letter-spacing:0.12em; text-transform:uppercase;
          padding:0.9375rem 1.75rem; border-radius:2px; text-decoration:none;
          border:1px solid rgba(14,14,14,0.25); transition:all 0.25s; min-height:50px;
        }
        .hero-cta-ghost:hover { background:var(--color-deep); color:#fff; border-color:var(--color-deep); }
      `}</style>

      <section
        ref={heroRef}
        style={{
          position: "relative",
          minHeight: "100vh",
          background: "var(--color-canvas)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ── Background images ── */}
        {SLIDES.map((slide, i) => (
          <div
            key={slide.img}
            style={{
              position: "absolute",
              inset: 0,
              opacity: i === active ? 1 : 0,
              transition: "opacity 1.2s ease",
              zIndex: 1,
            }}
          >
            <img
              src={slide.img}
              alt={slide.model}
              className={i === active ? "slide-img-enter" : ""}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </div>
        ))}

        {/* Overlays */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            background:
              "linear-gradient(105deg, rgba(247,245,240,0.97) 0%, rgba(247,245,240,0.88) 35%, rgba(247,245,240,0.4) 65%, rgba(247,245,240,0.1) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            background:
              "linear-gradient(to top, var(--color-canvas) 0%, transparent 30%)",
          }}
        />

        {/* Decorative vertical rule */}
        <div
          style={{
            position: "absolute",
            left: "max(2rem,calc(50% - 640px))",
            top: 0,
            bottom: 0,
            width: "1px",
            background:
              "linear-gradient(to bottom, transparent 0%, var(--color-border) 20%, var(--color-border) 80%, transparent 100%)",
            zIndex: 3,
            opacity: phase >= 2 ? 0.6 : 0,
            transition: "opacity 0.8s ease 0.5s",
          }}
          className="hidden lg:block"
        />

        {/* ── Main content ── */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            flex: 1,
            display: "flex",
            alignItems: "center",
            maxWidth: "1360px",
            margin: "0 auto",
            width: "100%",
            padding: "clamp(5.5rem,12vh,8rem) 2rem clamp(3rem,6vh,5rem)",
          }}
        >
          <div style={{ maxWidth: "620px" }}>
            {/* Slide indicator */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "2rem",
                opacity: phase >= 1 ? 1 : 0,
                animation:
                  phase >= 1 ? `fadeSlideL 0.6s ${ease} 0.2s both` : "none",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-accent)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.3em",
                  color: "var(--color-gold)",
                }}
              >
                {String(active + 1).padStart(2, "0")}
              </span>
              <div
                style={{
                  flex: 1,
                  maxWidth: "60px",
                  height: "1px",
                  background: "var(--color-border)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  key={`tick-${tick}`}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    background: "var(--color-gold)",
                    animation: "tickProgress 6s linear forwards",
                  }}
                />
              </div>
              <span
                style={{
                  fontFamily: "var(--font-accent)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.3em",
                  color: "rgba(14,14,14,0.3)",
                }}
              >
                {String(SLIDES.length).padStart(2, "0")}
              </span>
            </div>

            {/* Make */}
            <div
              key={`make-${active}`}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.72rem",
                fontWeight: 500,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "var(--color-gold)",
                marginBottom: "0.625rem",
                opacity: 0,
                animation: `fadeSlideUp 0.6s ${ease} 0.1s forwards`,
              }}
            >
              {SLIDES[active].make}
            </div>

            {/* Headline */}
            <h1
              key={`title-${active}`}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3rem,7.5vw,6.5rem)",
                fontWeight: 300,
                lineHeight: 0.92,
                letterSpacing: "-0.01em",
                color: "var(--color-deep)",
                marginBottom: "1rem",
                opacity: 0,
                animation: `fadeSlideUp 0.75s ${ease} 0.18s forwards`,
              }}
            >
              {SLIDES[active].model.split(" ").map((word, i) => (
                <span key={i} style={{ display: "block" }}>
                  {word}
                </span>
              ))}
            </h1>

            {/* Tagline */}
            <p
              key={`tag-${active}`}
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "1.0625rem",
                color: "var(--color-muted)",
                marginBottom: "2.5rem",
                letterSpacing: "0.01em",
                opacity: 0,
                animation: `fadeSlideUp 0.7s ${ease} 0.28s forwards`,
              }}
            >
              {SLIDES[active].tagline}
            </p>

            {/* CTAs */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.875rem",
                alignItems: "center",
                opacity: phase >= 2 ? 1 : 0,
                animation:
                  phase >= 2 ? `fadeSlideUp 0.7s ${ease} 0.15s both` : "none",
              }}
            >
              <a href="#cars" className="hero-cta-main">
                Explore Inventory
                <MdArrowForward size={16} />
              </a>
              <a href="#featured" className="hero-cta-ghost">
                View Featured
              </a>
            </div>

            {/* Stats */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "2.5rem",
                marginTop: "3rem",
                paddingTop: "2rem",
                borderTop: "1px solid var(--color-border)",
                opacity: phase >= 3 ? 1 : 0,
                animation:
                  phase >= 3 ? `fadeSlideUp 0.7s ${ease} 0.1s both` : "none",
              }}
            >
              {[
                { v: stats?.total ?? 0, l: "Vehicles" },
                { v: stats?.makes ?? 0, l: "Brands" },
                { v: "100%", l: "Certified" },
              ].map((s, i) => (
                <div
                  key={s.l}
                  className="hero-stat"
                  style={{ animationDelay: `${0.1 + i * 0.1}s` }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "2.5rem",
                      fontWeight: 300,
                      color: "var(--color-deep)",
                      lineHeight: 1,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {s.v}
                  </p>
                  <p
                    style={{
                      fontSize: "0.7rem",
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "var(--color-muted)",
                      marginTop: "0.375rem",
                    }}
                  >
                    {s.l}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Slide dots ── */}
        <div
          style={{
            position: "absolute",
            bottom: "6rem",
            right: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            zIndex: 20,
            opacity: phase >= 3 ? 1 : 0,
            transition: "opacity 0.5s ease 1s",
          }}
          className="hidden md:flex"
        >
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`slide-dot ${i === active ? "active" : ""}`}
            />
          ))}
        </div>

        {/* ── Scroll cue ── */}
        <div
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
            zIndex: 20,
            opacity: phase >= 3 ? 1 : 0,
            transition: "opacity 0.6s ease 1.2s",
          }}
        >
          <span
            style={{
              fontSize: "0.58rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "var(--color-muted)",
            }}
          >
            Scroll
          </span>
          <MdKeyboardArrowDown
            size={18}
            style={{
              color: "var(--color-muted)",
              animation: "bounceY 2s ease infinite",
            }}
          />
        </div>

        {/* ── Brand marquee ── */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            borderTop: "1px solid var(--color-border)",
            padding: "1rem 0",
            overflow: "hidden",
            opacity: phase >= 3 ? 1 : 0,
            transition: "opacity 0.8s ease 1s",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "max-content",
              animation: "marquee 32s linear infinite",
            }}
          >
            {[...MARQUEE, ...MARQUEE].map((b, i) => (
              <span key={i} className="marquee-brand">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
