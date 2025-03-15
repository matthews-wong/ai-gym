"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function ApiTestButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [rawResponse, setRawResponse] = useState<string | null>(null)

  const testGroqApi = async () => {
    setIsLoading(true)
    setResult(null)
    setError(null)
    setRawResponse(null)

    try {
      const response = await fetch("/api/test-groq")

      // Get the raw text first to check if it's valid JSON
      const text = await response.text()
      setRawResponse(text.substring(0, 500)) // Store first 500 chars of raw response for debugging

      let data
      try {
        data = JSON.parse(text)
      } catch (e) {
        setError(`Failed to parse response as JSON. Raw response starts with: ${text.substring(0, 100)}...`)
        setIsLoading(false)
        return
      }

      if (data.success) {
        setResult(data)
      } else {
        setError(data.error || "Unknown error occurred")
      }
    } catch (err: any) {
      setError(err.message || "Failed to test API")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-4">
      <Button onClick={testGroqApi} disabled={isLoading} variant="outline" size="sm">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Testing API...
          </>
        ) : (
          "Test Groq API Connection"
        )}
      </Button>

      {result && (
        <div className="mt-2 p-3 bg-green-900/30 border border-green-800 rounded-md text-sm">
          <p className="font-medium text-green-400">✓ API Connection Successful</p>
          <p className="text-gray-300 mt-1">Response: {JSON.stringify(result.response)}</p>
        </div>
      )}

      {error && (
        <div className="mt-2 p-3 bg-red-900/30 border border-red-800 rounded-md text-sm">
          <p className="font-medium text-red-400">✗ API Connection Failed</p>
          <p className="text-gray-300 mt-1">Error: {error}</p>
          {rawResponse && (
            <details className="mt-2">
              <summary className="cursor-pointer text-gray-400">Raw Response</summary>
              <pre className="mt-2 p-2 bg-gray-800 rounded text-xs overflow-auto max-h-40">{rawResponse}</pre>
            </details>
          )}
        </div>
      )}
    </div>
  )
}

