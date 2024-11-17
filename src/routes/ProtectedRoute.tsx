import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToastNotification } from "@/hooks/use-toast-notification";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const navigate = useNavigate();
  const showToast = useToastNotification();

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (!jwtToken) {
      showToast({
        title: "Unauthorized",
        description: "You need to login first",
      })
      navigate("/");
    }
  }, [navigate, showToast]);

  return children;
}

export default ProtectedRoute;
