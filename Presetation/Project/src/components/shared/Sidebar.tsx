import React from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ContactsIcon from "@mui/icons-material/Contacts";
import HomeIcon from "@mui/icons-material/Home";
import BarChartIcon from "@mui/icons-material/BarChart";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const menuItems = [
  { text: "Início", icon: <HomeIcon />, path: "/home" },
  { text: "Contatos", icon: <ContactsIcon />, path: "/contatos" },
  { text: "Análises", icon: <BarChartIcon />, path: "/analytics" },
];

export const Sidebar: React.FC<{ open?: boolean; onToggle?: () => void }> = ({
  open = true,
  onToggle,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Encerra a sessão e redireciona para a tela de login
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  if (!open) {
    return (
      <Tooltip title="Abrir menu" placement="right">
        <IconButton
          onClick={onToggle}
          sx={{
            position: "fixed",
            top: 20,
            left: 0,
            zIndex: 1300,
            backgroundColor: "primary.main",
            color: "primary.contrastText",
            borderRadius: "0 20px 20px 0",
            boxShadow: 3,
            width: 44,
            height: 44,
            p: 0,
            "&:hover": { backgroundColor: "primary.dark", boxShadow: 4 },
          }}
          size="medium"
          aria-label="Abrir menu"
        >
          <ChevronRightIcon fontSize="medium" />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <div
      style={{
        width: 270,
        height: "100vh",
        backgroundColor: "#030213",
        color: "#ffffff",
        position: "fixed",
        top: 0,
        left: 0,
        display: "flex",
        flexDirection: "column",
        boxShadow: "2px 0 12px rgba(0,0,0,0.18)",
        zIndex: 1200,
      }}
    >
      <div
        style={{
          padding: "24px 24px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <svg
            width={28}
            height={28}
            viewBox="0 0 100 100"
            fill="none"
            style={{ color: "white", flexShrink: 0 }}
          >
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="3" fill="none" />
            <circle cx="50" cy="50" r="8" fill="currentColor" />
            <circle cx="30" cy="30" r="6" fill="currentColor" />
            <circle cx="70" cy="30" r="6" fill="currentColor" />
            <circle cx="30" cy="70" r="6" fill="currentColor" />
            <circle cx="70" cy="70" r="6" fill="currentColor" />
            <line x1="50" y1="50" x2="30" y2="30" stroke="currentColor" strokeWidth="2" opacity="0.6" />
            <line x1="50" y1="50" x2="70" y2="30" stroke="currentColor" strokeWidth="2" opacity="0.6" />
            <line x1="50" y1="50" x2="30" y2="70" stroke="currentColor" strokeWidth="2" opacity="0.6" />
            <line x1="50" y1="50" x2="70" y2="70" stroke="currentColor" strokeWidth="2" opacity="0.6" />
            <line x1="30" y1="30" x2="70" y2="30" stroke="currentColor" strokeWidth="2" opacity="0.4" />
            <line x1="30" y1="70" x2="70" y2="70" stroke="currentColor" strokeWidth="2" opacity="0.4" />
            <rect x="20" y="47" width="12" height="2" fill="currentColor" opacity="0.5" rx="1" />
            <rect x="68" y="47" width="12" height="2" fill="currentColor" opacity="0.5" rx="1" />
            <rect x="47" y="20" width="2" height="12" fill="currentColor" opacity="0.5" rx="1" />
            <rect x="47" y="68" width="2" height="12" fill="currentColor" opacity="0.5" rx="1" />
          </svg>
          <div>
            <Typography sx={{ fontWeight: 700, fontSize: 15, color: "white", lineHeight: 1.1 }}>
              SmartReg
            </Typography>
            <Typography sx={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.3 }}>
              Sistema Inteligente
            </Typography>
          </div>
        </div>
        <IconButton
          onClick={onToggle}
          sx={{ color: "rgba(255,255,255,0.7)", "&:hover": { color: "white", bgcolor: "rgba(255,255,255,0.08)" } }}
          size="small"
          aria-label="Fechar menu"
        >
          <ChevronLeftIcon fontSize="medium" />
        </IconButton>
      </div>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.16)", mx: 2, mb: 1 }} />

      <List sx={{ px: 1.5 }}>
        {menuItems.map((item, idx) => {
          const isActive = location.pathname.startsWith(item.path);

          return (
            <React.Fragment key={item.text}>
              <ListItem
                component={Link}
                to={item.path}
                sx={{
                  borderRadius: 2,
                  my: 0.5,
                  px: 1.5,
                  color: "primary.contrastText",
                  opacity: 0.9,
                  transition: "background-color 0.2s, color 0.2s, transform 0.1s",
                  ...(isActive && {
                    backgroundColor: "rgba(255,255,255,0.18)",
                    boxShadow: 1,
                  }),
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.12)",
                    transform: "translateX(2px)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: "primary.contrastText",
                    opacity: isActive ? 1 : 0.9,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    ".MuiTypography-root": {
                      fontWeight: isActive ? 600 : 500,
                      letterSpacing: 0.3,
                    },
                  }}
                />
              </ListItem>
              {idx < menuItems.length - 1 && (
                <Divider sx={{ bgcolor: "rgba(255,255,255,0.18)", mx: 2 }} />
              )}
            </React.Fragment>
          );
        })}
      </List>

      {/* ── Rodapé: usuário logado + botão de logout ───────────────── */}
      <div style={{ marginTop: "auto" }}>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.16)", mx: 2, mb: 1 }} />
        <div
          style={{
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <div style={{ overflow: "hidden" }}>
            <Typography
              sx={{ fontWeight: 600, fontSize: 13, color: "white", lineHeight: 1.2 }}
              noWrap
            >
              {user?.nome ?? "Usuário"}
            </Typography>
            <Typography
              sx={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.3 }}
              noWrap
            >
              {user?.email ?? ""}
            </Typography>
          </div>
          <Tooltip title="Sair" placement="right">
            <IconButton
              onClick={handleLogout}
              size="small"
              aria-label="Sair do sistema"
              sx={{
                color: "rgba(255,255,255,0.6)",
                flexShrink: 0,
                "&:hover": { color: "#f87171", bgcolor: "rgba(248,113,113,0.1)" },
              }}
            >
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
