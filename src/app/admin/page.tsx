"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Eye } from "lucide-react";
import { TopTemplates } from "@/components/admin/top-templates";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

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
      gradient: "from-purple-500 to-pink-400",
      bgGradient: "from-purple-400/50 to-pink-400/50",
    },
    {
      title: "Total Templates",
      value: totalTemplates,
      icon: FileText,
      gradient: "from-pink-500 to-purple-400",
      bgGradient: "from-pink-400/50 to-purple-400/50",
    },
    {
      title: "Revenue",
      value: revenue,
      icon: () => <span className="text-lg font-bold text-white">₱</span>,
      gradient: "from-indigo-500 to-purple-400",
      bgGradient: "from-indigo-400/50 to-purple-400/50",
    },
    {
      title: "Number of Pending Payments",
      value: pendingPayments,
      icon: Eye,
      gradient: "from-purple-500 to-indigo-400",
      bgGradient: "from-purple-500/50 to-indigo-500/50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.title}
            className={`bg-white/90 backdrop-blur-xl border border-purple-200/50 shadow-lg hover:shadow-purple-300/30 transition-all duration-300 hover:scale-105 relative overflow-hidden`}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} -z-10`}
            />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-900">
                {stat.title}
              </CardTitle>
              <div
                className={`p-2 rounded-full bg-gradient-to-r ${stat.gradient}`}
              >
                <Icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

interface TemplateDataEntry {
  name: string;
  value: number;
  color: string;
}

export function ChartsSection() {
  const [monthlyData, setMonthlyData] = useState([])
  const [templateData, setTemplateData] = useState<TemplateDataEntry[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats/user-growth`)
      .then((res) => res.json())
      .then((data) => setMonthlyData(data))

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats/template-distribution`)
      .then((res) => res.json())
      .then((data) => setTemplateData(data))
  }, [])

  return (
    <div className="space-y-6">
      <Card className="bg-white/90 backdrop-blur-xl border border-purple-200/50 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/30 to-purple-400/30 -z-10" />
        <CardHeader>
          <CardTitle className="text-purple-900">User Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.2)" />
              <XAxis dataKey="name" stroke="#7c3aed" />
              <YAxis stroke="#7c3aed" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                  borderRadius: "8px",
                  color: "#581c87",
                }}
              />
              <Line type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-white/90 backdrop-blur-xl border border-purple-200/50 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 to-pink-400/30 -z-10" />
        <CardHeader>
          <CardTitle className="text-purple-900">Template Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={templateData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                dataKey="value"
              >
                {templateData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                  borderRadius: "8px",
                  color: "#581c87",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <main className="flex-1">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 mt-2">
              Monitor your platform&apos;s performance and user engagement
            </p>
          </div>
          <StatsCards />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <ChartsSection />
            <TopTemplates />
          </div>
        </div>
      </main>
    </div>
  );
}
