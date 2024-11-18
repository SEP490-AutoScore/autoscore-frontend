import { Routes, Route } from "react-router-dom";
import Login from "@/app/login/page";
import Dashboard from "@/app/dashboard/page";
import Exams from "@/app/exams/page";
import MainLayout from "@/layouts/layout-main";
import ProtectedRoute from "./ProtectedRoute";
import ExamPaper from "@/app/examPapers/page";
import ScoresOverview from "@/app/score/overview";
import ScoresPage from "@/app/score/page";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Route không có sidebar */}
      <Route path="/" element={<Login />} />

      {/* Routes có sidebar */}
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
        <Route path="exam/examPaper" element={<ExamPaper />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
