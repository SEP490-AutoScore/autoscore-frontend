import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { useToastNotification} from "@/hooks/use-toast-notification";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { handle401, handle403 } = useAuth();
  const navigate = useNavigate();
  const showToast = useToastNotification();

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");

    if (!jwtToken) {
      handle401();
      return;
    }

    // Kiểm tra token có hợp lệ hay không thông qua API
    const verifyToken = async () => {
      try {
        const response = await fetch(`${BASE_URL}${API_ENDPOINTS.vertification}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        if (response.status === 401) {
          handle401();
        } else if (response.status === 403) {
          handle403();
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        showToast({
          title: "Oops! Something went wrong",
          description: "There was a problem with your request",
          variant: "destructive",
        });
      }
    };

    verifyToken();
  }, [handle401, handle403, navigate, showToast]);

  return children;
}

export default ProtectedRoute;
