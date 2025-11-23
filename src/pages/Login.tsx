import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Stack,
  Avatar,
} from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseClient';
import {
  AdminPanelSettings,
  Visibility,
  VisibilityOff,
  Lock,
  Email,
  ArrowBack,
} from '@mui/icons-material';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err: unknown) {
      const error = err as { code?: string; message: string };
      if (error.code === 'auth/invalid-credential') {
        setError('Credenciales inválidas. Por favor verifica tu email y contraseña.');
      } else if (error.code === 'auth/user-not-found') {
        setError('Usuario no encontrado.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Contraseña incorrecta.');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Demasiados intentos fallidos. Por favor intenta más tarde.');
      } else {
        setError('Error al iniciar sesión. Por favor intenta de nuevo.');
      }
      console.error('Error de login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 100%)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Medical Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          zIndex: 0,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '20%',
            right: '15%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'pulse 15s ease-in-out infinite',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '20%',
            left: '15%',
            width: '350px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(20, 184, 166, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'pulse 18s ease-in-out infinite reverse',
          },
          '@keyframes pulse': {
            '0%, 100%': { transform: 'scale(1)', opacity: 1 },
            '50%': { transform: 'scale(1.1)', opacity: 0.8 },
          },
        }}
      />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{
            color: '#0369a1',
            mb: 3,
            textTransform: 'none',
            fontWeight: 700,
            '&:hover': {
              backgroundColor: 'rgba(14, 165, 233, 0.1)',
            },
          }}
        >
          Volver al inicio
        </Button>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            backgroundColor: 'white',
            border: '3px solid #e0f2fe',
            boxShadow: '0 25px 80px rgba(14, 165, 233, 0.15)',
          }}
        >
          {/* Logo/Icon */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Avatar
              sx={{
                width: 90,
                height: 90,
                background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
                boxShadow: '0 10px 40px rgba(14, 165, 233, 0.4)',
                border: '4px solid #e0f2fe',
              }}
            >
              <AdminPanelSettings sx={{ fontSize: 50 }} />
            </Avatar>
          </Box>

          {/* Title */}
          <Typography
            component="h1"
            variant="h4"
            align="center"
            sx={{
              color: '#0f172a',
              fontWeight: 900,
              mb: 1,
              letterSpacing: '-1px',
            }}
          >
            Portal de Administración
          </Typography>

          <Typography
            variant="body2"
            align="center"
            sx={{
              color: '#64748b',
              mb: 4,
              fontSize: '1rem',
              fontWeight: 500,
            }}
          >
            Ingresa tus credenciales para acceder al panel médico
          </Typography>

          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: '#fca5a5',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                '& .MuiAlert-icon': {
                  color: '#ef4444',
                },
              }}
            >
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleLogin}>
            <Stack spacing={3}>
              <TextField
                required
                fullWidth
                id="email"
                label="Correo Electrónico"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: '#0ea5e9' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f8fafc',
                    color: '#0f172a',
                    '& fieldset': {
                      borderColor: '#cbd5e1',
                      borderWidth: 2,
                    },
                    '&:hover fieldset': {
                      borderColor: '#0ea5e9',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#0ea5e9',
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#64748b',
                    fontWeight: 600,
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#0ea5e9',
                  },
                }}
              />

              <TextField
                required
                fullWidth
                name="password"
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#0ea5e9' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: '#64748b' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f8fafc',
                    color: '#0f172a',
                    '& fieldset': {
                      borderColor: '#cbd5e1',
                      borderWidth: 2,
                    },
                    '&:hover fieldset': {
                      borderColor: '#0ea5e9',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#0ea5e9',
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#64748b',
                    fontWeight: 600,
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#0ea5e9',
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading || !email || !password}
                sx={{
                  py: 2,
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
                  boxShadow: '0 8px 30px rgba(14, 165, 233, 0.35)',
                  borderRadius: 2.5,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
                    boxShadow: '0 12px 40px rgba(14, 165, 233, 0.5)',
                    transform: 'translateY(-2px)',
                  },
                  '&:disabled': {
                    background: '#cbd5e1',
                    color: '#94a3b8',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </Stack>
          </Box>

          <Typography
            variant="caption"
            align="center"
            sx={{
              display: 'block',
              mt: 4,
              color: '#64748b',
            }}
          >
            Solo usuarios administradores pueden acceder
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
