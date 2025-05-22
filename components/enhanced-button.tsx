import type React from "react"
export interface EnhancedButtonProps {
  children: React.ReactNode
  primary?: boolean
  href: string
  className?: string
  size?: "default" | "lg" | "xl"
  onClick?: () => void
}
