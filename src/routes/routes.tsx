import { Routes, Route } from "react-router-dom";
import { NotFoundPage } from "@/app/error/page";
import { AuthProvider } from "@/context/AuthProvider";
import MainLayout from "@/layouts/layout-main";
import ProtectedRoute from "./ProtectedRoute";

import Login from "@/app/login/page";
import Dashboard from "@/app/dashboard/page";
import Exams from "@/app/exams/page";
import ExamDetail from "@/app/examDetail/page";
import ScoresPage from "@/app/score/scores/page";
import ScoresOverviewPage from "@/app/score/overview/page";
import NewExam from "@/app/new-exam/page";
import ExamPapers from "@/app/exam-papers/page";
import GherkinPostman from "@/app/gherkin-postman/page";
import PostmanForGrading from "@/app/postman-for-grading/page";
import Permissions from "@/app/permission/permissions/page";

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
          <Route path="exams/detail" element={<ExamDetail />} />
          <Route path="scores" element={<ScoresPage />} />
          <Route path="scores-overview" element={<ScoresOverviewPage />} />
          <Route path="exams/new-exam" element={<NewExam />} />
          <Route path="exams/exam-papers" element={<ExamPapers />} />
          <Route path="gherkin-postman/:id" element={<GherkinPostman />} />
          <Route path="postman-for-grading/:id" element={<PostmanForGrading />} />
          <Route path="permissions" element={<Permissions />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
};

export default AppRoutes;