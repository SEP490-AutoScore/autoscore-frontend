"use client";

import { useEffect, useState } from "react";
// import { ExamInfoCard } from "@/app/score/score-details/exam-infor-card";
import { ScoreDetailsTable } from "@/app/score/score-details/score-details-table";
// import { Skeleton } from "@/components/ui/skeleton"
import { DataTableSkeleton } from "@/app/score/score-details/score-details-skeleton";
import { API_ENDPOINTS, BASE_URL } from "@/config/apiConfig";
import { useLocation } from "react-router-dom";

// const mockExamInfo = {
//   examName: "PRN231",
//   subjectCode: "PRN231",
//   semester: "Fall 2024",
//   examCode: "PE_PRN231_FA24_006006",
//   examDate: "10.11.2024",
//   gradingDate: "12.11.2024",
//   gradedBy: "Auto Score",
// };
// interface ExamInfo {
//   examName: string;
//   subjectCode: string;
//   semester: string;
//   examCode: string;
//   examDate: string;
//   gradingDate: string;
//   gradedBy: string;
// }

interface ScoreDetails {
  scoreDetailId: string;
  postmanFunctionName: string;
  scoreOfFunction: number;
  totalPmtest: number;
  scoreAchieve: number;
  noPmtestAchieve: number;
  examQuestionId: string;
}
// const mockScoreDetails = [
//   {
//     scoreDetailId: 1,
//     postmanFunctionName: "Login",
//     scoreOfFunction: 0.5,
//     totalPmtest: 5,
//     scoreAchieve: 0.2,
//     noPmtestAchieve: 2,
//     examQuestionId: 1,
//   },
//   {
//     scoreDetailId: 2,
//     postmanFunctionName: "Create Account",
//     scoreOfFunction: 1.0,
//     totalPmtest: 10,
//     scoreAchieve: 0.6,
//     noPmtestAchieve: 6,
//     examQuestionId: 1,
//   },
//   {
//     scoreDetailId: 3,
//     postmanFunctionName: "Update Account",
//     scoreOfFunction: 1.0,
//     totalPmtest: 8,
//     scoreAchieve: 0.4,
//     noPmtestAchieve: 4,
//     examQuestionId: 2,
//   },
//   {
//     scoreDetailId: 4,
//     postmanFunctionName: "View List Account",
//     scoreOfFunction: 0.5,
//     totalPmtest: 5,
//     scoreAchieve: 0.3,
//     noPmtestAchieve: 3,
//     examQuestionId: 2,
//   },
// ];

// interface ApiResponse {
//   // examInfo: mockExamInfo;
//   scoreDetails: ScoreDetails[];
// }

export default function ExamDetailsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ScoreDetails[] | null>(null);
  const location = useLocation();
  const { scoreId } = location.state || {};

  useEffect(() => {
    const fetchData = async () => {
      if (!scoreId) {
        setError("No score ID provided");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}${API_ENDPOINTS.scoreDetail}?scoreId=${scoreId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError("Unauthorized access. Please log in again.");
            return;
          }
      
          if (response.status === 204) {
            // setData({ scoreDetails: [] });
            return;
          }
          throw new Error(`Failed to fetch score details.  Status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        // setData({ scoreDetails: [] });
        // setError("An error occurred while fetching the data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [scoreId]);

  if (loading) {
    return (
      <div className="container mx-auto py-0 space-y-8">
        <DataTableSkeleton />
        <DataTableSkeleton />
      </div>
    );
  }

  if (error) {
    return <div className="container mx-auto py-0 text-red-500">{error}</div>;
  }

  if (!data) {
    return <div className="container mx-auto py-0">No data available</div>;
  }

  // if (data?.scoreDetails.length === 0) {
  //   return (
  //     <div className="container mx-auto py-0">
  //       <p className="text-gray-500">No score details available for this exam.</p>
  //     </div>
  //   );
  // }

  return (
    <div className="container mx-auto py-0 space-y-8">
      {/* <ExamInfoCard examInfo={mockExamInfo} /> */}
      <ScoreDetailsTable details={data} />
    </div>
  );
}
