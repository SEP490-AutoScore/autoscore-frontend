import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { handle401, handle403 } = useAuth();
  const navigate = useNavigate();
  const showToast = useToastNotification();

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");

    if (!jwtToken) {
      handle401(); // Không có Access Token, làm mới hoặc yêu cầu đăng nhập lại
      return;
    }

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
          handle401(); // Làm mới Access Token
        } else if (response.status === 403) {
          handle403(); // Người dùng không có quyền
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        showToast({
          title: "Oops! Something went wrong",
          description: "There was a problem with your request.",
          variant: "destructive",
        });
      }
    };

    verifyToken();
  }, [handle401, handle403, navigate, showToast]);

  return children;
}

export default ProtectedRoute;