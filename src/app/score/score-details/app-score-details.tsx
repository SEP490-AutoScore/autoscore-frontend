"use client"

import { useEffect, useState } from "react"
import { ExamInfoCard } from "@/app/score/score-details/exam-infor-card"
import { ScoreDetailsTable } from "@/app/score/score-details/score-details-table"
// import { Skeleton } from "@/components/ui/skeleton"
import { DataTableSkeleton } from "@/app/score/score-details/score-details-skeleton"


const mockExamInfo = {
  examName: "PRN231",
  subjectCode: "PRN231",
  semester: "Fall 2024",
  examCode: "PE_PRN231_FA24_006006",
  examDate: "10.11.2024",
  gradingDate: "12.11.2024",
  gradedBy: "Auto Score",
}

const mockScoreDetails = [
  {
    scoreDetailId: 1,
    postmanFunctionName: "Login",
    scoreOfFunction: 0.5,
    totalPmtest: 5,
    scoreAchieve: 0.2,
    noPmtestAchieve: 2,
    examQuestionId: 1,
  },
  {
    scoreDetailId: 2,
    postmanFunctionName: "Create Account",
    scoreOfFunction: 1.0,
    totalPmtest: 10,
    scoreAchieve: 0.6,
    noPmtestAchieve: 6,
    examQuestionId: 1,
  },
  {
    scoreDetailId: 3,
    postmanFunctionName: "Update Account",
    scoreOfFunction: 1.0,
    totalPmtest: 8,
    scoreAchieve: 0.4,
    noPmtestAchieve: 4,
    examQuestionId: 2,
  },
  {
    scoreDetailId: 4,
    postmanFunctionName: "View List Account",
    scoreOfFunction: 0.5,
    totalPmtest: 5,
    scoreAchieve: 0.3,
    noPmtestAchieve: 3,
    examQuestionId: 2,
  },
]

export default function ExamDetailsPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto py-0 space-y-8">
        <DataTableSkeleton />
        <DataTableSkeleton />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-0 space-y-8">
      <ExamInfoCard examInfo={mockExamInfo} />
      <ScoreDetailsTable details={mockScoreDetails} />
    </div>
  )
}