import { useEffect } from "react";
// import { useAuth } from "@/hooks/use-auth";
// import { useNavigate } from "react-router-dom";
import { useTokenManager } from "@/hooks/use-token-manager";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  // const { handle401 } = useAuth();
  const { checkAndRefreshToken } = useTokenManager();
  // const navigate = useNavigate();

  // Kiểm tra token ngay khi component render
  // useEffect(() => {
  //   const verifySession = async () => {
  //     const isTokenValid = await checkAndRefreshToken();
  //     if (!isTokenValid) {
  //       handle401();
  //     }
  //   };

  //   verifySession();
  // }, [checkAndRefreshToken, handle401]);

  // Kiểm tra token định kỳ
  useEffect(() => {
    const interval = setInterval(() => {
      checkAndRefreshToken();
    }, 5 * 60 * 1000); // Kiểm tra mỗi 5 phút (milliseconds)

    return () => clearInterval(interval); // Xóa interval khi component unmount
  }, [checkAndRefreshToken]);

  return children;
}

export default ProtectedRoute;
