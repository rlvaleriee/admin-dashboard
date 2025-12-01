import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Stack,
  IconButton,
  Paper,
} from '@mui/material';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseClient';
import { NavBar } from '../components/NavBar';
import {
  Verified,
  Cancel,
  ArrowBack,
} from '@mui/icons-material';

interface CSSPData {
  board: string;
  boardNumber: string;
  profession: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
}

interface Doctor {
  id: string;
  name: string;
  lastName?: string;
  specialty?: string;
  licenseNumber?: string;
  email?: string;
  phone?: string;
  address?: string;
  clinicAddress?: string;
  verified: boolean;
  rejected?: boolean;
  cssp?: CSSPData;
  location?: LocationData;
  reviewStatus?: string;
  createdAt?: any;
  role: string;
}

export const DoctorDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!id) return;

      try {
        const docRef = doc(db, 'users', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDoctor({ id: docSnap.id, ...docSnap.data() } as Doctor);
        } else {
          setSnackbar({ open: true, message: 'Médico no encontrado', severity: 'error' });
        }
      } catch (error) {
        console.error('Error fetching doctor:', error);
        setSnackbar({ open: true, message: 'Error al cargar datos del médico', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  const verifyDoctor = async () => {
    if (!id) return;

    try {
      await updateDoc(doc(db, 'users', id), { verified: true, rejected: false });
      setSnackbar({ open: true, message: 'Médico verificado exitosamente', severity: 'success' });
      setTimeout(() => navigate('/doctors-pending'), 1500);
    } catch (error) {
      console.error('Error verifying doctor:', error);
      setSnackbar({ open: true, message: 'Error al verificar médico', severity: 'error' });
    }
  };

  const rejectDoctor = async () => {
    if (!id) return;

    try {
      await updateDoc(doc(db, 'users', id), { verified: false, rejected: true });
      setSnackbar({ open: true, message: 'Solicitud rechazada', severity: 'success' });
      setTimeout(() => navigate('/doctors-pending'), 1500);
    } catch (error) {
      console.error('Error rejecting doctor:', error);
      setSnackbar({ open: true, message: 'Error al rechazar solicitud', severity: 'error' });
    }
  };

  if (loading) {
    return (
      <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        <NavBar />
        <Container>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
            <CircularProgress sx={{ color: '#0ea5e9' }} />
          </Box>
        </Container>
      </Box>
    );
  }

  if (!doctor) {
    return (
      <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        <NavBar />
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/doctors-pending')}
            sx={{ mb: 3, color: '#0ea5e9' }}
          >
            Volver
          </Button>
          <Alert severity="error">Médico no encontrado</Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <NavBar />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              onClick={() => navigate(-1)}
              sx={{
                backgroundColor: 'white',
                border: '2px solid #e0f2fe',
                '&:hover': {
                  backgroundColor: '#f0f9ff',
                },
              }}
            >
              <ArrowBack sx={{ color: '#0ea5e9' }} />
            </IconButton>
            <Typography variant="h4" sx={{ color: '#0f172a', fontWeight: 800 }}>
              Detalles del Médico
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2}>
            <Button
              onClick={rejectDoctor}
              startIcon={<Cancel />}
              sx={{
                color: '#0f172a',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1.5,
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '2px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'rgba(239, 68, 68, 0.25)',
                },
              }}
            >
              Rechazar
            </Button>
            <Button
              onClick={verifyDoctor}
              variant="contained"
              startIcon={<Verified />}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(16, 185, 129, 0.5)',
                },
              }}
            >
              Verificar
            </Button>
          </Stack>
        </Box>

        {/* Main Content - Two Columns */}
        <Paper
          sx={{
            backgroundColor: 'white',
            borderRadius: 4,
            border: '3px solid #e0f2fe',
            boxShadow: '0 25px 80px rgba(14, 165, 233, 0.15)',
            overflow: 'hidden',
            minHeight: '75vh',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '400px 1fr' },
              minHeight: '75vh',
            }}
          >
            {/* Left Column - Doctor Info */}
            <Box
              sx={{
                p: 4,
                borderRight: { md: '2px solid #e0f2fe' },
                borderBottom: { xs: '2px solid #e0f2fe', md: 'none' },
                overflowY: 'auto',
              }}
            >
              <Stack spacing={4}>
                {/* Personal Info */}
                <Box>
                  <Typography variant="h6" sx={{ color: '#0ea5e9', fontWeight: 700, mb: 3 }}>
                    Información Personal
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                        Nombre Completo
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#0f172a', fontWeight: 600 }}>
                        {doctor.name} {doctor.lastName}
                      </Typography>
                    </Box>
                    {doctor.email && (
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                          Email
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#0f172a', fontWeight: 600, wordBreak: 'break-all' }}>
                          {doctor.email}
                        </Typography>
                      </Box>
                    )}
                    {doctor.phone && (
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                          Teléfono
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#0f172a', fontWeight: 600 }}>
                          {doctor.phone}
                        </Typography>
                      </Box>
                    )}
                    {doctor.address && (
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                          Dirección
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#0f172a', fontWeight: 600 }}>
                          {doctor.address}
                        </Typography>
                      </Box>
                    )}
                    {doctor.clinicAddress && (
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                          Dirección de Clínica
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#0f172a', fontWeight: 600 }}>
                          {doctor.clinicAddress}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Box>

                {/* Professional Info */}
                {doctor.cssp && (
                  <Box>
                    <Typography variant="h6" sx={{ color: '#10b981', fontWeight: 700, mb: 3 }}>
                      Información Profesional
                    </Typography>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                          Profesión
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#0f172a', fontWeight: 600 }}>
                          {doctor.cssp.profession}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                          Junta
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#0f172a', fontWeight: 600 }}>
                          {doctor.cssp.board}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                          Número de Junta
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#0f172a', fontWeight: 700 }}>
                          {doctor.cssp.boardNumber}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                )}
              </Stack>
            </Box>

            {/* Right Column - CSSP Iframe */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <Box
                sx={{
                  p: 3,
                  borderBottom: '2px solid #e0f2fe',
                  backgroundColor: '#f8fafc',
                }}
              >
                <Typography variant="h6" sx={{ color: '#f59e0b', fontWeight: 700 }}>
                  Verificación CSSP
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                  Busca con el número de junta: <strong style={{ color: '#0f172a' }}>{doctor.cssp?.boardNumber}</strong>
                </Typography>
              </Box>
              <Box sx={{ flex: 1, minHeight: 0 }}>
                <iframe
                  src="https://www.cssp.gob.sv/profesionales/faces/consulta/buscar.xhtml"
                  width="100%"
                  height="100%"
                  style={{ border: 'none', minHeight: '600px' }}
                  title="Verificación CSSP"
                />
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{
              backgroundColor: '#1e293b',
              color: '#f8fafc',
              border:
                snackbar.severity === 'success'
                  ? '1px solid rgba(16, 185, 129, 0.3)'
                  : '1px solid rgba(239, 68, 68, 0.3)',
              '& .MuiAlert-icon': {
                color: snackbar.severity === 'success' ? '#10b981' : '#ef4444',
              },
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default DoctorDetails;
