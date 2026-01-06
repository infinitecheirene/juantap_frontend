"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Save,
  Loader2,
  CheckCircle,
  User,
  Globe,
  MapPin,
  Phone,
  Mail,
  Upload,
  Plus,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileEditModal({ isOpen, onClose }: ProfileEditModalProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Static profile data
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    displayName: "John Doe",
    username: "johndoe",
    bio: "Digital Creator & Tech Enthusiast. Sharing my journey in web development and design.",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    website: "https://johndoe.dev",
    location: "San Francisco, CA",
    avatar: "/placeholder.svg?height=120&width=120",
    socialLinks: [
      {
        id: "1",
        platform: "Instagram",
        url: "https://instagram.com/johndoe",
        username: "@johndoe",
        isVisible: true,
      },
      {
        id: "2",
        platform: "LinkedIn",
        url: "https://linkedin.com/in/johndoe",
        username: "John Doe",
        isVisible: true,
      },
      {
        id: "3",
        platform: "Twitter",
        url: "https://twitter.com/johndoe",
        username: "@johndoe",
        isVisible: false,
      },
    ],
  });

  const handleInputChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
    setIsSaved(false);
  };

  const handleSocialLinkChange = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    const updatedSocialLinks = [...profile.socialLinks];
    updatedSocialLinks[index] = {
      ...updatedSocialLinks[index],
      [field]: value,
    };
    setProfile((prev) => ({ ...prev, socialLinks: updatedSocialLinks }));
    setHasChanges(true);
  };

  const addSocialLink = () => {
    const newLink = {
      id: Date.now().toString(),
      platform: "",
      url: "",
      username: "",
      isVisible: true,
    };
    setProfile((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, newLink],
    }));
    setHasChanges(true);
  };

  const removeSocialLink = (index: number) => {
    const updatedSocialLinks = profile.socialLinks.filter(
      (_, i) => i !== index
    );
    setProfile((prev) => ({ ...prev, socialLinks: updatedSocialLinks }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    setHasChanges(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleClose = () => {
    if (hasChanges) {
      const confirmClose = window.confirm(
        "You have unsaved changes. Are you sure you want to close?"
      );
      if (!confirmClose) return;
    }
    setHasChanges(false);
    setIsSaved(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Edit Profile</span>
            <div className="flex items-center gap-2">
              {hasChanges && (
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-700"
                >
                  Unsaved changes
                </Badge>
              )}
              {isSaved && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Saved
                </Badge>
              )}
              <Button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="social">Social Links</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6 mt-6">
              {/* Profile Picture */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {profile.avatar}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage
                        src={profile.avatar || "/placeholder.svg"}
                        alt={profile.displayName}
                      />
                      <AvatarFallback className="text-lg">
                        {profile.firstName[0]}
                        {profile.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload New Picture
                      </Button>
                      <p className="text-sm text-gray-500">
                        JPG, PNG up to 5MB
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profile.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profile.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={profile.displayName}
                      onChange={(e) =>
                        handleInputChange("displayName", e.target.value)
                      }
                      placeholder="How your name appears on your profile"
                    />
                  </div>

                  <div>
                    <Label htmlFor="username">Username</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        juantap.info/
                      </span>
                      <Input
                        id="username"
                        value={profile.username}
                        onChange={(e) =>
                          handleInputChange("username", e.target.value)
                        }
                        placeholder="username"
                        className="rounded-l-none"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      placeholder="Tell people about yourself..."
                      rows={3}
                      className="resize-none"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {profile.bio.length}/500 characters
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="email"
                        className="flex items-center gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="phone"
                        className="flex items-center gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="website"
                        className="flex items-center gap-2"
                      >
                        <Globe className="w-4 h-4" />
                        Website
                      </Label>
                      <Input
                        id="website"
                        value={profile.website}
                        onChange={(e) =>
                          handleInputChange("website", e.target.value)
                        }
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="location"
                        className="flex items-center gap-2"
                      >
                        <MapPin className="w-4 h-4" />
                        Location
                      </Label>
                      <Input
                        id="location"
                        value={profile.location}
                        onChange={(e) =>
                          handleInputChange("location", e.target.value)
                        }
                        placeholder="City, Country"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Social Media Links
                    <Button onClick={addSocialLink} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Link
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.socialLinks.map((link, index) => (
                    <div
                      key={link.id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={link.isVisible ? "default" : "secondary"}
                          >
                            {link.isVisible ? "Visible" : "Hidden"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleSocialLinkChange(
                                index,
                                "isVisible",
                                !link.isVisible
                              )
                            }
                          >
                            {link.isVisible ? (
                              <Eye className="w-4 h-4" />
                            ) : (
                              <EyeOff className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSocialLink(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-3">
                        <div>
                          <Label>Platform</Label>
                          <Input
                            value={link.platform}
                            onChange={(e) =>
                              handleSocialLinkChange(
                                index,
                                "platform",
                                e.target.value
                              )
                            }
                            placeholder="Instagram"
                          />
                        </div>
                        <div>
                          <Label>URL</Label>
                          <Input
                            value={link.url}
                            onChange={(e) =>
                              handleSocialLinkChange(
                                index,
                                "url",
                                e.target.value
                              )
                            }
                            placeholder="https://instagram.com/username"
                          />
                        </div>
                        <div>
                          <Label>Display Name</Label>
                          <Input
                            value={link.username}
                            onChange={(e) =>
                              handleSocialLinkChange(
                                index,
                                "username",
                                e.target.value
                              )
                            }
                            placeholder="@username"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {profile.socialLinks.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No social links added yet.</p>
                      <p className="text-sm">
                        Click "Add Link" to get started.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <Separator />

        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-gray-500">
            Last updated: March 15, 2024
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleClose}
              className="bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
