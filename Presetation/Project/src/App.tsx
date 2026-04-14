import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import AppRoutes from './config/rotas/routes';
import { lightTheme } from './assets/theme';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <AppRoutes />
    </ThemeProvider>
  );
};

export default App;
