// app/login/LoginContent.js
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../lib/useAuth";
import {
  MdDirectionsCar,
  MdVisibility,
  MdVisibilityOff,
  MdArrowForward,
  MdCheckCircle,
} from "react-icons/md";

const KEYFRAMES = `
  @keyframes spin       { to { transform: rotate(360deg); } }
  @keyframes fadeUp     { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeDown   { from{opacity:0;transform:translateY(-14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideLeft  { from{opacity:0;transform:translateX(-28px)} to{opacity:1;transform:translateX(0)} }
  @keyframes slideRight { from{opacity:0;transform:translateX(28px)} to{opacity:1;transform:translateX(0)} }
  @keyframes scaleIn    { from{opacity:0;transform:scale(0.88)} to{opacity:1;transform:scale(1)} }
  @keyframes ripple     { from{transform:scale(0);opacity:0.5} to{transform:scale(4);opacity:0} }
  @keyframes orbFloat   { 0%,100%{transform:translate(0,0)} 33%{transform:translate(20px,-15px)} 66%{transform:translate(-12px,10px)} }
  @keyframes dotDrift   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes borderGlow { 0%,100%{box-shadow:0 0 0 0 rgba(230,57,70,0)} 50%{box-shadow:0 0 0 4px rgba(230,57,70,0.15)} }
  @keyframes countUp    { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes glowPulse  { 0%,100%{opacity:0.6} 50%{opacity:1} }
  @keyframes pulse      { 0%,100%{box-shadow:0 0 0 0 rgba(230,57,70,0.4)} 50%{box-shadow:0 0 0 8px rgba(230,57,70,0)} }
  @keyframes shake      { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
`;

function CinematicBackground({ mouseX, mouseY }) {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    mouse.current = { x: mouseX, y: mouseY };
  }, [mouseX, mouseY]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const streaks = Array.from({ length: 12 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      length: 80 + Math.random() * 180,
      speed: 0.12 + Math.random() * 0.25,
      opacity: 0.025 + Math.random() * 0.055,
      width: 0.4 + Math.random() * 1.4,
    }));

    const dots = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 0.4 + Math.random() * 1.6,
      opacity: 0.04 + Math.random() * 0.12,
      speedY: -0.08 - Math.random() * 0.18,
      phase: Math.random() * Math.PI * 2,
    }));

    let frame = 0;

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gap = 48;
      ctx.strokeStyle = "rgba(255,255,255,0.022)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < canvas.width; x += gap) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gap) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      const rad = (-35 * Math.PI) / 180;
      streaks.forEach((s) => {
        const dx = Math.cos(rad) * s.length;
        const dy = Math.sin(rad) * s.length;
        const grad = ctx.createLinearGradient(s.x, s.y, s.x + dx, s.y + dy);
        grad.addColorStop(0, `rgba(230,57,70,0)`);
        grad.addColorStop(0.5, `rgba(230,57,70,${s.opacity})`);
        grad.addColorStop(1, `rgba(230,57,70,0)`);
        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = s.width;
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x + dx, s.y + dy);
        ctx.stroke();
        s.x += s.speed;
        s.y -= s.speed * 0.55;
        if (s.x > canvas.width + 200) {
          s.x = -200;
          s.y = Math.random() * canvas.height;
        }
      });

      dots.forEach((d) => {
        const drift = Math.sin(frame * 0.012 + d.phase) * 1.5;
        ctx.beginPath();
        ctx.arc(d.x + drift, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230,57,70,${d.opacity})`;
        ctx.fill();
        d.y += d.speedY;
        if (d.y < -10) {
          d.y = canvas.height + 10;
          d.x = Math.random() * canvas.width;
        }
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        mixBlendMode: "screen",
      }}
    />
  );
}

function FloatingInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  disabled,
  autoComplete,
  placeholder,
  suffix,
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div style={{ position: "relative" }}>
      <label
        htmlFor={id}
        style={{
          position: "absolute",
          left: "1rem",
          top: active ? "0.42rem" : "50%",
          transform: active
            ? "translateY(0) scale(0.72)"
            : "translateY(-50%) scale(1)",
          transformOrigin: "left center",
          color: focused ? "#E63946" : active ? "#5a616e" : "#3d434d",
          fontSize: "0.875rem",
          fontWeight: 500,
          pointerEvents: "none",
          transition: "all 0.22s cubic-bezier(0.4,0,0.2,1)",
          zIndex: 10,
          letterSpacing: active ? "0.07em" : "0",
          textTransform: active ? "uppercase" : "none",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        placeholder={focused ? placeholder : ""}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={onChange}
        style={{
          width: "100%",
          background: focused
            ? "rgba(230,57,70,0.03)"
            : "rgba(255,255,255,0.025)",
          border: `1px solid ${focused ? "#E63946" : "rgba(255,255,255,0.07)"}`,
          borderRadius: "0.875rem",
          padding: "1.5rem 1rem 0.625rem",
          paddingRight: suffix ? "3rem" : "1rem",
          fontSize: "0.9375rem",
          color: "#ffffff",
          transition: "border-color 0.22s,box-shadow 0.22s,background 0.22s",
          boxShadow: focused
            ? "0 0 0 3px rgba(230,57,70,0.1),inset 0 1px 0 rgba(255,255,255,0.03)"
            : "inset 0 1px 0 rgba(255,255,255,0.02)",
          outline: "none",
          caretColor: "#E63946",
          animation: focused ? "borderGlow 2s ease infinite" : "none",
        }}
      />
      {suffix && (
        <div
          style={{
            position: "absolute",
            right: "0.875rem",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          {suffix}
        </div>
      )}
    </div>
  );
}

function RippleButton({
  onClick,
  disabled,
  children,
  style,
  onMouseEnter,
  onMouseLeave,
}) {
  const btnRef = useRef(null);

  const handleClick = (e) => {
    if (disabled) return;
    const btn = btnRef.current;
    const rect = btn.getBoundingClientRect();
    const rip = document.createElement("span");
    const size = Math.max(rect.width, rect.height);
    rip.style.cssText = `position:absolute;border-radius:50%;width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px;background:rgba(255,255,255,0.18);pointer-events:none;animation:ripple 0.55s ease forwards;`;
    btn.appendChild(rip);
    setTimeout(() => rip.remove(), 600);
    if (onClick) onClick(e);
  };

  return (
    <button
      ref={btnRef}
      disabled={disabled}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ position: "relative", overflow: "hidden", ...style }}
    >
      {children}
    </button>
  );
}

function Word({ text, delay, red }) {
  return (
    <span
      style={{
        display: "inline-block",
        opacity: 0,
        animation: `slideLeft 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}s forwards`,
        color: red ? "#E63946" : "#ffffff",
      }}
    >
      {text}
    </span>
  );
}

export default function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, isLoading } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [phase, setPhase] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [logoHover, setLogoHover] = useState(false);
  const leftRef = useRef(null);
  const shakeRef = useRef(null);
  const ease = "cubic-bezier(0.22,1,0.36,1)";

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 60);
    const t2 = setTimeout(() => setPhase(2), 350);
    const t3 = setTimeout(() => setPhase(3), 700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.push("/admin");
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const err = searchParams.get("error");
    if (err === "unauthorized")
      setError("You don't have permission to access that page.");
    if (err === "CredentialsSignin") setError("Invalid email or password.");
  }, [searchParams]);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (error) setError("");
  };

  const triggerShake = () => {
    if (!shakeRef.current) return;
    shakeRef.current.style.animation = "none";
    shakeRef.current.offsetHeight;
    shakeRef.current.style.animation = "shake 0.45s ease forwards";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Both fields are required.");
      triggerShake();
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await login(form.email, form.password);
      if (result?.error) {
        setError(
          result.error === "CredentialsSignin"
            ? "Invalid email or password."
            : result.error,
        );
        triggerShake();
      } else if (result?.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin");
          router.refresh();
        }, 900);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const autoFill = () => {
    setForm({ email: "admin@autoelite.com", password: "Admin@123456" });
    setError("");
  };

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#080810",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            border: "2px solid rgba(230,57,70,0.3)",
            borderTopColor: "#E63946",
            borderRadius: "50%",
            animation: "spin 0.75s linear infinite",
          }}
        />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          overflow: "hidden",
          background: "#080810",
        }}
      >
        {/* ══ LEFT panel ══ */}
        <div
          ref={leftRef}
          onMouseMove={(e) => {
            if (!leftRef.current) return;
            const r = leftRef.current.getBoundingClientRect();
            setMouse({ x: e.clientX - r.left, y: e.clientY - r.top });
          }}
          className="hidden lg:flex"
          style={{
            width: "52%",
            flexShrink: 0,
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
            background:
              "linear-gradient(145deg,#0f0f1a 0%,#080810 60%,#0d0008 100%)",
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? "translateX(0)" : "translateX(-40px)",
            transition: `opacity 0.9s ${ease},transform 0.9s ${ease}`,
          }}
        >
          <CinematicBackground mouseX={mouse.x} mouseY={mouse.y} />

          <div
            style={{
              position: "absolute",
              top: "25%",
              left: "-8%",
              width: "500px",
              height: "500px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle,rgba(230,57,70,0.1) 0%,transparent 70%)",
              filter: "blur(40px)",
              pointerEvents: "none",
              animation: "orbFloat 12s ease-in-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "15%",
              right: 0,
              width: "280px",
              height: "280px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle,rgba(230,57,70,0.07) 0%,transparent 70%)",
              filter: "blur(30px)",
              pointerEvents: "none",
              animation: "orbFloat 16s ease-in-out 3s infinite reverse",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "1px",
              height: "100%",
              background:
                "linear-gradient(to bottom,transparent,rgba(230,57,70,0.15),rgba(230,57,70,0.08),transparent)",
              zIndex: 20,
            }}
          />

          {/* Logo */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              padding: "2.5rem 3rem",
              opacity: phase >= 2 ? 1 : 0,
              transform: phase >= 2 ? "none" : "translateY(-16px)",
              transition: `opacity 0.7s ${ease} 0.15s,transform 0.7s ${ease} 0.15s`,
            }}
          >
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                textDecoration: "none",
              }}
            >
              <div
                onMouseEnter={() => setLogoHover(true)}
                onMouseLeave={() => setLogoHover(false)}
                style={{
                  width: "42px",
                  height: "42px",
                  background: "#E63946",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 24px rgba(230,57,70,0.45)",
                  flexShrink: 0,
                  transition: "transform 0.4s ease,box-shadow 0.4s ease",
                  transform: logoHover
                    ? "scale(1.1) rotate(-6deg)"
                    : "scale(1)",
                  animation: "pulse 3s ease-in-out 2s infinite",
                }}
              >
                <MdDirectionsCar size={22} color="#fff" />
              </div>
              <div>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.5rem",
                    letterSpacing: "0.2em",
                    color: "#fff",
                    lineHeight: 1,
                    display: "block",
                  }}
                >
                  AutoElite
                </span>
                <span
                  style={{
                    fontSize: "0.62rem",
                    color: "#E63946",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    animation: "glowPulse 3s ease-in-out infinite",
                  }}
                >
                  Admin Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Hero text */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "0 3rem 2rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "1.5rem",
                opacity: phase >= 2 ? 1 : 0,
                transform: phase >= 2 ? "none" : "translateY(16px)",
                transition: `opacity 0.9s ${ease} 0.3s,transform 0.9s ${ease} 0.3s`,
              }}
            >
              <div
                style={{ width: "28px", height: "1px", background: "#E63946" }}
              />
              <span
                style={{
                  fontSize: "0.68rem",
                  color: "#E63946",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Exclusive Access
              </span>
            </div>

            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3rem,4.5vw,4.5rem)",
                lineHeight: 0.92,
                letterSpacing: "0.04em",
                marginBottom: "1.5rem",
              }}
            >
              {phase >= 2 && (
                <>
                  <div>
                    <Word text="Drive" delay={0.4} />{" "}
                    <Word text="Your" delay={0.52} />
                  </div>
                  <div style={{ marginTop: "0.05em" }}>
                    <Word text="Business" delay={0.64} red />
                  </div>
                  <div style={{ marginTop: "0.05em" }}>
                    <Word text="Forward" delay={0.76} />
                  </div>
                </>
              )}
            </div>

            <p
              style={{
                fontSize: "0.9375rem",
                color: "rgba(255,255,255,0.36)",
                lineHeight: 1.75,
                maxWidth: "300px",
                opacity: phase >= 2 ? 1 : 0,
                transform: phase >= 2 ? "none" : "translateY(12px)",
                transition: `opacity 0.8s ${ease} 0.95s,transform 0.8s ${ease} 0.95s`,
              }}
            >
              Manage your entire premium vehicle inventory, listings, and
              showroom performance from one intelligent dashboard.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginTop: "2.25rem",
              }}
            >
              {[
                "Unlimited vehicle listings",
                "Real-time inventory management",
                "Cloudinary image hosting",
              ].map((feat, i) => (
                <div
                  key={feat}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    opacity: phase >= 2 ? 1 : 0,
                    transform: phase >= 2 ? "none" : "translateX(-16px)",
                    transition: `opacity 0.6s ${ease} ${1.05 + i * 0.12}s,transform 0.6s ${ease} ${1.05 + i * 0.12}s`,
                  }}
                >
                  <div
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      background: "rgba(230,57,70,0.12)",
                      border: "1px solid rgba(230,57,70,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      animation: `dotDrift ${2.5 + i * 0.4}s ease-in-out ${i * 0.3}s infinite`,
                    }}
                  >
                    <div
                      style={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        background: "#E63946",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "0.8125rem",
                      color: "rgba(255,255,255,0.4)",
                    }}
                  >
                    {feat}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: "1px",
                marginTop: "2.75rem",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.05)",
                opacity: phase >= 2 ? 1 : 0,
                transform: phase >= 2 ? "none" : "translateY(20px) scale(0.96)",
                transition: `opacity 0.8s ${ease} 1.35s,transform 0.8s ${ease} 1.35s`,
              }}
            >
              {[
                { v: "∞", l: "Listings" },
                { v: "99.9%", l: "Uptime" },
                { v: "< 1s", l: "Load time" },
              ].map((s, i) => (
                <div
                  key={s.l}
                  style={{
                    padding: "1.25rem 0",
                    textAlign: "center",
                    background: "rgba(0,0,0,0.2)",
                    transition: "background 0.2s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(230,57,70,0.06)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "rgba(0,0,0,0.2)")
                  }
                >
                  <p
                    style={{
                      fontSize: "1.375rem",
                      fontWeight: 600,
                      color: "#fff",
                      lineHeight: 1,
                      opacity: phase >= 2 ? 1 : 0,
                      animation:
                        phase >= 2
                          ? `countUp 0.5s ${ease} ${1.5 + i * 0.1}s both`
                          : "none",
                    }}
                  >
                    {s.v}
                  </p>
                  <p
                    style={{
                      fontSize: "0.68rem",
                      color: "rgba(255,255,255,0.28)",
                      marginTop: "0.375rem",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {s.l}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              position: "relative",
              zIndex: 10,
              padding: "1.25rem 3rem",
              borderTop: "1px solid rgba(255,255,255,0.04)",
              opacity: phase >= 2 ? 1 : 0,
              transition: `opacity 1s ${ease} 1s`,
            }}
          >
            <p
              style={{
                fontSize: "0.72rem",
                color: "rgba(255,255,255,0.18)",
                letterSpacing: "0.04em",
              }}
            >
              © {new Date().getFullYear()} AutoElite — All rights reserved
            </p>
          </div>
        </div>

        {/* ══ RIGHT panel ══ */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: "#0a0a12",
            borderLeft: "1px solid rgba(255,255,255,0.04)",
            overflowY: "auto",
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? "translateX(0)" : "translateX(40px)",
            transition: `opacity 0.9s ${ease} 0.2s,transform 0.9s ${ease} 0.2s`,
          }}
        >
          <div
            style={{
              height: "1px",
              flexShrink: 0,
              background:
                "linear-gradient(90deg,transparent,rgba(230,57,70,0.35),transparent)",
              transform: phase >= 1 ? "scaleX(1)" : "scaleX(0)",
              transition: `transform 1s ${ease} 0.4s`,
              transformOrigin: "center",
            }}
          />

          {/* Mobile header */}
          <div
            className="lg:hidden"
            style={{
              padding: "1.5rem 1.5rem 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
              opacity: phase >= 2 ? 1 : 0,
              transform: phase >= 2 ? "none" : "translateY(-12px)",
              transition: `opacity 0.6s ${ease} 0.3s,transform 0.6s ${ease} 0.3s`,
            }}
          >
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  background: "#E63946",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 6px 16px rgba(230,57,70,0.35)",
                  flexShrink: 0,
                }}
              >
                <MdDirectionsCar size={17} color="#fff" />
              </div>
              <div>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.125rem",
                    letterSpacing: "0.18em",
                    color: "#fff",
                    lineHeight: 1,
                    display: "block",
                  }}
                >
                  AutoElite
                </span>
                <span
                  style={{
                    fontSize: "0.6rem",
                    color: "rgba(230,57,70,0.75)",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                  }}
                >
                  Admin Portal
                </span>
              </div>
            </Link>
            <Link
              href="/"
              style={{
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.22)",
                textDecoration: "none",
                letterSpacing: "0.04em",
              }}
            >
              ← Showroom
            </Link>
          </div>

          {/* Form */}
          <div
            style={{
              flex: "1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2.5rem 1.5rem",
            }}
          >
            <div style={{ width: "100%", maxWidth: "400px" }}>
              {/* Heading */}
              <div
                style={{
                  marginBottom: "2rem",
                  opacity: phase >= 2 ? 1 : 0,
                  transform: phase >= 2 ? "none" : "translateY(12px)",
                  transition: `opacity 0.8s ${ease} 0.4s,transform 0.8s ${ease} 0.4s`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "0.875rem",
                  }}
                >
                  <div
                    style={{
                      height: "1px",
                      background: "rgba(230,57,70,0.6)",
                      width: phase >= 2 ? "20px" : "0px",
                      transition: `width 0.5s ${ease} 0.9s`,
                    }}
                  />
                  <span
                    style={{
                      fontSize: "0.66rem",
                      color: "rgba(230,57,70,0.8)",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      fontWeight: 600,
                      opacity: phase >= 2 ? 1 : 0,
                      transition: `opacity 0.5s ease 1.1s`,
                    }}
                  >
                    Secure login
                  </span>
                </div>
                <h2
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: 600,
                    color: "#fff",
                    lineHeight: 1.15,
                    marginBottom: "0.5rem",
                    opacity: phase >= 2 ? 1 : 0,
                    animation:
                      phase >= 2
                        ? `slideRight 0.65s ${ease} 0.5s both`
                        : "none",
                  }}
                >
                  Welcome back
                </h2>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "rgba(255,255,255,0.3)",
                    lineHeight: 1.65,
                    opacity: phase >= 2 ? 1 : 0,
                    animation:
                      phase >= 2 ? `fadeUp 0.65s ${ease} 0.62s both` : "none",
                  }}
                >
                  Sign in to access your admin dashboard and manage your
                  inventory.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div
                  style={{
                    marginBottom: "1.25rem",
                    padding: "0.8rem 1rem",
                    borderRadius: "0.875rem",
                    background: "rgba(230,57,70,0.08)",
                    border: "1px solid rgba(230,57,70,0.22)",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.6rem",
                    animation: `fadeDown 0.35s ${ease} forwards`,
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#E63946",
                      marginTop: "1px",
                      flexShrink: 0,
                    }}
                  >
                    ⚠
                  </span>
                  <span
                    style={{
                      fontSize: "0.8125rem",
                      color: "rgba(230,57,70,0.9)",
                      lineHeight: 1.5,
                    }}
                  >
                    {error}
                  </span>
                </div>
              )}

              {/* Success */}
              {success && (
                <div
                  style={{
                    marginBottom: "1.25rem",
                    padding: "0.8rem 1rem",
                    borderRadius: "0.875rem",
                    background: "rgba(34,197,94,0.08)",
                    border: "1px solid rgba(34,197,94,0.22)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    animation: `scaleIn 0.4s ${ease} forwards`,
                  }}
                >
                  <MdCheckCircle size={16} color="#4ade80" />
                  <span style={{ fontSize: "0.8125rem", color: "#4ade80" }}>
                    Authenticated — redirecting…
                  </span>
                </div>
              )}

              {/* Form */}
              <form
                ref={shakeRef}
                onSubmit={handleSubmit}
                style={{
                  opacity: phase >= 3 ? 1 : 0,
                  transform: phase >= 3 ? "none" : "translateY(20px)",
                  transition: `opacity 0.7s ${ease},transform 0.7s ${ease}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <FloatingInput
                    id="email"
                    label="Email address"
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    disabled={loading}
                    autoComplete="email"
                    placeholder="admin@autoelite.com"
                  />
                  <FloatingInput
                    id="password"
                    label="Password"
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                    disabled={loading}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    suffix={
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        style={{
                          color: "rgba(255,255,255,0.28)",
                          cursor: "pointer",
                          display: "flex",
                          background: "none",
                          border: "none",
                          padding: 0,
                          transition: "color 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color =
                            "rgba(255,255,255,0.7)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color =
                            "rgba(255,255,255,0.28)")
                        }
                      >
                        {showPass ? (
                          <MdVisibilityOff size={17} />
                        ) : (
                          <MdVisibility size={17} />
                        )}
                      </button>
                    }
                  />
                </div>

                <div style={{ marginTop: "1.5rem" }}>
                  <RippleButton
                    disabled={loading || success}
                    style={{
                      width: "100%",
                      padding: "0.9375rem",
                      borderRadius: "0.875rem",
                      background: success
                        ? "linear-gradient(135deg,#16a34a,#22c55e)"
                        : loading
                          ? "rgba(230,57,70,0.5)"
                          : "linear-gradient(135deg,#E63946 0%,#c8303c 100%)",
                      color: "#fff",
                      fontSize: "0.9375rem",
                      fontWeight: 600,
                      letterSpacing: "0.02em",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      cursor: loading || success ? "not-allowed" : "pointer",
                      boxShadow:
                        loading || success
                          ? "none"
                          : "0 4px 24px rgba(230,57,70,0.35),0 1px 0 rgba(255,255,255,0.12) inset",
                      transition:
                        "background 0.35s,box-shadow 0.25s,transform 0.12s",
                      border: "none",
                      fontFamily: "inherit",
                    }}
                    onMouseEnter={(e) => {
                      if (!loading && !success) {
                        e.currentTarget.style.boxShadow =
                          "0 8px 32px rgba(230,57,70,0.5)";
                        e.currentTarget.style.transform = "translateY(-1px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading && !success) {
                        e.currentTarget.style.boxShadow =
                          "0 4px 24px rgba(230,57,70,0.35),0 1px 0 rgba(255,255,255,0.12) inset";
                        e.currentTarget.style.transform = "translateY(0)";
                      }
                    }}
                  >
                    {loading ? (
                      <>
                        <div
                          style={{
                            width: "16px",
                            height: "16px",
                            border: "2px solid rgba(255,255,255,0.35)",
                            borderTopColor: "#fff",
                            borderRadius: "50%",
                            animation: "spin 0.7s linear infinite",
                          }}
                        />{" "}
                        Verifying…
                      </>
                    ) : success ? (
                      <>
                        <MdCheckCircle size={17} /> Authenticated
                      </>
                    ) : (
                      <>
                        Sign In to Dashboard <MdArrowForward size={17} />
                      </>
                    )}
                  </RippleButton>
                </div>
              </form>

              {/* Divider */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  margin: "1.5rem 0",
                  opacity: phase >= 3 ? 1 : 0,
                  transition: `opacity 0.8s ${ease} 0.7s`,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: "1px",
                    background: "rgba(255,255,255,0.05)",
                  }}
                />
                <span
                  style={{
                    fontSize: "0.72rem",
                    color: "rgba(255,255,255,0.18)",
                    letterSpacing: "0.08em",
                  }}
                >
                  or
                </span>
                <div
                  style={{
                    flex: 1,
                    height: "1px",
                    background: "rgba(255,255,255,0.05)",
                  }}
                />
              </div>

              {/* Demo card */}
              <div
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "1rem",
                  padding: "1rem 1.125rem",
                  opacity: phase >= 3 ? 1 : 0,
                  transform: phase >= 3 ? "none" : "translateY(12px)",
                  transition: `opacity 0.8s ${ease} 0.75s,transform 0.8s ${ease} 0.75s`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "0.75rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.68rem",
                      color: "rgba(255,255,255,0.22)",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      fontWeight: 600,
                    }}
                  >
                    Demo access
                  </span>
                  <button
                    onClick={autoFill}
                    style={{
                      fontSize: "0.7rem",
                      color: "#E63946",
                      background: "rgba(230,57,70,0.1)",
                      border: "1px solid rgba(230,57,70,0.2)",
                      borderRadius: "6px",
                      padding: "3px 10px",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      letterSpacing: "0.04em",
                      transition: "background 0.18s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(230,57,70,0.18)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "rgba(230,57,70,0.1)")
                    }
                  >
                    Auto-fill ↗
                  </button>
                </div>
                {[
                  { l: "Email", v: "admin@autoelite.com" },
                  { l: "Password", v: "Admin@123456" },
                ].map((row, i, arr) => (
                  <div
                    key={row.l}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.5rem 0",
                      borderBottom:
                        i < arr.length - 1
                          ? "1px solid rgba(255,255,255,0.04)"
                          : "none",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "rgba(255,255,255,0.25)",
                      }}
                    >
                      {row.l}
                    </span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "rgba(255,255,255,0.48)",
                        fontFamily: "monospace",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {row.v}
                    </span>
                  </div>
                ))}
              </div>

              {/* Back link */}
              <div
                className="hidden lg:block"
                style={{
                  textAlign: "center",
                  marginTop: "1.5rem",
                  opacity: phase >= 3 ? 1 : 0,
                  transition: `opacity 0.8s ${ease} 0.85s`,
                }}
              >
                <Link
                  href="/"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "0.8rem",
                    color: "rgba(255,255,255,0.2)",
                    textDecoration: "none",
                    letterSpacing: "0.02em",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "rgba(255,255,255,0.5)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "rgba(255,255,255,0.2)")
                  }
                >
                  ← Back to showroom
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
