"use client";
import { createContext, useContext, useState } from "react";

const AdminSidebarContext = createContext({
  collapsed: false,
  setCollapsed: () => {},
});

export function AdminSidebarProvider({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <AdminSidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </AdminSidebarContext.Provider>
  );
}

export function useAdminSidebar() {
  return useContext(AdminSidebarContext);
}
