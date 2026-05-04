import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import ProtectedRoute from "../../components/shared/ProtectedRoute";
import { useAuth } from "../../context/AuthContext";

const LoginPage     = lazy(() => import("../../Pages/PageContatos/LoginPage"));
const HomePage      = lazy(() => import("../../Pages/PageContatos/HomePage"));
const ContatosPage  = lazy(() => import("../../Pages/PageContatos/ContatosPage"));
const AnalyticsPage = lazy(() => import("../../Pages/PageContatos/AnalyticsPage"));
const NotFoundPage  = lazy(() => import("../../Pages/PageContatos/NotFoundPage"));

const loadingFallback = (   // Fallback genérico para carregamento de páginas.
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

const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <BrowserRouter>
      <Suspense fallback={loadingFallback}>
        <Routes>
          {/* Rota raiz: login é a página padrão */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Rota pública: se já autenticado vai direto para /home */}
          <Route
            path="/login"
            element={
              isLoading    ? loadingFallback :
              isAuthenticated ? <Navigate to="/home" replace /> :
              <LoginPage />
            }
          />

          {/* Rotas protegidas — exigem JWT válido */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/contatos"
            element={
              <ProtectedRoute>
                <ContatosPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;
