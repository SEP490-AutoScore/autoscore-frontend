import { Routes, Route } from "react-router-dom";
import Dashboard from "@/app/dashboard/page";
import Login from "@/app/login/page";
import ProtectedRoute from "./ProtectedRoute";
import ScoresOverview from "@/app/score/overview";
import ScoresPage from "@/app/score/page";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/scores-overview"
        element={
          <ProtectedRoute>
            <ScoresOverview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/scores"
        element={
          <ProtectedRoute>
            <ScoresPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
