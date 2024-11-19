import { useCallback } from "react";

export const useCookie = () => {
  // Hàm lưu cookie
  const setCookie = useCallback((name: string, value: string, days: number) => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // Chuyển đổi ngày thành mili giây
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/;Secure;SameSite=Strict`;
  }, []);

  // Hàm lấy giá trị cookie
  const getCookie = useCallback((name: string): string | null => {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
  }, []);

  // Hàm xóa cookie
  const deleteCookie = useCallback((name: string) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;Secure;SameSite=Strict`;
  }, []);

  return { setCookie, getCookie, deleteCookie };
};
