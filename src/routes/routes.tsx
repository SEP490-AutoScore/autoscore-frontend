import { Routes, Route } from "react-router-dom";
import { NotFoundPage } from "@/app/authentication/error/page";
import { AuthProvider } from "@/context/AuthProvider";
import MainLayout from "@/layouts/layout-main";
import ProtectedRoute from "./ProtectedRoute";

import Login from "@/app/authentication/login/page";
import Dashboard from "@/app/dashboard/page";
import Exams from "@/app/exam/overview/page";
import ScoresPage from "@/app/score/scores/page";
import ScoresOverviewPage from "@/app/score/overview/page";
import ScoreDetailPage from "@/app/score/score-details/page";
import PlagiarismPage from "@/app/score/plagiarism/page";
import NewExam from "@/app/exam/new-exam/page";
import ExamPapers from "@/app/exam/exam-papers/page";
import GherkinPostman from "@/app/exam/gherkin-postman/page";
import PostmanForGrading from "@/app/exam/postman-for-grading/page";
import Permissions from "@/app/authentication/permission/page";
import ExamQuestions from "@/app/exam/exam-questions/page";
import Roles from "@/app/authentication/role/overview/page";
import RoleDetail from "@/app/authentication/role/detail/page";
import Accounts from "@/app/authentication/account/overview/page";
import AIApiKeysPage from "@/app/ai-api-key/page";
import ExamPapersOverview from "@/app/exam/exam-paper-overview/page";
import ExamPaperDetail from "@/app/exam/exam-paper-overview/exam-paper-detail";
import Students from "@/app/exam/students/page";

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="exams" element={<Exams />} />
          <Route path="scores-overview/scores" element={<ScoresPage />} />
          <Route path="scores-overview" element={<ScoresOverviewPage />} />
          <Route path="scores-overview/scores/score-details" element={<ScoreDetailPage />} />
          <Route path="scores-overview/scores/plagiarism" element={<PlagiarismPage />} />
          <Route path="exams/new-exam" element={<NewExam />} />
          <Route path="exams/exam-papers" element={<ExamPapers />} />
          <Route path="exams/exam-papers/gherkin-postman" element={<GherkinPostman />} />
          <Route path="exams/exam-papers/postman-for-grading" element={<PostmanForGrading />} />
          <Route path="permissions" element={<Permissions />} />
          <Route path="exams/exam-papers/exam-questions" element={<ExamQuestions />} />
          <Route path="roles" element={<Roles />} />
          <Route path="roles/detail" element={<RoleDetail />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="exam-papers" element={<ExamPapersOverview />} />
          <Route path="exam-papers/exam-questions" element={<ExamPaperDetail />} />
          <Route path="ai-api-keys" element={<AIApiKeysPage />} />
          <Route path="/exams/students" element={<Students />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
};

export default AppRoutes;