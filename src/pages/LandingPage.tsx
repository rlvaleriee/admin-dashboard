import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  AppBar,
  Toolbar,
  Stack,
  Chip,
  Avatar,
} from '@mui/material';
import {
  LocationOn,
  Chat,
  Download,
  Android,
  AdminPanelSettings,
  LocalHospital,
  Favorite,
  CheckCircle,
  CalendarMonth,
  ArrowForward,
  Security,
  HealthAndSafety,
  MedicalServices,
  Vaccines,
} from '@mui/icons-material';

export const LandingPage = () => {
  const navigate = useNavigate();

  const handleScrollToFeatures = () => {
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleDownloadApk = () => {
    const link = document.createElement('a');
    link.href = '/application-e29bdf8c-b11c-4e07-939b-04bd85007e47.apk';
    link.download = 'MediConnect.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const features = [
    {
      icon: <MedicalServices sx={{ fontSize: 35 }} />,
      title: 'Atención Médica',
      description: 'Acceso a profesionales de la salud certificados y especializados.',
      color: '#0ea5e9',
      gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    },
    {
      icon: <LocationOn sx={{ fontSize: 35 }} />,
      title: 'Ubicación en Tiempo Real',
      description: 'Encuentra centros médicos y doctores cercanos a tu ubicación.',
      color: '#14b8a6',
      gradient: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
    },
    {
      icon: <CalendarMonth sx={{ fontSize: 35 }} />,
      title: 'Agenda de Citas',
      description: 'Programa consultas médicas de manera rápida y sencilla.',
      color: '#22c55e',
      gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    },
    {
      icon: <Chat sx={{ fontSize: 35 }} />,
      title: 'Asistente Virtual',
      description: 'Chatbot médico para orientación inicial sobre síntomas.',
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    },
    {
      icon: <HealthAndSafety sx={{ fontSize: 35 }} />,
      title: 'Historial Clínico',
      description: 'Mantén tu información médica organizada y segura.',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    },
    {
      icon: <Security sx={{ fontSize: 35 }} />,
      title: 'Datos Protegidos',
      description: 'Encriptación de nivel hospitalario para tu privacidad.',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    },
  ];

  const benefits = [
    { icon: <Vaccines />, text: 'Médicos Certificados' },
    { icon: <CheckCircle />, text: 'Disponible 24/7' },
    { icon: <HealthAndSafety />, text: 'Seguro y Confiable' },
  ];

  return (
    <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh', position: 'relative' }}>
      {/* Medical Pattern Background */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          zIndex: 0,
          background: 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 50%, #f8fafc 100%)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-10%',
            right: '-5%',
            width: '800px',
            height: '800px',
            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'pulse 15s ease-in-out infinite',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-10%',
            left: '-5%',
            width: '700px',
            height: '700px',
            background: 'radial-gradient(circle, rgba(20, 184, 166, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'pulse 18s ease-in-out infinite reverse',
          },
          '@keyframes pulse': {
            '0%, 100%': { transform: 'scale(1)', opacity: 1 },
            '50%': { transform: 'scale(1.1)', opacity: 0.8 },
          },
        }}
      />

      {/* Navigation */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '2px solid #e0f2fe',
          zIndex: 10,
          boxShadow: '0 2px 12px rgba(14, 165, 233, 0.08)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ py: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: 2.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                <img
                  src="/logo.png"
                  alt="MediConnect Logo"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  background: 'linear-gradient(135deg, #0369a1 0%, #0d9488 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: 900,
                  fontSize: { xs: '1.3rem', md: '1.6rem' },
                  letterSpacing: '-0.5px',
                }}
              >
                MediConnect
              </Typography>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ position: 'relative', zIndex: 1, pt: { xs: 8, md: 14 }, pb: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            {/* Medical Badge */}
            <Chip
              icon={<HealthAndSafety sx={{ fontSize: 18 }} />}
              label="Plataforma de Salud Certificada"
              sx={{
                backgroundColor: '#e0f2fe',
                border: '2px solid #0ea5e9',
                color: '#0369a1',
                fontWeight: 800,
                mb: 4,
                fontSize: '0.9rem',
                py: 2.8,
                px: 1,
                '& .MuiChip-icon': {
                  color: '#0ea5e9',
                },
              }}
            />

            {/* Title */}
            <Typography
              variant="h1"
              sx={{
                color: '#0f172a',
                fontWeight: 900,
                fontSize: { xs: '2.8rem', sm: '4rem', md: '5rem' },
                mb: 3,
                lineHeight: 1.1,
                letterSpacing: '-2px',
              }}
            >
              Conecta con{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    right: 0,
                    height: 6,
                    background: 'linear-gradient(90deg, #0ea5e9 0%, #14b8a6 100%)',
                    borderRadius: 3,
                    opacity: 0.3,
                  },
                }}
              >
                Tu Médico
              </Box>
            </Typography>

            {/* Subtitle */}
            <Typography
              variant="h5"
              sx={{
                color: '#475569',
                mb: 6,
                fontSize: { xs: '1.15rem', md: '1.4rem' },
                lineHeight: 1.7,
                maxWidth: '750px',
                mx: 'auto',
                fontWeight: 500,
              }}
            >
              Acceso inmediato a profesionales de la salud. Agenda citas, consulta tu historial
              médico y recibe atención de calidad desde cualquier lugar.
            </Typography>

            {/* Medical Benefits */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
              sx={{ mb: 6 }}
            >
              {benefits.map((benefit, index) => (
                <Chip
                  key={index}
                  icon={benefit.icon}
                  label={benefit.text}
                  sx={{
                    backgroundColor: 'white',
                    border: '2px solid #e0f2fe',
                    color: '#0c4a6e',
                    fontWeight: 700,
                    py: 3,
                    px: 1.5,
                    fontSize: '0.95rem',
                    boxShadow: '0 2px 8px rgba(14, 165, 233, 0.1)',
                    '& .MuiChip-icon': {
                      color: '#0ea5e9',
                      fontSize: 22,
                    },
                    '&:hover': {
                      borderColor: '#0ea5e9',
                      boxShadow: '0 4px 16px rgba(14, 165, 233, 0.2)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </Stack>

            {/* CTA Buttons */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={3}
              justifyContent="center"
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<Android />}
                endIcon={<Download />}
                onClick={handleDownloadApk}
                sx={{
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
                  color: 'white',
                  px: 6,
                  py: 2.5,
                  fontSize: '1.15rem',
                  textTransform: 'none',
                  fontWeight: 800,
                  borderRadius: 3,
                  boxShadow: '0 8px 30px rgba(14, 165, 233, 0.35)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
                    boxShadow: '0 12px 40px rgba(14, 165, 233, 0.5)',
                    transform: 'translateY(-3px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Descargar Aplicación
              </Button>
              <Button
                variant="outlined"
                size="large"
                endIcon={<ArrowForward />}
                onClick={handleScrollToFeatures}
                sx={{
                  borderColor: '#0ea5e9',
                  color: '#0369a1',
                  px: 6,
                  py: 2.5,
                  fontSize: '1.15rem',
                  textTransform: 'none',
                  fontWeight: 800,
                  borderRadius: 3,
                  borderWidth: 2,
                  '&:hover': {
                    borderColor: '#0284c7',
                    borderWidth: 2,
                    backgroundColor: '#f0f9ff',
                    transform: 'translateY(-3px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Conocer Más
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box
        id="features-section"
        sx={{
          position: 'relative',
          zIndex: 1,
          py: { xs: 8, md: 12 },
          backgroundColor: 'white',
          borderTop: '3px solid #e0f2fe',
          borderBottom: '3px solid #e0f2fe',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Chip
              icon={<MedicalServices sx={{ fontSize: 18 }} />}
              label="SERVICIOS MÉDICOS"
              size="small"
              sx={{
                backgroundColor: '#e0f2fe',
                border: '2px solid #0ea5e9',
                color: '#0369a1',
                fontWeight: 800,
                mb: 4,
                py: 2.5,
                px: 1,
                fontSize: '0.85rem',
                '& .MuiChip-icon': {
                  color: '#0ea5e9',
                },
              }}
            />
            <Typography
              variant="h2"
              sx={{
                color: '#0f172a',
                fontWeight: 900,
                fontSize: { xs: '2.2rem', md: '3.5rem' },
                mb: 3,
                letterSpacing: '-1.5px',
              }}
            >
              Cuidado Integral de Salud
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#64748b',
                maxWidth: '700px',
                mx: 'auto',
                fontSize: '1.2rem',
                fontWeight: 500,
                lineHeight: 1.7,
              }}
            >
              Tecnología avanzada al servicio de tu bienestar y el de tu familia
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 4,
            }}
          >
            {features.map((feature, index) => (
              <Card
                key={index}
                sx={{
                  backgroundColor: 'white',
                  border: '2px solid #e0f2fe',
                  borderRadius: 4,
                  p: 4,
                  position: 'relative',
                  overflow: 'visible',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 20px rgba(14, 165, 233, 0.08)',
                  '&:hover': {
                    transform: 'translateY(-12px)',
                    borderColor: feature.color,
                    boxShadow: `0 20px 60px ${feature.color}25`,
                    '& .feature-icon': {
                      transform: 'scale(1.15)',
                      boxShadow: `0 12px 32px ${feature.color}45`,
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: -30,
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                >
                  <Avatar
                    className="feature-icon"
                    sx={{
                      width: 70,
                      height: 70,
                      background: feature.gradient,
                      boxShadow: `0 8px 28px ${feature.color}40`,
                      transition: 'all 0.4s ease',
                      border: '4px solid white',
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                </Box>
                <Box sx={{ pt: 5 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#0f172a',
                      fontWeight: 800,
                      mb: 2,
                      fontSize: '1.25rem',
                      textAlign: 'center',
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#64748b',
                      lineHeight: 1.8,
                      textAlign: 'center',
                      fontSize: '0.95rem',
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Box>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Chatbot Section */}
      <Box sx={{ position: 'relative', zIndex: 1, py: { xs: 10, md: 12 } }}>
        <Container maxWidth="md">
          <Card
            sx={{
              background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
              border: '3px solid #0ea5e9',
              borderRadius: 5,
              p: { xs: 5, md: 6 },
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 12px 40px rgba(14, 165, 233, 0.15)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                background: 'radial-gradient(circle, rgba(14, 165, 233, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
              },
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 4 }}>
                <Avatar
                  sx={{
                    width: 70,
                    height: 70,
                    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                    boxShadow: '0 8px 28px rgba(6, 182, 212, 0.4)',
                    border: '4px solid white',
                  }}
                >
                  <Chat sx={{ fontSize: 35 }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ color: '#0c4a6e', fontWeight: 900, mb: 1 }}>
                    Asistente Médico Virtual
                  </Typography>
                  <Chip
                    icon={<CheckCircle sx={{ fontSize: 16 }} />}
                    label="Tecnología IA Certificada"
                    sx={{
                      backgroundColor: 'white',
                      border: '2px solid #06b6d4',
                      color: '#0e7490',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      '& .MuiChip-icon': {
                        color: '#06b6d4',
                      },
                    }}
                  />
                </Box>
              </Stack>
              <Typography
                variant="body1"
                sx={{
                  color: '#334155',
                  lineHeight: 1.9,
                  fontSize: '1.05rem',
                  mb: 2,
                }}
              >
                Nuestro chatbot inteligente te ayuda a identificar síntomas y te guía hacia el
                especialista adecuado para tu consulta.
              </Typography>
              <Box
                sx={{
                  backgroundColor: '#fff7ed',
                  border: '2px solid #fb923c',
                  borderRadius: 3,
                  p: 3,
                  mt: 3,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: '#9a3412',
                    lineHeight: 1.8,
                    fontSize: '0.95rem',
                    fontWeight: 600,
                  }}
                >
                  <Box component="span" sx={{ fontWeight: 800, color: '#ea580c' }}>
                    ⚕️ Aviso Médico Importante:
                  </Box>{' '}
                  Este asistente virtual es una herramienta de orientación y NO reemplaza el
                  diagnóstico ni el tratamiento de un profesional médico certificado. Siempre
                  consulta con un doctor para diagnósticos precisos.
                </Typography>
              </Box>
            </Box>
          </Card>
        </Container>
      </Box>

      {/* CTA Final */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          py: { xs: 10, md: 14 },
          background: 'linear-gradient(180deg, #ffffff 0%, #f0f9ff 100%)',
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              textAlign: 'center',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
              borderRadius: 5,
              p: { xs: 6, md: 9 },
              boxShadow: '0 20px 60px rgba(14, 165, 233, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              border: '4px solid white',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -120,
                right: -120,
                width: 350,
                height: 350,
                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
                borderRadius: '50%',
              },
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <LocalHospital sx={{ fontSize: 70, color: 'white', mb: 3, opacity: 0.95 }} />
              <Typography
                variant="h2"
                sx={{
                  color: 'white',
                  fontWeight: 900,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  mb: 3,
                  letterSpacing: '-1.5px',
                }}
              >
                Comienza tu Atención Médica Hoy
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255, 255, 255, 0.95)',
                  mb: 5,
                  fontSize: { xs: '1.15rem', md: '1.3rem' },
                  lineHeight: 1.7,
                  maxWidth: '600px',
                  mx: 'auto',
                  fontWeight: 500,
                }}
              >
                Únete a miles de pacientes que confían en MediConnect para su cuidado de salud
                integral
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={3}
                justifyContent="center"
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Download />}
                  onClick={handleDownloadApk}
                  sx={{
                    backgroundColor: 'white',
                    color: '#0369a1',
                    px: 8,
                    py: 3,
                    fontSize: '1.2rem',
                    textTransform: 'none',
                    fontWeight: 900,
                    borderRadius: 3,
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                    '&:hover': {
                      backgroundColor: '#f8fafc',
                      transform: 'scale(1.05)',
                      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.25)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Descargar Ahora
                </Button>
                <Chip
                  icon={<Android sx={{ color: 'white !important' }} />}
                  label="Android APK"
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    border: '2px solid white',
                    color: 'white',
                    fontWeight: 700,
                    py: 3.5,
                    fontSize: '1rem',
                    '& .MuiChip-icon': {
                      color: 'white',
                    },
                  }}
                />
              </Stack>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          backgroundColor: 'white',
          borderTop: '3px solid #e0f2fe',
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 6,
              mb: 6,
            }}
          >
            <Box>
              <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <Box
                  sx={{
                    width: 55,
                    height: 55,
                    borderRadius: 2.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src="/logo.png"
                    alt="MediConnect Logo"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontWeight: 900,
                  }}
                >
                  MediConnect
                </Typography>
              </Stack>
              <Typography
                variant="body2"
                sx={{
                  color: '#64748b',
                  maxWidth: 420,
                  lineHeight: 1.9,
                  fontSize: '0.95rem',
                  mb: 3,
                }}
              >
                Tu plataforma de confianza para conectar con profesionales médicos certificados.
                Tecnología innovadora al servicio de tu salud y bienestar.
              </Typography>
              <Stack direction="row" spacing={1.5}>
                <Chip
                  icon={<HealthAndSafety />}
                  label="Certificado"
                  size="small"
                  sx={{
                    backgroundColor: '#e0f2fe',
                    color: '#0369a1',
                    border: '2px solid #0ea5e9',
                    fontWeight: 700,
                    '& .MuiChip-icon': {
                      color: '#0ea5e9',
                    },
                  }}
                />
                <Chip
                  icon={<Security />}
                  label="Seguro"
                  size="small"
                  sx={{
                    backgroundColor: '#ccfbf1',
                    color: '#0d9488',
                    border: '2px solid #14b8a6',
                    fontWeight: 700,
                    '& .MuiChip-icon': {
                      color: '#14b8a6',
                    },
                  }}
                />
              </Stack>
            </Box>
            <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Typography variant="h6" sx={{ color: '#0f172a', fontWeight: 800, mb: 3 }}>
                Acceso Administrativo
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: '#64748b', mb: 3, fontSize: '0.9rem', lineHeight: 1.7 }}
              >
                Portal exclusivo para administradores del sistema MediConnect
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/login')}
                startIcon={<AdminPanelSettings />}
                sx={{
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 800,
                  px: 4,
                  py: 1.8,
                  fontSize: '1rem',
                  borderRadius: 2.5,
                  boxShadow: '0 6px 24px rgba(14, 165, 233, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
                    boxShadow: '0 8px 32px rgba(14, 165, 233, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Panel de Control
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              borderTop: '2px solid #e0f2fe',
              pt: 5,
              textAlign: 'center',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: '#64748b',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5,
                flexWrap: 'wrap'
              }}
            >
              <span>© 2025 MediConnect. Desarrollado con</span>
              <Favorite sx={{ fontSize: 16, color: '#ef4444' }} />
              <span>para el cuidado de tu salud.</span>
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
