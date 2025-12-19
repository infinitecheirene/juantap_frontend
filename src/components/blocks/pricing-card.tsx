'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface PricingCardProps {
  name: string
  description: string
  price: string
  priceSubtext?: string
  priceColor: string
  features: string[]
  buttonText: string
  buttonVariant: "default" | "outline"
  buttonClass: string
  badge?: string
  borderClass?: string
  iconColor?: string
  onClick?: () => void 
   loadingBtn?: string
}

export function PricingCard({
  name,
  description,
  price,
  priceSubtext,
  priceColor,
  features,
  buttonText,
  buttonVariant,
  buttonClass,
  badge,
  borderClass = "border-2 border-gray-200 hover:border-blue-300",
  iconColor = "text-green-500",
  onClick,
  loadingBtn
  
}: PricingCardProps) {
  return (
    <Card className={cn("transition-colors relative flex flex-col h-full", borderClass)}>
        {badge && (
          <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600">
            {badge}
          </Badge>
        )}
        <CardHeader className="text-center flex-grow-0">
          <CardTitle className="text-2xl">{name}</CardTitle>
          <CardDescription className="text-lg">{description}</CardDescription>
          <div className={cn("text-3xl font-bold mt-4", priceColor)}>{price}</div>
          {priceSubtext && <p className="text-sm text-gray-500">{priceSubtext}</p>}
        </CardHeader>

        <CardContent className="flex flex-col flex-grow justify-between">
          <ul className="space-y-3 mb-6">
            {features.map((feature) => (
              <li key={feature} className="flex items-center">
                <CheckCircle className={cn("w-5 h-5 mr-3", iconColor)} />
                {feature}
              </li>
            ))}
          </ul>

          <Button
            className={cn("w-full mt-auto flex items-center justify-center gap-2", buttonClass)}
            variant={buttonVariant}
            onClick={onClick}
            disabled={loadingBtn === name}
          >
            {loadingBtn === name ? "Loading..." : buttonText}
          </Button>
        </CardContent>
      </Card>

  )
}
