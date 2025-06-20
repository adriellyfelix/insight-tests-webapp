import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { authApi } from "../services/api";
//import { mockLogin } from "../mocks/auth";
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextData {
  user: User | null;
  register: (name: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("@Insights:user");
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return null;
  });

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await authApi.register(name, email, password);

      const { user: userData } = response.data;
      console.log("dados do user:", userData);
    } catch (error) {
      console.error("Erro ao registrar:", error);
      throw new Error("Erro ao registrar");
    }
  };

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      const { access_token, user: userData } = await response.data;

      //const { token, user: userData } = await mockLogin(email, password);
      localStorage.setItem("@Insights:token", access_token);
      localStorage.setItem("@Insights:user", JSON.stringify(userData));

      setUser({
        id: userData.id,
        name: userData.nome,
        email: userData.email,
        //avatar: userData.avatar,
      });
      console.log(user);
    } catch (error) {
      throw new Error("Falha na autenticação");
    }
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem("@Insights:token");
    localStorage.removeItem("@Insights:user");
    setUser(null);
    authApi.logout();
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
