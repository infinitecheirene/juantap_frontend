"use client"
import { useParams, notFound } from "next/navigation"
import { useEffect, useState } from "react"
import { Loading } from "@/components/loading"
import type { TemplateData } from "@/types/template"
import { User } from "@/types/user"
import PreviewRenderer from "@/components/templates/PreviewRenderer"
import { AnimatedBackground } from "@/components/templates/background/animated-bg"

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

  if (loading) return <Loading />
  if (!templateData) return notFound()

  return (
    <main
      className="relative flex-1 flex items-center justify-center min-h-screen px-4"
      style={{
        background: `${templateData?.colors?.primary}15`,
      }}
    >
      {templateData.is_premium && <AnimatedBackground template={templateData} />}
      <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 z-50">
        {templateData && userData && <PreviewRenderer template={templateData} user={userData} slug={username} />}
      </div>
    </main>
  )
}
