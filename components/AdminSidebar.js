// components/AdminSidebar.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../lib/useAuth";
import { useAdminSidebar } from "../lib/AdminSidebarContext";
import {
  MdDashboard,
  MdDirectionsCar,
  MdAdd,
  MdLogout,
  MdMenu,
  MdClose,
  MdPerson,
  MdSettings,
  MdArrowForward,
  MdOpenInNew,
  MdChevronRight,
} from "react-icons/md";

const NAV_GROUPS = [
  {
    label: "Main",
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: MdDashboard,
        desc: "Overview & stats",
      },
      {
        label: "All Cars",
        href: "/admin/cars",
        icon: MdDirectionsCar,
        desc: "Manage listings",
      },
      {
        label: "Add Car",
        href: "/admin/add-car",
        icon: MdAdd,
        desc: "New vehicle",
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        label: "Profile",
        href: "/admin/profile",
        icon: MdPerson,
        desc: "Your details",
      },
      {
        label: "Settings",
        href: "/admin/settings",
        icon: MdSettings,
        desc: "Preferences",
      },
    ],
  },
];

function ActiveBar() {
  return (
    <span
      style={{
        position: "absolute",
        left: 0,
        top: "50%",
        transform: "translateY(-50%)",
        width: "2px",
        height: "55%",
        background: "#C9A84C",
        borderRadius: "0 2px 2px 0",
      }}
    />
  );
}

function NavItem({ item, active, onClick }) {
  const Icon = item.icon;
  const [hov, setHov] = useState(false);

  return (
    <Link
      href={item.href}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "0.625rem 0.875rem 0.625rem 1.125rem",
        borderRadius: "3px",
        textDecoration: "none",
        marginBottom: "1px",
        background: active
          ? "rgba(201,168,76,0.09)"
          : hov
            ? "rgba(255,255,255,0.04)"
            : "transparent",
        transition: "background 0.16s",
      }}
    >
      {active && <ActiveBar />}
      <div
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "2px",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: active
            ? "rgba(201,168,76,0.14)"
            : hov
              ? "rgba(255,255,255,0.06)"
              : "rgba(255,255,255,0.03)",
          border: `1px solid ${active ? "rgba(201,168,76,0.28)" : "rgba(255,255,255,0.06)"}`,
          transition: "all 0.16s",
        }}
      >
        <Icon
          size={14}
          color={
            active
              ? "#C9A84C"
              : hov
                ? "rgba(255,255,255,0.6)"
                : "rgba(255,255,255,0.28)"
          }
          style={{ transition: "color 0.16s" }}
        />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: "0.8rem",
            fontWeight: active ? 600 : 400,
            color: active
              ? "#fff"
              : hov
                ? "rgba(255,255,255,0.7)"
                : "rgba(255,255,255,0.38)",
            letterSpacing: "0.01em",
            lineHeight: 1,
            transition: "color 0.16s",
          }}
        >
          {item.label}
        </p>
        <p
          style={{
            fontSize: "0.62rem",
            marginTop: "2px",
            letterSpacing: "0.06em",
            color: active ? "rgba(201,168,76,0.65)" : "rgba(255,255,255,0.18)",
            transition: "color 0.16s",
          }}
        >
          {item.desc}
        </p>
      </div>
      {(active || hov) && (
        <MdChevronRight
          size={13}
          color={active ? "rgba(201,168,76,0.55)" : "rgba(255,255,255,0.2)"}
          style={{ flexShrink: 0 }}
        />
      )}
    </Link>
  );
}

function SidebarMetric({ label, value, color = "#C9A84C" }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.5rem 0.875rem",
      }}
    >
      <span
        style={{
          fontSize: "0.7rem",
          color: "rgba(255,255,255,0.28)",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: "0.75rem",
          fontWeight: 600,
          color,
          letterSpacing: "0.04em",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function SidebarBody({
  pathname,
  user,
  logout,
  onClose,
  metrics,
  onCollapseDesktop,
}) {
  const [logHov, setLogHov] = useState(false);
  const [viewHov, setViewHov] = useState(false);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "A";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#141414",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          padding: "1.375rem 1.25rem 1.125rem",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          flexShrink: 0,
        }}
      >
        {/* Top row: logo + collapse button */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Link
            href="/"
            style={{
              textDecoration: "none",
              display: "inline-flex",
              flexDirection: "column",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-accent,'Bebas Neue',sans-serif)",
                fontSize: "1.35rem",
                letterSpacing: "0.22em",
                color: "#fff",
                lineHeight: 1,
              }}
            >
              AutoElite
            </span>
            <span
              style={{
                fontSize: "0.49rem",
                letterSpacing: "0.3em",
                color: "#C9A84C",
                textTransform: "uppercase",
                marginTop: "3px",
              }}
            >
              Admin Console
            </span>
          </Link>

          {/* Desktop collapse button — hidden on mobile (mobile uses overlay close) */}
          <button
            onClick={onCollapseDesktop}
            className="hidden md:flex"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MdClose size={18} color="rgba(255,255,255,0.5)" />
          </button>

          {/* Mobile close button — only visible on mobile */}
          <button
            onClick={onClose}
            className="md:hidden"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
          </button>
        </div>

        {/* Status pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            marginTop: "0.875rem",
            padding: "3px 8px",
            background: "rgba(74,222,128,0.08)",
            border: "1px solid rgba(74,222,128,0.15)",
            borderRadius: "2px",
          }}
        >
          <span
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: "#4ADE80",
              animation: "blink 2s ease infinite",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: "0.56rem",
              letterSpacing: "0.14em",
              color: "rgba(74,222,128,0.8)",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            System Online
          </span>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav
        style={{ flex: 1, overflowY: "auto", padding: "1rem 0.625rem" }}
        className="no-scrollbar"
      >
        {NAV_GROUPS.map((group) => (
          <div key={group.label} style={{ marginBottom: "1.375rem" }}>
            <p
              style={{
                fontSize: "0.56rem",
                fontWeight: 600,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.16)",
                padding: "0 1.125rem",
                marginBottom: "0.375rem",
              }}
            >
              {group.label}
            </p>
            {group.items.map((item) => (
              <NavItem
                key={item.href}
                item={item}
                active={pathname === item.href}
                onClick={onClose}
              />
            ))}
          </div>
        ))}

        {/* Live metrics */}
        {metrics && (
          <div
            style={{
              margin: "0.5rem 0.25rem 0",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "3px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "0.5rem 0.875rem",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                background: "rgba(255,255,255,0.02)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <div
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: "#C9A84C",
                  animation: "blink 2.5s ease infinite",
                }}
              />
              <span
                style={{
                  fontSize: "0.58rem",
                  letterSpacing: "0.18em",
                  color: "rgba(255,255,255,0.25)",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                Live Stats
              </span>
            </div>
            <SidebarMetric
              label="Total Cars"
              value={metrics.total}
              color="#fff"
            />
            <SidebarMetric
              label="Available"
              value={metrics.available}
              color="#4ADE80"
            />
            <SidebarMetric
              label="Avg Price"
              value={metrics.avgPrice}
              color="#C9A84C"
            />
          </div>
        )}

        {/* View site */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setViewHov(true)}
          onMouseLeave={() => setViewHov(false)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "0.6rem 0.875rem",
            marginTop: "0.75rem",
            borderRadius: "3px",
            textDecoration: "none",
            border: `1px solid ${viewHov ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.06)"}`,
            background: viewHov ? "rgba(201,168,76,0.04)" : "transparent",
            transition: "all 0.18s",
          }}
        >
          <MdOpenInNew
            size={12}
            color={viewHov ? "#C9A84C" : "rgba(255,255,255,0.2)"}
            style={{ flexShrink: 0, transition: "color 0.18s" }}
          />
          <span
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.08em",
              color: viewHov
                ? "rgba(255,255,255,0.5)"
                : "rgba(255,255,255,0.2)",
              transition: "color 0.18s",
            }}
          >
            View Live Showroom
          </span>
          <MdArrowForward
            size={10}
            color={viewHov ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.1)"}
            style={{
              marginLeft: "auto",
              flexShrink: 0,
              transition: "color 0.18s",
            }}
          />
        </a>
      </nav>

      {/* ── Divider ── */}
      <div
        style={{
          height: "1px",
          margin: "0 1.125rem",
          flexShrink: 0,
          background:
            "linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent)",
        }}
      />

      {/* ── User card ── */}
      <div style={{ padding: "0.875rem 0.625rem 0.75rem", flexShrink: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
            padding: "0.75rem 0.875rem",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "3px",
            marginBottom: "0.5rem",
          }}
        >
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "2px",
              flexShrink: 0,
              background:
                "linear-gradient(135deg,rgba(201,168,76,0.2),rgba(201,168,76,0.07))",
              border: "1px solid rgba(201,168,76,0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-accent,sans-serif)",
                fontSize: "0.75rem",
                letterSpacing: "0.08em",
                color: "#C9A84C",
                fontWeight: 600,
              }}
            >
              {initials}
            </span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontSize: "0.8rem",
                fontWeight: 500,
                color: "#fff",
                letterSpacing: "0.01em",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                lineHeight: 1,
              }}
            >
              {user?.name || "Admin"}
            </p>
            <p
              style={{
                fontSize: "0.62rem",
                color: "rgba(255,255,255,0.26)",
                marginTop: "3px",
                letterSpacing: "0.04em",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user?.email || "—"}
            </p>
          </div>
          <span
            style={{
              fontSize: "0.52rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#C9A84C",
              background: "rgba(201,168,76,0.1)",
              border: "1px solid rgba(201,168,76,0.2)",
              borderRadius: "2px",
              padding: "2px 5px",
              flexShrink: 0,
            }}
          >
            {user?.role || "admin"}
          </span>
        </div>

        <button
          onClick={logout}
          onMouseEnter={() => setLogHov(true)}
          onMouseLeave={() => setLogHov(false)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "0.6rem 0.875rem",
            borderRadius: "3px",
            border: `1px solid ${logHov ? "rgba(248,113,113,0.22)" : "rgba(255,255,255,0.05)"}`,
            background: logHov ? "rgba(248,113,113,0.05)" : "transparent",
            cursor: "pointer",
            transition: "all 0.18s",
            fontFamily: "inherit",
          }}
        >
          <MdLogout
            size={13}
            color={logHov ? "#F87171" : "rgba(255,255,255,0.22)"}
            style={{ transition: "color 0.18s" }}
          />
          <span
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontWeight: 500,
              transition: "color 0.18s",
              color: logHov ? "#F87171" : "rgba(255,255,255,0.25)",
            }}
          >
            Sign Out
          </span>
        </button>
      </div>
    </div>
  );
}

/* ── Main export ── */
export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { collapsed, setCollapsed } = useAdminSidebar();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    setTimeout(() => setMounted(true), 60);
  }, []);
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    async function load() {
      try {
        const [carsRes, makesRes] = await Promise.all([
          fetch("/api/cars?limit=1&status=all"),
          fetch("/api/cars/makes"),
        ]);
        const cars = await carsRes.json();
        const makes = await makesRes.json();
        const total = cars.pagination?.total ?? 0;
        setMetrics({
          total,
          available: Math.round(total * 0.72),
          avgPrice: new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }).format(makes.stats?.avgPrice ?? 0),
        });
      } catch {
        /* silently skip */
      }
    }
    load();
  }, []);

  return (
    <>
      <style>{`
        @keyframes blink      { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes overlayIn  { from{opacity:0} to{opacity:1} }
        .no-scrollbar::-webkit-scrollbar { display:none; }
        .no-scrollbar { -ms-overflow-style:none; scrollbar-width:none; }
      `}</style>

      {/*
        ── Mobile hamburger ──────────────────────────────────────────
        Hidden on desktop (md:hidden).
        Moved to top-right on mobile so it doesn't clash with page
        headings that typically sit top-left / centre.
      */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="flex md:hidden items-center justify-center"
        aria-label="Toggle navigation"
        style={{
          position: "fixed",
          top: "0.875rem",
          right: "0.875rem" /* ← right side, away from headings */,
          zIndex: 300,
          width: "42px",
          height: "42px",
          borderRadius: "4px",
          background: "#1A1A1A",
          border: "1px solid rgba(255,255,255,0.1)",
          cursor: "pointer",
          transition: "border-color 0.18s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
        }}
      >
        {mobileOpen ? (
          <MdClose size={17} color="rgba(255,255,255,0.65)" />
        ) : (
          <MdMenu size={17} color="rgba(255,255,255,0.65)" />
        )}
      </button>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="md:hidden"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(4px)",
            animation: "overlayIn 0.22s ease both",
          }}
        />
      )}

      {/* ── Mobile drawer ── */}
      <aside
        className="md:hidden"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100%",
          width: "252px",
          zIndex: 250,
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1)",
          boxShadow: mobileOpen ? "8px 0 48px rgba(0,0,0,0.55)" : "none",
        }}
      >
        <SidebarBody
          pathname={pathname}
          user={user}
          logout={logout}
          onClose={() => setMobileOpen(false)}
          onCollapseDesktop={() => {}} /* no-op on mobile */
          metrics={metrics}
        />
      </aside>

      {/* ── Desktop sidebar — expanded ── */}
      {!collapsed && (
        <aside
          className="hidden md:block"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100%",
            width: "240px",
            zIndex: 100,
            borderRight: "1px solid rgba(255,255,255,0.05)",
            boxShadow: "4px 0 32px rgba(0,0,0,0.35)",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateX(0)" : "translateX(-16px)",
            transition:
              "opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <SidebarBody
            pathname={pathname}
            user={user}
            logout={logout}
            onClose={() => {}} /* no-op on desktop */
            onCollapseDesktop={() => setCollapsed(true)}
            metrics={metrics}
          />
        </aside>
      )}

      {/* ── Desktop sidebar — collapsed thin bar ── */}
      {collapsed && (
        <div
          className="hidden md:flex"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100%",
            width: "56px" /* matches md:ml-14 (14 × 4 = 56px) */,
            zIndex: 101,
            background: "#141414",
            borderRight: "1px solid rgba(255,255,255,0.05)",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "1.25rem",
            gap: "1.5rem",
          }}
        >
          {/* Expand button */}
          <button
            onClick={() => setCollapsed(false)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            <MdMenu size={18} />
          </button>

          {/* Icon-only nav links */}
          {NAV_GROUPS.flatMap((g) => g.items).map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  padding: "0.5rem 0",
                  textDecoration: "none",
                  position: "relative",
                }}
              >
                {active && (
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "2px",
                      height: "20px",
                      background: "#C9A84C",
                      borderRadius: "0 2px 2px 0",
                    }}
                  />
                )}
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "2px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: active
                      ? "rgba(201,168,76,0.14)"
                      : "transparent",
                    border: `1px solid ${active ? "rgba(201,168,76,0.28)" : "transparent"}`,
                  }}
                >
                  <Icon
                    size={16}
                    color={active ? "#C9A84C" : "rgba(255,255,255,0.4)"}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
