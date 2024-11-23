"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { API_ENDPOINTS, BASE_URL } from "@/config/apiConfig";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type ScoreDetail = {
  scoreDetailId: number;
  postmanFunctionName: string;
  scoreOfFunction: number;
  totalPmtest: number;
  scoreAchieve: number;
  noPmtestAchieve: number;
  examQuestionId: number;
};

type ScoreDetailProps = {
  scoreId: number;
};

const ScoreDetailsTable: React.FC<ScoreDetailProps> = ({ scoreId }) => {
  const [scoreDetails, setScoreDetails] = useState<ScoreDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch score details by scoreId
  useEffect(() => {
    const fetchScoreDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}${API_ENDPOINTS.scoreDetail}?scoreId=${scoreId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch score details");
        }
        const data = await response.json();
        setScoreDetails(data);
      } catch (error) {
        console.error("Error fetching score details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScoreDetails();
  }, [scoreId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!scoreDetails.length) {
    return <div>No score details found for this score ID.</div>;
  }

  return (
    <div className="p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Function Name</TableHead>
            <TableHead>Score of Function</TableHead>
            <TableHead>Total PM Tests</TableHead>
            <TableHead>Score Achieved</TableHead>
            <TableHead>PM Tests Achieved</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scoreDetails.map((detail) => (
            <TableRow key={detail.scoreDetailId}>
              <TableCell>{detail.postmanFunctionName}</TableCell>
              <TableCell>{detail.scoreOfFunction}</TableCell>
              <TableCell>{detail.totalPmtest}</TableCell>
              <TableCell>{detail.scoreAchieve}</TableCell>
              <TableCell>{detail.noPmtestAchieve}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      •••
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(`${detail.scoreDetailId}`)}>
                      Copy Score Detail ID
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => alert(`View details for Function: ${detail.postmanFunctionName}`)}
                    >
                      View Details
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ScoreDetailsTable;
