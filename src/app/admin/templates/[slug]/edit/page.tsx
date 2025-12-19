"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MinimalClean } from "@/components/template-previews/minimal-clean-template-edit";

type Template = {
  id: number;
  slug: string;
  name: string;
  description: string;
  colors: Record<string, string>;
  fonts: Record<string, string>;
  features: string[] | object;
  tags: string[] | object;
  socialStyle?: string;
  connectStyle?: string;
  is_hidden?: boolean;
};

type TemplatePayload = Omit<
  Template,
  "features" | "colors" | "fonts" | "tags"
> & {
  features: string;
  colors: string;
  fonts: string;
  tags: string;
};

export default function EditTemplatePage() {
  const { slug } = useParams();
  const router = useRouter();

  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch template data
  useEffect(() => {
    if (!slug) return;

    const fetchTemplate = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/templates/${slug}`
        );

        // Ensure colors/fonts objects exist
        const data = res.data as Template;
        setTemplate({
          ...data,
          colors: data.colors || {},
          fonts: data.fonts || {},
        });
      } catch (err) {
        console.error("❌ Failed to fetch template:", err);
        alert("Failed to load template.");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [slug]);

  // Save template update
  const saveTemplate = async () => {
    if (!template) return;
    setSaving(true);

    try {
      const payload: TemplatePayload = {
        id: template.id,
        slug: template.slug,
        name: template.name,
        description: template.description,
        socialStyle: template.socialStyle,
        connectStyle: template.connectStyle,
        is_hidden: template.is_hidden,
        // Convert to JSON strings for Laravel
        features: JSON.stringify(template.features),
        colors: JSON.stringify(template.colors),
        fonts: JSON.stringify(template.fonts),
        tags: JSON.stringify(template.tags),
      };

      const token = localStorage.getItem("token");

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/templates/${template.id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Template updated successfully!");
      router.push("/admin/templates");
    } catch (err) {
      console.error("❌ Failed to update template:", err);
      if (axios.isAxiosError(err)) {
        console.error("Response data:", err.response?.data);
        alert(
          `Error saving template: ${err.response?.data?.message || err.message}`
        );
      } else {
        alert("Error saving template.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading template...</p>;
  if (!template) return <p>Template not found</p>;

  // Update color helper
  const updateColor = (key: string, value: string) => {
    setTemplate({
      ...template,
      colors: {
        ...template.colors,
        [key]: value,
      },
    });
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <Link href="/admin/templates">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Templates
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Template</h1>
        <p className="text-gray-600 mt-2">
          Edit and customize a business card template
        </p>
      </div>

      {/* Basic Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Basic Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Slug</Label>
            <Input
              value={template.slug}
              disabled
              className="bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <Label>Name</Label>
            <Input
              value={template.name}
              onChange={(e) =>
                setTemplate({ ...template, name: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={template.description}
              onChange={(e) =>
                setTemplate({ ...template, description: e.target.value })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Visibility / Hide Template */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Design Customization</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Social Links</Label>
            <select
              className="w-full border rounded p-2"
              value={template.socialStyle ? "default" : "circles"}
              onChange={(e) =>
                setTemplate({ ...template, is_hidden: e.target.value === "1" })
              }
            >
              <option value="default">Default</option>
              <option value="circles">Circles</option>
              <option value="fullblock">Full Block</option>
            </select>
          </div>
          <div>
            <Label>Social Links</Label>
            <select
              className="w-full border rounded p-2"
              value={template.connectStyle ? "grid" : "list"}
              onChange={(e) =>
                setTemplate({ ...template, is_hidden: e.target.value === "1" })
              }
            >
              <option value="grid">Grid</option>
              <option value="list">List</option>
              <option value="compact">Compact</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Colors */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Colors</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {["primary", "secondary", "accent", "background", "text"].map(
            (key) => (
              <div key={key}>
                <Label className="capitalize">{key}</Label>
                <Input
                  type="color"
                  value={
                    template.colors?.[key] ||
                    (key === "background" ? "#ffffff" : "#000000")
                  }
                  onChange={(e) => updateColor(key, e.target.value)}
                />
              </div>
            )
          )}
        </CardContent>
      </Card>

      {/* Pricing Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Premium Toggle */}
          <div className="md:col-span-2">
            <Label>Premium?</Label>
            <select
              className="border rounded p-2 w-full"
              value={template.is_premium ? "1" : "0"}
              onChange={(e) =>
                setTemplate({ ...template, is_premium: e.target.value === "1" })
              }
            >
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
          </div>

          {/* Show pricing fields ONLY if Premium */}
          {template.is_premium && (
            <>
              <div>
                <Label>Price (auto-calculated)</Label>
                <Input
                  type="number"
                  value={template.price || ""}
                  disabled
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <Label>Original Price</Label>
                <Input
                  type="number"
                  value={template.original_price || ""}
                  onChange={(e) => {
                    const original = Number(e.target.value) || 0;
                    const discount = Number(template.discount) || 0;
                    const calculated = original - (original * discount) / 100;

                    setTemplate({
                      ...template,
                      original_price: original,
                      price: calculated,
                    });
                  }}
                />
              </div>
              <div>
                <Label>Discount (%)</Label>
                <Input
                  type="number"
                  value={template.discount || ""}
                  onChange={(e) => {
                    const discount = Number(e.target.value) || 0;
                    const original = Number(template.original_price) || 0;
                    const calculated = original - (original * discount) / 100;

                    setTemplate({
                      ...template,
                      discount,
                      price: calculated,
                    });
                  }}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Visibility / Hide Template */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Visibility</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label>Hide this template?</Label>
            <select
              className="border rounded p-2 w-full"
              value={template.is_hidden ? "1" : "0"}
              onChange={(e) =>
                setTemplate({ ...template, is_hidden: e.target.value === "1" })
              }
            >
              <option value="0">No (Visible)</option>
              <option value="1">Yes (Hidden)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button onClick={saveTemplate} disabled={saving} className="mt-6">
        {saving ? "Saving..." : "Save Changes"}
      </Button>

      {/* Live Preview */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <MinimalClean
              socialStyle={template.socialStyle}
              connectStyle={template.connectStyle}
              colors={template.colors}
              fonts={template.fonts}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
