import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Stack, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useContatoEvents } from '../hooks/contato/useContatoEvents';
import { ContatoEventType } from '../utils/contato/contatoEvents';
import { Contato } from '../utils/contato/contatoTypes';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { dispatchContatoEvent } = useContatoEvents();
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = (await dispatchContatoEvent({ type: ContatoEventType.LISTAR })) as Contato[];
        setContatos(data ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatchContatoEvent]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at top left, #e3f2fd, #f5f7fa 45%, #ffffff 80%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Container maxWidth="md">
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

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            alignItems="center"
            sx={{ mb: 3 }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/contatos')}
              sx={{ borderRadius: 999, textTransform: 'none', px: 4, fontWeight: 600 }}
            >
              Ver lista de contatos
            </Button>
          </Stack>

          <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: 13 }}>
            {loading ? 'Carregando quantidade de contatos...' : `Total de contatos cadastrados: ${contatos.length}`}
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default HomePage;
