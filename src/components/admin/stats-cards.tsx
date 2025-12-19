"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, Eye } from "lucide-react"

export function StatsCards() {
  const [totalUsers, setTotalUsers] = useState<string>("...")
  const [totalTemplates, setTotalTemplates] = useState<string>("...")
  const [revenue, setRevenue] = useState<string>("...")
  const [pendingPayments, setPendingPayments] = useState<string>("...")

  useEffect(() => {
    async function fetchStats() {
      const token = localStorage.getItem("token")
      if (!token) {
        setTotalUsers("N/A")
        setTotalTemplates("N/A")
        setRevenue("N/A")
        setPendingPayments("N/A")
        return
      }

      try {
        // Users
        const usersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats/users-count`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })
        const usersData = await usersRes.json()
        setTotalUsers(Number(usersData.count).toLocaleString())

        // Templates
        const templatesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats/templates-count`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })
        const templatesData = await templatesRes.json()
        setTotalTemplates(Number(templatesData.count).toLocaleString())

        // Revenue
        const revenueRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats/revenue`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })
        const revenueData = await revenueRes.json()
        setRevenue(`₱${Number(revenueData.total).toLocaleString()}`)

        // Pending payments
        const pendingRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats/pending-payments`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })
        const pendingData = await pendingRes.json()
        setPendingPayments(Number(pendingData.count).toLocaleString())
      } catch (error) {
        console.error(error)
        setTotalUsers("N/A")
        setTotalTemplates("N/A")
        setRevenue("N/A")
        setPendingPayments("N/A")
      }
    }

    fetchStats()
  }, [])

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
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card
            key={stat.title}
            className={`bg-white/90 backdrop-blur-xl border border-purple-200/50 shadow-lg hover:shadow-purple-300/30 transition-all duration-300 hover:scale-105 relative overflow-hidden`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} -z-10`} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-900">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full bg-gradient-to-r ${stat.gradient}`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{stat.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
