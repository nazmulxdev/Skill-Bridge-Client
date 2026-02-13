import { redirect } from "next/navigation";

//auth role
const getUserRole = () => {
  // auth context/session
  return "admin";
};

export default function DashboardPage() {
  const role = getUserRole();

  // Redirect to role-specific dashboard
  redirect(`/dashboard/${role}`);

  return null;
}
