import Link from "next/link";
import { Users, Calendar, DollarSign, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function AdminDashboard() {
  const stats = [
    {
      label: "Total Users",
      value: "2,547",
      icon: Users,
      change: "+12%",
      color: "text-primary",
    },
    {
      label: "Active Tutors",
      value: "342",
      icon: Users,
      change: "+8%",
      color: "text-success",
    },
    {
      label: "Total Slots",
      value: "1,289",
      icon: Calendar,
      change: "+23%",
      color: "text-warning",
    },
    {
      label: "Revenue",
      value: "$45.2K",
      icon: DollarSign,
      change: "+18%",
      color: "text-[#F4B400]",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Monitor platform performance and manage users.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="border-border/50 bg-card/50 backdrop-blur-sm"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                </div>
                <div
                  className={`p-3 rounded-xl bg-${stat.color.split("-")[1]}/10`}
                >
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-success/10 text-success border-success/20"
                >
                  {stat.change}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  vs last month
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Manage students, tutors, and admins
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Total Users</span>
              <span className="font-semibold">2,547</span>
            </div>
            <Progress value={65} className="h-2" />
            <Button className="w-full" variant="outline" asChild>
              <Link href="/admin/users">Manage Users</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Slot Overview</CardTitle>
            <CardDescription>Monitor all platform slots</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Available Slots</span>
              <span className="font-semibold">847</span>
            </div>
            <Progress value={65} className="h-2" />
            <Button className="w-full" variant="outline" asChild>
              <Link href="/admin/slots">View All Slots</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Platform Health</CardTitle>
            <CardDescription>System status and reports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-success" />
              <span className="text-sm">All systems operational</span>
            </div>
            <Button className="w-full" variant="outline" asChild>
              <Link href="/admin/reports">View Reports</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
