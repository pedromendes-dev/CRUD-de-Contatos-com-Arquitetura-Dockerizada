import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

// Lazy loading das páginas para otimizar o carregamento inicial da aplicação - Carrega as pag só quando o usuário navega para elas
const HomePage = lazy(() => import('../../pages/HomePage'));
const ContatosPage = lazy(() => import('../../pages/ContatosPage'));

const loadingFallback = (
  <Box
    sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f7fa',
    }}
  >
    <CircularProgress />
  </Box>
);

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={loadingFallback}>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/home" replace />}
          />

          <Route
            path="/home"
            element={<HomePage />}
          />

          <Route
            path="/contatos"
            element={<ContatosPage />}
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;
