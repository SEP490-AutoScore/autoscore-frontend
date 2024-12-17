// context/UserContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

interface UserContextType {
  avatar: string;
  setAvatar: (avatar: string) => void;
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [avatar, setAvatar] = useState<string>(
    localStorage.getItem("avatar") ||
      "https://img.myloview.cz/nalepky/default-avatar-profile-in-trendy-style-for-social-media-user-icon-400-228654852.jpg"
  );

  const [name, setName] = useState<string>(localStorage.getItem("name") || "");
  const [email, setEmail] = useState<string>(
    localStorage.getItem("email") || ""
  );

  const updateAvatar = (newAvatar: string) => {
    setAvatar(newAvatar);
    localStorage.setItem("avatar", newAvatar);
  };

  const updateName = (newName: string) => {
    setName(newName);
     localStorage.setItem("name", newName);
  };

  const updateEmail = (newEmail: string) => {
    setEmail(newEmail);
    localStorage.setItem("email", newEmail);
  };


  return (
    <UserContext.Provider
      value={{
        avatar,
        setAvatar: updateAvatar,
        name,
        setName: updateName,
        email,
        setEmail: updateEmail
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
