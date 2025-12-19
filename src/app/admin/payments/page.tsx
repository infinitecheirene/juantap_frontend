"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { columns, Payment } from "./columns";
const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchPayments();

    const userData = localStorage.getItem("user");
    const data = userData ? JSON.parse(userData) : null;
    if (!userData) {
      router.push("/");
      return;
    }
    const user = JSON.parse(userData);

    console.log("user admin ", user.is_admin);

    if (!user.is_admin) {
      router.push("/");
    } else {
      router.push("/admin/payments");
    }
  }, [router]);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/payments`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setPayments(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Payment Management
      </h1>

      <Card className="shadow-xl border-0">
        <CardContent className="p-4">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={payments}
              refreshData={fetchPayments}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
