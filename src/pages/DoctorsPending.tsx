import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
  Avatar,
  Stack,
} from '@mui/material';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseClient';
import { NavBar } from '../components/NavBar';
import {
  Verified,
  Person,
  LocalHospital,
  Email,
  Phone,
  LocationOn,
  CheckCircle,
  OpenInNew,
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

export const DoctorsPending = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    const q = query(
      collection(db, 'users'),
      where('role', '==', 'doctor'),
      where('verified', '==', false)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const doctorsList = (snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Doctor[]).filter((doctor) => !doctor.rejected);
        setDoctors(doctorsList);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching doctors:', error);
        setSnackbar({ open: true, message: 'Error al cargar médicos', severity: 'error' });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const verifyDoctor = async (id: string) => {
    try {
      await updateDoc(doc(db, 'users', id), { verified: true });
      setSnackbar({ open: true, message: 'Médico verificado exitosamente', severity: 'success' });
    } catch (error) {
      console.error('Error verifying doctor:', error);
      setSnackbar({ open: true, message: 'Error al verificar médico', severity: 'error' });
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

  return (
    <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <NavBar />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              color: '#0f172a',
              fontWeight: 900,
              mb: 1,
              letterSpacing: '-1.5px',
            }}
          >
            Médicos Pendientes
          </Typography>
          <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
            Revisa y verifica los perfiles de médicos que solicitan acceso
            <Chip
              label={`${doctors.length} Pendiente${doctors.length !== 1 ? 's' : ''}`}
              size="small"
              sx={{
                backgroundColor: '#fff7ed',
                border: '2px solid #f59e0b',
                color: '#d97706',
                fontWeight: 800,
              }}
            />
          </Typography>
        </Box>

        {doctors.length === 0 ? (
          <Card
            sx={{
              backgroundColor: 'white',
              border: '2px solid #e0f2fe',
              borderRadius: 4,
              p: 6,
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(14, 165, 233, 0.08)',
            }}
          >
            <CheckCircle sx={{ fontSize: 60, color: '#22c55e', mb: 2 }} />
            <Typography variant="h5" sx={{ color: '#0f172a', fontWeight: 900, mb: 1 }}>
              ¡Todo al día!
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
              No hay médicos pendientes de verificación
            </Typography>
          </Card>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
              gap: 3,
            }}
          >
            {doctors.map((doctor) => (
              <Card
                key={doctor.id}
                sx={{
                  backgroundColor: 'white',
                  border: '2px solid #e0f2fe',
                  borderRadius: 4,
                  p: 3,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 20px rgba(14, 165, 233, 0.08)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    borderColor: '#f59e0b',
                    boxShadow: '0 20px 60px rgba(245, 158, 11, 0.25)',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '120px',
                    height: '120px',
                    background: 'radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    transform: 'translate(40%, -40%)',
                  },
                }}
              >
                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                  {/* Header with Avatar */}
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        boxShadow: '0 8px 24px rgba(245, 158, 11, 0.4)',
                        border: '3px solid white',
                      }}
                    >
                      <Person sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ color: '#0f172a', fontWeight: 800, mb: 0.5 }}>
                        {doctor.name} {doctor.lastName}
                      </Typography>
                      <Chip
                        label="Pendiente"
                        size="small"
                        sx={{
                          backgroundColor: '#fff7ed',
                          border: '2px solid #f59e0b',
                          color: '#d97706',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                        }}
                      />
                    </Box>
                  </Stack>

                  {/* Info */}
                  <Stack spacing={1.5} sx={{ mb: 3 }}>
                    {doctor.cssp?.profession && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <LocalHospital sx={{ fontSize: 18, color: '#0ea5e9' }} />
                        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                          {doctor.cssp.profession}
                        </Typography>
                      </Box>
                    )}

                    {doctor.email && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Email sx={{ fontSize: 18, color: '#0ea5e9' }} />
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#64748b',
                            fontWeight: 600,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {doctor.email}
                        </Typography>
                      </Box>
                    )}

                    {doctor.phone && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Phone sx={{ fontSize: 18, color: '#0ea5e9' }} />
                        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                          {doctor.phone}
                        </Typography>
                      </Box>
                    )}

                    {doctor.address && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <LocationOn sx={{ fontSize: 18, color: '#0ea5e9' }} />
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#64748b', fontWeight: 600,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {doctor.address}
                        </Typography>
                      </Box>
                    )}
                  </Stack>

                  {/* Actions */}
                  <Stack spacing={1.5}>
                    <Button
                      variant="outlined"
                      size="small"
                      fullWidth
                      startIcon={<OpenInNew />}
                      onClick={() => navigate(`/doctor/${doctor.id}`)}
                      sx={{
                        borderColor: '#0ea5e9',
                        color: '#0ea5e9',
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          borderColor: '#0369a1',
                          backgroundColor: 'rgba(14, 165, 233, 0.1)',
                        },
                      }}
                    >
                      Ver Detalles
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      fullWidth
                      startIcon={<Verified />}
                      onClick={() => verifyDoctor(doctor.id)}
                      sx={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        textTransform: 'none',
                        fontWeight: 700,
                        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                        '&:hover': {
                          boxShadow: '0 6px 20px rgba(16, 185, 129, 0.5)',
                        },
                      }}
                    >
                      Verificar
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

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
              backgroundColor: snackbar.severity === 'success' ? '#1e293b' : '#1e293b',
              color: '#0f172a',
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

export default DoctorsPending;
