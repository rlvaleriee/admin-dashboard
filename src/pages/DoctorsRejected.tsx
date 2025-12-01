import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Avatar,
  Stack,
  IconButton,
} from '@mui/material';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseClient';
import { NavBar } from '../components/NavBar';
import {
  Verified,
  Person,
  LocalHospital,
  Close,
  Email,
  Phone,
  LocationOn,
  Delete,
  Refresh,
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

export const DoctorsRejected = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    const q = query(
      collection(db, 'users'),
      where('role', '==', 'doctor'),
      where('rejected', '==', true)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const doctorsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Doctor[];
        setDoctors(doctorsList);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching rejected doctors:', error);
        setSnackbar({ open: true, message: 'Error al cargar médicos rechazados', severity: 'error' });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleOpenDialog = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDoctor(null);
  };

  const verifyDoctor = async (id: string) => {
    try {
      await updateDoc(doc(db, 'users', id), { verified: true, rejected: false });
      setSnackbar({ open: true, message: 'Médico verificado exitosamente', severity: 'success' });
      handleCloseDialog();
    } catch (error) {
      console.error('Error verifying doctor:', error);
      setSnackbar({ open: true, message: 'Error al verificar médico', severity: 'error' });
    }
  };

  const reevaluateDoctor = async (id: string) => {
    try {
      await updateDoc(doc(db, 'users', id), { rejected: false });
      setSnackbar({ open: true, message: 'Médico enviado a pendientes para reevaluación', severity: 'success' });
      handleCloseDialog();
    } catch (error) {
      console.error('Error reevaluating doctor:', error);
      setSnackbar({ open: true, message: 'Error al reevaluar médico', severity: 'error' });
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
            Médicos Rechazados
          </Typography>
          <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
            Revisa y reevalúa los perfiles de médicos rechazados
            <Chip
              label={`${doctors.length} Rechazado${doctors.length !== 1 ? 's' : ''}`}
              size="small"
              sx={{
                backgroundColor: '#fef2f2',
                border: '2px solid #ef4444',
                color: '#dc2626',
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
            <Delete sx={{ fontSize: 60, color: '#94a3b8', mb: 2 }} />
            <Typography variant="h5" sx={{ color: '#0f172a', fontWeight: 900, mb: 1 }}>
              Sin rechazados
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
              No hay médicos rechazados en el sistema
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
                  border: '2px solid #fecaca',
                  borderRadius: 4,
                  p: 3,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 20px rgba(239, 68, 68, 0.08)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    borderColor: '#ef4444',
                    boxShadow: '0 20px 60px rgba(239, 68, 68, 0.25)',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '120px',
                    height: '120px',
                    background: 'radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, transparent 70%)',
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
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        boxShadow: '0 8px 24px rgba(239, 68, 68, 0.4)',
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
                        label="Rechazado"
                        size="small"
                        sx={{
                          backgroundColor: '#fef2f2',
                          border: '2px solid #ef4444',
                          color: '#dc2626',
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
                        <LocalHospital sx={{ fontSize: 18, color: '#ef4444' }} />
                        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                          {doctor.cssp.profession}
                        </Typography>
                      </Box>
                    )}

                    {doctor.email && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Email sx={{ fontSize: 18, color: '#ef4444' }} />
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
                        <Phone sx={{ fontSize: 18, color: '#ef4444' }} />
                        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                          {doctor.phone}
                        </Typography>
                      </Box>
                    )}

                    {doctor.address && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <LocationOn sx={{ fontSize: 18, color: '#ef4444' }} />
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
                  <Stack direction="row" spacing={1.5}>
                    <Button
                      variant="outlined"
                      size="small"
                      fullWidth
                      onClick={() => handleOpenDialog(doctor)}
                      sx={{
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        color: '#0f172a',
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          borderColor: '#0ea5e9',
                          backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        },
                      }}
                    >
                      Ver Detalles
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      fullWidth
                      startIcon={<Refresh />}
                      onClick={() => reevaluateDoctor(doctor.id)}
                      sx={{
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        textTransform: 'none',
                        fontWeight: 700,
                        boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)',
                        '&:hover': {
                          boxShadow: '0 6px 20px rgba(245, 158, 11, 0.5)',
                        },
                      }}
                    >
                      Reevaluar
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {/* Dialog de detalles */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="xl"
          fullWidth
          slotProps={{
            paper: {
              sx: {
                backgroundColor: 'white',
                backgroundImage: 'none',
                borderRadius: 4,
                border: '3px solid #fecaca',
                boxShadow: '0 25px 80px rgba(239, 68, 68, 0.15)',
                minHeight: '80vh',
              },
            },
          }}
        >
          <DialogTitle
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#0f172a',
              pb: 2,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Detalles del Médico Rechazado
            </Typography>
            <IconButton
              onClick={handleCloseDialog}
              sx={{
                color: '#64748b',
                '&:hover': {
                  backgroundColor: '#fef2f2',
                },
              }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ borderColor: '#fecaca', p: 0 }}>
            {selectedDoctor && (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '350px 1fr' },
                  minHeight: '70vh',
                }}
              >
                {/* Left Column - Doctor Info */}
                <Box
                  sx={{
                    p: 3,
                    borderRight: { md: '2px solid #fecaca' },
                    borderBottom: { xs: '2px solid #fecaca', md: 'none' },
                    overflowY: 'auto',
                  }}
                >
                  <Stack spacing={3}>
                    {/* Personal Info */}
                    <Box>
                      <Typography variant="h6" sx={{ color: '#ef4444', fontWeight: 700, mb: 2 }}>
                        Información Personal
                      </Typography>
                      <Stack spacing={1.5}>
                        <Box>
                          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                            Nombre Completo
                          </Typography>
                          <Typography variant="body1" sx={{ color: '#0f172a', fontWeight: 600 }}>
                            {selectedDoctor.name} {selectedDoctor.lastName}
                          </Typography>
                        </Box>
                        {selectedDoctor.email && (
                          <Box>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                              Email
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#0f172a', fontWeight: 600, wordBreak: 'break-all' }}>
                              {selectedDoctor.email}
                            </Typography>
                          </Box>
                        )}
                        {selectedDoctor.phone && (
                          <Box>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                              Teléfono
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#0f172a', fontWeight: 600 }}>
                              {selectedDoctor.phone}
                            </Typography>
                          </Box>
                        )}
                        {selectedDoctor.address && (
                          <Box>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                              Dirección
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#0f172a', fontWeight: 600 }}>
                              {selectedDoctor.address}
                            </Typography>
                          </Box>
                        )}
                        {selectedDoctor.clinicAddress && (
                          <Box>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                              Dirección de Clínica
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#0f172a', fontWeight: 600 }}>
                              {selectedDoctor.clinicAddress}
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    </Box>

                    {/* Professional Info */}
                    {selectedDoctor.cssp && (
                      <Box>
                        <Typography variant="h6" sx={{ color: '#10b981', fontWeight: 700, mb: 2 }}>
                          Información Profesional
                        </Typography>
                        <Stack spacing={1.5}>
                          <Box>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                              Profesión
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#0f172a', fontWeight: 600 }}>
                              {selectedDoctor.cssp.profession}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                              Junta
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#0f172a', fontWeight: 600 }}>
                              {selectedDoctor.cssp.board}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                              Número de Junta
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#0f172a', fontWeight: 600 }}>
                              {selectedDoctor.cssp.boardNumber}
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
                      p: 2,
                      borderBottom: '2px solid #fecaca',
                      backgroundColor: '#fef2f2',
                    }}
                  >
                    <Typography variant="h6" sx={{ color: '#f59e0b', fontWeight: 700 }}>
                      Verificación CSSP
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      Busca con el número de junta: <strong>{selectedDoctor.cssp?.boardNumber}</strong>
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1, minHeight: 0 }}>
                    <iframe
                      src="https://www.cssp.gob.sv/profesionales/faces/consulta/buscar.xhtml"
                      width="100%"
                      height="100%"
                      style={{ border: 'none', minHeight: '500px' }}
                      title="Verificación CSSP"
                    />
                  </Box>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button
              onClick={() => selectedDoctor && reevaluateDoctor(selectedDoctor.id)}
              startIcon={<Refresh />}
              sx={{
                color: '#0f172a',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                '&:hover': {
                  backgroundColor: 'rgba(245, 158, 11, 0.25)',
                },
              }}
            >
              Enviar a Pendientes
            </Button>
            <Button
              onClick={() => selectedDoctor && verifyDoctor(selectedDoctor.id)}
              variant="contained"
              startIcon={<Verified />}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                px: 4,
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(16, 185, 129, 0.5)',
                },
              }}
            >
              Verificar
            </Button>
          </DialogActions>
        </Dialog>

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

export default DoctorsRejected;
