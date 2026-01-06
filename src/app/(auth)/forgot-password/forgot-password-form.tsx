"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Loader2, CheckCircle } from "lucide-react"

interface ForgotPasswordFormData {
  email: string
}

interface FormErrors {
  email?: string
  general?: string
}

export function ForgotPasswordForm() {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!validateForm()) return

  setIsLoading(true)
  setErrors({})

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email: formData.email }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || "Failed to send reset link")
    }

    setIsSuccess(true)
  } catch (error: any) {
    setErrors({ general: error.message })
  } finally {
    setIsLoading(false)
  }
}


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ email: e.target.value })
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }))
    }
  }

  if (isSuccess) {
    return (
      <Card className="shadow-xl border-0">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Check your email</h3>
           <p className="text-sm text-gray-600 mb-4">
              We&apos;ve sent a password reset link to <strong>{formData.email}</strong>
            </p>

           <p className="text-xs text-gray-500">
              Didn&apos;t receive the email? Check your spam folder or try again.
            </p>

          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-xl border-0">
      <CardHeader>
        <CardTitle className="text-center">Reset Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{errors.general}</div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleInputChange}
                className={`pl-10 ${errors.email ? "border-red-500 focus:border-red-500" : ""}`}
                disabled={isLoading}
              />
            </div>
            {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending reset link...
              </>
            ) : (
              "Send reset link"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
