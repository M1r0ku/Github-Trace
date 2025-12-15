"use client"

import { useState } from "react"
import { Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import {
  isEmail,
  isValidUsername,
  findEmailsByUsername,
  findUsernamesByEmail,
} from "@/lib/github-api"

export default function Home() {
  const [input, setInput] = useState("")
  const [results, setResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchType, setSearchType] = useState<"username" | "email" | null>(null)

  const handleSearch = async () => {
    if (!input.trim()) {
      setError("Please enter a username or email address")
      return
    }

    setIsLoading(true)
    setError(null)
    setResults([])
    setSearchType(null)

    try {
      let foundResults: string[] = []
      let type: "username" | "email"

      if (isEmail(input)) {
        type = "email"
        setSearchType(type)
        foundResults = await findUsernamesByEmail(input.trim())
      } else if (isValidUsername(input)) {
        type = "username"
        setSearchType(type)
        foundResults = await findEmailsByUsername(input.trim())
      } else {
        setError("Invalid input format. Please enter a valid GitHub username or email address")
        return
      }

      setResults(foundResults)

      if (foundResults.length === 0) {
        setError(`No ${type === "username" ? "emails" : "usernames"} found for this ${type}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while searching")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch()
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="max-w-2xl mx-auto p-6 pt-12">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm shadow-lg border-border">
          {/* Header */}
          <div className="flex flex-col space-y-1.5 p-6 text-center pb-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">
              Github-Trace
            </h3>
          </div>

          {/* Form */}
          <div className="p-6 pt-0">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Search Input */}
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Username / Email"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="h-11"
                  disabled={isLoading}
                />
              </div>

              {/* Submit Button */}
              <div className="space-y-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 text-base font-medium"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>

              {/* Search Status */}
              {searchType && !isLoading && !error && (
                <Alert className="mb-6">
                  <AlertDescription>
                    {searchType === "email" 
                      ? `Detected format: Email. Searching for associated usernames...`
                      : `Detected format: Username. Searching for associated emails...`
                    }
                  </AlertDescription>
                </Alert>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              )}

              {/* Error State */}
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Results */}
              {results.length > 0 && (
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="flex flex-col space-y-1.5 p-6">
                    <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      Found {results.length} Result{results.length !== 1 ? "s" : ""}
                    </h3>
                  </div>
                  <div className="p-6 pt-0 space-y-3">
                    {results.map((result, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted rounded-md group hover:bg-muted/80 transition-colors"
                      >
                        <code className="text-sm font-mono flex-1 break-all">
                          {result}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(result)}
                          className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Copy
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Info Section */}
              <p className="text-xs text-muted-foreground">
                This tool searches GitHub commit history to find connections between usernames and email addresses. 
                Results are extracted from public commit data and may not be exhaustive.
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}