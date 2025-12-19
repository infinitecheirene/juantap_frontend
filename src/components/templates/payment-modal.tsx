"use client"

import axios from "axios"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, CreditCard, Smartphone, Building, CheckCircle, AlertCircle, X, FileText } from "lucide-react"
import { useState, useCallback, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Template } from "@/types/template"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  template: Template
  onPaymentSuccess: () => void
}

interface PaymentMethod {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  details: string
  accountInfo: string
}

export function PaymentModal({ isOpen, onClose, template, onPaymentSuccess }: PaymentModalProps) {
  // 🔑 Move useEffect inside the component
  useEffect(() => {
    const fetchPaymentAccounts = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) return

        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const accounts = res.data.payment_accounts || {}
        const methods: PaymentMethod[] = []

        if (accounts.gcash) {
          methods.push({
            id: "gcash",
            name: "GCash",
            icon: Smartphone,
            details: "Mobile payment via GCash app",
            accountInfo: accounts.gcash,
          })
        }
        if (accounts.paymaya) {
          methods.push({
            id: "paymaya",
            name: "PayMaya",
            icon: CreditCard,
            details: "Digital wallet payment",
            accountInfo: accounts.paymaya,
          })
        }
        if (accounts.bpi) {
          methods.push({
            id: "bpi",
            name: "BPI Bank Transfer",
            icon: Building,
            details: "Bank to bank transfer",
            accountInfo: accounts.bpi,
          })
        }
        if (accounts.bdo) {
          methods.push({
            id: "bdo",
            name: "BDO Bank Transfer",
            icon: Building,
            details: "Bank to bank transfer",
            accountInfo: accounts.bdo,
          })
        }

        setAvailableMethods(methods)
      } catch (err) {
        console.error("Failed to fetch payment accounts:", err)
      }
    }

    if (isOpen) fetchPaymentAccounts()
  }, [isOpen])

  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB in bytes
  const ALLOWED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

  const pathname = usePathname()
  const currentSlug = pathname.split("/").pop() || ""
  const [availableMethods, setAvailableMethods] = useState<PaymentMethod[]>([])
  const [selectedMethod, setSelectedMethod] = useState<string>("")
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [referenceNumber, setReferenceNumber] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string>("")
  const [fileError, setFileError] = useState<string>("")

  const validateFile = useCallback((file: File): string | null => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return "Please upload a valid image file (JPEG, PNG, or WebP)"
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 10MB"
    }
    return null
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setFileError("")

    if (file) {
      const validationError = validateFile(file)
      if (validationError) {
        setFileError(validationError)
        setScreenshot(null)
        // Clear the input
        e.target.value = ""
        return
      }
      setScreenshot(file)
    }
  }

  const removeFile = () => {
    setScreenshot(null)
    setFileError("")
    // Clear the file input
    const fileInput = document.getElementById("screenshot") as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMethod || !screenshot) return

    // Clear previous errors
    setError("")
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("template_slug", currentSlug)
      formData.append("payment_method", selectedMethod)
      formData.append("reference_number", referenceNumber)
      formData.append("notes", notes)
      formData.append("receipt_img", screenshot)

      // Get token from a more secure method if available
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/payment/submit`, formData, {
        headers: {
          Authorization: `Bearer ${token || ""}`,
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000, // 30 second timeout
      })

      setIsSubmitted(true)
    } catch (error) {
      console.error("Payment submission failed:", error)

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setError("Authentication failed. Please log in again.")
        } else if (error.response?.status === 413) {
          setError("File too large. Please upload a smaller image.")
        } else if (error.code === "ECONNABORTED") {
          setError("Request timed out. Please try again.")
        } else {
          setError(error.response?.data?.message || "Submission failed. Please try again.")
        }
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetModal = () => {
    setSelectedMethod("")
    setScreenshot(null)
    setReferenceNumber("")
    setNotes("")
    setIsSubmitted(false)
    setIsSubmitting(false)
    setError("")
    setFileError("")
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  if (isSubmitted) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-6">
            <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Submitted!</h3>
            <p className="text-gray-600 mb-6">
              Your payment proof has been submitted for review. You'll receive an email notification once it's approved (usually within 24 hours).
            </p>
            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Purchase {template.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Error Display */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Template Summary */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg">
                    <FileText className="w-8 h-8 text-gray-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{template.name}</h4>
                    <p className="text-sm text-gray-600">{template.category === "premium" ? "Premium Template" : "Free Template"}</p>
                  </div>
                </div>
                <div className="text-right">
                  {template.original_price && template.discount ? (
                    <div>
                      <span className="text-xl font-bold">₱{template.price}</span>
                      <span className="text-sm text-gray-500 line-through ml-2">₱{template.original_price}</span>
                      <Badge variant="destructive" className="ml-2 bg-red-500">
                        -{template.discount}%
                      </Badge>
                    </div>
                  ) : (
                    <span className="text-xl font-bold">₱{template.price}</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                Payment Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Choose your preferred payment method below</li>
                  <li>Send the exact amount to the provided account</li>
                  <li>Take a screenshot of your payment confirmation</li>
                  <li>Upload the screenshot and submit for review</li>
                  <li>Wait for admin approval (usually within 24 hours)</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Methods */}
            <div>
              <Label className="text-base font-semibold mb-4 block">Choose Payment Method</Label>
              <div className="grid md:grid-cols-2 gap-3">
                {availableMethods.length > 0 ? (
                  availableMethods.map((method) => {
                    const Icon = method.icon

                    return (
                      <Card
                        key={method.id}
                        className={`cursor-pointer transition-all ${
                          selectedMethod === method.id ? "border-purple-500 bg-purple-50" : "hover:border-gray-300 bg-transparent"
                        }`}
                        onClick={() => setSelectedMethod(method.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <Icon className="w-6 h-6 text-gray-600" />

                            <div className="flex-1">
                              <h4 className="font-medium">{method.name}</h4>
                              <p className="text-xs text-gray-500">{method.details}</p>
                            </div>

                            <div
                              className={`w-4 h-4 rounded-full border-2 ${
                                selectedMethod === method.id ? "border-purple-500 bg-purple-500" : "border-gray-300"
                              }`}
                            >
                              {selectedMethod === method.id && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-8 text-center border rounded-lg bg-muted/30">
                    <p className="text-sm font-medium text-gray-700">No payment methods available</p>
                    <p className="text-xs text-gray-500 mt-1">The admin has not added any payment accounts yet.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Account Information */}
            {selectedMethod && (
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Payment Details</h4>
                  <p className="text-sm text-gray-700">{availableMethods.find((m) => m.id === selectedMethod)?.accountInfo}</p>
                  <p className="text-sm font-medium text-purple-600 mt-2">Amount: ₱{template.price}</p>
                </CardContent>
              </Card>
            )}

            {/* Screenshot Upload */}
            <div>
              <Label htmlFor="screenshot" className="text-base font-semibold">
                Upload Payment Screenshot *
              </Label>
              <div className="mt-2">
                {screenshot ? (
                  <div className="border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={URL.createObjectURL(screenshot)} alt="Payment screenshot preview" className="w-16 h-16 object-cover rounded" />
                        <div>
                          <p className="font-medium text-sm">{screenshot.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(screenshot.size)}</p>
                        </div>
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={removeFile} className="text-red-600 hover:text-red-700">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  //When no payment method yet
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="screenshot"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">Click to upload screenshot</p>
                        <p className="text-xs text-gray-500">PNG, JPG, WebP up to 10MB</p>
                      </div>
                      <input id="screenshot" type="file" accept="image/*" onChange={handleFileChange} className="hidden" required />
                    </label>
                  </div>
                )}
                {fileError && (
                  <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {fileError}
                  </p>
                )}
              </div>
            </div>

            {/* Reference Number */}
            <div>
              <Label htmlFor="reference">Reference Number (Optional)</Label>
              <Input
                id="reference"
                placeholder="Enter transaction reference number"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                maxLength={50}
              />
            </div>

            {/* Additional Notes */}
            <div>
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any additional information about your payment"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">{notes.length}/500 characters</p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1 bg-transparent" disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!selectedMethod || !screenshot || isSubmitting || !!fileError}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isSubmitting ? "Submitting..." : "Submit Payment Proof"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
