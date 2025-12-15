"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Upload } from "lucide-react";

function ProfileModal({ open, onClose, refreshUser }: any) {
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    display_name: "",
    username: "",
    email: "",
    bio: "",
    phone: "",
    website: "",
    location: "",
    socialLinks: [] as { platform: string; url: string }[],
    gcash: "",
    paymaya: "",
    bpi: "",
    bdo: "",
  });
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Convert backend path to full image URL
  const getProfileImageUrl = (path?: string) => {
    if (!path) return "/avatar.png";
    if (path.startsWith("http")) return path;
    return `${process.env.NEXT_PUBLIC_IMAGE_URL}/storage/${path}`;
  };

  // Fetch user profile from /user-profile
  useEffect(() => {
    if (!open) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user-profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        const accounts = data.payment_accounts || {};
        setForm({
          firstname: data.firstname || "",
          lastname: data.lastname || "",
          display_name: data.display_name || "",
          username: data.username || "",
          email: data.email || "",
          bio: data.profile?.bio || "",
          phone: data.profile?.phone || "",
          website: data.profile?.website || "",
          location: data.profile?.location || "",
          socialLinks: data.profile?.socialLinks || [],
          gcash: accounts?.gcash || "",
          paymaya: accounts?.paymaya || "",
          bpi: accounts?.bpi || "",
          bdo: accounts?.bdo || "",
        });
        setProfileImage(data.avatar_url || null);
        setPreviewURL(null);
      })
      .catch((err) => console.error(err));
  }, [open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    try {
      const fd = new FormData();
      Object.keys(form).forEach((key) => {
        if (key !== "socialLinks") fd.append(key, (form as any)[key] || "");
      });
      form.socialLinks.forEach((link, idx) => {
        fd.append(`socialLinks[${idx}][platform]`, link.platform);
        fd.append(`socialLinks[${idx}][url]`, link.url);
      });
      if (avatarFile) fd.append("avatar", avatarFile);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      if (res.ok) {
        toast.success("Profile updated successfully");
        refreshUser?.();
        onClose();
      } else {
        toast.error("Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null; // wait for user data

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        {/* Profile Picture */}
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={previewURL || profileImage || "/avatar.png"} />
            <AvatarFallback>{form.firstname?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => avatarInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Avatar
            </Button>
            <input
              type="file"
              accept="image/*"
              ref={avatarInputRef}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setAvatarFile(file);
                setPreviewURL(URL.createObjectURL(file));
              }}
            />
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>First Name</Label>
              <Input
                name="firstname"
                value={form.firstname}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input
                name="lastname"
                value={form.lastname}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <Label>Display Name</Label>
            <Input
              name="display_name"
              value={form.display_name}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Username</Label>
            <Input
              name="username"
              value={form.username}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled
            />
          </div>
          <div>
            <Label>Phone</Label>
            <Input name="phone" value={form.phone} onChange={handleChange} />
          </div>
          <div>
            <Label>Location</Label>
            <Input
              name="location"
              value={form.location}
              onChange={handleChange}
            />
          </div>

          {/* Payment Accounts */}
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Payment Accounts (Admin)</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>GCash</Label>
                <Input
                  name="gcash"
                  value={form.gcash}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>PayMaya</Label>
                <Input
                  name="paymaya"
                  value={form.paymaya}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>BPI</Label>
                <Input name="bpi" value={form.bpi} onChange={handleChange} />
              </div>
              <div>
                <Label>BDO</Label>
                <Input name="bdo" value={form.bdo} onChange={handleChange} />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ProfileModal;
