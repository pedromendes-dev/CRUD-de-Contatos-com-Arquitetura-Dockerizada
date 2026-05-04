import React from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import AppRoutes from "./config/rotas/routes";
import { lightTheme } from "./assets/theme";
import { AuthProvider } from "./context/AuthContext";

const App: React.FC = () => {
  return (
    // AuthProvider envolve toda a aplicação para que qualquer componente
    // possa acessar o contexto de autenticação via useAuth()
    <AuthProvider>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <AppRoutes />
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
