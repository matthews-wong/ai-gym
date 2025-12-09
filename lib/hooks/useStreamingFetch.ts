"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { generationStore, type GenerationType } from "@/lib/stores/generationStore"

interface StreamingState<T> {
  isLoading: boolean
  isStreaming: boolean
  error: string | null
  data: T | null
  streamedContent: string
  progress: number
  stage: string
  canResume: boolean
  generationId: string | null
  retryCount: number
  isRetrying: boolean
}

interface UseStreamingFetchOptions<T> {
  type: GenerationType
  onChunk?: (chunk: string) => void
  onComplete?: (data: T) => void
  onError?: (error: string) => void
  onProgress?: (progress: number, stage: string) => void
}

const STAGES = {
  workout: [
    { threshold: 0, label: "Analyzing your fitness goals..." },
    { threshold: 20, label: "Selecting exercises..." },
    { threshold: 40, label: "Building your routine..." },
    { threshold: 60, label: "Optimizing sets and reps..." },
    { threshold: 80, label: "Finalizing workout plan..." },
  ],
  meal: [
    { threshold: 0, label: "Analyzing your nutrition goals..." },
    { threshold: 20, label: "Calculating optimal macros..." },
    { threshold: 40, label: "Selecting recipes..." },
    { threshold: 60, label: "Building your 7-day plan..." },
    { threshold: 80, label: "Finalizing meal plan..." },
  ],
}

function getStageLabel(type: GenerationType, progress: number): string {
  const stages = STAGES[type]
  for (let i = stages.length - 1; i >= 0; i--) {
    if (progress >= stages[i].threshold) {
      return stages[i].label
    }
  }
  return stages[0].label
}

export function useStreamingFetch<T>(options: UseStreamingFetchOptions<T>) {
  const { type, onChunk, onComplete, onError, onProgress } = options
  const abortControllerRef = useRef<AbortController | null>(null)

  const [state, setState] = useState<StreamingState<T>>({
    isLoading: false,
    isStreaming: false,
    error: null,
    data: null,
    streamedContent: "",
    progress: 0,
    stage: "",
    canResume: false,
    generationId: null,
    retryCount: 0,
    isRetrying: false,
  })

  // Check for incomplete generations on mount
  useEffect(() => {
    const incomplete = generationStore.getIncomplete(type)
    if (incomplete) {
      setState((prev) => ({
        ...prev,
        canResume: true,
        generationId: incomplete.id,
        progress: incomplete.progress,
        streamedContent: incomplete.partialContent,
        stage: getStageLabel(type, incomplete.progress),
      }))
    }
  }, [type])

  const fetchStream = useCallback(
    async (url: string, body: Record<string, unknown>) => {
      // Cancel any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      const generationId = generationStore.start(type, body)

      setState({
        isLoading: true,
        isStreaming: false,
        error: null,
        data: null,
        streamedContent: "",
        progress: 0,
        stage: getStageLabel(type, 0),
        canResume: false,
        generationId,
        retryCount: 0,
        isRetrying: false,
      })

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: abortControllerRef.current.signal,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `Request failed with status ${response.status}`)
        }

        const contentType = response.headers.get("content-type")

        if (contentType?.includes("text/event-stream")) {
          setState((prev) => ({ ...prev, isStreaming: true }))

          const reader = response.body?.getReader()
          const decoder = new TextDecoder()

          if (!reader) {
            throw new Error("Failed to get response reader")
          }

          let streamedContent = ""
          let chunkCount = 0

          while (true) {
            const { done, value } = await reader.read()

            if (done) break

            const chunk = decoder.decode(value, { stream: true })
            const lines = chunk.split("\n")

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                try {
                  const jsonStr = line.slice(6)
                  const parsed = JSON.parse(jsonStr)

                  if (parsed.error) {
                    throw new Error(parsed.error)
                  }

                  // Handle retry notification from server
                  if (parsed.retry) {
                    setState((prev) => ({
                      ...prev,
                      retryCount: parsed.retry,
                      isRetrying: true,
                      stage: `Retrying (${parsed.retry}/2): ${parsed.reason || "Improving response..."}`,
                      progress: 90,
                    }))
                    continue
                  }

                  if (parsed.chunk) {
                    streamedContent += parsed.chunk
                    chunkCount++

                    // Estimate progress based on content length and chunk count
                    const estimatedProgress = Math.min(
                      95,
                      Math.floor((chunkCount / 50) * 100)
                    )
                    const stage = getStageLabel(type, estimatedProgress)

                    // Persist to store
                    generationStore.updateProgress(generationId, estimatedProgress, streamedContent)

                    setState((prev) => ({
                      ...prev,
                      streamedContent,
                      progress: estimatedProgress,
                      stage,
                    }))

                    onChunk?.(parsed.chunk)
                    onProgress?.(estimatedProgress, stage)
                  }

                  if (parsed.done && parsed.plan) {
                    generationStore.complete(generationId, parsed.plan)

                    setState((prev) => ({
                      ...prev,
                      isLoading: false,
                      isStreaming: false,
                      data: parsed.plan as T,
                      progress: 100,
                      stage: "Complete!",
                      isRetrying: false,
                    }))

                    onComplete?.(parsed.plan)
                    return parsed.plan
                  }
                } catch (e) {
                  if (e instanceof Error && e.message !== "Unexpected end of JSON input") {
                    // Only throw actual errors, not JSON parse errors from incomplete chunks
                    if (!e.message.includes("JSON")) {
                      throw e
                    }
                  }
                }
              }
            }
          }
        } else {
          // Non-streaming JSON response (cached)
          const data = await response.json()

          if (data.error) {
            throw new Error(data.error)
          }

          generationStore.complete(generationId, data.plan)

          setState((prev) => ({
            ...prev,
            isLoading: false,
            data: data.plan as T,
            progress: 100,
            stage: "Loaded from cache",
          }))

          onComplete?.(data.plan)
          return data.plan
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          // Request was cancelled, don't update state
          return
        }

        const errorMessage = error instanceof Error ? error.message : "An error occurred"
        generationStore.fail(generationId, errorMessage)

        setState((prev) => ({
          ...prev,
          isLoading: false,
          isStreaming: false,
          error: errorMessage,
          canResume: true,
        }))

        onError?.(errorMessage)
        throw error
      }
    },
    [type, onChunk, onComplete, onError, onProgress]
  )

  const resume = useCallback(
    async (url: string) => {
      const incomplete = generationStore.getIncomplete(type)
      if (!incomplete) {
        setState((prev) => ({ ...prev, canResume: false }))
        return
      }

      // Retry with the same params
      return fetchStream(url, incomplete.params as Record<string, unknown>)
    },
    [type, fetchStream]
  )

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    setState((prev) => ({
      ...prev,
      isLoading: false,
      isStreaming: false,
    }))
  }, [])

  const reset = useCallback(() => {
    if (state.generationId) {
      generationStore.remove(state.generationId)
    }
    setState({
      isLoading: false,
      isStreaming: false,
      error: null,
      data: null,
      streamedContent: "",
      progress: 0,
      stage: "",
      canResume: false,
      generationId: null,
      retryCount: 0,
      isRetrying: false,
    })
  }, [state.generationId])

  const clearIncomplete = useCallback(() => {
    generationStore.clear(type)
    setState((prev) => ({ ...prev, canResume: false }))
  }, [type])

  return {
    ...state,
    fetchStream,
    resume,
    cancel,
    reset,
    clearIncomplete,
  }
}
