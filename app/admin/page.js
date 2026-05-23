// app/admin/page.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../lib/useAuth";
import {
  MdDirectionsCar,
  MdAttachMoney,
  MdTrendingUp,
  MdVisibility,
  MdAdd,
  MdStar,
  MdArrowForward,
  MdArrowUpward,
  MdArrowDownward,
  MdMoreVert,
} from "react-icons/md";

// ── Tiny sparkline SVG ─────────────────────────────────────────────
function Sparkline({ color = "#C9A84C", up = true }) {
  const points = up
    ? "0,18 8,15 16,12 24,14 32,9 40,11 48,6 56,8 64,4 72,2"
    : "0,4 8,7 16,5 24,10 32,8 40,13 48,11 56,14 64,16 72,18";
  return (
    <svg width="72" height="20" viewBox="0 0 72 20" fill="none">
      <polyline
        points={points}
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
      <polyline
        points={`${points} 72,20 0,20`}
        stroke="none"
        fill={color}
        opacity="0.08"
      />
    </svg>
  );
}

// ── Stat card ──────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  trend,
  trendUp,
  icon: Icon,
  delay = 0,
}) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVis(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      style={{
        background: "#1A1A1A",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "4px",
        padding: "1.5rem",
        position: "relative",
        overflow: "hidden",
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(16px)",
        transition:
          "opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1), border-color 0.2s",
        cursor: "default",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = "rgba(201,168,76,0.25)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")
      }
    >
      {/* Top row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "1.25rem",
        }}
      >
        <div
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "3px",
            background: "rgba(201,168,76,0.1)",
            border: "1px solid rgba(201,168,76,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={18} color="#C9A84C" />
        </div>
        {trend && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "3px",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.06em",
              color: trendUp ? "#4ADE80" : "#F87171",
            }}
          >
            {trendUp ? (
              <MdArrowUpward size={12} />
            ) : (
              <MdArrowDownward size={12} />
            )}
            {trend}
          </div>
        )}
      </div>

      {/* Value */}
      <p
        style={{
          fontSize: "1.75rem",
          fontWeight: 600,
          color: "#fff",
          lineHeight: 1,
          letterSpacing: "-0.02em",
          marginBottom: "0.375rem",
        }}
      >
        {value}
      </p>
      <p
        style={{
          fontSize: "0.72rem",
          color: "rgba(255,255,255,0.38)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </p>
      {sub && (
        <p
          style={{
            fontSize: "0.72rem",
            color: "rgba(255,255,255,0.25)",
            marginTop: "0.25rem",
            letterSpacing: "0.04em",
          }}
        >
          {sub}
        </p>
      )}

      {/* Sparkline */}
      <div style={{ position: "absolute", bottom: "0.875rem", right: "1rem" }}>
        <Sparkline color="#C9A84C" up={trendUp !== false} />
      </div>
    </div>
  );
}

// ── Status badge ───────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    available: { bg: "rgba(74,222,128,0.1)", color: "#4ADE80", dot: "#4ADE80" },
    sold: { bg: "rgba(248,113,113,0.1)", color: "#F87171", dot: "#F87171" },
    reserved: { bg: "rgba(251,191,36,0.1)", color: "#FBBF24", dot: "#FBBF24" },
    "coming-soon": {
      bg: "rgba(96,165,250,0.1)",
      color: "#60A5FA",
      dot: "#60A5FA",
    },
  };
  const s = map[status] || map.available;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "3px 8px",
        borderRadius: "2px",
        background: s.bg,
        fontSize: "0.68rem",
        fontWeight: 500,
        letterSpacing: "0.08em",
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

// ── Main page ──────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 40);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const [carsRes, makesRes] = await Promise.all([
          fetch("/api/cars?limit=6&sortBy=createdAt&order=desc&status=all"),
          fetch("/api/cars/makes"),
        ]);
        const carsData = await carsRes.json();
        const makesData = await makesRes.json();
        setRecent(carsData.data || []);
        setStats({
          total: carsData.pagination?.total || 0,
          avgPrice: makesData.stats?.avgPrice || 0,
          maxPrice: makesData.stats?.maxPrice || 0,
          makes: makesData.makes?.length || 0,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const fmt = (n) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  const ease = "cubic-bezier(0.22,1,0.36,1)";

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#111111",
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
            gap: "1rem",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              border: "1.5px solid rgba(201,168,76,0.3)",
              borderTopColor: "#C9A84C",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <p
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.25)",
            }}
          >
            Loading Dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes spin       { to{transform:rotate(360deg)} }
        @keyframes headerIn   { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeUp     { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes tableRowIn { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }

        .dash-table-row { transition:background 0.18s; cursor:default; }
        .dash-table-row:hover { background:rgba(201,168,76,0.04)!important; }
        .dash-edit-link { font-size:0.72rem; letter-spacing:0.1em; text-transform:uppercase; color:rgba(255,255,255,0.3); text-decoration:none; transition:color 0.2s; display:flex; align-items:center; gap:4px; }
        .dash-edit-link:hover { color:#C9A84C; }
        .add-car-btn { display:inline-flex; align-items:center; gap:6px; background:#C9A84C; color:#fff; font-size:0.72rem; font-weight:500; letter-spacing:0.12em; text-transform:uppercase; padding:0.6875rem 1.25rem; border-radius:2px; text-decoration:none; transition:all 0.2s; box-shadow:0 4px 16px rgba(201,168,76,0.3); }
        .add-car-btn:hover { background:#b8963e; transform:translateY(-1px); box-shadow:0 6px 22px rgba(201,168,76,0.4); }
        .view-all-link { font-size:0.72rem; letter-spacing:0.1em; text-transform:uppercase; color:rgba(255,255,255,0.35); text-decoration:none; display:flex; align-items:center; gap:5px; transition:color 0.2s; }
        .view-all-link:hover { color:#C9A84C; }
        .quick-action { display:flex; align-items:center; gap:10px; padding:0.875rem 1rem; border:1px solid rgba(255,255,255,0.06); border-radius:3px; text-decoration:none; transition:all 0.2s; background:transparent; cursor:pointer; font-family:inherit; width:100%; }
        .quick-action:hover { border-color:rgba(201,168,76,0.3); background:rgba(201,168,76,0.04); }
        .tab-btn { font-size:0.72rem; letter-spacing:0.1em; text-transform:uppercase; padding:0.5rem 1rem; border:none; cursor:pointer; border-radius:2px; font-family:inherit; transition:all 0.2s; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#111111",
          padding: "2.5rem 1.5rem",
          marginLeft: "40px",
          marginRight: "40px",
        }}
        className="md:p-10"
      >
        {/* ── Page header ── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "2.5rem",
            flexWrap: "wrap",
            gap: "1rem",
            opacity: mounted ? 1 : 0,
            animation: mounted ? `headerIn 0.6s ${ease} both` : "none",
          }}
        >
          <div>
            {/* Eyebrow */}
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
                  fontSize: "0.62rem",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "#C9A84C",
                  fontWeight: 500,
                }}
              >
                Dashboard
              </span>
            </div>
            <h1
              style={{
                fontSize: "1.625rem",
                fontWeight: 600,
                color: "#fff",
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
              }}
            >
              Welcome back, {user?.name?.split(" ")[0] ?? "Admin"}
            </h1>
            <p
              style={{
                fontSize: "0.8125rem",
                color: "rgba(255,255,255,0.35)",
                marginTop: "0.375rem",
                letterSpacing: "0.02em",
              }}
            >
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <Link href="/admin/add-car" className="add-car-btn">
            <MdAdd size={16} />
            Add New Car
          </Link>
        </div>

        {/* ── Stat cards ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <StatCard
            label="Total Listings"
            value={stats?.total ?? 0}
            sub="All inventory"
            trend="+12%"
            trendUp={true}
            icon={MdDirectionsCar}
            delay={80}
          />
          <StatCard
            label="Average Price"
            value={fmt(stats?.avgPrice ?? 0)}
            sub="Across all cars"
            trend="+5.2%"
            trendUp={true}
            icon={MdAttachMoney}
            delay={160}
          />
          <StatCard
            label="Highest Listing"
            value={fmt(stats?.maxPrice ?? 0)}
            sub="Most expensive"
            icon={MdTrendingUp}
            delay={240}
          />
          <StatCard
            label="Total Brands"
            value={stats?.makes ?? 0}
            sub="Unique makes"
            trend="+2"
            trendUp={true}
            icon={MdStar}
            delay={320}
          />
        </div>

        {/* ── Main grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "1.25rem",
          }}
          className="dash-main-grid"
        >
          <style>{`@media(min-width:1280px){.dash-main-grid{grid-template-columns:1fr 280px!important}}`}</style>

          {/* ── Recent listings table ── */}
          <div
            style={{
              background: "#1A1A1A",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "4px",
              overflow: "hidden",
              opacity: mounted ? 1 : 0,
              animation: mounted ? `fadeUp 0.65s ${ease} 0.35s both` : "none",
            }}
          >
            {/* Table header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1.25rem 1.5rem",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.01)",
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#fff",
                    letterSpacing: "0.02em",
                  }}
                >
                  Recent Listings
                </h2>
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "rgba(255,255,255,0.3)",
                    marginTop: "2px",
                    letterSpacing: "0.04em",
                  }}
                >
                  Last 6 vehicles added
                </p>
              </div>
              <Link href="/admin/cars" className="view-all-link">
                View all <MdArrowForward size={13} />
              </Link>
            </div>

            {recent.length === 0 ? (
              <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "3px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.25rem",
                  }}
                >
                  <MdDirectionsCar size={24} color="rgba(255,255,255,0.2)" />
                </div>
                <p
                  style={{
                    fontSize: "0.9375rem",
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.5)",
                    marginBottom: "0.375rem",
                  }}
                >
                  No listings yet
                </p>
                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: "rgba(255,255,255,0.25)",
                    marginBottom: "1.5rem",
                  }}
                >
                  Add your first vehicle to get started
                </p>
                <Link
                  href="/admin/add-car"
                  className="add-car-btn"
                  style={{ margin: "0 auto", width: "fit-content" }}
                >
                  <MdAdd size={15} /> Add Car
                </Link>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      {[
                        "Vehicle",
                        "Price",
                        "Status",
                        "Condition",
                        "Views",
                        "",
                      ].map((h) => (
                        <th
                          key={h}
                          style={{
                            textAlign: "left",
                            padding: "0.625rem 1.25rem",
                            fontSize: "0.62rem",
                            fontWeight: 600,
                            letterSpacing: "0.16em",
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.25)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((car, i) => (
                      <tr
                        key={car._id}
                        className="dash-table-row"
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.04)",
                          opacity: mounted ? 1 : 0,
                          animation: mounted
                            ? `tableRowIn 0.45s ${ease} ${0.45 + i * 0.06}s both`
                            : "none",
                        }}
                      >
                        {/* Vehicle */}
                        <td style={{ padding: "0.875rem 1.25rem" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            <div
                              style={{
                                width: "44px",
                                height: "34px",
                                borderRadius: "3px",
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.06)",
                                overflow: "hidden",
                                flexShrink: 0,
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
                            <div>
                              <p
                                style={{
                                  fontSize: "0.8125rem",
                                  fontWeight: 500,
                                  color: "#fff",
                                  letterSpacing: "0.01em",
                                  lineHeight: 1.3,
                                  maxWidth: "180px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {car.title}
                              </p>
                              <p
                                style={{
                                  fontSize: "0.7rem",
                                  color: "rgba(255,255,255,0.28)",
                                  marginTop: "2px",
                                  letterSpacing: "0.06em",
                                }}
                              >
                                {car.year} · {car.make}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Price */}
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
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                              maximumFractionDigits: 0,
                            }).format(car.price)}
                          </span>
                        </td>

                        {/* Status */}
                        <td style={{ padding: "0.875rem 1.25rem" }}>
                          <StatusBadge status={car.status} />
                        </td>

                        {/* Condition */}
                        <td style={{ padding: "0.875rem 1.25rem" }}>
                          <span
                            style={{
                              fontSize: "0.75rem",
                              color: "rgba(255,255,255,0.4)",
                              textTransform: "capitalize",
                              letterSpacing: "0.06em",
                            }}
                          >
                            {car.condition}
                          </span>
                        </td>

                        {/* Views */}
                        <td style={{ padding: "0.875rem 1.25rem" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                            }}
                          >
                            <MdVisibility
                              size={13}
                              color="rgba(255,255,255,0.25)"
                            />
                            <span
                              style={{
                                fontSize: "0.75rem",
                                color: "rgba(255,255,255,0.4)",
                                letterSpacing: "0.04em",
                              }}
                            >
                              {car.views || 0}
                            </span>
                          </div>
                        </td>

                        {/* Action */}
                        <td style={{ padding: "0.875rem 1.25rem" }}>
                          <Link
                            href={`/admin/cars/${car._id}/edit`}
                            className="dash-edit-link"
                          >
                            Edit <MdArrowForward size={11} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ── Right column ── */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            {/* Quick actions */}
            <div
              style={{
                background: "#1A1A1A",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "4px",
                overflow: "hidden",
                opacity: mounted ? 1 : 0,
                animation: mounted ? `fadeUp 0.65s ${ease} 0.45s both` : "none",
              }}
            >
              <div
                style={{
                  padding: "1.125rem 1.25rem",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.01)",
                }}
              >
                <h3
                  style={{
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "#fff",
                    letterSpacing: "0.02em",
                  }}
                >
                  Quick Actions
                </h3>
              </div>
              <div
                style={{
                  padding: "0.875rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {[
                  {
                    label: "Add New Vehicle",
                    href: "/admin/add-car",
                    icon: MdAdd,
                    desc: "List a new car",
                  },
                  {
                    label: "Manage Inventory",
                    href: "/admin/cars",
                    icon: MdDirectionsCar,
                    desc: "View all listings",
                  },
                  {
                    label: "View Showroom",
                    href: "/",
                    icon: MdVisibility,
                    desc: "Public-facing site",
                  },
                ].map((a) => {
                  const Icon = a.icon;
                  return (
                    <Link key={a.label} href={a.href} className="quick-action">
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "2px",
                          background: "rgba(201,168,76,0.08)",
                          border: "1px solid rgba(201,168,76,0.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={15} color="#C9A84C" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: "0.8125rem",
                            fontWeight: 500,
                            color: "rgba(255,255,255,0.75)",
                            letterSpacing: "0.01em",
                          }}
                        >
                          {a.label}
                        </p>
                        <p
                          style={{
                            fontSize: "0.7rem",
                            color: "rgba(255,255,255,0.25)",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {a.desc}
                        </p>
                      </div>
                      <MdArrowForward size={14} color="rgba(255,255,255,0.2)" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Inventory breakdown */}
            <div
              style={{
                background: "#1A1A1A",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "4px",
                overflow: "hidden",
                opacity: mounted ? 1 : 0,
                animation: mounted ? `fadeUp 0.65s ${ease} 0.55s both` : "none",
              }}
            >
              <div
                style={{
                  padding: "1.125rem 1.25rem",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.01)",
                }}
              >
                <h3
                  style={{
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "#fff",
                    letterSpacing: "0.02em",
                  }}
                >
                  Inventory Breakdown
                </h3>
              </div>
              <div style={{ padding: "1.25rem" }}>
                {[
                  {
                    label: "Available",
                    value: stats?.total ?? 0,
                    color: "#4ADE80",
                    pct: 72,
                  },
                  {
                    label: "Reserved",
                    value: Math.round((stats?.total ?? 0) * 0.15),
                    color: "#FBBF24",
                    pct: 15,
                  },
                  {
                    label: "Coming Soon",
                    value: Math.round((stats?.total ?? 0) * 0.08),
                    color: "#60A5FA",
                    pct: 8,
                  },
                  {
                    label: "Sold",
                    value: Math.round((stats?.total ?? 0) * 0.05),
                    color: "#F87171",
                    pct: 5,
                  },
                ].map((item) => (
                  <div key={item.label} style={{ marginBottom: "0.875rem" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "5px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "7px",
                        }}
                      >
                        <div
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: item.color,
                            flexShrink: 0,
                          }}
                        />
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: "rgba(255,255,255,0.5)",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {item.label}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          color: "rgba(255,255,255,0.7)",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {item.value}
                      </span>
                    </div>
                    <div
                      style={{
                        height: "3px",
                        background: "rgba(255,255,255,0.06)",
                        borderRadius: "2px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          borderRadius: "2px",
                          background: item.color,
                          width: mounted ? `${item.pct}%` : "0%",
                          transition: `width 0.8s cubic-bezier(0.22,1,0.36,1) ${0.6 + [0, 1, 2, 3].indexOf([0, 1, 2, 3].find((_, i) => i === [0, 1, 2, 3].indexOf([0, 1, 2, 3].find((_, j) => j === ["Available", "Reserved", "Coming Soon", "Sold"].indexOf(item.label)))))}s`,
                          opacity: 0.85,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity feed */}
            <div
              style={{
                background: "#1A1A1A",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "4px",
                overflow: "hidden",
                opacity: mounted ? 1 : 0,
                animation: mounted ? `fadeUp 0.65s ${ease} 0.65s both` : "none",
              }}
            >
              <div
                style={{
                  padding: "1.125rem 1.25rem",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.01)",
                }}
              >
                <h3
                  style={{
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "#fff",
                    letterSpacing: "0.02em",
                  }}
                >
                  Recent Activity
                </h3>
              </div>
              <div style={{ padding: "0.75rem" }}>
                {recent.slice(0, 4).map((car, i) => (
                  <div
                    key={car._id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "0.625rem 0.5rem",
                      borderBottom:
                        i < Math.min(recent.length, 4) - 1
                          ? "1px solid rgba(255,255,255,0.04)"
                          : "none",
                    }}
                  >
                    {/* Timeline dot */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          width: "7px",
                          height: "7px",
                          borderRadius: "50%",
                          background: "#C9A84C",
                          border: "1.5px solid rgba(201,168,76,0.3)",
                        }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "rgba(255,255,255,0.55)",
                          letterSpacing: "0.02em",
                          lineHeight: 1.4,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span
                          style={{
                            color: "rgba(255,255,255,0.75)",
                            fontWeight: 500,
                          }}
                        >
                          Listed
                        </span>{" "}
                        {car.year} {car.make} {car.model}
                      </p>
                      <p
                        style={{
                          fontSize: "0.65rem",
                          color: "rgba(255,255,255,0.2)",
                          marginTop: "2px",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {new Date(car.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <StatusBadge status={car.status} />
                  </div>
                ))}
                {recent.length === 0 && (
                  <p
                    style={{
                      fontSize: "0.78rem",
                      color: "rgba(255,255,255,0.2)",
                      padding: "1rem 0.5rem",
                      textAlign: "center",
                      letterSpacing: "0.04em",
                    }}
                  >
                    No activity yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
