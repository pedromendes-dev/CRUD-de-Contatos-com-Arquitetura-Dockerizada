import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/shared/Logo';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url(/img_1.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(255,255,255,0.72)',
        },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          px: { xs: 4, sm: 7 },
          py: 6,
          borderRadius: 4,
          backdropFilter: 'blur(14px)',
          backgroundColor: 'rgba(255,255,255,0.88)',
          maxWidth: 460,
          width: '90%',
          gap: 1.5,
        }}
      >
        <Logo size={64} showText variant="default" />

        {/* Separador roxo */}
        <Box
          sx={{ width: 36, height: 3, borderRadius: 2, bgcolor: 'secondary.main', my: 0.5 }}
        />

        {/* 404 */}
        <Typography
          component="p"
          sx={{
            fontSize: { xs: '5.5rem', sm: '8rem' },
            fontWeight: 700,
            color: 'primary.main',
            lineHeight: 1,
            letterSpacing: -4,
          }}
        >
          404
        </Typography>

        <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main', mt: -0.5 }}>
          Página não encontrada
        </Typography>

        <Typography variant="body2" sx={{ color: '#4b5563', maxWidth: 320 }}>
          A página que você está procurando não existe ou foi movida. 
          Verifique o URL ou volte para a página inicial.
        </Typography>

        <Button
          variant="contained"
          startIcon={<HomeIcon />}
          onClick={() => navigate('/home')}
          sx={{ mt: 1.5, px: 4 }}
        >
          Voltar ao Início
        </Button>
      </Paper>
    </Box>
  );
};

export default NotFoundPage;
