import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { AuthContext } from "./AuthContext";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { useCookie } from "@/hooks/use-cookie";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const showToast = useToastNotification();
  const { setCookie, getCookie, deleteCookie } = useCookie(); 

  const handle401 = useCallback(() => {
    const handleUnauthorized = async () => {
      try {
        const refreshToken = getCookie("refreshToken");
        if (!refreshToken) {
          // Không có Refresh Token, yêu cầu đăng nhập lại
          showToast({
            title: "Session Expired",
            description: "Please log in again.",
            variant: "destructive",
          });
          localStorage.clear();
          navigate("/"); // Đưa về trang đăng nhập
          return;
        }

        // Gửi yêu cầu làm mới token
        const response = await fetch(`${BASE_URL}${API_ENDPOINTS.refreshToken}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "*/*",
          },
          body: refreshToken,
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("jwtToken", data.accessToken);
          const expire = Date.now() + data.exp;
          localStorage.setItem("exp", expire);
          setCookie("refreshToken", data.refreshToken, Number(localStorage.getItem("exp"))/ (24 * 60 * 60 * 1000));
          showToast({
            title: "Session Refreshed",
            description: "Your session has been renewed.",
          });
        } else {
          // Refresh Token không hợp lệ hoặc hết hạn
          showToast({
            title: "Session Expired",
            description: "Please log in again.",
            variant: "destructive",
          });
          localStorage.clear();
          deleteCookie("refreshToken");
          navigate("/");
        }
      } catch (error) {
        console.error("Error handling 401:", error);
        showToast({
          title: "Error",
          description: "An error occurred while refreshing session.",
          variant: "destructive",
        });
        localStorage.clear();
        deleteCookie("refreshToken");
        navigate("/");
      }
    };

    handleUnauthorized();
  }, [navigate, showToast, getCookie, setCookie, deleteCookie]);

  const handle403 = useCallback(() => {
    showToast({
      title: "Forbidden",
      description: "You do not have permission to access this page.",
      variant: "destructive",
    });
    localStorage.clear();
    deleteCookie("refreshToken");
    navigate("/");
  }, [navigate, showToast, deleteCookie]);

  const value = { handle401, handle403 };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
