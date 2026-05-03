// src/app/(dashboardLayout)/@admin/profile/page.tsx
import { Metadata } from "next";
import { DashboardAdminProfileClient } from "@/components/Dashboard/Admin/DashboardAdminProfileClient";
import { ErrorDisplay } from "@/components/GlobalComponent/ErrorDisplay";
import { notFound } from "next/navigation";
import { authService } from "@/services/authService.server";

export const metadata: Metadata = {
  title: "Admin Profile - SkillBridge",
  description: "Manage your admin profile",
};

export default async function AdminProfilePage() {
  const { data: sessionData, error } = await authService.getSession();

  if (error || !sessionData) {
    return <ErrorDisplay error={error} data={sessionData} />;
  }

  // Extract user data from session (Better Auth structure)
  const adminData = {
    id: sessionData.user?.id || sessionData.id,
    name: sessionData.user?.name || sessionData.name,
    email: sessionData.user?.email || sessionData.email,
    image: sessionData.user?.image || sessionData.image || null,
    role: sessionData.user?.role || sessionData.role,
    createdAt: sessionData.user?.createdAt || sessionData.createdAt,
    status: sessionData.user?.status || sessionData.status || "UNBANNED",
  };

  if (adminData.role !== "ADMIN") {
    notFound();
  }

  return <DashboardAdminProfileClient admin={adminData} />;
}
