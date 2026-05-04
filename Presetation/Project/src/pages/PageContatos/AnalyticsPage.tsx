import React, { useState } from "react";
import { Typography, Chip } from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import { Sidebar } from "../../components/shared";

export const AnalyticsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f7fa" }}>
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />

      <div
        style={{
          flex: 1,
          marginLeft: sidebarOpen ? "270px" : 0,
          transition: "margin-left 0.3s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px",
        }}
      >
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              backgroundColor: "rgba(21,93,252,0.08)",
              border: "1px solid rgba(21,93,252,0.14)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <BarChartIcon sx={{ fontSize: 44, color: "#155dfc", opacity: 0.55 }} />
          </div>

          <Typography
            variant="h4"
            sx={{fontWeight: 700, color: "#111827", letterSpacing: 0.2, mb: 1.5 }} style={{ fontSize: "1.75rem" }}
          >
            Painel de Análises
          </Typography>

          <Typography
            variant="body1"
            sx={{ color: "#6a7282", lineHeight: 1.85, fontSize: "0.95rem", mb: 3 }}
          >
            Esta seção será dedicada à coleta e visualização inteligente dos dados de contatos. Aqui
            você poderá acompanhar o crescimento da base por período, identificar padrões de
            cadastro, monitorar a cobertura de informações como e-mail e telefone, e explorar
            métricas através de dashboards interativos e gráficos dinâmicos.
          </Typography>

          <Chip
            label="Em construção"
            size="small"
            sx={{
              fontSize: 12,
              letterSpacing: 0.5,
              bgcolor: "rgba(21,93,252,0.08)",
              color: "#155dfc",
              border: "1px solid rgba(21,93,252,0.18)",
              fontWeight: 600,
              px: 1,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
