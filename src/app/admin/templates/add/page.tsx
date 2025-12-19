"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { MinimalClean } from "@/components/template-previews/minimal-clean-template-add";

interface TemplateData {
  id: string;
  slug: string;
  name: string;
  description: string;
  preview_url: string;
  thumbnail_url: string;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
  category: "free" | "premium";
  price: number;
  original_price?: number;
  discount?: number;
  features: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  layout: "minimal" | "modern" | "creative" | "professional" | "artistic";
  tags: string[];
  is_popular: boolean;
  is_new: boolean;
  downloads: number;
  socialStyle: "default" | "circles" | "fullblock";
  connectStyle: "grid" | "list" | "compact";
}

const defaultTemplate: TemplateData = {
  id: "",
  slug: "",
  name: "",
  description: "",
  preview_url: "/placeholder.svg",
  thumbnail_url: "/placeholder.svg",
  is_premium: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  category: "free", // must be "free" or "premium"
  price: 0,
  original_price: 0,
  discount: 0,
  features: [],
  colors: { primary: "", secondary: "", accent: "", background: "", text: "" },
  fonts: { heading: "", body: "" },
  layout: "minimal", // must be one of the allowed values
  tags: [],
  is_popular: false,
  is_new: false,
  downloads: 0,
  connectStyle: "grid",
  socialStyle: "circles",
};

type TemplatePayload = Omit<
  TemplateData,
  "id" | "features" | "colors" | "fonts" | "tags"
> & {
  features: string;
  colors: string;
  fonts: string;
  tags: string;
};

export default function AddTemplatePage() {
  const [template, setTemplate] = useState<TemplateData>(defaultTemplate);
  const [newFeature, setNewFeature] = useState("");
  const [newTag, setNewTag] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const updateTemplate = <K extends keyof TemplateData>(
    field: K,
    value: TemplateData[K]
  ) => {
    setTemplate((prev) => ({
      ...prev,
      [field]: value,
      updated_at: new Date().toISOString(),
    }));
  };

  const updateColors = (colorKey: string, value: string) => {
    setTemplate((prev) => ({
      ...prev,
      colors: { ...prev.colors, [colorKey]: value },
      updated_at: new Date().toISOString(),
    }));
  };

  const updateFonts = (fontKey: string, value: string) => {
    setTemplate((prev) => ({
      ...prev,
      fonts: { ...prev.fonts, [fontKey]: value },
      updated_at: new Date().toISOString(),
    }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setTemplate((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setTemplate((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addTag = () => {
    if (newTag.trim()) {
      setTemplate((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    setTemplate((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (name: string) => {
    updateTemplate("name", name);
    if (!template.id) {
      const slug = generateSlug(name);
      updateTemplate("slug", slug);
      updateTemplate("id", slug);
    }
  };

  const saveTemplate = async () => {
    if (!template.name || !template.description) {
      alert("Name and description are required!");
      return;
    }

    setSaving(true);

    try {
      const slug = template.slug || generateSlug(template.name);
      const now = new Date().toISOString();

      const payload: TemplatePayload = {
        ...template,
        slug,
        created_at: template.created_at || now,
        updated_at: now,
        features: JSON.stringify(template.features),
        colors: JSON.stringify(template.colors),
        fonts: JSON.stringify(template.fonts),
        tags: JSON.stringify(template.tags),
      };

      console.log("[v2] Sending template data to Laravel backend:", payload);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/templates/store`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log("[v2] Backend response:", response.data);

      setTemplate({
        ...defaultTemplate,
        created_at: now,
        updated_at: now,
      });

      alert("Template saved successfully!");
      router.push("/admin/templates");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Check if we got an HTML response instead of JSON
        const contentType = error.response?.headers['content-type'];

        if (contentType?.includes('text/html')) {
          console.error('[v2] Server returned HTML instead of JSON');
          console.error('Response data:', error.response?.data);
          alert('Server error: The API endpoint returned an HTML error page. Check the console for details.');
        } else if (error.response) {
          // The request was made and the server responded with a status code
          console.error('[v2] Server error:', error.response.status);
          console.error('Error data:', error.response.data);
          alert(`Error ${error.response.status}: ${error.response.data.message || 'Failed to save template'}`);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('[v2] No response received:', error.request);
          alert('No response from server. Please check your network connection.');
        } else {
          // Something happened in setting up the request
          console.error('[v2] Request setup error:', error.message);
          alert(`Error: ${error.message}`);
        }
      } else if (error instanceof Error) {
        console.error("[v2] Error saving template:", error.message);
        alert(error.message);
      } else {
        console.error("[v2] Unknown error saving template:", error);
        alert("Failed to save template. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/admin/templates">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Templates
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Add New Template</h1>
          <p className="text-gray-600 mt-2">
            Create and customize a new business card template
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <div className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="mb-1" htmlFor="name">Template Name</Label>
                  <Input
                    id="name"
                    value={template.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g., Minimal Clean"
                  />
                </div>
                <div>
                  <Label className="mb-1" htmlFor="slug">Slug (auto-generated)</Label>
                  <Input
                    id="slug"
                    value={template.slug}
                    onChange={(e) => updateTemplate("slug", e.target.value)}
                    placeholder="minimal-clean"
                  />
                </div>
                <div>
                  <Label className="mb-1" htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={template.description}
                    onChange={(e) =>
                      updateTemplate("description", e.target.value)
                    }
                    placeholder="A clean and simple design perfect for professionals..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-1" htmlFor="category">Category</Label>
                    <Select
                      value={template.category}
                      onValueChange={(value) => {
                        updateTemplate("category", value);
                        updateTemplate("is_premium", value === "premium");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-1" htmlFor="layout">Layout</Label>
                    <Select
                      value={template.layout}
                      onValueChange={(value) => updateTemplate("layout", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                        <SelectItem value="professional">
                          Professional
                        </SelectItem>
                        <SelectItem value="artistic">Artistic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {template.category === "premium" && (
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="mb-1" htmlFor="price">Price (auto-calculated)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={template.price}
                        disabled
                        className="bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <Label className="mb-1" htmlFor="original_price">Original Price</Label>
                      <Input
                        id="original_price"
                        type="number"
                        value={template.original_price || ""}
                        onChange={(e) => {
                          const original = Number(e.target.value) || 0;
                          updateTemplate("original_price", original);
                          const calculated =
                            original -
                            (original * (template.discount || 0)) / 100;
                          updateTemplate("price", calculated);
                        }}
                        placeholder="399"
                      />
                    </div>
                    <div>
                      <Label htmlFor="discount">Discount %</Label>
                      <Input
                        id="discount"
                        type="number"
                        value={template.discount || ""}
                        onChange={(e) => {
                          const discount = Number(e.target.value) || 0;
                          updateTemplate("discount", discount);
                          const calculated =
                            (template.original_price || 0) -
                            ((template.original_price || 0) * discount) / 100;
                          updateTemplate("price", calculated);
                        }}
                        placeholder="0"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Design Customization */}
            <Card>
              <CardHeader>
                <CardTitle>Design Customization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="socialStyle">Social Links Style</Label>
                    <Select
                      value={template.socialStyle}
                      onValueChange={(value) =>
                        updateTemplate("socialStyle", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="circles">Circles</SelectItem>
                        <SelectItem value="fullblock">Full Block</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="connectStyle">Connect Section Style</Label>
                    <Select
                      value={template.connectStyle}
                      onValueChange={(value) =>
                        updateTemplate("connectStyle", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grid">Grid</SelectItem>
                        <SelectItem value="list">List</SelectItem>
                        <SelectItem value="compact">Compact</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Colors */}
            <Card>
              <CardHeader>
                <CardTitle>Colors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primary">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primary"
                        type="color"
                        value={template.colors.primary}
                        onChange={(e) =>
                          updateColors("primary", e.target.value)
                        }
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={template.colors.primary}
                        onChange={(e) =>
                          updateColors("primary", e.target.value)
                        }
                        placeholder="#1f2937"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="secondary">Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondary"
                        type="color"
                        value={template.colors.secondary}
                        onChange={(e) =>
                          updateColors("secondary", e.target.value)
                        }
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={template.colors.secondary}
                        onChange={(e) =>
                          updateColors("secondary", e.target.value)
                        }
                        placeholder="#6b7280"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="accent">Accent Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="accent"
                        type="color"
                        value={template.colors.accent}
                        onChange={(e) => updateColors("accent", e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={template.colors.accent}
                        onChange={(e) => updateColors("accent", e.target.value)}
                        placeholder="#3b82f6"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="background">Background Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="background"
                        type="color"
                        value={template.colors.background}
                        onChange={(e) =>
                          updateColors("background", e.target.value)
                        }
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={template.colors.background}
                        onChange={(e) =>
                          updateColors("background", e.target.value)
                        }
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="text">Text Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="text"
                        type="color"
                        value={template.colors.text}
                        onChange={(e) => updateColors("text", e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={template.colors.text}
                        onChange={(e) => updateColors("text", e.target.value)}
                        placeholder="#111827"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fonts */}
            <Card>
              <CardHeader>
                <CardTitle>Typography</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="headingFont">Heading Font</Label>
                    <Select
                      value={template.fonts.heading}
                      onValueChange={(value) => updateFonts("heading", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Poppins">Poppins</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Playfair Display">
                          Playfair Display
                        </SelectItem>
                        <SelectItem value="Merriweather">
                          Merriweather
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="bodyFont">Body Font</Label>
                    <Select
                      value={template.fonts.body}
                      onValueChange={(value) => updateFonts("body", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                        <SelectItem value="Lato">Lato</SelectItem>
                        <SelectItem value="Source Sans Pro">
                          Source Sans Pro
                        </SelectItem>
                        <SelectItem value="Nunito">Nunito</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add a feature..."
                    onKeyPress={(e) => e.key === "Enter" && addFeature()}
                  />
                  <Button onClick={addFeature}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {template.features.map((feature, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeFeature(index)}
                    >
                      {feature} ×
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag..."
                    onKeyPress={(e) => e.key === "Enter" && addTag()}
                  />
                  <Button onClick={addTag}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {template.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => removeTag(index)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Options */}
            <Card>
              <CardHeader>
                <CardTitle>Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_popular"
                    checked={template.is_popular}
                    onCheckedChange={(checked) =>
                      updateTemplate("is_popular", checked)
                    }
                  />
                  <Label htmlFor="is_popular">Mark as Popular</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_new"
                    checked={template.is_new}
                    onCheckedChange={(checked) =>
                      updateTemplate("is_new", checked)
                    }
                  />
                  <Label htmlFor="is_new">Mark as New</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_premium"
                    checked={template.is_premium}
                    onCheckedChange={(checked) => {
                      updateTemplate("is_premium", checked);
                      updateTemplate("category", checked ? "premium" : "free");
                    }}
                  />
                  <Label htmlFor="is_premium">Premium Template</Label>
                </div>
              </CardContent>
            </Card>

            <Button onClick={saveTemplate} disabled={saving} className="w-full">
              {saving ? "Saving..." : "Save Template"}
            </Button>
          </div>

          {/* Preview Panel */}
          <div className="lg:sticky lg:top-6">
            <Card>
              <CardHeader>
                <CardTitle>Template Preview</CardTitle>
                <p className="text-sm text-gray-600">
                  Live preview with design customizations
                </p>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="scale-75 origin-top">
                    <MinimalClean
                      socialStyle={template.socialStyle}
                      connectStyle={template.connectStyle}
                      colors={template.colors}
                      fonts={template.fonts}
                    />
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Name:</strong>{" "}
                    {template.name || "Untitled Template"}
                  </div>
                  <div>
                    <strong>Category:</strong> {template.category}
                  </div>
                  <div>
                    <strong>Layout:</strong> {template.layout}
                  </div>
                  <div>
                    <strong>Social Style:</strong> {template.socialStyle}
                  </div>
                  <div>
                    <strong>Connect Style:</strong> {template.connectStyle}
                  </div>
                  <div>
                    <strong>Premium:</strong>{" "}
                    {template.is_premium ? "Yes" : "No"}
                  </div>
                  {template.category === "premium" && (
                    <div>
                      <strong>Price:</strong> ₱{template.price}
                    </div>
                  )}
                  <div>
                    <strong>Downloads:</strong> {template.downloads}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
