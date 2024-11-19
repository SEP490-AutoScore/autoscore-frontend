import { Routes, Route } from "react-router-dom";
import Login from "@/app/login/page";
import Dashboard from "@/app/dashboard/page";
import Exams from "@/app/exams/page";
import MainLayout from "@/layouts/layout-main";
import ProtectedRoute from "./ProtectedRoute";
import { NotFoundPage } from "@/app/error/page";
import { AuthProvider } from "@/context/AuthProvider";

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
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
};

export default AppRoutes;
