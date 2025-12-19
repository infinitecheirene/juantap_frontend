"use client"

import { useEffect, useState } from "react"
import api from "@/lib/axios"
import { Button } from "@/components/ui/button"
import { QRCodeCanvas } from "qrcode.react"
import {
    Facebook,
    Instagram,
    Twitter,
    Linkedin,
    Github,
    Youtube,
    Music,
    Globe,
    User,
} from "lucide-react"

interface SocialLink {
    id: string
    platform: string
    url: string
    username?: string
    isVisible: boolean
}

interface UserData {
    id: number
    name: string
    email: string
    username: string
    profile_image?: string
    profile?: {
        socialLinks?: SocialLink[]
    }
}

interface ProfilePreviewProps {
    user?: UserData
    imageUrl?: string
}

export function ProfilePreview({ user: propUser, imageUrl }: ProfilePreviewProps) {
    const [user, setUser] = useState<UserData | null>(propUser || null)
    const [hasUsedTemplate, setHasUsedTemplate] = useState(false)
    const [imgError, setImgError] = useState(false)

    const socialIconMap: Record<string, JSX.Element> = {
        facebook: <Facebook size={14} />,
        instagram: <Instagram size={14} />,
        twitter: <Twitter size={14} />,
        linkedin: <Linkedin size={14} />,
        github: <Github size={14} />,
        youtube: <Youtube size={14} />,
        tiktok: <Music size={14} />,
    }

    // Fetch user if not passed as prop
    useEffect(() => {
        if (!propUser) {
            const fetchUser = async () => {
                try {
                    const res = await api.get("/user")
                    setUser(res.data)
                } catch (error) {
                    console.error("Failed to fetch user", error)
                }
            }
            fetchUser()
        }
    }, [propUser])

    // Check if user has used a template
    useEffect(() => {
        const checkUsedTemplate = async () => {
            if (!user?.username) return
            try {
                const res = await api.get(`/profile/${user.username}/used-templates`)
                setHasUsedTemplate(res.data && res.data.length > 0)
            } catch (error) {
                console.error("Failed to check used templates", error)
            }
        }

        checkUsedTemplate()
    }, [user])

    if (!user) {
        return <div className="text-center text-sm text-gray-500">Loading user data...</div>
    }

    const visibleLinks = user.profile?.socialLinks?.filter(link => link.isVisible) || []

    const profileImg =
        imageUrl ||
        (user.profile_image ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${user.profile_image}` : null)

    const canShowQR = !!user.username && hasUsedTemplate

    return (
        <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto border">
                {/* Profile Image */}
                <div className="flex items-center space-x-3 mb-6">
                    {profileImg && !imgError ? (
                        <img
                            src={profileImg}
                            alt={user.name}
                            onError={() => setImgError(true)}
                            className="w-16 h-16 rounded-full border object-cover"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-full border flex items-center justify-center bg-gray-100">
                            <User size={32} className="text-gray-500" />
                        </div>
                    )}
                    <div>
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        <p className="text-gray-500">{user.email}</p>
                    </div>
                </div>

                {/* Social Media Links */}
                {visibleLinks.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        {visibleLinks.map(link => {
                            const key = link.platform?.toLowerCase() || ""
                            const icon = socialIconMap[key] || <Globe size={14} />
                            return (
                                <Button
                                    key={link.id}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs bg-transparent flex items-center gap-1"
                                    onClick={() => window.open(link.url, "_blank")}
                                >
                                    {icon}
                                    {link.platform}
                                </Button>
                            )
                        })}
                    </div>
                )}

                {/* ✅ QR Code Section */}
                {canShowQR ? (
                    <div className="flex flex-col items-center mt-6">
                        <QRCodeCanvas
                            value={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/${user.username}`}
                            size={128}
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            Scan to view your digital profile
                        </p>
                    </div>
                ) : (
                    <div className="text-center text-sm text-gray-500 mt-6 italic">
                        QR code will appear once you’ve set a{" "}
                        <span className="font-semibold">username</span> and used a{" "}
                        <span className="font-semibold">template</span>.
                    </div>
                )}

            </div>
        </div>
    )
}