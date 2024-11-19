import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const showToast = useToastNotification();

  const handle401 = useCallback(() => {
    showToast({ title: "Unauthorized", description: "Please log in.", variant: "destructive" });
    localStorage.clear();
    navigate("/");
  }, [navigate, showToast]);

  const handle403 = useCallback(() => {
    showToast({ title: "Forbidden", description: "You do not have permission to access this page.", variant: "destructive" });
    navigate("/forbidden");
  }, [navigate, showToast]);

  const value = { handle401, handle403 };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
