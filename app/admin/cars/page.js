// app/admin/cars/page.js
"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  MdAdd,
  MdSearch,
  MdDelete,
  MdEdit,
  MdDirectionsCar,
  MdStar,
  MdStarBorder,
  MdArrowForward,
  MdFilterList,
  MdClose,
  MdArrowUpward,
  MdArrowDownward,
} from "react-icons/md";

// ── Status badge ───────────────────────────────────────────────────
function StatusBadge({ status }) {
  const MAP = {
    available: {
      bg: "rgba(74,222,128,0.09)",
      color: "#4ADE80",
      dot: "#4ADE80",
    },
    sold: { bg: "rgba(248,113,113,0.09)", color: "#F87171", dot: "#F87171" },
    reserved: { bg: "rgba(251,191,36,0.09)", color: "#FBBF24", dot: "#FBBF24" },
    "coming-soon": {
      bg: "rgba(96,165,250,0.09)",
      color: "#60A5FA",
      dot: "#60A5FA",
    },
  };
  const s = MAP[status] || MAP.available;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "3px 8px",
        borderRadius: "2px",
        background: s.bg,
        fontSize: "0.65rem",
        fontWeight: 500,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: s.color,
      }}
    >
      <span
        style={{
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          background: s.dot,
          flexShrink: 0,
        }}
      />
      {status}
    </span>
  );
}

// ── Skeleton row ───────────────────────────────────────────────────
function SkeletonRow({ i }) {
  return (
    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      {[140, 80, 110, 80, 50, 60].map((w, j) => (
        <td key={j} style={{ padding: "1rem 1.25rem" }}>
          <div
            style={{
              height: "12px",
              borderRadius: "2px",
              width: `${w}px`,
              background: "rgba(255,255,255,0.06)",
              animation: `skelPulse 1.6s ease ${i * 0.08 + j * 0.03}s infinite`,
            }}
          />
        </td>
      ))}
    </tr>
  );
}

// ── Main page ──────────────────────────────────────────────────────
export default function AdminCarsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [deleting, setDeleting] = useState(null);
  const [featuring, setFeaturing] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showSearch, setShowSearch] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  const fmt = (n) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  useEffect(() => {
    setTimeout(() => setMounted(true), 60);
  }, []);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 12,
        status,
        sortBy,
        order: sortOrder,
        ...(search && { search }),
      });
      const res = await fetch(`/api/cars?${params}`);
      const data = await res.json();
      setCars(data.data || []);
      setPagination(data.pagination || {});
    } catch {
      toast.error("Failed to load listings");
    } finally {
      setLoading(false);
    }
  }, [page, status, search, sortBy, sortOrder]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const handleDelete = async (id) => {
    setDeleting(id);
    setConfirmId(null);
    try {
      const res = await fetch(`/api/cars/${id}`, { method: "DELETE" });
      const data = await res.json();
      data.success
        ? toast.success("Listing removed")
        : toast.error(data.message);
      if (data.success) fetchCars();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleFeatured = async (id) => {
    setFeaturing(id);
    try {
      const res = await fetch(`/api/cars/${id}/featured`, { method: "PATCH" });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        fetchCars();
      }
    } catch {
      toast.error("Failed to update");
    } finally {
      setFeaturing(null);
    }
  };

  const toggleSort = (col) => {
    if (sortBy === col) setSortOrder((o) => (o === "desc" ? "asc" : "desc"));
    else {
      setSortBy(col);
      setSortOrder("desc");
    }
    setPage(1);
  };

  const ease = "cubic-bezier(0.22,1,0.36,1)";

  // Column header helper
  const ColHead = ({ label, col, right }) => {
    const active = sortBy === col;
    return (
      <th
        onClick={col ? () => toggleSort(col) : undefined}
        style={{
          textAlign: right ? "right" : "left",
          padding: "0.625rem 1.25rem",
          fontSize: "0.58rem",
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: active ? "rgba(201,168,76,0.8)" : "rgba(255,255,255,0.22)",
          whiteSpace: "nowrap",
          cursor: col ? "pointer" : "default",
          userSelect: "none",
          transition: "color 0.18s",
        }}
        onMouseEnter={(e) => {
          if (col) e.currentTarget.style.color = "rgba(255,255,255,0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = active
            ? "rgba(201,168,76,0.8)"
            : "rgba(255,255,255,0.22)";
        }}
      >
        <span
          style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
        >
          {label}
          {col &&
            active &&
            (sortOrder === "desc" ? (
              <MdArrowDownward size={10} color="#C9A84C" />
            ) : (
              <MdArrowUpward size={10} color="#C9A84C" />
            ))}
        </span>
      </th>
    );
  };

  return (
    <>
      <style>{`
        @keyframes pageIn    { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin      { to{transform:rotate(360deg)} }
        @keyframes skelPulse { 0%,100%{opacity:0.45} 50%{opacity:0.8} }
        @keyframes rowIn     { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:translateX(0)} }
        @keyframes confirmIn { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }

        .car-row        { transition:background 0.15s; }
        .car-row:hover  { background:rgba(201,168,76,0.035)!important; }
        .edit-btn       { transition:all 0.16s; }
        .edit-btn:hover { background:rgba(255,255,255,0.06)!important; color:#fff!important; }
        .del-btn        { transition:all 0.16s; }
        .del-btn:hover  { background:rgba(248,113,113,0.08)!important; color:#F87171!important; }
        .feat-btn       { transition:all 0.2s; }
        .feat-btn:hover { transform:scale(1.15); }
        .status-pill    { transition:all 0.18s; cursor:pointer; }
        .status-pill:hover { opacity:0.75; }
        .add-car-btn    { transition:all 0.2s; }
        .add-car-btn:hover { background:#b8963e!important; transform:translateY(-1px); box-shadow:0 6px 22px rgba(201,168,76,0.4)!important; }
        .page-btn       { transition:all 0.18s; }
        .page-btn:hover:not(:disabled) { background:rgba(255,255,255,0.06)!important; color:#fff!important; border-color:rgba(255,255,255,0.15)!important; }
        .page-btn:disabled { opacity:0.28; cursor:not-allowed; }
        .filter-pill    { transition:all 0.18s; cursor:pointer; }
        .filter-pill:hover { border-color:rgba(255,255,255,0.2)!important; color:rgba(255,255,255,0.6)!important; }
        .filter-pill.active { border-color:rgba(201,168,76,0.4)!important; color:#C9A84C!important; background:rgba(201,168,76,0.07)!important; }
        select option   { background:#1A1A1A; color:#fff; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#111111",
          padding: "2.5rem 1.25rem 4rem",
          opacity: mounted ? 1 : 0,
          animation: mounted ? `pageIn 0.55s ${ease} both` : "none",
          marginLeft: 40,
          marginRight: 40,
        }}
        className="md:px-10"
      >
        {/* ── Page header ── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "0.5rem",
              }}
            >
              <div
                style={{ width: "20px", height: "1px", background: "#C9A84C" }}
              />
              <span
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "#C9A84C",
                  fontWeight: 500,
                }}
              >
                Inventory
              </span>
            </div>
            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "#fff",
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
              }}
            >
              All Vehicles
            </h1>
            <p
              style={{
                fontSize: "0.78rem",
                color: "rgba(255,255,255,0.28)",
                marginTop: "0.375rem",
                letterSpacing: "0.02em",
              }}
            >
              {pagination.total ?? 0} total listing
              {pagination.total !== 1 ? "s" : ""}
            </p>
          </div>

          <Link
            href="/admin/add-car"
            className="add-car-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "#C9A84C",
              color: "#fff",
              fontSize: "0.72rem",
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "0.6875rem 1.25rem",
              borderRadius: "2px",
              textDecoration: "none",
              boxShadow: "0 4px 16px rgba(201,168,76,0.3)",
            }}
          >
            <MdAdd size={15} /> Add Car
          </Link>
        </div>

        {/* ── Toolbar ── */}
        <div
          style={{
            background: "#1A1A1A",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "4px",
            padding: "1rem 1.25rem",
            marginBottom: "1.25rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
            alignItems: "center",
          }}
        >
          {/* Search */}
          <div style={{ position: "relative", flex: 1, minWidth: "180px" }}>
            <MdSearch
              size={14}
              style={{
                position: "absolute",
                left: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "rgba(255,255,255,0.25)",
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              placeholder="Search make, model, title…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "3px",
                padding: "0.625rem 0.75rem 0.625rem 2.125rem",
                fontSize: "0.8rem",
                color: "#fff",
                fontFamily: "inherit",
                outline: "none",
                caretColor: "#C9A84C",
                letterSpacing: "0.02em",
                transition: "border-color 0.18s",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(201,168,76,0.45)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255,255,255,0.08)")
              }
            />
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                style={{
                  position: "absolute",
                  right: "0.625rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.25)",
                  display: "flex",
                  padding: 0,
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#F87171")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.25)")
                }
              >
                <MdClose size={13} />
              </button>
            )}
          </div>

          {/* Divider */}
          <div
            style={{
              width: "1px",
              height: "24px",
              background: "rgba(255,255,255,0.07)",
              flexShrink: 0,
            }}
            className="hidden sm:block"
          />

          {/* Status filter pills */}
          <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
            {[
              { v: "all", l: "All" },
              { v: "available", l: "Available" },
              { v: "reserved", l: "Reserved" },
              { v: "coming-soon", l: "Coming Soon" },
              { v: "sold", l: "Sold" },
            ].map((opt) => (
              <button
                key={opt.v}
                onClick={() => {
                  setStatus(opt.v);
                  setPage(1);
                }}
                className={`filter-pill ${status === opt.v ? "active" : ""}`}
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "4px 10px",
                  borderRadius: "2px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background:
                    status === opt.v ? "rgba(201,168,76,0.07)" : "transparent",
                  color: status === opt.v ? "#C9A84C" : "rgba(255,255,255,0.3)",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  borderColor:
                    status === opt.v
                      ? "rgba(201,168,76,0.4)"
                      : "rgba(255,255,255,0.08)",
                }}
              >
                {opt.l}
              </button>
            ))}
          </div>

          {/* Results count */}
          {!loading && cars.length > 0 && (
            <span
              style={{
                marginLeft: "auto",
                fontSize: "0.7rem",
                color: "rgba(255,255,255,0.2)",
                letterSpacing: "0.06em",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {cars.length} of {pagination.total}
            </span>
          )}
        </div>

        {/* ── Table card ── */}
        <div
          style={{
            background: "#1A1A1A",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          {/* Empty */}
          {!loading && cars.length === 0 ? (
            <div style={{ padding: "5rem 2rem", textAlign: "center" }}>
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "3px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.25rem",
                }}
              >
                <MdDirectionsCar size={22} color="rgba(255,255,255,0.18)" />
              </div>
              <p
                style={{
                  fontSize: "0.9375rem",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.4)",
                  marginBottom: "0.375rem",
                }}
              >
                No vehicles found
              </p>
              <p
                style={{
                  fontSize: "0.78rem",
                  color: "rgba(255,255,255,0.2)",
                  marginBottom: "1.5rem",
                  letterSpacing: "0.02em",
                }}
              >
                {search || status !== "all"
                  ? "Try adjusting your filters"
                  : "Add your first listing to get started"}
              </p>
              {search || status !== "all" ? (
                <button
                  onClick={() => {
                    setSearch("");
                    setStatus("all");
                    setPage(1);
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "0.625rem 1.125rem",
                    borderRadius: "2px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "transparent",
                    color: "rgba(255,255,255,0.4)",
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.18s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.4)";
                  }}
                >
                  <MdClose size={13} /> Clear filters
                </button>
              ) : (
                <Link
                  href="/admin/add-car"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "0.625rem 1.25rem",
                    borderRadius: "2px",
                    background: "#C9A84C",
                    color: "#fff",
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  <MdAdd size={14} /> Add First Car
                </Link>
              )}
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                {/* Head */}
                <thead>
                  <tr
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      background: "rgba(255,255,255,0.01)",
                    }}
                  >
                    <ColHead label="Vehicle" col="title" />
                    <ColHead label="Price" col="price" />
                    <ColHead label="Specs" />
                    <ColHead label="Status" col="status" />
                    <ColHead label="Featured" />
                    <ColHead label="Actions" right />
                  </tr>
                </thead>

                <tbody>
                  {loading
                    ? Array.from({ length: 8 }).map((_, i) => (
                        <SkeletonRow key={i} i={i} />
                      ))
                    : cars.map((car, i) => (
                        <tr
                          key={car._id}
                          className="car-row"
                          style={{
                            borderBottom: "1px solid rgba(255,255,255,0.04)",
                            opacity: mounted ? 1 : 0,
                            animation: mounted
                              ? `rowIn 0.4s ${ease} ${0.04 + i * 0.04}s both`
                              : "none",
                          }}
                        >
                          {/* ── Vehicle ── */}
                          <td style={{ padding: "0.875rem 1.25rem" }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                              }}
                            >
                              {/* Thumbnail */}
                              <div
                                style={{
                                  width: "48px",
                                  height: "36px",
                                  borderRadius: "2px",
                                  overflow: "hidden",
                                  flexShrink: 0,
                                  background: "rgba(255,255,255,0.04)",
                                  border: "1px solid rgba(255,255,255,0.06)",
                                }}
                              >
                                {car.thumbnail ? (
                                  <img
                                    src={car.thumbnail}
                                    alt={car.title}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                      display: "block",
                                    }}
                                  />
                                ) : (
                                  <div
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <MdDirectionsCar
                                      size={16}
                                      color="rgba(255,255,255,0.15)"
                                    />
                                  </div>
                                )}
                              </div>
                              {/* Info */}
                              <div style={{ minWidth: 0 }}>
                                <p
                                  style={{
                                    fontSize: "0.8125rem",
                                    fontWeight: 500,
                                    color: "#fff",
                                    letterSpacing: "0.01em",
                                    lineHeight: 1.3,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    maxWidth: "180px",
                                  }}
                                >
                                  {car.title}
                                </p>
                                <p
                                  style={{
                                    fontSize: "0.68rem",
                                    color: "rgba(255,255,255,0.3)",
                                    marginTop: "2px",
                                    letterSpacing: "0.06em",
                                  }}
                                >
                                  {car.year} · {car.make} {car.model}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* ── Price ── */}
                          <td
                            style={{
                              padding: "0.875rem 1.25rem",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "0.8125rem",
                                fontWeight: 600,
                                color: "#fff",
                                letterSpacing: "0.02em",
                              }}
                            >
                              {fmt(car.price)}
                            </span>
                          </td>

                          {/* ── Specs ── */}
                          <td style={{ padding: "0.875rem 1.25rem" }}>
                            <p
                              style={{
                                fontSize: "0.72rem",
                                color: "rgba(255,255,255,0.4)",
                                textTransform: "capitalize",
                                letterSpacing: "0.04em",
                              }}
                            >
                              {car.transmission} · {car.fuelType}
                            </p>
                            <p
                              style={{
                                fontSize: "0.68rem",
                                color: "rgba(255,255,255,0.22)",
                                marginTop: "2px",
                                letterSpacing: "0.04em",
                              }}
                            >
                              {car.mileage?.toLocaleString() || 0} mi
                            </p>
                          </td>

                          {/* ── Status ── */}
                          <td style={{ padding: "0.875rem 1.25rem" }}>
                            <StatusBadge status={car.status} />
                          </td>

                          {/* ── Featured ── */}
                          <td style={{ padding: "0.875rem 1.25rem" }}>
                            {featuring === car._id ? (
                              <div
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  border: "1.5px solid rgba(201,168,76,0.3)",
                                  borderTopColor: "#C9A84C",
                                  borderRadius: "50%",
                                  animation: "spin 0.7s linear infinite",
                                }}
                              />
                            ) : (
                              <button
                                onClick={() => handleToggleFeatured(car._id)}
                                className="feat-btn"
                                title={
                                  car.isFeatured
                                    ? "Remove from featured"
                                    : "Mark as featured"
                                }
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  display: "flex",
                                  padding: 0,
                                }}
                              >
                                {car.isFeatured ? (
                                  <MdStar size={18} color="#C9A84C" />
                                ) : (
                                  <MdStarBorder
                                    size={18}
                                    color="rgba(255,255,255,0.2)"
                                  />
                                )}
                              </button>
                            )}
                          </td>

                          {/* ── Actions ── */}
                          <td style={{ padding: "0.875rem 1.25rem" }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.375rem",
                                justifyContent: "flex-end",
                              }}
                            >
                              {/* Edit */}
                              <Link
                                href={`/admin/cars/${car._id}/edit`}
                                className="edit-btn"
                                title="Edit listing"
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  borderRadius: "2px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  background: "rgba(255,255,255,0.04)",
                                  border: "1px solid rgba(255,255,255,0.07)",
                                  color: "rgba(255,255,255,0.4)",
                                  textDecoration: "none",
                                }}
                              >
                                <MdEdit size={14} />
                              </Link>

                              {/* Delete — confirm inline */}
                              {confirmId === car._id ? (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    animation: `confirmIn 0.2s ${ease} both`,
                                  }}
                                >
                                  <button
                                    onClick={() => handleDelete(car._id)}
                                    disabled={deleting === car._id}
                                    style={{
                                      height: "30px",
                                      padding: "0 8px",
                                      borderRadius: "2px",
                                      background: "rgba(248,113,113,0.12)",
                                      border: "1px solid rgba(248,113,113,0.3)",
                                      color: "#F87171",
                                      fontSize: "0.65rem",
                                      fontWeight: 600,
                                      letterSpacing: "0.1em",
                                      textTransform: "uppercase",
                                      cursor: "pointer",
                                      fontFamily: "inherit",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "4px",
                                    }}
                                  >
                                    {deleting === car._id ? (
                                      <div
                                        style={{
                                          width: "12px",
                                          height: "12px",
                                          border:
                                            "1.5px solid rgba(248,113,113,0.4)",
                                          borderTopColor: "#F87171",
                                          borderRadius: "50%",
                                          animation:
                                            "spin 0.7s linear infinite",
                                        }}
                                      />
                                    ) : (
                                      "Confirm"
                                    )}
                                  </button>
                                  <button
                                    onClick={() => setConfirmId(null)}
                                    style={{
                                      width: "30px",
                                      height: "30px",
                                      borderRadius: "2px",
                                      background: "rgba(255,255,255,0.04)",
                                      border:
                                        "1px solid rgba(255,255,255,0.07)",
                                      color: "rgba(255,255,255,0.3)",
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <MdClose size={12} />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setConfirmId(car._id)}
                                  className="del-btn"
                                  title="Delete listing"
                                  style={{
                                    width: "30px",
                                    height: "30px",
                                    borderRadius: "2px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: "rgba(255,255,255,0.04)",
                                    border: "1px solid rgba(255,255,255,0.07)",
                                    color: "rgba(255,255,255,0.35)",
                                    cursor: "pointer",
                                  }}
                                >
                                  <MdDelete size={14} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── Pagination ── */}
          {pagination.pages > 1 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem 1.25rem",
                borderTop: "1px solid rgba(255,255,255,0.05)",
                background: "rgba(255,255,255,0.01)",
                flexWrap: "wrap",
                gap: "0.75rem",
              }}
            >
              <p
                style={{
                  fontSize: "0.72rem",
                  color: "rgba(255,255,255,0.25)",
                  letterSpacing: "0.06em",
                }}
              >
                Page{" "}
                <span style={{ color: "rgba(255,255,255,0.5)" }}>
                  {pagination.page}
                </span>{" "}
                of{" "}
                <span style={{ color: "rgba(255,255,255,0.5)" }}>
                  {pagination.pages}
                </span>
              </p>

              <div style={{ display: "flex", gap: "0.375rem" }}>
                {/* Prev */}
                <button
                  className="page-btn"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!pagination.hasPrev}
                  style={{
                    padding: "0.5rem 0.875rem",
                    borderRadius: "2px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "transparent",
                    color: "rgba(255,255,255,0.35)",
                    fontSize: "0.72rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  ← Prev
                </button>

                {/* Page numbers */}
                {Array.from(
                  { length: Math.min(5, pagination.pages) },
                  (_, i) => {
                    const p =
                      pagination.pages <= 5
                        ? i + 1
                        : Math.max(
                            1,
                            Math.min(pagination.pages - 4, page - 2),
                          ) + i;
                    const active = p === page;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className="page-btn"
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "2px",
                          border: `1px solid ${active ? "rgba(201,168,76,0.45)" : "rgba(255,255,255,0.08)"}`,
                          background: active
                            ? "rgba(201,168,76,0.1)"
                            : "transparent",
                          color: active ? "#C9A84C" : "rgba(255,255,255,0.35)",
                          fontSize: "0.78rem",
                          fontWeight: active ? 600 : 400,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          boxShadow: active
                            ? "0 2px 8px rgba(201,168,76,0.15)"
                            : "none",
                        }}
                      >
                        {p}
                      </button>
                    );
                  },
                )}

                {/* Next */}
                <button
                  className="page-btn"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!pagination.hasNext}
                  style={{
                    padding: "0.5rem 0.875rem",
                    borderRadius: "2px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "transparent",
                    color: "rgba(255,255,255,0.35)",
                    fontSize: "0.72rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
