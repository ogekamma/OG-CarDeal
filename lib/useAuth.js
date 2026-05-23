// lib/useAuth.js
"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";
  const user = session?.user || null;
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  const login = async (email, password) => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // handle redirect manually
    });
    return result;
  };

  const logout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  const requireAuth = () => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    requireAuth,
    session,
  };
}
