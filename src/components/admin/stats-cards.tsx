"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, ShoppingBag, Eye } from "lucide-react";

export function StatsCards() {
  const [totalUsers, setTotalUsers] = useState<string>("...");
  const [totalTemplates, setTotalTemplates] = useState<string>("...");
  const [revenue, setRevenue] = useState<string>("...");
  const [pendingPayments, setPendingPayments] = useState<string>("...");

  useEffect(() => {
    async function fetchStats() {
      const token = localStorage.getItem("token");
      if (!token) {
        setTotalUsers("N/A");
        setTotalTemplates("N/A");
        setRevenue("N/A");
        setPendingPayments("N/A");
        return;
      }

      try {
        // Users
        const usersRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/stats/users-count`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const usersData = await usersRes.json();
        setTotalUsers(Number(usersData.count).toLocaleString());

        // Templates
        const templatesRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/stats/templates-count`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const templatesData = await templatesRes.json();
        setTotalTemplates(Number(templatesData.count).toLocaleString());

        // Revenue
        const revenueRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/stats/revenue`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const revenueData = await revenueRes.json();
        setRevenue(`₱${Number(revenueData.total).toLocaleString()}`);

        // Pending payments
        const pendingRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/stats/pending-payments`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const pendingData = await pendingRes.json();
        setPendingPayments(Number(pendingData.count).toLocaleString());
      } catch (error) {
        console.error(error);
        setTotalUsers("N/A");
        setTotalTemplates("N/A");
        setRevenue("N/A");
        setPendingPayments("N/A");
      }
    }

    fetchStats();
  }, []);

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      bgColor: "from-violet-500 to-violet-900",
    },
    {
      title: "Total Templates",
      value: totalTemplates,
      icon: FileText,
      bgColor: "from-blue-500 to-blue-900",
    },
    {
      title: "Revenue",
      value: revenue,
      icon: ShoppingBag,
      bgColor: "from-green-400 to-green-700",
    },
    {
      title: "Pending Payments",
      value: pendingPayments,
      icon: Eye,
      bgColor: "from-yellow-400 to-yellow-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className={`bg-gradient-to-b bg-gradient-to-br from-pink-200 via-pink-500 to-purple-500 p-6`}>
            <div className="flex items-center gap-3 my-5 mx-5">
              <Icon className={`h-12 w-12 text-white flex-shrink-0`} />
              <div className="flex flex-col">
                <CardTitle className="text-sm font-medium text-white">
                  {stat.title}
                </CardTitle>
                <div className="text-3xl font-bold text-white">
                  {stat.value}
                </div>
              </div>
            </div>

            {/* Floating particles (reused from Hero) */}
            <div className="relative inset-0 opacity-30 pointer-events-none">
              <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <div className="absolute top-20 right-20 w-1 h-1 bg-whiye rounded-full animate-ping"></div>
              <div className="absolute bottom-20 left-0 w-1 h-1 bg-white rounded-full animate-ping"></div>
              <div className="absolute bottom-20 right-1 w-3 h-3 bg-white rounded-full animate-bounce"></div>
              <div className="absolute top-1/2 right-10 w-2 h-2 bg-white rounded-full animate-pulse delay-1000"></div>
              <div className="absolute bottom-10 right-3 w-1 h-1 bg-white rounded-full animate-ping delay-500"></div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
