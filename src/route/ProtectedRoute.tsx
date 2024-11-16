import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const navigate = useNavigate();

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (!jwtToken) {
      alert("You need to log in first!");
      navigate("/login");
    }
  }, [navigate]);

  return children;
}

export default ProtectedRoute;
