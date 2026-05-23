// components/ContactSection.js
"use client";

import { useState, useEffect, useRef } from "react";
import { MdArrowForward, MdPhone, MdEmail, MdLocationOn, MdSchedule, MdCheckCircle } from "react-icons/md";

const HOURS = [
  { d:"Monday – Friday", h:"9:00 AM – 7:00 PM" },
  { d:"Saturday",        h:"10:00 AM – 6:00 PM" },
  { d:"Sunday",          h:"11:00 AM – 5:00 PM" },
];

const CONTACT_INFO = [
  { icon: MdPhone,       label:"Phone",   value:"+1 (234) 567-8900", href:"tel:+12345678900"             },
  { icon: MdEmail,       label:"Email",   value:"hello@autoelite.com", href:"mailto:hello@autoelite.com" },
  { icon: MdLocationOn,  label:"Address", value:"Manhattan, New York, USA", href:"#"                    },
];

function useInView(threshold = 0.12) {
  const ref  = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis];
}

export default function ContactSection() {
  const [secRef, vis] = useInView();
  const [sent,   setSent]    = useState(false);
  const [sending,setSending] = useState(false);
  const [form,   setForm]    = useState({ name:"", email:"", phone:"", message:"", interest:"" });
  const ease = "cubic-bezier(0.22,1,0.36,1)";

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    // Simulate submit — wire to your API / EmailJS / Resend as needed
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
  };

  const inputStyle = {
    width:        "100%",
    background:   "rgba(255,255,255,0.04)",
    border:       "1px solid rgba(255,255,255,0.1)",
    borderRadius: "2px",
    padding:      "0.875rem 1rem",
    fontSize:     "0.875rem",
    color:        "#fff",
    fontFamily:   "var(--font-body)",
    outline:      "none",
    transition:   "border-color 0.2s, background 0.2s",
    caretColor:   "var(--color-gold)",
    letterSpacing:"0.02em",
  };

  return (
    <>
      <style>{`
        @keyframes cFadeUp  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes cSlideL  { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes cSlideR  { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes popIn    { from{opacity:0;transform:scale(0.88)} to{opacity:1;transform:scale(1)} }

        .c-input:focus          { border-color:var(--color-gold)!important; background:rgba(201,168,76,0.04)!important; }
        .c-input::placeholder   { color:rgba(255,255,255,0.2); }
        .c-info-row             { transition:all 0.2s ${ease}; }
        .c-info-row:hover       { padding-left:8px!important; }
        .c-submit               { transition:all 0.25s ${ease}; }
        .c-submit:hover:not(:disabled) { background:var(--color-gold)!important; transform:translateY(-2px); box-shadow:0 8px 28px rgba(201,168,76,0.35)!important; }
        .c-submit:disabled      { opacity:0.6; cursor:not-allowed; }
        .hour-row               { transition:background 0.2s; }
        .hour-row:hover         { background:rgba(201,168,76,0.05)!important; }
      `}</style>

      <section
        id="contact"
        ref={secRef}
        style={{
          background: "var(--color-canvas)",
          borderTop: "1px solid var(--color-border)",
          padding: "0 0 6rem",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* ── Section label bar ── */}
        <div
          style={{
            background: "var(--color-deep)",
            padding: "1.25rem 2rem",
            marginBottom: "5rem",
            opacity: vis ? 1 : 0,
            animation: vis ? `cFadeUp 0.6s ${ease} 0.05s both` : "none",
          }}
        >
          <div
            style={{
              maxWidth: "1360px",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span
                style={{
                  fontFamily: "var(--font-accent)",
                  fontSize: "0.85rem",
                  letterSpacing: "0.28em",
                  color: "var(--color-gold)",
                }}
              >
                Get in Touch
              </span>
              <div
                style={{
                  width: "1px",
                  height: "16px",
                  background: "rgba(255,255,255,0.15)",
                }}
              />
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.4)",
                  letterSpacing: "0.08em",
                }}
              >
                Our team responds within 2 hours
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#22C55E",
                  animation: "pulse 2s ease infinite",
                }}
              />
              <style>{`@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,0.4)}50%{box-shadow:0 0 0 6px rgba(34,197,94,0)}}`}</style>
              <span
                style={{
                  fontSize: "0.72rem",
                  color: "rgba(255,255,255,0.5)",
                  letterSpacing: "0.1em",
                }}
              >
                Currently open
              </span>
            </div>
          </div>
        </div>

        <div
          style={{ maxWidth: "1360px", margin: "0 auto", padding: "0 2rem" }}
        >
          {/* Headline */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "4rem",
              opacity: vis ? 1 : 0,
              animation: vis ? `cFadeUp 0.7s ${ease} 0.15s both` : "none",
            }}
          >
            <p
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "var(--color-gold)",
                fontWeight: 500,
                marginBottom: "0.875rem",
              }}
            >
              Contact Us
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 300,
                fontSize: "clamp(2.5rem,5vw,4rem)",
                color: "var(--color-deep)",
                letterSpacing: "-0.01em",
                lineHeight: 0.95,
              }}
            >
              Ready to Find
              <br />
              <em style={{ fontStyle: "italic", color: "var(--color-gold)" }}>
                Your Car?
              </em>
            </h2>
          </div>

          {/* Two-column layout */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "3rem",
              alignItems: "start",
            }}
            className="contact-main-grid"
          >
            <style>{`@media(min-width:1024px){.contact-main-grid{grid-template-columns:1fr 1fr!important}}`}</style>

            {/* LEFT — Info */}
            <div
              style={{
                opacity: vis ? 1 : 0,
                animation: vis ? `cSlideL 0.8s ${ease} 0.25s both` : "none",
              }}
            >
              {/* Contact info rows */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0",
                  border: "1px solid var(--color-border)",
                  borderRadius: "4px",
                  overflow: "hidden",
                  marginBottom: "2rem",
                }}
              >
                {CONTACT_INFO.map((c, i) => {
                  const Icon = c.icon;

                  return (
                    <a
                      key={c.label}
                      href={c.href}
                      className="c-info-row"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        padding: "1.25rem 1.5rem",
                        borderBottom:
                          i < CONTACT_INFO.length - 1
                            ? "1px solid var(--color-border)"
                            : "none",
                        background: "var(--color-surface)",
                        textDecoration: "none",
                        color: "inherit",
                        paddingLeft: "1.5rem",
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "2px",
                          background: "var(--color-canvas)",
                          border: "1px solid var(--color-border)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={18} color="var(--color-gold)" />
                      </div>

                      <div>
                        <p
                          style={{
                            fontSize: "0.65rem",
                            letterSpacing: "0.16em",
                            textTransform: "uppercase",
                            color: "var(--color-muted)",
                            marginBottom: "0.25rem",
                          }}
                        >
                          {c.label}
                        </p>

                        <p
                          style={{
                            fontSize: "0.875rem",
                            color: "var(--color-charcoal)",
                            fontWeight: 500,
                            letterSpacing: "0.02em",
                          }}
                        >
                          {c.value}
                        </p>
                      </div>
                    </a>
                  );
                })}{" "}
              </div>

              {/* Hours */}
              <div
                style={{
                  border: "1px solid var(--color-border)",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "1rem 1.5rem",
                    background: "var(--color-canvas)",
                    borderBottom: "1px solid var(--color-border)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <MdSchedule size={15} color="var(--color-gold)" />
                  <p
                    style={{
                      fontSize: "0.68rem",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "var(--color-muted)",
                      fontWeight: 500,
                    }}
                  >
                    Showroom Hours
                  </p>
                </div>
                {HOURS.map((h, i) => (
                  <div
                    key={h.d}
                    className="hour-row"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.875rem 1.5rem",
                      borderBottom:
                        i < HOURS.length - 1
                          ? "1px solid var(--color-border)"
                          : "none",
                      background: "var(--color-surface)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.8125rem",
                        color: "var(--color-charcoal)",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {h.d}
                    </span>
                    <span
                      style={{
                        fontSize: "0.8125rem",
                        color: "var(--color-muted)",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {h.h}
                    </span>
                  </div>
                ))}
              </div>

              {/* Map placeholder */}
              <div
                style={{
                  marginTop: "2rem",
                  borderRadius: "4px",
                  overflow: "hidden",
                  border: "1px solid var(--color-border)",
                  aspectRatio: "16/9",
                  background: "var(--color-canvas)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=60"
                  alt="Location"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: 0.5,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      background: "var(--color-deep)",
                      color: "#fff",
                      padding: "0.75rem 1.25rem",
                      borderRadius: "2px",
                      fontSize: "0.75rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      border: "1px solid rgba(201,168,76,0.3)",
                    }}
                  >
                    📍 Manhattan, New York
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT — Form */}
            <div
              style={{
                opacity: vis ? 1 : 0,
                animation: vis ? `cSlideR 0.8s ${ease} 0.35s both` : "none",
              }}
            >
              <div
                style={{
                  background: "var(--color-deep)",
                  borderRadius: "4px",
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {/* Gold top bar */}
                <div
                  style={{
                    height: "2px",
                    background: `linear-gradient(90deg, var(--color-gold), rgba(201,168,76,0.3))`,
                  }}
                />

                <div style={{ padding: "2rem 2rem 2.5rem" }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.625rem",
                      fontWeight: 300,
                      color: "#fff",
                      marginBottom: "0.5rem",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Send a Message
                  </h3>
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      color: "rgba(255,255,255,0.4)",
                      marginBottom: "2rem",
                      letterSpacing: "0.02em",
                    }}
                  >
                    We'll get back to you within 2 business hours.
                  </p>

                  {sent ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "3rem 1rem",
                        animation: `popIn 0.5s ${ease} both`,
                      }}
                    >
                      <MdCheckCircle
                        size={48}
                        color="var(--color-gold)"
                        style={{ marginBottom: "1rem" }}
                      />
                      <p
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "1.5rem",
                          fontWeight: 300,
                          color: "#fff",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Message Received
                      </p>
                      <p
                        style={{
                          fontSize: "0.875rem",
                          color: "rgba(255,255,255,0.45)",
                          lineHeight: 1.7,
                        }}
                      >
                        Thank you for reaching out. A specialist will contact
                        you shortly.
                      </p>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleSubmit}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                      }}
                    >
                      {/* Name + Phone row */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr",
                          gap: "1rem",
                        }}
                        className="form-row"
                      >
                        <style>{`@media(min-width:480px){.form-row{grid-template-columns:1fr 1fr!important}}`}</style>
                        <div>
                          <label
                            style={{
                              display: "block",
                              fontSize: "0.65rem",
                              letterSpacing: "0.18em",
                              textTransform: "uppercase",
                              color: "rgba(255,255,255,0.4)",
                              marginBottom: "0.5rem",
                            }}
                          >
                            Full Name *
                          </label>
                          <input
                            className="c-input"
                            type="text"
                            placeholder="John Smith"
                            value={form.name}
                            onChange={(e) => set("name", e.target.value)}
                            required
                            style={inputStyle}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              display: "block",
                              fontSize: "0.65rem",
                              letterSpacing: "0.18em",
                              textTransform: "uppercase",
                              color: "rgba(255,255,255,0.4)",
                              marginBottom: "0.5rem",
                            }}
                          >
                            Phone
                          </label>
                          <input
                            className="c-input"
                            type="tel"
                            placeholder="+1 (234) 000-0000"
                            value={form.phone}
                            onChange={(e) => set("phone", e.target.value)}
                            style={inputStyle}
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "0.65rem",
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.4)",
                            marginBottom: "0.5rem",
                          }}
                        >
                          Email Address *
                        </label>
                        <input
                          className="c-input"
                          type="email"
                          placeholder="john@example.com"
                          value={form.email}
                          onChange={(e) => set("email", e.target.value)}
                          required
                          style={inputStyle}
                        />
                      </div>

                      {/* Interest */}
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "0.65rem",
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.4)",
                            marginBottom: "0.5rem",
                          }}
                        >
                          I'm interested in
                        </label>
                        <select
                          className="c-input"
                          value={form.interest}
                          onChange={(e) => set("interest", e.target.value)}
                          style={{
                            ...inputStyle,
                            appearance: "none",
                            WebkitAppearance: "none",
                          }}
                        >
                          <option value="">Select an option…</option>
                          <option value="buying">Buying a vehicle</option>
                          <option value="selling">Selling my vehicle</option>
                          <option value="finance">Financing options</option>
                          <option value="test-drive">
                            Booking a test drive
                          </option>
                          <option value="other">General enquiry</option>
                        </select>
                      </div>

                      {/* Message */}
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "0.65rem",
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.4)",
                            marginBottom: "0.5rem",
                          }}
                        >
                          Message *
                        </label>
                        <textarea
                          className="c-input"
                          placeholder="Tell us what you're looking for…"
                          value={form.message}
                          onChange={(e) => set("message", e.target.value)}
                          required
                          rows={4}
                          style={{
                            ...inputStyle,
                            resize: "none",
                            lineHeight: 1.65,
                          }}
                        />
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={sending}
                        className="c-submit"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          width: "100%",
                          padding: "0.9375rem",
                          background: "var(--color-gold)",
                          color: "#fff",
                          fontSize: "0.78rem",
                          fontWeight: 500,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          border: "none",
                          borderRadius: "2px",
                          fontFamily: "var(--font-body)",
                          cursor: "pointer",
                          boxShadow: "0 4px 20px rgba(201,168,76,0.3)",
                          marginTop: "0.5rem",
                        }}
                      >
                        {sending ? (
                          <>
                            <div
                              style={{
                                width: "14px",
                                height: "14px",
                                border: "1.5px solid rgba(255,255,255,0.4)",
                                borderTopColor: "#fff",
                                borderRadius: "50%",
                                animation: "spin 0.7s linear infinite",
                              }}
                            />
                            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                            Sending…
                          </>
                        ) : (
                          <>
                            Send Message
                            <MdArrowForward size={15} />
                          </>
                        )}
                      </button>

                      <p
                        style={{
                          fontSize: "0.7rem",
                          color: "rgba(255,255,255,0.25)",
                          textAlign: "center",
                          letterSpacing: "0.04em",
                          marginTop: "0.25rem",
                        }}
                      >
                        Your information is kept strictly confidential.
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}