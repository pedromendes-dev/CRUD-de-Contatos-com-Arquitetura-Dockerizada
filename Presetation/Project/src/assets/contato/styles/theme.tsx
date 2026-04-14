import { createTheme } from "@mui/material/styles";
import { ptBR } from "@mui/material/locale";

const commonThemeOptions = {
  typography: {
    fontFamily: "Roboto, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      defaultProps: {
        size: "small" as const,
        variant: "contained" as const,
      },
    },
    MuiTextField: {
      defaultProps: {
        size: "small" as const,
        fullWidth: true,
      },
    },
    MuiTable: {
      defaultProps: {
        size: "small" as const,
      },
    },
    MuiDialog: {
      defaultProps: {
        maxWidth: "sm" as const,
        fullWidth: true,
      },
      styleOverrides: {
        paper: {
          borderRadius: 16,
        },
      },
    },
  },
};

export const lightTheme = createTheme(
  {
    palette: {
      mode: "light",
      background: {
        default: "#f3f4f6",
        paper: "#ffffff",
      },
      primary: {
        light: "#e3f2fd",
        main: "#1976d2",
        dark: "#115293",
        contrastText: "#ffffff",
      },
      secondary: {
        light: "#f3e5f5",
        main: "#9c27b0",
        dark: "#6a0080",
        contrastText: "#ffffff",
      },
    },
    ...commonThemeOptions,
  },
  ptBR
);

export const darkTheme = createTheme(
  {
    palette: {
      mode: "dark",
      background: {
        default: "#0b1120",
        paper: "#111827",
      },
      primary: {
        light: "#60a5fa",
        main: "#3b82f6",
        dark: "#1d4ed8",
        contrastText: "#ffffff",
      },
      secondary: {
        light: "#c4b5fd",
        main: "#8b5cf6",
        dark: "#5b21b6",
        contrastText: "#ffffff",
      },
    },
    ...commonThemeOptions,
  },
  ptBR
);
