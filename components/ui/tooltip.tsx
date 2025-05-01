"use client"

import { useState, useRef, useEffect, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"

interface TooltipProps {
  content: ReactNode
  children: ReactNode
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  className?: string
  contentClassName?: string
  delayDuration?: number
}

export function CustomTooltip({
  content,
  children,
  side = "top",
  align = "center",
  className,
  contentClassName,
  delayDuration = 300,
}: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setIsOpen(true), delayDuration)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setIsOpen(false), 100)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (isOpen && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()

      let top = 0
      let left = 0

      // Calculate position based on side
      switch (side) {
        case "top":
          top = triggerRect.top - tooltipRect.height - 8
          break
        case "bottom":
          top = triggerRect.bottom + 8
          break
        case "left":
          left = triggerRect.left - tooltipRect.width - 8
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
          break
        case "right":
          left = triggerRect.right + 8
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
          break
      }

      // Adjust horizontal alignment for top and bottom
      if (side === "top" || side === "bottom") {
        switch (align) {
          case "start":
            left = triggerRect.left
            break
          case "center":
            left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
            break
          case "end":
            left = triggerRect.right - tooltipRect.width
            break
        }
      }

      // Adjust vertical alignment for left and right
      if (side === "left" || side === "right") {
        switch (align) {
          case "start":
            top = triggerRect.top
            break
          case "center":
            top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
            break
          case "end":
            top = triggerRect.bottom - tooltipRect.height
            break
        }
      }

      // Adjust for scroll position
      top += window.scrollY
      left += window.scrollX

      // Ensure tooltip stays within viewport
      const padding = 10
      if (left < padding) left = padding
      if (top < padding) top = padding
      if (left + tooltipRect.width > window.innerWidth - padding) {
        left = window.innerWidth - tooltipRect.width - padding
      }
      if (top + tooltipRect.height > window.innerHeight - padding) {
        top = window.innerHeight - tooltipRect.height - padding
      }

      setPosition({ top, left })
    }
  }, [isOpen, side, align])

  // Only render the portal if we're in the browser
  const isBrowser = typeof window !== "undefined"

  return (
    <div
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      className={cn("inline-block", className)}
    >
      {children}
      {isBrowser &&
        isOpen &&
        createPortal(
          <div
            ref={tooltipRef}
            style={{
              position: "absolute",
              top: `${position.top}px`,
              left: `${position.left}px`,
              zIndex: 9999,
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn(
              "z-50 overflow-hidden rounded-md border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm text-gray-200 shadow-md animate-in fade-in-0 zoom-in-95",
              contentClassName,
            )}
          >
            {content}
          </div>,
          document.body,
        )}
    </div>
  )
}

