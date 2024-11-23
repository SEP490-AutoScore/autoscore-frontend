import { useCallback } from "react";

export const useCookie = () => {
  // Hàm lưu cookie
  const setCookie = useCallback((name: string, value: string, date: number) => {
    const newDate = new Date();
    newDate.setTime(newDate.getTime() + date);
    document.cookie = `${name}=${value};expires=${newDate.toUTCString()};path=/;Secure;SameSite=Strict`;
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
