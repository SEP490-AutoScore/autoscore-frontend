"use client"

import { useState, useEffect } from "react"
import { CodePlagiarism, fetchCodePlagiarism } from "@/app/score/plagiarism/api"
import { PlagiarismComparison } from "@/app/score/plagiarism/comparison"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

export default function PlagiarismPage() {
  const [plagiarismData, setPlagiarismData] = useState<CodePlagiarism[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scoreId, setScoreId] = useState(Number)

  const fetchData = async () => {
    if (!scoreId) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchCodePlagiarism(scoreId)
      setPlagiarismData(data)
    } catch (err) {
      setError("Failed to fetch plagiarism data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (scoreId) {
      fetchData()
    }
  }, [scoreId])

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Code Plagiarism Analysis</h1>
      <div className="flex gap-4 mb-6">
        <Input
          type="text"
          placeholder="Enter Exam Paper ID"
          value={scoreId}
          onChange={(e) => setScoreId(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={fetchData}>Fetch Data</Button>
      </div>
      {loading && (
        <div className="space-y-4">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && plagiarismData.length === 0 && (
        <p>No plagiarism data found. Please enter an Exam Paper ID and fetch data.</p>
      )}
      <div className="space-y-6">
        {plagiarismData.map((item) => (
          <PlagiarismComparison key={item.codePlagiarismId} data={item} />
        ))}
      </div>
    </div>
  )
}

