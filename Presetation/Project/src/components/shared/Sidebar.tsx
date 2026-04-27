import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Divider, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ContactsIcon from '@mui/icons-material/Contacts';
import HomeIcon from '@mui/icons-material/Home';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';

const menuItems = [
  { text: 'Início', icon: <HomeIcon />, path: '/home' },
  { text: 'Contatos', icon: <ContactsIcon />, path: '/contatos' },
];

export const Sidebar: React.FC<{ open?: boolean; onToggle?: () => void }> = ({ open = true, onToggle }) => {
  const location = useLocation();
  
  if (!open) {
    return (
      <IconButton
        onClick={onToggle}
        sx={{
          position: 'fixed',
          top: 20,
          left: 0,
          zIndex: 1300,
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          borderRadius: '0 20px 20px 0',
          boxShadow: 3,
          width: 44,
          height: 44,
          p: 0,
          '&:hover': {
            backgroundColor: 'primary.dark',
            boxShadow: 4,
          },
        }}
        size="medium"
        aria-label="Abrir menu"
      >
        <ChevronRightIcon fontSize="medium" />
      </IconButton>
    );
  }
  return (
    <Box
      sx={{
        width: 270,
        height: '100vh',
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        position: 'fixed',
        top: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 3,
        zIndex: 1200,
      }}
    >
      <Box
        sx={{
          px: 3,
          pt: 3,
          pb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Logo size={36} showText variant="white" />
        <IconButton onClick={onToggle} sx={{ color: 'primary.contrastText', ml: 1 }} size="small" aria-label="Fechar menu">
          <ChevronLeftIcon fontSize="medium" />
        </IconButton>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.16)', mx: 2, mb: 1 }} />
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
                color: 'primary.contrastText',
                opacity: 0.9,
                transition: 'background-color 0.2s, color 0.2s, transform 0.1s',
                ...(isActive && {
                  backgroundColor: 'rgba(255,255,255,0.18)',
                  boxShadow: 1,
                }),
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  transform: 'translateX(2px)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: 'primary.contrastText',
                  opacity: isActive ? 1 : 0.9,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  '.MuiTypography-root': {
                    fontWeight: isActive ? 600 : 500,
                    letterSpacing: 0.3,
                  },
                }}
              />
            </ListItem>
            {idx < menuItems.length - 1 && <Divider sx={{ bgcolor: 'rgba(255,255,255,0.18)', mx: 2 }} />}
          </React.Fragment>
          );
        })}
      </List>
    </Box>
  );
};
