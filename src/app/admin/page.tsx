"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  FileText,
  ShoppingBag,
  Eye,
  Download,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
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
          <Card
            key={stat.title}
            className={`bg-gradient-to-b bg-gradient-to-br from-pink-200 via-pink-500 to-purple-500 p-6`}
          >
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

export function ChartsSection() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [templateData, setTemplateData] = useState([]);
  const COLORS = ["#8b2bdbff", "#ec70cdff", "#06b6d4", "#74e660ff", "#10b981"];
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats/user-growth`)
      .then((res) => res.json())
      .then((data) => setMonthlyData(data));

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats/template-distribution`)
      .then((res) => res.json())
      .then((data) => setTemplateData(data));
  }, []);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-pink-200 via-pink-500 to-purple-500 border-none">
        <CardHeader>
          <CardTitle className="text-white">User Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.2)"
              />
              <XAxis dataKey="name" stroke="#ffffff" />
              <YAxis stroke="#ffffff" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "none",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#ffffff"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>

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

      <Card className="bg-gradient-to-br from-pink-200 via-pink-500 to-purple-500 border-none">
        <CardHeader>
          <CardTitle className="text-white">Template Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={templateData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                dataKey="value"
              >
                {templateData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "none",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>

        {/* Floating particles (reused from Hero) */}
        <div className="relative inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-2 right-10 w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-1 h-1 bg-whiye rounded-full animate-ping"></div>
          <div className="absolute bottom-20 left-0 w-1 h-1 bg-white rounded-full animate-ping"></div>
          <div className="absolute bottom-20 right-1 w-3 h-3 bg-white rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 right-10 w-2 h-2 bg-white rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-10 right-3 w-1 h-1 bg-white rounded-full animate-ping delay-500"></div>
        </div>
      </Card>
    </div>
  );
}

const ITEMS_PER_PAGE = 7

interface Template {
  id: number
  name: string
  category: string
  unlocks: number
  saves: number
  revenue: number
  trend: "up" | "down"
}

export function TopTemplates() {
  const [topTemplates, setTopTemplates] = useState<Template[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(topTemplates.length / ITEMS_PER_PAGE)

  const paginatedTemplates = topTemplates.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  useEffect(() => {
    async function fetchTopTemplates() {
      const token = localStorage.getItem("token")
      if (!token) {
        setTopTemplates([])
        return
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats/top-templates`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })

        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        let data: Template[] = await res.json()

        // Sort by unlocks descending
        data = data.sort((a: Template, b: Template) => (b.unlocks ?? 0) - (a.unlocks ?? 0))

        setTopTemplates(data)
        setCurrentPage(1)
      } catch (err) {
        console.error("Failed to fetch top templates:", err)
        setTopTemplates([])
      }
    }

    fetchTopTemplates()
  }, [])

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1)
  }

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold bg-gradient-to-br from-blue-500 via-blue-600 to-blue-600 bg-clip-text text-transparent">
          Top Performing Templates
        </CardTitle>
      </CardHeader>
      <CardContent>
        {paginatedTemplates.length === 0 ? (
          <p className="text-sm text-gray-500">No data available</p>
        ) : (
          <div className="space-y-4">
            {paginatedTemplates.map((template, index) => (
              <div
                key={template.id}
                className="relative flex items-center space-x-4 rounded-lg bg-gradient-to-br from-blue-100 via-pink-200 to-blue-600 p-[2px]"
              >
                <div className="flex items-center space-x-4 w-full bg-white rounded-lg p-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-full text-sm font-semibold">
                    {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{template.name}</h3>
                      <Badge variant={template.category === "Premium" ? "default" : "secondary"}>
                        {template.category}
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Download className="h-3 w-3" />
                        <span>{(template.unlocks ?? 0).toLocaleString()}</span>
                      </div>

                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{(template.saves ?? 0).toLocaleString()}</span>
                      </div>

                      {Number(template.revenue) > 0 && (
                        <div className="flex items-center space-x-1">
                          <span className="text-xs font-bold">₱</span>
                          <span>
                            {Number(template.revenue).toLocaleString("en-PH", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center">
                    {template.trend === "up" ? (
                      <ArrowUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center pt-4">
                <Button variant="outline" size="sm" onClick={handlePrev} disabled={currentPage === 1}>
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/");
      return;
    }

    const user = JSON.parse(userData);

    if (!user.is_admin) {
      router.push("/");
    }
  }, [router]);

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
