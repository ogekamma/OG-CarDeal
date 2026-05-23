// app/admin/layout.js
import { AdminSidebarProvider } from "../../lib/AdminSidebarContext";
import AdminLayoutClient from "./AdminLayoutClient"; // new client component below

export const metadata = {
  title: "Admin — AutoElite",
};

export default function AdminLayout({ children }) {
  return (
    <AdminSidebarProvider>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </AdminSidebarProvider>
  );
}
