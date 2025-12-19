"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
              <XAxis dataKey="name" stroke="#ffffff" />
              <YAxis stroke="#ffffff" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '8px'
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
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '8px'
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