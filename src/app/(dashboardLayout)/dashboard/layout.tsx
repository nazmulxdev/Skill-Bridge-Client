import { DashboardClientWrapper } from "@/components/Dashboard/DashboardLayout";

interface DashboardLayoutProps {
  children: React.ReactNode;
  admin: React.ReactNode;
  student: React.ReactNode;
  tutor: React.ReactNode;
}

// roles
const HARD_CODED_ROLE = "student";

export default function DashboardLayout({
  children,
  admin,
  student,
  tutor,
}: DashboardLayoutProps) {
  return (
    <DashboardClientWrapper
      admin={admin}
      student={student}
      tutor={tutor}
      userRole={HARD_CODED_ROLE}
    >
      {children}
    </DashboardClientWrapper>
  );
}
