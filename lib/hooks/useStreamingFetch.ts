"use client"

import { useState, useCallback } from "react"

interface StreamingState<T> {
  isLoading: boolean
  isStreaming: boolean
  error: string | null
  data: T | null
  streamedContent: string
}

interface UseStreamingFetchOptions {
  onChunk?: (chunk: string) => void
  onComplete?: <T>(data: T) => void
  onError?: (error: string) => void
}

export function useStreamingFetch<T>(options: UseStreamingFetchOptions = {}) {
  const [state, setState] = useState<StreamingState<T>>({
    isLoading: false,
    isStreaming: false,
    error: null,
    data: null,
    streamedContent: "",
  })

  const fetchStream = useCallback(async (url: string, body: object) => {
    setState({
      isLoading: true,
      isStreaming: false,
      error: null,
      data: null,
      streamedContent: "",
    })

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      // Check if it's a rate limit error or other non-stream response
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Request failed with status ${response.status}`)
      }

      // Check if response is SSE stream
      const contentType = response.headers.get("content-type")
      
      if (contentType?.includes("text/event-stream")) {
        setState(prev => ({ ...prev, isStreaming: true }))
        
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (!reader) {
          throw new Error("Failed to get response reader")
        }

        let streamedContent = ""

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

                if (parsed.chunk) {
                  streamedContent += parsed.chunk
                  setState(prev => ({ ...prev, streamedContent }))
                  options.onChunk?.(parsed.chunk)
                }

                if (parsed.done && parsed.plan) {
                  setState(prev => ({
                    ...prev,
                    isLoading: false,
                    isStreaming: false,
                    data: parsed.plan as T,
                  }))
                  options.onComplete?.(parsed.plan)
                  return parsed.plan
                }
              } catch (e) {
                // Skip invalid JSON lines
              }
            }
          }
        }
      } else {
        // Non-streaming JSON response (e.g., cached response)
        const data = await response.json()
        
        if (data.error) {
          throw new Error(data.error)
        }

        setState(prev => ({
          ...prev,
          isLoading: false,
          data: data.plan as T,
        }))
        options.onComplete?.(data.plan)
        return data.plan
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred"
      setState(prev => ({
        ...prev,
        isLoading: false,
        isStreaming: false,
        error: errorMessage,
      }))
      options.onError?.(errorMessage)
      throw error
    }
  }, [options])

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      isStreaming: false,
      error: null,
      data: null,
      streamedContent: "",
    })
  }, [])

  return {
    ...state,
    fetchStream,
    reset,
  }
}
