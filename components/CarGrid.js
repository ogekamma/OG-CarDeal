// components/CarGrid.js
"use client";

import { useState, useEffect, useCallback } from "react";
import CarCard from "./CarCard";
import { MdSearch, MdTune, MdClose } from "react-icons/md";

const BODY_TYPES = [
  "sedan",
  "suv",
  "coupe",
  "hatchback",
  "truck",
  "van",
  "convertible",
  "wagon",
];
const FUEL_TYPES = ["petrol", "diesel", "electric", "hybrid", "plug-in-hybrid"];
const TRANSMISSION = ["automatic", "manual", "cvt"];
const SORT_OPTIONS = [
  { v: "createdAt_desc", l: "Newest First" },
  { v: "price_asc", l: "Price: Low → High" },
  { v: "price_desc", l: "Price: High → Low" },
  { v: "year_desc", l: "Year: Newest" },
  { v: "views_desc", l: "Most Viewed" },
];

export default function CarGrid({ featured = false }) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debSearch, setDebSearch] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [trans, setTrans] = useState("");
  const [sort, setSort] = useState("createdAt_desc");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebSearch(search), 380);
    return () => clearTimeout(t);
  }, [search]);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const [sortBy, order] = sort.split("_");
      const params = new URLSearchParams({
        page,
        limit: featured ? 6 : 12,
        status: "available",
        sortBy,
        order,
        ...(featured && { featured: "true" }),
        ...(debSearch && { search: debSearch }),
        ...(bodyType && { bodyType }),
        ...(fuelType && { fuelType }),
        ...(trans && { transmission: trans }),
      });
      const res = await fetch(`/api/cars?${params}`);
      const data = await res.json();
      setCars(data.data || []);
      setPagination(data.pagination || {});
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, debSearch, bodyType, fuelType, trans, sort, featured]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);
  useEffect(() => {
    setPage(1);
  }, [debSearch, bodyType, fuelType, trans, sort]);

  const activeFilters = [bodyType, fuelType, trans].filter(Boolean).length;
  const clearFilters = () => {
    setBodyType("");
    setFuelType("");
    setTrans("");
    setSearch("");
  };

  const selStyle = {
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: "2px",
    padding: "0.625rem 0.875rem",
    fontSize: "0.78rem",
    color: "var(--color-charcoal)",
    cursor: "pointer",
    outline: "none",
    fontFamily: "var(--font-body)",
    appearance: "none",
    WebkitAppearance: "none",
    transition: "border-color 0.2s",
    letterSpacing: "0.04em",
    minWidth: "140px",
  };

  return (
    <>
      <style>{`
        @keyframes spin        { to{transform:rotate(360deg)} }
        @keyframes skelPulse   { 0%,100%{opacity:0.5} 50%{opacity:0.9} }
        @keyframes filterSlide { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        .filter-sel:focus      { border-color:var(--color-gold)!important; }
        .page-btn              { transition:all 0.2s; }
        .page-btn:hover:not(:disabled) { background:var(--color-deep); color:#fff; border-color:var(--color-deep); }
        .page-btn:disabled     { opacity:0.3; cursor:not-allowed; }
      `}</style>

      <section
        id={featured ? "featured" : "cars"}
        style={{
          padding: "5rem 0",
          background: featured ? "var(--color-canvas)" : "var(--color-surface)",
        }}
      >
        <div
          style={{ maxWidth: "1360px", margin: "0 auto", padding: "0 2rem" }}
        >
          {/* Section header */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: "3rem",
              flexWrap: "wrap",
              gap: "1rem",
              paddingBottom: "2rem",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "var(--color-gold)",
                  fontWeight: 500,
                  marginBottom: "0.5rem",
                }}
              >
                {featured ? "Handpicked Collection" : "Our Inventory"}
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 300,
                  fontSize: "clamp(2.25rem,4vw,3.25rem)",
                  color: "var(--color-deep)",
                  letterSpacing: "-0.01em",
                  lineHeight: 1,
                }}
              >
                {featured ? "Featured Vehicles" : "Browse All Cars"}
              </h2>
            </div>

            {!featured && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                {pagination.total > 0 && (
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--color-muted)",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {pagination.total} vehicles
                  </span>
                )}
                <button
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "0.6rem 1rem",
                    border: `1px solid ${filtersOpen || activeFilters > 0 ? "var(--color-gold)" : "var(--color-border)"}`,
                    background:
                      filtersOpen || activeFilters > 0
                        ? "rgba(201,168,76,0.06)"
                        : "transparent",
                    color:
                      filtersOpen || activeFilters > 0
                        ? "var(--color-gold)"
                        : "var(--color-muted)",
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    borderRadius: "2px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    fontFamily: "var(--font-body)",
                    position: "relative",
                  }}
                >
                  <MdTune size={14} />
                  Filters
                  {activeFilters > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: "-7px",
                        right: "-7px",
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        background: "var(--color-gold)",
                        color: "#fff",
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {activeFilters}
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Filter panel */}
          {!featured && filtersOpen && (
            <div
              style={{
                marginBottom: "2rem",
                padding: "1.5rem",
                background: "var(--color-canvas)",
                border: "1px solid var(--color-border)",
                borderRadius: "4px",
                animation:
                  "filterSlide 0.3s cubic-bezier(0.22,1,0.36,1) forwards",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                  alignItems: "center",
                }}
              >
                {/* Search */}
                <div
                  style={{ position: "relative", flex: "1", minWidth: "200px" }}
                >
                  <MdSearch
                    size={14}
                    style={{
                      position: "absolute",
                      left: "0.75rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--color-muted)",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Make, model or keyword…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="filter-sel"
                    style={{
                      ...selStyle,
                      width: "100%",
                      paddingLeft: "2.125rem",
                      minWidth: "unset",
                    }}
                  />
                </div>

                <select
                  className="filter-sel"
                  value={bodyType}
                  onChange={(e) => setBodyType(e.target.value)}
                  style={selStyle}
                >
                  <option value="">Body Type</option>
                  {BODY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>

                <select
                  className="filter-sel"
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  style={selStyle}
                >
                  <option value="">Fuel Type</option>
                  {FUEL_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>

                <select
                  className="filter-sel"
                  value={trans}
                  onChange={(e) => setTrans(e.target.value)}
                  style={selStyle}
                >
                  <option value="">Transmission</option>
                  {TRANSMISSION.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>

                <select
                  className="filter-sel"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  style={selStyle}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.v} value={o.v}>
                      {o.l}
                    </option>
                  ))}
                </select>

                {activeFilters > 0 && (
                  <button
                    onClick={clearFilters}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      background: "transparent",
                      border: "1px solid #fca5a5",
                      color: "#dc2626",
                      fontSize: "0.72rem",
                      letterSpacing: "0.08em",
                      padding: "0.625rem 0.875rem",
                      borderRadius: "2px",
                      cursor: "pointer",
                      fontFamily: "var(--font-body)",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#fef2f2";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <MdClose size={13} /> Clear all
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
                gap: "1.5rem",
              }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    background: "var(--color-canvas)",
                    borderRadius: "4px",
                    border: "1px solid var(--color-border)",
                    aspectRatio: "0.8",
                    animation: `skelPulse 1.6s ease ${i * 0.1}s infinite`,
                  }}
                />
              ))}
            </div>
          ) : cars.length === 0 ? (
            <div style={{ textAlign: "center", padding: "6rem 0" }}>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.75rem",
                  fontWeight: 300,
                  color: "var(--color-muted)",
                  marginBottom: "0.5rem",
                }}
              >
                No vehicles found
              </p>
              <p style={{ fontSize: "0.875rem", color: "var(--color-muted)" }}>
                {activeFilters > 0
                  ? "Try adjusting your filters"
                  : "Check back soon for new listings"}
              </p>
              {activeFilters > 0 && (
                <button
                  onClick={clearFilters}
                  className="btn-outline"
                  style={{ marginTop: "1.5rem" }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
                gap: "1.5rem",
              }}
            >
              {cars.map((car, i) => (
                <CarCard key={car._id} car={car} index={i} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                marginTop: "3.5rem",
              }}
            >
              <button
                className="page-btn"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!pagination.hasPrev}
                style={{
                  padding: "0.6rem 1.25rem",
                  border: "1px solid var(--color-border)",
                  background: "transparent",
                  color: "var(--color-charcoal)",
                  fontSize: "0.78rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  borderRadius: "2px",
                  fontFamily: "var(--font-body)",
                }}
              >
                ← Prev
              </button>

              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                const p =
                  pagination.pages <= 5
                    ? i + 1
                    : Math.max(1, Math.min(pagination.pages - 4, page - 2)) + i;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className="page-btn"
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "2px",
                      border: "1px solid",
                      borderColor:
                        p === page
                          ? "var(--color-deep)"
                          : "var(--color-border)",
                      background:
                        p === page ? "var(--color-deep)" : "transparent",
                      color: p === page ? "#fff" : "var(--color-charcoal)",
                      fontSize: "0.8125rem",
                      cursor: "pointer",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                className="page-btn"
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination.hasNext}
                style={{
                  padding: "0.6rem 1.25rem",
                  border: "1px solid var(--color-border)",
                  background: "transparent",
                  color: "var(--color-charcoal)",
                  fontSize: "0.78rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  borderRadius: "2px",
                  fontFamily: "var(--font-body)",
                }}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
