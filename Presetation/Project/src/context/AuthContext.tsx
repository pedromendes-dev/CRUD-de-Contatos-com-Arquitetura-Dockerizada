import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AuthContextType, AuthResponse, AuthUser } from "../utils/types/authTypes";

// Chaves usadas no localStorage para persistir a sessão entre recarregamentos de página
const TOKEN_KEY = "smartreg_token";
const USER_KEY  = "smartreg_user";

// Contexto de autenticação — fornece token, user e ações de login/logout para toda a árvore
const AuthContext = createContext<AuthContextType | null>(null);

// Provider que envolve a aplicação (em App.tsx) e disponibiliza o contexto de auth
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // true até terminar a leitura do localStorage

  useEffect(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setIsLoading(false);
  }, []);

  // Persiste o token e os dados do usuário no localStorage e atualiza o contexto
  const login = useCallback((data: AuthResponse) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify({ nome: data.nome, email: data.email }));
    setToken(data.token);
    setUser({ nome: data.nome, email: data.email });
  }, []);

  // Remove o token e os dados do usuário do localStorage e limpa o contexto
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook utilitário — lança erro descritivo se usado fora do AuthProvider
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser utilizado dentro de <AuthProvider>");
  }
  return context;
};
