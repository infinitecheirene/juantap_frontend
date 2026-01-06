"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Eye, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface UserProfile {
  bio: string;
  phone: string;
  website: string;
  location: string;
}

interface User {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  name: string;
  email: string;
  is_admin: boolean;
  profile_image: string;
  profile_image_url?: string;
  profile?: UserProfile;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const router = useRouter();
  useEffect(() => {
    fetchUsers();

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
      router.push("/admin/users");
    }
  }, [router]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not logged in");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();
      setUsers(Array.isArray(data.users) ? data.users : []);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        console.error(error.message);
      } else {
        toast.error("Error fetching users");
        console.error(error);
      }
    }
  };

  const fetchUserProfile = async (userId: number) => {
    setLoadingProfile(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not logged in");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/user/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch user profile");

      const data = await res.json();
      setSelectedUser(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        console.error(error.message);
      } else {
        toast.error("Error fetching user profile");
        console.error(error);
      }
    } finally {
      setLoadingProfile(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        User Management
      </h1>

      <Card>
        <CardContent>
          {users.length === 0 ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2">#</th>
                  <th className="py-2">Name</th>
                  <th className="py-2">Email</th>
                  <th className="py-2 px-4">Role</th>
                  <th className="py-2">View Profile</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user, idx) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-4">{idx + 1}</td>
                      <td className="py-4 flex items-center gap-2">
                        <Image
                          src={user.profile_image ?? "/defaults/avatar.png"}
                          alt={user.name}
                          width={32}
                          height={32}
                          className="w-12 h-12 rounded-full object-cover"
                        />

                        {user.name}
                      </td>
                      <td className="py-4">{user.email}</td>
                      <td className="py-4 px-4">
                        {user.is_admin ? (
                          <Badge variant="destructive"  className="py-2 px-4">Admin</Badge>
                        ) : (
                          <Badge className="text-sm py-2 px-4">User</Badge>
                        )}
                      </td>
                      <td className="flex py-4 px-4 gap-2">
                        <Button
                          size="sm"
                          variant="outline" className="flex items-center justify-center w-12 h-9"
                          onClick={() => fetchUserProfile(user.id)}
                        >
                          <Eye size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-3 right-3"
              onClick={() => setSelectedUser(null)}
            >
              <X size={20} />
            </button>

            {loadingProfile ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <Image
                  src={
                    selectedUser.profile_image ||
                    selectedUser.profile_image_url ||
                    "https://play-lh.googleusercontent.com/y85Wq41fBfoivml6J3lTqB-WINrb2dbUTGVbYkRG12vIbiJXO97Y6N4y3JWA2rcFiQ=w480-h960-rw"
                  }
                  alt={selectedUser.name}
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full object-cover"
                />

                <h2 className="text-xl font-bold">{selectedUser.name}</h2>
                <p className="text-gray-600">{selectedUser.email}</p>

                {selectedUser.username ? (
                  <a
                    href={`/${selectedUser.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 w-full"
                  >
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      View Public Profile
                    </Button>
                  </a>
                ) : (
                  <p className="text-sm text-gray-500 mt-4">
                    This user has not set a username yet.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}