"use client";

import AdminSidebar from "../../components/AdminSidebar";
import { useAdminSidebar } from "../../lib/AdminSidebarContext";

export default function AdminLayoutClient({ children }) {
  const { collapsed } = useAdminSidebar();

  return (
    <div style={{ minHeight: "100vh", background: "#111111" }}>
      <AdminSidebar />

      {/*
        Desktop: offset by sidebar width (240px expanded / 56px collapsed).
        Mobile:  no left margin, but add top padding (pt-16 = 64px) so content
                 clears the fixed hamburger button (42px tall, 12px from top).
      */}
      <main
        style={{
          transition: "margin-left 0.3s cubic-bezier(0.22,1,0.36,1)",
        }}
        className={[
          // Mobile: zero left margin + top padding to clear hamburger
          "pt-16",
          "md:pt-0", // desktop has no hamburger, reset top padding
          // Desktop: match sidebar width
          collapsed ? "md:ml-14" : "md:ml-60",
        ].join(" ")}
      >
        {children}
      </main>
    </div>
  );
}
