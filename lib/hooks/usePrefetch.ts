"use client"

import { useCallback, useRef, useEffect } from "react"
import { generationStore, type GenerationType } from "@/lib/stores/generationStore"

interface PrefetchOptions {
  type: GenerationType
  url: string
  debounceMs?: number
}

export function usePrefetch({ type, url, debounceMs = 2000 }: PrefetchOptions) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastParamsRef = useRef<string | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const prefetch = useCallback(
    (params: Record<string, unknown>, priority: number = 1) => {
      const paramsKey = JSON.stringify(params)

      // Skip if same params as last prefetch
      if (paramsKey === lastParamsRef.current) {
        return
      }

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Debounce the prefetch
      timeoutRef.current = setTimeout(() => {
        lastParamsRef.current = paramsKey

        // Check if already cached or in progress
        const existing = generationStore.getByParams(type, params)
        if (existing && (existing.status === "completed" || existing.status === "streaming")) {
          return
        }

        // Add to prefetch queue (for analytics/future background fetching)
        generationStore.addToPrefetch(type, params, priority)

        // Warm the cache by making a HEAD request or light validation
        // This primes the connection without actually generating
        fetch(url, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "X-Prefetch": "true" 
          },
          body: JSON.stringify({ ...params, _prefetch: true }),
          // Use keepalive to maintain connection
          keepalive: true,
        }).catch(() => {
          // Silently fail prefetch attempts
        })
      }, debounceMs)
    },
    [type, url, debounceMs]
  )

  const cancelPrefetch = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  return { prefetch, cancelPrefetch }
}

// Hook to predict likely form completions based on partial input
export function usePredictiveParams(type: GenerationType) {
  const getWorkoutPredictions = useCallback(
    (partial: Record<string, unknown>): Record<string, unknown>[] => {
      const predictions: Record<string, unknown>[] = []
      const base = { ...partial }

      // If goal is set, predict likely equipment choices
      if (partial.fitnessGoal && partial.experienceLevel) {
        const equipmentOptions = ["fullGym", "homeBasic", "bodyweight"]
        equipmentOptions.forEach((eq) => {
          predictions.push({
            ...base,
            equipment: eq,
            focusAreas: partial.focusAreas || ["fullBody"],
            daysPerWeek: partial.daysPerWeek || 3,
            sessionLength: partial.sessionLength || 60,
          })
        })
      }

      return predictions.slice(0, 2) // Limit to 2 predictions
    },
    []
  )

  const getMealPredictions = useCallback(
    (partial: Record<string, unknown>): Record<string, unknown>[] => {
      const predictions: Record<string, unknown>[] = []
      const base = { ...partial }

      // If goal and diet type are set, predict with common calorie targets
      if (partial.nutritionGoal && partial.dietType) {
        const calorieTargets = [1800, 2000, 2200, 2500]
        calorieTargets.forEach((cal) => {
          predictions.push({
            ...base,
            dailyCalories: cal,
            mealsPerDay: partial.mealsPerDay || 3,
            dietaryRestrictions: partial.dietaryRestrictions || "none",
            cuisinePreference: partial.cuisinePreference || "any",
          })
        })
      }

      return predictions.slice(0, 2)
    },
    []
  )

  return {
    getPredictions:
      type === "workout" ? getWorkoutPredictions : getMealPredictions,
  }
}
