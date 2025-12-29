import { createContext, useContext, useState } from "react";

type User = {
  name: string;
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  login: (name: string) => void;
  logout: () => void;
  updateAvatar: (avatar: string) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  function login(name: string) {
    setUser({ name });
  }

  function logout() {
    setUser(null);
  }

  function updateAvatar(avatar: string) {
    if (!user) return;
    setUser({ ...user, avatar });
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateAvatar }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
