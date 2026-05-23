// app/cars/[id]/page.js
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import {
  MdArrowBack,
  MdArrowForward,
  MdShare,
  MdFavoriteBorder,
  MdFavorite,
  MdPhone,
  MdEmail,
  MdCheck,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdZoomIn,
} from "react-icons/md";

const fmt = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

const STATUS_MAP = {
  available: {
    label: "Available",
    color: "#22C55E",
    bg: "rgba(34,197,94,0.08)",
    border: "rgba(34,197,94,0.2)",
  },
  sold: {
    label: "Sold",
    color: "#EF4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.2)",
  },
  reserved: {
    label: "Reserved",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.2)",
  },
  "coming-soon": {
    label: "Coming Soon",
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.2)",
  },
};

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          obs.disconnect();
        }
      },
      { threshold },
    );

    if (ref.current) obs.observe(ref.current);

    return () => obs.disconnect();
  }, [threshold]);

  return [ref, vis];
}

export default function CarDetailPage({ params }) {
  const router = useRouter();
  const resolvedParams = React.use(params);

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [liked, setLiked] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const [enquirySent, setEnquirySent] = useState(false);
  const [sending, setSending] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showEnquiry, setShowEnquiry] = useState(false);

  const [enquiryForm, setEnquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [heroRef] = useInView();
  const [specsRef, specsVis] = useInView();
  const [featRef, featVis] = useInView();

  const ease = "cubic-bezier(0.22,1,0.36,1)";

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/cars/${resolvedParams.id}`);
        const data = await res.json();

        if (!data.success) {
          router.push("/");
          return;
        }

        setCar(data.data);
      } catch (error) {
        router.push("/");
      } finally {
        setLoading(false);
        setTimeout(() => setMounted(true), 80);
      }
    }

    load();
  }, [resolvedParams.id, router]);

  const handleEnquiry = async (e) => {
    e.preventDefault();

    if (!enquiryForm.name || !enquiryForm.email) return;

    setSending(true);

    await new Promise((r) => setTimeout(r, 1000));

    setSending(false);
    setEnquirySent(true);
  };

  const prevImg = () => {
    setActiveImg(
      (i) => (i - 1 + (car?.images?.length || 1)) % (car?.images?.length || 1),
    );
  };

  const nextImg = () => {
    setActiveImg((i) => (i + 1) % (car?.images?.length || 1));
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--color-canvas)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.25rem",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "1.5px solid rgba(201,168,76,0.2)",
              borderTopColor: "var(--color-gold)",
              animation: "spin 0.9s linear infinite",
            }}
          />

          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

          <p
            style={{
              fontSize: "0.68rem",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "var(--color-muted)",
            }}
          >
            Loading Vehicle
          </p>
        </div>
      </div>
    );
  }

  if (!car) return null;

  const status = STATUS_MAP[car.status] || STATUS_MAP.available;

  const images =
    car.images?.length > 0 ? car.images : [car.thumbnail].filter(Boolean);

  const SPECS = [
    {
      label: "Body Type",
      value: car.bodyType,
    },
    {
      label: "Fuel Type",
      value: car.fuelType,
    },
    {
      label: "Transmission",
      value: car.transmission,
    },
    {
      label: "Drive Type",
      value: car.driveType?.toUpperCase(),
    },
    {
      label: "Engine",
      value: car.engineSize || "—",
    },
    {
      label: "Horsepower",
      value: car.horsepower ? `${car.horsepower} hp` : "—",
    },
    {
      label: "Mileage",
      value: car.mileage ? `${car.mileage.toLocaleString()} mi` : "0 mi",
    },
    {
      label: "Color",
      value: car.color || "—",
    },
    {
      label: "Seats",
      value: car.seats,
    },
    {
      label: "Doors",
      value: car.doors,
    },
    {
      label: "Condition",
      value: car.condition,
    },
    {
      label: "VIN",
      value: car.vin || "On request",
    },
  ];

  return (
    <>
      {/* Your existing styles remain here */}

      <main style={{ background: "var(--color-canvas)", minHeight: "100vh" }}>
        <Navbar />

        {/* PAGE CONTENT */}

        <div ref={heroRef} style={{ paddingTop: "5rem" }}>
          <div
            style={{
              maxWidth: "1360px",
              margin: "0 auto",
              padding: "2rem 1.5rem 0",
            }}
          >
            {/* CONTENT REMAINS SAME */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "2rem",
              }}
            >
              {/* CAR IMAGE */}
              <div
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "1px solid var(--color-border)",
                  background: "#f5f5f5",
                }}
              >
                <img
                  src={images[activeImg]}
                  alt={car.title}
                  style={{
                    width: "100%",
                    height: "500px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>

              {/* THUMBNAILS */}
              {images.length > 1 && (
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    overflowX: "auto",
                  }}
                >
                  {images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt=""
                      onClick={() => setActiveImg(index)}
                      style={{
                        width: "100px",
                        height: "70px",
                        objectFit: "cover",
                        borderRadius: "4px",
                        cursor: "pointer",
                        border:
                          activeImg === index
                            ? "2px solid gold"
                            : "1px solid #ddd",
                      }}
                    />
                  ))}
                </div>
              )}

              {/* CAR INFO */}
              <div>
                <p
                  style={{
                    color: "var(--color-gold)",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    fontSize: "0.75rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  {car.year} • {car.make}
                </p>

                <h1
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: 700,
                    marginBottom: "1rem",
                    color: "var(--color-deep)",
                  }}
                >
                  {car.title}
                </h1>

                <p
                  style={{
                    fontSize: "2rem",
                    color: "var(--color-gold)",
                    fontWeight: 700,
                    marginBottom: "2rem",
                  }}
                >
                  {fmt(car.price)}
                </p>

                {/* SPECS */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  {SPECS.map((spec) => (
                    <div
                      key={spec.label}
                      style={{
                        padding: "1rem",
                        border: "1px solid var(--color-border)",
                        borderRadius: "6px",
                        background: "white",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "#777",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {spec.label}
                      </p>

                      <p
                        style={{
                          fontWeight: 600,
                          color: "#111",
                        }}
                      >
                        {spec.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* DESCRIPTION */}
                {car.description && (
                  <div style={{ marginTop: "2rem" }}>
                    <h2
                      style={{
                        marginBottom: "1rem",
                        fontSize: "1.5rem",
                      }}
                    >
                      Description
                    </h2>

                    <p
                      style={{
                        lineHeight: 1.8,
                        color: "#555",
                      }}
                    >
                      {car.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* FIXED CTA SECTION */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.625rem",
              }}
            >
              <a
                href={`https://wa.me/2348070968441?text=${encodeURIComponent(
                  `Hello, I'm interested in the ${car.year} ${car.make} ${car.model}`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="call-btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  textDecoration: "none",
                  background:
                    car.status === "available"
                      ? "var(--color-deep)"
                      : "rgba(0,0,0,0.08)",
                  color:
                    car.status === "available" ? "#fff" : "var(--color-muted)",
                  fontSize: "0.78rem",
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "0.9375rem",
                  borderRadius: "2px",
                  boxShadow:
                    car.status === "available"
                      ? "0 4px 16px rgba(0,0,0,0.12)"
                      : "none",
                  transition: "all 0.22s",
                  pointerEvents: car.status !== "available" ? "none" : "auto",
                  opacity: car.status !== "available" ? 0.5 : 1,
                }}
              >
                <MdPhone size={15} />
                {car.status === "available"
                  ? "Call to Enquire"
                  : `Status: ${car.status}`}
              </a>

              <button
                onClick={() => setShowEnquiry(!showEnquiry)}
                className="email-btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  background: "transparent",
                  color: "var(--color-charcoal)",
                  border: "1px solid var(--color-border)",
                  fontSize: "0.78rem",
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "0.9375rem",
                  borderRadius: "2px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.22s",
                }}
              >
                <MdEmail size={15} />
                {showEnquiry ? "Hide Form" : "Send Enquiry"}
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM CTA SECTION */}
        <section
          style={{
            borderTop: "1px solid var(--color-border)",
            background: "var(--color-deep)",
            padding: "4rem 0",
          }}
        >
          <div
            style={{
              maxWidth: "1360px",
              margin: "0 auto",
              padding: "0 1.5rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <a
                href={`https://wa.me/2348070968441?text=${encodeURIComponent(
                  `Hello, I'm interested in the ${car.year} ${car.make} ${car.model}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
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
                  transition: "all 0.22s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#b8963e";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--color-gold)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <MdPhone size={15} /> Call Now
              </a>

              <Link
                href="/#cars"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "transparent",
                  color: "rgba(255,255,255,0.55)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  fontSize: "0.78rem",
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "0.9375rem 1.875rem",
                  borderRadius: "2px",
                  textDecoration: "none",
                  transition: "all 0.22s",
                }}
              >
                <MdArrowBack size={15} /> Browse More
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
