import { API_ENDPOINTS, BASE_URL } from "@/config/apiConfig";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { useCookie } from "@/hooks/use-cookie";

export const useTokenManager = () => {
  const { setCookie, getCookie } = useCookie();
  const showToast = useToastNotification();

  const checkAndRefreshToken = async () => {
    const jwtToken = localStorage.getItem("jwtToken");
    const exp = localStorage.getItem("exp"); // Thời gian hết hạn dạng milliseconds

    if (!jwtToken || !exp) {
      showToast({
        title: "Session Expired",
        description: "You are not logged in. Please log in again.",
        variant: "destructive",
      });
      return false;
    }

    const currentTime = Date.now(); // Thời gian hiện tại (milliseconds)
    const threshold = 5 * 60 * 1000; // Ngưỡng kiểm tra: 5 phút trước khi hết hạn

    if (currentTime >= Number(exp) - threshold) {
      const refreshToken = getCookie("refreshToken");

      if (!refreshToken) {
        showToast({
          title: "Refresh Token Missing",
          description: "You need to log in again.",
          variant: "destructive",
        });
        return false;
      }

      try {
        const response = await fetch(`${BASE_URL}${API_ENDPOINTS.refreshToken}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
          body: refreshToken, // Đóng gói refreshToken dưới dạng JSON
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("jwtToken", data.accessToken);
          localStorage.setItem("exp", String(data.exp)); // Lưu `exp` dạng string để đồng bộ
          setCookie("refreshToken", data.refreshToken, data.exp / (24 * 60 * 60 * 1000)); // Thời hạn bằng số ngày

          showToast({
            title: "Session Refreshed",
            description: "Your session has been successfully renewed.",
          });

          return true;
        } else {
          showToast({
            title: "Session Expired",
            description: "Your refresh token is invalid or expired. Please log in again.",
            variant: "destructive",
          });
          localStorage.clear();
          setCookie("refreshToken", "", -1); // Xóa cookie
          return false;
        }
      } catch (error) {
        console.error("Error refreshing token:", error);
        showToast({
          title: "Error",
          description: "An error occurred while refreshing your session.",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  return { checkAndRefreshToken };
};
