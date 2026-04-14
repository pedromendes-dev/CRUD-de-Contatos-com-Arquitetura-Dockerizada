import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ContatosPage } from '../../pages/ContatosPage';

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/contatos" replace />} />
        <Route path="/contatos" element={<ContatosPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
