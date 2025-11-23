import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  LocalHospital,
  Dashboard as DashboardIcon,
  Group,
  PendingActions,
} from '@mui/icons-material';

export const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { label: 'Médicos Pendientes', path: '/doctors-pending', icon: <PendingActions /> },
    { label: 'Usuarios', path: '/users', icon: <Group /> },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'white',
        backdropFilter: 'blur(20px)',
        borderBottom: '3px solid #e0f2fe',
        boxShadow: '0 2px 12px rgba(14, 165, 233, 0.08)',
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 4, gap: 1.5 }}>
          <Box
            sx={{
              width: 45,
              height: 45,
              borderRadius: 2.5,
              background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(14, 165, 233, 0.3)',
            }}
          >
            <LocalHospital sx={{ fontSize: 26, color: 'white' }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              background: 'linear-gradient(135deg, #0369a1 0%, #0d9488 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 900,
              letterSpacing: '-0.5px',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            MediConnect
          </Typography>
          <Chip
            label="Admin"
            size="small"
            sx={{
              backgroundColor: '#fff7ed',
              border: '2px solid #f59e0b',
              color: '#d97706',
              fontWeight: 800,
              fontSize: '0.7rem',
            }}
          />
        </Box>

        {/* Desktop Navigation */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              startIcon={item.icon}
              sx={{
                color: location.pathname === item.path ? '#0369a1' : '#64748b',
                textTransform: 'none',
                fontWeight: 700,
                px: 2.5,
                py: 1,
                borderRadius: 2,
                backgroundColor:
                  location.pathname === item.path ? '#e0f2fe' : 'transparent',
                border:
                  location.pathname === item.path
                    ? '2px solid #0ea5e9'
                    : '2px solid transparent',
                '&:hover': {
                  backgroundColor: '#f0f9ff',
                  color: '#0369a1',
                },
                transition: 'all 0.2s ease',
              }}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* Mobile Navigation */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, flexGrow: 1 }}>
          <IconButton
            size="large"
            onClick={handleMenu}
            sx={{
              color: '#0ea5e9',
              backgroundColor: '#f0f9ff',
              '&:hover': {
                backgroundColor: '#e0f2fe',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            slotProps={{
              paper: {
                sx: {
                  backgroundColor: 'white',
                  border: '2px solid #e0f2fe',
                  minWidth: 200,
                  mt: 1,
                },
              },
            }}
          >
            {navItems.map((item) => (
              <MenuItem
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  handleClose();
                }}
                sx={{
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: '#e0f2fe',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#0ea5e9' }}>
                  {item.icon}
                  <Typography sx={{ color: '#0f172a', fontWeight: 600 }}>{item.label}</Typography>
                </Box>
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {/* User Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              gap: 1.5,
              px: 2,
              py: 0.8,
              borderRadius: 2,
              backgroundColor: '#f8fafc',
              border: '2px solid #e0f2fe',
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
                fontSize: '0.9rem',
              }}
            >
              <AccountCircle />
            </Avatar>
            <Typography variant="body2" sx={{ color: '#0f172a', fontWeight: 700 }}>
              {userData?.name || 'Admin'}
            </Typography>
          </Box>
          <Button
            onClick={handleLogout}
            startIcon={<Logout />}
            sx={{
              color: 'white',
              textTransform: 'none',
              fontWeight: 700,
              px: 2.5,
              py: 1,
              borderRadius: 2,
              backgroundColor: '#ef4444',
              border: '2px solid #dc2626',
              '&:hover': {
                backgroundColor: '#dc2626',
              },
            }}
          >
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Salir</Box>
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
