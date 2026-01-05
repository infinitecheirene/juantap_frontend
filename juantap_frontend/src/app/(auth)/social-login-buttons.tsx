"use client"

import { Button } from "@/components/ui/button"

interface SocialLoginButtonsProps {
  isRegister?: boolean
}

export function SocialLoginButtons({ isRegister = false }: SocialLoginButtonsProps) {
  const handleSocialLogin = (provider: string) => {
    // Here you would handle the actual social login logic
    console.log(`${isRegister ? "Register" : "Login"} with ${provider}`)
    alert(`${isRegister ? "Register" : "Login"} with ${provider} (This is just a demo)`)
  }

  return (
    <div className="grid grid-cols-2 gap-4">
    

     
    </div>
  )
}
