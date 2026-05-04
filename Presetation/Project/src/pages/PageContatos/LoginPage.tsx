import React, { ChangeEvent, FormEvent, useState } from "react";
import {
  Box,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from "@mui/material";
import {
  LockOutlined,
  EmailOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAuthEvents } from "../../hooks/auth/useAuthEvents";
import { Alert, Button, Paper, TextField } from "../../components/ui";
import { Logo } from "../../components/shared/LogoExeterna";

// Página de login do SmartReg.
// Layout: painel esquerdo (branding, escondido em mobile) + painel direito (formulário).
// Aceita qualquer usuário da tabela [user].[usuario] — administrador ou não.
// Após autenticação bem-sucedida, redireciona para /home.
export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { dispatchLogin, loading, error, setError } = useAuthEvents();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !senha) return;

    const response = await dispatchLogin({ email, senha });

    if (response) {
      login(response);      // persiste token + user no contexto e localStorage
      navigate("/home", { replace: true });
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>

      {/* ── Painel esquerdo: branding (oculto em mobile) ───────────── */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          width: "42%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#030213", // mesma cor da Sidebar
          color: "#ffffff",
          px: 6,
          gap: 4,
        }}
      >
        {/* Logo grande com variante white */}
        <Logo size={120} showText variant="white" textSize={43} />

        <Divider sx={{ borderColor: "rgba(255,255,255,0.12)", width: "100%" }} />

        <div>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, mb: 1.5, letterSpacing: 0.2 }}
          >
            Sistema Inteligente de Gestão
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7, mb: 3 }}
          >
            Gerencie seus contatos com eficiência, segurança e visibilidade total
            sobre os dados cadastrados.
          </Typography>

          {/* Destaques do sistema */}
          {[
            "Cadastro e edição em tempo real",
            "Filtros avançados por múltiplos campos",
            "Exclusão com confirmação e opção de restauração",
          ].map((item) => (
            <Stack
              key={item}
              direction="row"
              spacing={1.5}
              sx={{ mb: 1.5, alignItems: "center" }}
            >
              <Box
                sx={{
                  mt: "3px",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "#155dfc",
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.75)" }}
              >
                {item}
              </Typography>
            </Stack>
          ))}
        </div>
      </Box>

      {/* ── Painel direito: formulário de login ── */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f7fa", // fundo padrão da aplicação
          p: 3,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 640,
            p: { xs: 4, sm: 5 },
            minHeight: 640,
            borderRadius: 2.8,
            border: "1px solid #e5e7eb",
            backgroundColor: "#ffffff",
          }}
        >
        {/* Logo pequeno no topo do card — visível em todos os tamanhos */}
        <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "flex-start", mb: 5 }}>
          <Logo size={56} showText variant="dark" />
        </Box>

        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: "#111827", textAlign: "center", mb: 2, fontSize: "1.75rem" }}
        >
          Bem-vindo de volta
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "#6a7282", textAlign: "center", mb: 5, fontSize: "0.95rem", lineHeight: 1.6 }}
        >
          Insira suas credenciais para acessar o sistema
        </Typography>

        {/* Alerta de erro — exibido apenas quando há mensagem de erro */}
        {error && (
          <Box sx={{ mb: 2 }}>
            <Alert
              severity="error"
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          </Box>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={3}>
            <TextField
              label="E-mail"
              type="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
              required
              sx={{
                '& input:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 1000px white inset !important',
                  WebkitTextFillColor: '#111827 !important',
                },
                '& input:-webkit-autofill:focus': {
                  WebkitBoxShadow: '0 0 0 1000px white inset !important',
                  WebkitTextFillColor: '#111827 !important',
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined sx={{ fontSize: 20, color: "#9ca3af" }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              label="Senha"
              type={showSenha ? "text" : "password"}
              value={senha}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSenha(e.target.value)}
              autoComplete="current-password"
              required
              sx={{
                '& input:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 1000px white inset !important',
                  WebkitTextFillColor: '#111827 !important',
                },
                '& input:-webkit-autofill:focus': {
                  WebkitBoxShadow: '0 0 0 1000px white inset !important',
                  WebkitTextFillColor: '#111827 !important',
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined sx={{ fontSize: 20, color: "#9ca3af" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowSenha((v) => !v)}
                        edge="end"
                        aria-label={showSenha ? "Ocultar senha" : "Exibir senha"}
                      >
                        {showSenha
                          ? <VisibilityOff sx={{ fontSize: 20 }} />
                          : <Visibility sx={{ fontSize: 20 }} />
                        }
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading || !email || !senha}
              sx={{ mt: 1, minHeight: 52, fontWeight: 600, fontSize: "1rem" }}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </Stack>
        </Box>

        <Typography
          variant="caption"
          sx={{ display: "block", textAlign: "center", color: "#9ca3af", mt: 3 }}
        >
          Acesse a plataforma
        </Typography>
      </Paper>
    </Box>
    </Box >
  );
};

export default LoginPage;
