import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const MEDICONNECT_URL = 'https://mediconnect-sv.vercel.app/';

const goToMediConnect = () => {
  window.location.href = MEDICONNECT_URL;
};
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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { auth } from '../firebase/firebaseClient';
import { validatePassword as validatePasswordService, checkPasswordRequirements } from '../services/passwordService';
import {
  VpnKey,
  Visibility,
  VisibilityOff,
  Lock,
  ArrowBack,
  CheckCircle,
  RadioButtonUnchecked,
} from '@mui/icons-material';

export const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState('');
  const [oobCode, setOobCode] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('oobCode');

    if (!code) {
      setError('El enlace de recuperación no es válido o ha expirado.');
      setVerifying(false);
      return;
    }

    verifyPasswordResetCode(auth, code)
      .then((emailFromCode) => {
        setEmail(emailFromCode);
        setOobCode(code);
        setVerifying(false);
      })
      .catch((err) => {
        console.log('Error verificando código:', err);

        let errorMessage = 'El enlace no es válido o ha expirado';

        if (err.code === 'auth/expired-action-code') {
          errorMessage = 'El enlace ha expirado. Solicita uno nuevo.';
        } else if (err.code === 'auth/invalid-action-code') {
          errorMessage = 'El enlace no es válido o ya fue usado.';
        }

        setError(errorMessage);
        setVerifying(false);
      });
  }, [searchParams]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwordValidation = validatePasswordService(password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors.join(', '));
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!oobCode) {
      setError('Código de verificación no encontrado');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await confirmPasswordReset(auth, oobCode, password);
      setSuccessDialogOpen(true);
    } catch (err: unknown) {
      console.log('Error restableciendo contraseña:', err);
      const firebaseError = err as { code?: string };

      let errorMessage = 'No se pudo restablecer la contraseña';

      if (firebaseError.code === 'auth/expired-action-code') {
        errorMessage = 'El enlace ha expirado. Solicita uno nuevo.';
      } else if (firebaseError.code === 'auth/invalid-action-code') {
        errorMessage = 'El enlace no es válido o ya fue usado.';
      } else if (firebaseError.code === 'auth/weak-password') {
        errorMessage = 'La contraseña es muy débil. Usa al menos 6 caracteres.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={48} sx={{ color: '#2196F3' }} />
          <Typography sx={{ color: '#6B7280', fontSize: 16 }}>
            Verificando enlace...
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (error && !oobCode) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 4,
              backgroundColor: 'white',
              border: '3px solid #e0f2fe',
              boxShadow: '0 25px 80px rgba(14, 165, 233, 0.15)',
              textAlign: 'center',
            }}
          >
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
            <Button
              variant="contained"
              onClick={goToMediConnect}
              sx={{
                background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
                textTransform: 'none',
                fontWeight: 700,
              }}
            >
              Volver al inicio
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

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
      {/* Background Pattern */}
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
          onClick={goToMediConnect}
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
          {/* Icon */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Avatar
              sx={{
                width: 96,
                height: 96,
                background: '#E3F2FD',
                boxShadow: '0 10px 40px rgba(33, 150, 243, 0.2)',
              }}
            >
              <VpnKey sx={{ fontSize: 48, color: '#2196F3' }} />
            </Avatar>
          </Box>

          {/* Title */}
          <Typography
            component="h1"
            variant="h4"
            align="center"
            sx={{
              color: '#1A1A1A',
              fontWeight: 800,
              mb: 1.5,
              letterSpacing: '-0.5px',
            }}
          >
            Nueva Contraseña
          </Typography>

          <Typography
            variant="body1"
            align="center"
            sx={{
              color: '#6B7280',
              mb: 4,
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            Ingresa tu nueva contraseña para{' '}
            <Box component="span" sx={{ fontWeight: 700, color: '#2196F3' }}>
              {email}
            </Box>
          </Typography>

          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              {error}
            </Alert>
          )}

          {/* Form */}
          <Box component="form" onSubmit={handleResetPassword}>
            <Stack spacing={2.5}>
              <TextField
                required
                fullWidth
                label="Nueva contraseña"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                disabled={loading}
                autoComplete="new-password"
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#9CA3AF' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: '#6B7280' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#fff',
                    borderRadius: 3,
                    '& fieldset': {
                      borderColor: error ? '#EF4444' : '#E5E7EB',
                      borderWidth: 1.5,
                    },
                    '&:hover fieldset': {
                      borderColor: '#2196F3',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#2196F3',
                      borderWidth: 1.5,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#9CA3AF',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#2196F3',
                  },
                }}
              />

              <TextField
                required
                fullWidth
                label="Confirmar contraseña"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError('');
                }}
                disabled={loading}
                autoComplete="new-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#9CA3AF' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        sx={{ color: '#6B7280' }}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#fff',
                    borderRadius: 3,
                    '& fieldset': {
                      borderColor: error ? '#EF4444' : '#E5E7EB',
                      borderWidth: 1.5,
                    },
                    '&:hover fieldset': {
                      borderColor: '#2196F3',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#2196F3',
                      borderWidth: 1.5,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#9CA3AF',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#2196F3',
                  },
                }}
              />

              {/* Password Requirements */}
              <Box
                sx={{
                  backgroundColor: '#F9FAFB',
                  borderRadius: 3,
                  p: 2,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#374151',
                    mb: 1.5,
                  }}
                >
                  La contraseña debe tener:
                </Typography>
                <Stack spacing={0.75}>
                  {(() => {
                    const requirements = checkPasswordRequirements(password);
                    const passwordsMatch = password === confirmPassword && password.length > 0;
                    const items = [
                      { met: requirements.hasMinLength, text: 'Al menos 8 caracteres' },
                      { met: requirements.hasUpperCase, text: 'Una letra mayúscula' },
                      { met: requirements.hasLowerCase, text: 'Una letra minúscula' },
                      { met: requirements.hasNumber, text: 'Un número' },
                      { met: requirements.hasSpecialChar, text: 'Un carácter especial (!@#$%...)' },
                      { met: passwordsMatch, text: 'Las contraseñas coinciden' },
                    ];
                    return items.map((item, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {item.met ? (
                          <CheckCircle sx={{ fontSize: 18, color: '#4CAF50' }} />
                        ) : (
                          <RadioButtonUnchecked sx={{ fontSize: 18, color: '#9CA3AF' }} />
                        )}
                        <Typography
                          sx={{
                            fontSize: 13,
                            color: item.met ? '#4CAF50' : '#6B7280',
                            fontWeight: item.met ? 500 : 400,
                          }}
                        >
                          {item.text}
                        </Typography>
                      </Box>
                    ));
                  })()}
                </Stack>
              </Box>

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} sx={{ color: '#fff' }} />
                  ) : (
                    <CheckCircle />
                  )
                }
                sx={{
                  py: 2,
                  fontSize: '1rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  background: '#2196F3',
                  boxShadow: '0 4px 14px rgba(33, 150, 243, 0.3)',
                  borderRadius: 3,
                  mt: 1.5,
                  '&:hover': {
                    background: '#1976D2',
                    boxShadow: '0 8px 25px rgba(33, 150, 243, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  '&:disabled': {
                    background: '#93C5FD',
                    color: '#fff',
                    opacity: 0.7,
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {loading ? 'Restableciendo...' : 'Restablecer contraseña'}
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>

      {/* Success Dialog */}
      <Dialog
        open={successDialogOpen}
        onClose={() => {}}
        aria-labelledby="success-dialog-title"
        aria-describedby="success-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        <DialogTitle
          id="success-dialog-title"
          sx={{
            textAlign: 'center',
            fontWeight: 700,
            color: '#4CAF50',
          }}
        >
          Contraseña actualizada
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="success-dialog-description"
            sx={{ textAlign: 'center', color: '#374151' }}
          >
            Tu contraseña ha sido restablecida correctamente. Ahora puedes abrir la aplicación e iniciar sesión con tu nueva contraseña.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button
            onClick={goToMediConnect}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
              textTransform: 'none',
              fontWeight: 700,
              px: 4,
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResetPassword;
