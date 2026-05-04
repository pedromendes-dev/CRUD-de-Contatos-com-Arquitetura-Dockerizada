import React from "react";
import { CircularProgress } from "@mui/material";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Wrapper de rota que exige autenticação.
// - Enquanto o AuthContext ainda está lendo o localStorage (isLoading), exibe spinner.
// - Se não autenticado, redireciona para /login preservando a URL de destino em `state`.
// - Se autenticado, renderiza normalmente os filhos da rota.
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f7fa",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redireciona para login — o state permite redirecionar de volta após autenticar
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
