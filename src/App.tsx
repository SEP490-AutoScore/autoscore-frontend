import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./app/dashboard/page";
import Login from "./app/login/page";
import ProtectedRoute from "./route/ProtectedRoute";
import ScorePage from "./app/score/page";
import ScoreOverviewPage from "./app/score/overview";

function App() {
  return (
    <Router>
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
              <ScoreOverviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/scores"
          element={
            <ProtectedRoute>
              <ScorePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
