import { useEffect } from "react";
import { useTokenManager } from "@/hooks/use-token-manager";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { checkAndRefreshToken } = useTokenManager();

  // Kiểm tra token ngay khi component render
  useEffect(() => {
    const verifySession = async () => {
      console.log("Kiem tra component render");
      checkAndRefreshToken();
    };
    verifySession();
  }, [checkAndRefreshToken]);

  // Kiểm tra token định kỳ
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Kiem tra token");
      checkAndRefreshToken();
    }, 5 * 60 * 1000); // Kiểm tra mỗi 5 phút (milliseconds)

    return () => clearInterval(interval); // Xóa interval khi component unmount
  }, [checkAndRefreshToken]);

  return children;
}

export default ProtectedRoute;
