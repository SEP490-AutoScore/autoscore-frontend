import { API_ENDPOINTS, BASE_URL } from "@/config/apiConfig";

export interface CodePlagiarism {
  codePlagiarismId: number;
  selfCode: string;
  studentCodePlagiarism: string;
  plagiarismPercentage: string;
  studentPlagiarism: string;
  type: string;
}

export async function fetchCodePlagiarism(
  scoreId: number
): Promise<CodePlagiarism[]> {
  try {
    const response = await fetch(
      `${BASE_URL}${API_ENDPOINTS.plagiarism}?scoreId=${scoreId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }
    );

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(errorDetails || "Failed to fetch code plagiarism data");
    }

    return await response.json();
  } catch (error: any) {
    console.error("API Error:", error.message);
    throw new Error(error.message || "Something went wrong. Please try again.");
  }
}
