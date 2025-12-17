"use client"
import { useParams, notFound } from "next/navigation"
import { useEffect, useState } from "react"
import { PreviewRenderer } from "@/components/templates/PreviewRenderer"
// ✅ Import your custom Loading component
import { Loading } from "@/components/loading"
import type { SocialLink, TemplateData } from "@/types/template"
import { User, UserData } from "@/types/user"

export default function PublicProfilePage() {
  const { username } = useParams<{ username: string }>()
  const [templateData, setTemplateData] = useState<TemplateData | null>(null)
  const [userData, setUserData] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const templateRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/${username}/used-templates`)
      const usedTemplates = templateRes.ok ? await templateRes.json() : []

      const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/${username}`)
      const user = userRes.ok ? await userRes.json() : null

      let finalTemplate: TemplateData | null = null
      if (usedTemplates?.length) {
        const t = usedTemplates[0]

        // fetch full template details
        const fullTemplateRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/templates/${t.slug}`)
        const fullTemplate = fullTemplateRes.ok ? await fullTemplateRes.json() : null

        finalTemplate = {
          ...fullTemplate,
          thumbnail_url: fullTemplate?.thumbnail_url ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${fullTemplate.thumbnail_url}` : "/placeholder.svg",
        }
      }

      setTemplateData(finalTemplate)

      if (user) {
        setUserData({
          ...user,
          avatar_url: user.avatar_url,
          title: user.profile?.bio ?? "",
          address: user.profile?.location ?? "",
          social_links:
            user.profile?.socialLinks?.reduce((acc: any, link: any) => {
              acc[link.platform.toLowerCase()] = link.url
              return acc
            }, {}) ?? {},
        })
      }

      setLoading(false)
    }
    fetchData()
  }, [username])

  if (loading) return <Loading /> // ✅ Use custom Loading component
  if (!templateData) return notFound()

  return (
    <main className="flex-1">
      {
         templateData && userData &&
        <PreviewRenderer template={templateData} user={userData} slug={username} />
      }
    </main>
  )
}
