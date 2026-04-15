import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ContatosPage } from '../../pages/ContatosPage';
import { HomePage } from '../../pages/HomePage';

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
};

export default AppRoutes;
