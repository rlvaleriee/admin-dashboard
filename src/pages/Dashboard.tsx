import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Avatar,
  Stack,
  Chip,
} from '@mui/material';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebaseClient';
import { NavBar } from '../components/NavBar';
import { useNavigate } from 'react-router-dom';
import {
  People,
  LocalHospital,
  Verified,
  Pending,
  TrendingUp,
  CheckCircle,
  ArrowForward,
} from '@mui/icons-material';

interface Stats {
  totalUsers: number;
  totalDoctors: number;
  verifiedDoctors: number;
  pendingDoctors: number;
}

export const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalDoctors: 0,
    verifiedDoctors: 0,
    pendingDoctors: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const totalUsers = usersSnapshot.size;

        const doctorsQuery = query(collection(db, 'users'), where('role', '==', 'doctor'));
        const doctorsSnapshot = await getDocs(doctorsQuery);
        const totalDoctors = doctorsSnapshot.size;

        const verifiedQuery = query(
          collection(db, 'users'),
          where('role', '==', 'doctor'),
          where('verified', '==', true)
        );
        const verifiedSnapshot = await getDocs(verifiedQuery);
        const verifiedDoctors = verifiedSnapshot.size;

        const pendingQuery = query(
          collection(db, 'users'),
          where('role', '==', 'doctor'),
          where('verified', '==', false)
        );

        const unsubscribe = onSnapshot(pendingQuery, (snapshot) => {
          const pendingDoctors = snapshot.size;
          setStats({
            totalUsers,
            totalDoctors,
            verifiedDoctors,
            pendingDoctors,
          });
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Usuarios',
      value: stats.totalUsers,
      icon: <People sx={{ fontSize: 35 }} />,
      color: '#0ea5e9',
      gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
      change: '+12%',
    },
    {
      title: 'Total Médicos',
      value: stats.totalDoctors,
      icon: <LocalHospital sx={{ fontSize: 35 }} />,
      color: '#14b8a6',
      gradient: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
      change: '+8%',
    },
    {
      title: 'Médicos Verificados',
      value: stats.verifiedDoctors,
      icon: <Verified sx={{ fontSize: 35 }} />,
      color: '#22c55e',
      gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
      change: '+15%',
    },
    {
      title: 'Médicos Pendientes',
      value: stats.pendingDoctors,
      icon: <Pending sx={{ fontSize: 35 }} />,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      change: '-3%',
    },
  ];

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
            Panel de Administración
          </Typography>
          <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 500 }}>
            Resumen general del sistema MediConnect
          </Typography>
        </Box>

        {/* Stats Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: 3,
            mb: 6,
          }}
        >
          {statCards.map((card, index) => (
            <Card
              key={index}
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
                  borderColor: card.color,
                  boxShadow: `0 20px 60px ${card.color}30`,
                  '& .stat-icon': {
                    transform: 'scale(1.1) rotate(-5deg)',
                  },
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '120px',
                  height: '120px',
                  background: `radial-gradient(circle, ${card.color}15 0%, transparent 70%)`,
                  borderRadius: '50%',
                  transform: 'translate(40%, -40%)',
                },
              }}
            >
              <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 2, fontWeight: 700 }}>
                      {card.title}
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        color: '#0f172a',
                        fontWeight: 900,
                        mb: 1,
                        fontSize: '2.5rem',
                      }}
                    >
                      {card.value}
                    </Typography>
                    <Chip
                      icon={<TrendingUp sx={{ fontSize: 16, color: '#22c55e !important' }} />}
                      label={card.change}
                      size="small"
                      sx={{
                        backgroundColor: '#dcfce7',
                        border: '1px solid #22c55e',
                        color: '#16a34a',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                      }}
                    />
                  </Box>
                  <Avatar
                    className="stat-icon"
                    sx={{
                      width: 60,
                      height: 60,
                      background: card.gradient,
                      boxShadow: `0 8px 24px ${card.color}40`,
                      transition: 'all 0.3s ease',
                      border: '3px solid white',
                    }}
                  >
                    {card.icon}
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Info Cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 3,
          }}
        >
          {/* Quick Actions */}
          <Card
            sx={{
              backgroundColor: 'white',
              border: '2px solid #e0f2fe',
              borderRadius: 4,
              p: 4,
              boxShadow: '0 4px 20px rgba(14, 165, 233, 0.08)',
            }}
          >
            <Typography variant="h5" sx={{ color: '#0f172a', fontWeight: 900, mb: 3 }}>
              Acciones Rápidas
            </Typography>
            <Stack spacing={2.5}>
              {[
                { text: 'Revisar médicos pendientes de verificación', icon: <Pending />, path: '/doctors-pending', color: '#f59e0b' },
                { text: 'Gestionar usuarios del sistema', icon: <People />, path: '/users', color: '#0ea5e9' },
                { text: 'Ver perfiles de médicos verificados', icon: <CheckCircle />, path: '/users', color: '#22c55e' },
              ].map((action, index) => (
                <Box
                  key={index}
                  onClick={() => navigate(action.path)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    p: 2.5,
                    borderRadius: 3,
                    backgroundColor: 'white',
                    border: '2px solid #e0f2fe',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(14, 165, 233, 0.08)',
                    '&:hover': {
                      backgroundColor: '#f0f9ff',
                      borderColor: action.color,
                      transform: 'translateX(8px)',
                      boxShadow: `0 8px 24px ${action.color}20`,
                      '& .action-arrow': {
                        transform: 'translateX(4px)',
                        color: action.color,
                      },
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      sx={{
                        width: 42,
                        height: 42,
                        backgroundColor: `${action.color}15`,
                        color: action.color,
                      }}
                    >
                      {action.icon}
                    </Avatar>
                    <Typography variant="body2" sx={{ color: '#0f172a', fontWeight: 700 }}>
                      {action.text}
                    </Typography>
                  </Box>
                  <ArrowForward
                    className="action-arrow"
                    sx={{
                      color: '#94a3b8',
                      transition: 'all 0.3s ease',
                      fontSize: 20,
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </Card>

          {/* System Status */}
          <Card
            sx={{
              backgroundColor: 'white',
              border: '2px solid #e0f2fe',
              borderRadius: 4,
              p: 4,
              boxShadow: '0 4px 20px rgba(14, 165, 233, 0.08)',
            }}
          >
            <Typography variant="h5" sx={{ color: '#0f172a', fontWeight: 900, mb: 3 }}>
              Estado del Sistema
            </Typography>
            <Stack spacing={3}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 700 }}>
                    Tasa de Verificación
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#0f172a', fontWeight: 900 }}>
                    {stats.totalDoctors > 0
                      ? Math.round((stats.verifiedDoctors / stats.totalDoctors) * 100)
                      : 0}
                    %
                  </Typography>
                </Box>
                <Box
                  sx={{
                    height: 10,
                    backgroundColor: '#e0f2fe',
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      width: `${
                        stats.totalDoctors > 0
                          ? (stats.verifiedDoctors / stats.totalDoctors) * 100
                          : 0
                      }%`,
                      background: 'linear-gradient(90deg, #0ea5e9 0%, #14b8a6 100%)',
                      borderRadius: 2,
                    }}
                  />
                </Box>
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 700 }}>
                    Médicos / Total Usuarios
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#0f172a', fontWeight: 900 }}>
                    {stats.totalUsers > 0
                      ? Math.round((stats.totalDoctors / stats.totalUsers) * 100)
                      : 0}
                    %
                  </Typography>
                </Box>
                <Box
                  sx={{
                    height: 10,
                    backgroundColor: '#e0f2fe',
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      width: `${
                        stats.totalUsers > 0 ? (stats.totalDoctors / stats.totalUsers) * 100 : 0
                      }%`,
                      background: 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)',
                      borderRadius: 2,
                    }}
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  mt: 2,
                  p: 2.5,
                  borderRadius: 3,
                  background: '#dcfce7',
                  border: '2px solid #22c55e',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <CheckCircle sx={{ color: '#22c55e', fontSize: 28 }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: '#16a34a', fontWeight: 800 }}>
                      Sistema Operativo
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#4d7c0f', fontWeight: 600 }}>
                      Todos los servicios funcionando correctamente
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};
