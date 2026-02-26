import { allBookings } from "@/actions/admin.action";
import { redirect } from "next/navigation";
import { DashboardAdminBookingsClient } from "@/components/Dashboard/Admin/DashboardAdminBookingsClient";
import { ErrorDisplay } from "@/components/GlobalComponent/ErrorDisplay";

export default async function AdminBookingsPage() {
  const { data: bookings, error } = await allBookings();

  if (error || !bookings) {
    return <ErrorDisplay error={error} data={bookings} />;
  }

  return <DashboardAdminBookingsClient initialBookings={bookings} />;
}
