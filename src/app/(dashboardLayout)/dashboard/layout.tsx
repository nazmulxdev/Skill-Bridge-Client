import { DashboardClientWrapper } from "@/components/Dashboard/DashboardLayout";
import { authService } from "@/services/authService.server";

interface DashboardLayoutProps {
  children: React.ReactNode;
  admin: React.ReactNode;
  student: React.ReactNode;
  tutor: React.ReactNode;
}

export default async function DashboardLayout({
  children,
  admin,
  student,
  tutor,
}: DashboardLayoutProps) {
  const { data, error } = await authService.getSession();
  const { role, name, email } = data?.user;
  return (
    <DashboardClientWrapper
      admin={admin}
      student={student}
      tutor={tutor}
      userRole={role}
      userData={{ name, email }}
    >
      {children}
    </DashboardClientWrapper>
  );
}
