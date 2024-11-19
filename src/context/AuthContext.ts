import { createContext } from "react";

interface AuthContextType {
  handle401: () => void;
  handle403: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
