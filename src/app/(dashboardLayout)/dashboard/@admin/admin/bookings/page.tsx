import { allBookings } from "@/actions/admin.action";
import { redirect } from "next/navigation";
import { DashboardAdminBookingsClient } from "@/components/Dashboard/Admin/DashboardAdminBookingsClient";

export default async function AdminBookingsPage() {
  const { data: bookings, error } = await allBookings();

  if (error || !bookings) {
    redirect("/login");
  }

  return <DashboardAdminBookingsClient initialBookings={bookings} />;
}
