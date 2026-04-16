import { createTheme } from "@mui/material/styles";
import { ptBR } from "@mui/material/locale";

const commonThemeOptions = {
  typography: {
          fontFamily: "Roboto, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          h1: { fontWeight: 700, letterSpacing: -1 },
          h2: { fontWeight: 700, letterSpacing: -0.5 },
          h3: { fontWeight: 600 },
          h4: { fontWeight: 600 },
          h5: { fontWeight: 600 },
          h6: { fontWeight: 600 },
          body1: { fontSize: 16, fontWeight: 400 },
          body2: { fontSize: 15, fontWeight: 400 },
          button: { fontWeight: 600, textTransform: 'none', fontSize: 15 },
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
          styleOverrides: {
            root: {
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 999,
              paddingInline: 20,
              minHeight: 40,
              boxShadow: "none",
              letterSpacing: 0.2,
              transition: 'background 0.2s, color 0.2s',
              '&:hover': {
                boxShadow: "none",
                filter: 'brightness(0.95)',
              },
            },
          },
    },
    MuiTextField: {
      defaultProps: {
        size: "small" as const,
        fullWidth: true,
      },
        },
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
        MuiTooltip: {
          defaultProps: {
            enterDelay: 300,
            leaveDelay: 100,
          },
          styleOverrides: {
            tooltip: {
              fontSize: 14,
              borderRadius: 8,
              padding: '8px 12px',
            },
          },
        },
        MuiListItem: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              transition: 'background 0.18s',
              '&.Mui-selected, &.Mui-selected:hover': {
                backgroundColor: 'rgba(76, 81, 255, 0.08)',
              },
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.04)',
              },
            },
          },
        },
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              scrollbarColor: '#bdbdbd #f3f4f6',
              '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
                backgroundColor: '#f3f4f6',
                width: 8,
                height: 8,
              },
              '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
                borderRadius: 8,
                backgroundColor: '#bdbdbd',
                minHeight: 24,
              },
            },
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
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 16px 0 rgba(0,0,0,0.06)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          padding: 8,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h3: {
          fontWeight: 600,
        },
        h5: {
          fontWeight: 600,
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
        light: "#4b5563",
        main: "#111827",
        dark: "#020617",
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
