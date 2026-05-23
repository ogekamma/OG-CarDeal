// components/CarCard.js
"use client";

import { useState } from "react";
import Link from "next/link";
import { MdArrowForward, MdFavoriteBorder, MdFavorite } from "react-icons/md";

const STATUS_MAP = {
  available: { label: "Available", dot: "#22C55E" },
  sold: { label: "Sold", dot: "#EF4444" },
  reserved: { label: "Reserved", dot: "#F59E0B" },
  "coming-soon": { label: "Coming Soon", dot: "#3B82F6" },
};

export default function CarCard({ car, index = 0 }) {
  const [liked, setLiked] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const fmt = (n) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);
  const status = STATUS_MAP[car.status] || STATUS_MAP.available;
  const ease = "cubic-bezier(0.22,1,0.36,1)";

  return (
    <>
      <style>{`
        @keyframes cardReveal { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>

      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "var(--color-surface)",
          border: `1px solid ${hovered ? "rgba(201,168,76,0.4)" : "var(--color-border)"}`,
          borderRadius: "4px",
          overflow: "hidden",
          transition: `all 0.4s ${ease}`,
          transform: hovered ? "translateY(-5px)" : "translateY(0)",
          boxShadow: hovered
            ? "0 20px 48px rgba(0,0,0,0.1), 0 0 0 1px rgba(201,168,76,0.15)"
            : "0 2px 12px rgba(0,0,0,0.04)",
          opacity: 0,
          animation: `cardReveal 0.6s ${ease} ${0.06 * index}s forwards`,
        }}
      >
        {/* Image */}
        <div
          style={{
            position: "relative",
            aspectRatio: "4/3",
            overflow: "hidden",
            background: "#F0EDE8",
          }}
        >
          {car.thumbnail ? (
            <>
              {!loaded && (
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
                      width: "20px",
                      height: "20px",
                      border: "1.5px solid var(--color-border)",
                      borderTopColor: "var(--color-gold)",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                </div>
              )}
              <img
                src={car.thumbnail}
                alt={car.title}
                onLoad={() => setLoaded(true)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: hovered ? "scale(1.05)" : "scale(1)",
                  transition: `transform 0.7s ${ease}`,
                  opacity: loaded ? 1 : 0,
                  transitionProperty: "transform, opacity",
                }}
              />
            </>
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#F0EDE8",
              }}
            >
              <span style={{ fontSize: "3rem", opacity: 0.2 }}>🚗</span>
            </div>
          )}

          {/* Overlay on hover */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(14,14,14,0.5) 0%, transparent 50%)",
              opacity: hovered ? 1 : 0,
              transition: `opacity 0.4s ${ease}`,
              pointerEvents: "none",
            }}
          />

          {/* Status */}
          <div
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              background: "rgba(247,245,240,0.92)",
              backdropFilter: "blur(8px)",
              borderRadius: "2px",
              padding: "4px 9px",
            }}
          >
            <div
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: status.dot,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-charcoal)",
              }}
            >
              {status.label}
            </span>
          </div>

          {/* Featured */}
          {car.isFeatured && (
            <div
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                background: "var(--color-gold)",
                borderRadius: "2px",
                padding: "3px 8px",
              }}
            >
              <span
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#fff",
                }}
              >
                Featured
              </span>
            </div>
          )}

          {/* Like */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setLiked(!liked);
            }}
            style={{
              position: "absolute",
              bottom: "12px",
              right: "12px",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "rgba(247,245,240,0.92)",
              backdropFilter: "blur(8px)",
              border: "1px solid var(--color-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: `all 0.3s ${ease}`,
              opacity: hovered ? 1 : 0,
              transform: hovered
                ? "scale(1) translateY(0)"
                : "scale(0.8) translateY(4px)",
            }}
          >
            {liked ? (
              <MdFavorite size={14} color="var(--color-gold)" />
            ) : (
              <MdFavoriteBorder size={14} color="var(--color-muted)" />
            )}
          </button>

          {/* Quick view on hover */}
          <Link
            href={`/cars/${car._id}`}
            style={{
              position: "absolute",
              bottom: "12px",
              left: "12px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "var(--color-deep)",
              color: "#fff",
              fontSize: "0.68rem",
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "6px 12px",
              borderRadius: "2px",
              textDecoration: "none",
              transition: `all 0.35s ${ease}`,
              opacity: hovered ? 1 : 0,
              transform: hovered ? "translateY(0)" : "translateY(6px)",
            }}
          >
            Quick View <MdArrowForward size={12} />
          </Link>
        </div>

        {/* Body */}
        <div style={{ padding: "1.25rem" }}>
          {/* Make row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.375rem",
            }}
          >
            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--color-gold)",
              }}
            >
              {car.make}
            </span>
            <span
              style={{
                fontSize: "0.68rem",
                color: "var(--color-muted)",
                letterSpacing: "0.08em",
              }}
            >
              {car.year}
            </span>
          </div>

          {/* Title */}
          <h3
            className="line-clamp-2"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.1875rem",
              fontWeight: 400,
              color: "var(--color-deep)",
              lineHeight: 1.3,
              marginBottom: "0.875rem",
              letterSpacing: "0.01em",
            }}
          >
            {car.title}
          </h3>

          {/* Specs */}
          <div
            style={{
              display: "flex",
              gap: "0",
              marginBottom: "1.125rem",
              paddingBottom: "1rem",
              borderBottom: "1px solid var(--color-border)",
              flexWrap: "wrap",
            }}
          >
            {[
              car.fuelType,
              car.transmission,
              car.mileage ? `${(car.mileage / 1000).toFixed(0)}k mi` : "0 mi",
            ].map((spec, i) => (
              <span
                key={i}
                style={{
                  fontSize: "0.72rem",
                  color: "var(--color-muted)",
                  paddingRight: "0.75rem",
                  marginRight: "0.75rem",
                  borderRight: i < 2 ? "1px solid var(--color-border)" : "none",
                  textTransform: "capitalize",
                  letterSpacing: "0.04em",
                }}
              >
                {spec}
              </span>
            ))}
          </div>

          {/* Price + CTA */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "0.58rem",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--color-muted)",
                  marginBottom: "3px",
                }}
              >
                Price
              </p>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                  fontWeight: 400,
                  color: "var(--color-deep)",
                  letterSpacing: "-0.01em",
                  lineHeight: 1,
                }}
              >
                {fmt(car.price)}
              </p>
            </div>

            <Link
              href={`/cars/${car._id}`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                border: `1px solid ${hovered ? "var(--color-deep)" : "var(--color-border)"}`,
                color: hovered ? "var(--color-surface)" : "var(--color-deep)",
                background: hovered ? "var(--color-deep)" : "transparent",
                textDecoration: "none",
                transition: `all 0.3s ${ease}`,
              }}
            >
              <MdArrowForward size={16} />
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
