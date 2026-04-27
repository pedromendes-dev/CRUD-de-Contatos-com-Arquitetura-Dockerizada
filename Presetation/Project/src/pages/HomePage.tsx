import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getContatosCount } from '../services/axios/contatosAxios';
import { Logo } from '../components/shared/Logo';

const contatosCountCacheKey = 'contatos-count-cache';
const contatosCountCacheTtlMs = 5 * 60 * 1000;

export const HomePage: React.FC = () => {
  const navigate = useNavigate();  //  useNavigate serve para mudar de página via código, sem recarregar o site.
  const [contatosCount, setContatosCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showCount, setShowCount] = useState(false);
  const [countError, setCountError] = useState(false);

  // Busca a quantidade de contatos usando cache curto entre navegacoes
  useEffect(() => {
    let hasValidCache = false;
    const cachedValue = sessionStorage.getItem(contatosCountCacheKey);

    if (cachedValue) {
      try {
        const parsedCache = JSON.parse(cachedValue) as { total: number; timestamp: number };
        const isCacheValid = Date.now() - parsedCache.timestamp < contatosCountCacheTtlMs;

        if (isCacheValid) {
          hasValidCache = true;
          setContatosCount(parsedCache.total);
          setCountError(false);
          setLoading(false);
        }
      } catch {
        sessionStorage.removeItem(contatosCountCacheKey);
      }
    }

    (async () => {
      try {
        const response = await getContatosCount();
        const total = response.data.total ?? 0;

        setContatosCount(total);
        setCountError(false);
        sessionStorage.setItem(
          contatosCountCacheKey,
          JSON.stringify({ total, timestamp: Date.now() }),
        );
      } catch (error) {
        console.error('Erro ao carregar quantidade de contatos:', error);
        if (!hasValidCache) {
          setCountError(true);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setShowCount(true), 1000); // Pequeno delay para evitar mostrar o número antes de atualizar o estado, melhorando a UX
      return () => clearTimeout(timer);
    } else {
      setShowCount(false);
    }
  }, [loading]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        backgroundImage: `url(/img_1.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Overlay branco translúcido */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(255,255,255,0.7)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center',
            boxShadow: '0 18px 45px rgba(15, 23, 42, 0.12)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2.5 }}>
            <Logo size={52} showText variant="dark" />
          </Box>

          <Typography
            variant="overline"
            sx={{ letterSpacing: 3, color: 'primary.main', fontWeight: 700, fontSize: 14, mb: 1 }}
          >
            Bem-vindo ao
          </Typography>
          <Typography
            variant="h3"
            sx={{ fontWeight: 605, mb: 1.5, color: '#111827', letterSpacing: 0.3, fontSize: { xs: 28, md: 36 } }}
          >
            Painel de Clientes
          </Typography>
          <Typography
            variant="body1"
            sx={{ mb: 3.5, color: '#4b5563', maxWidth: 620,fontWeight: 500, mx: 'auto', fontSize: 17 }}
          >
            Organize, atualize e gerencie seus contatos de forma simples, rápida
            e visual, com uma experiência pensada em usabilidade e produtividade.
     </Typography>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: 'bold', color: '#333', mb: 2, display: 'flex', justifyContent: 'center', textAlign: 'center' }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/contatos')}
              sx={{ borderRadius: 999, textTransform: 'none', px: 4, fontWeight: 600 }}
            >
              Ver lista de contatos
            </Button>
          </Typography>

          <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: 13 }}>
            {countError
              ? 'Nao foi possivel carregar a quantidade de contatos agora.'
              : (!showCount || loading)
              ? 'Carregando quantidade de contatos...'
              : `Total de contatos cadastrados: ${contatosCount}`}
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default HomePage;
