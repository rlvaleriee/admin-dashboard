import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Snackbar,
  Card,
  Stack,
  Avatar,
} from '@mui/material';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import type { SelectChangeEvent } from '@mui/material/Select';
import { db } from '../firebase/firebaseClient';
import { NavBar } from '../components/NavBar';
import {
  Search,
  Edit,
  Delete,
  Verified,
  Block,
  Close,
  AdminPanelSettings,
  LocalHospital,
  Person,
  CheckCircle,
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

interface User {
  id: string;
  name: string;
  lastName?: string;
  email: string;
  phone?: string;
  address?: string;
  clinicAddress?: string;
  role: string;
  verified?: boolean;
  cssp?: CSSPData;
  location?: LocationData;
  reviewStatus?: string;
  createdAt?: any;
}

export const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'edit' | 'delete'>('edit');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        const usersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[];
        setUsers(usersList);
        setFilteredUsers(usersList);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching users:', error);
        setSnackbar({ open: true, message: 'Error al cargar usuarios', severity: 'error' });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let result = users;

    if (searchTerm) {
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== 'all') {
      result = result.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(result);
    setPage(0);
  }, [searchTerm, roleFilter, users]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRoleFilterChange = (event: SelectChangeEvent) => {
    setRoleFilter(event.target.value);
  };

  const handleOpenDialog = (user: User, type: 'edit' | 'delete') => {
    setSelectedUser(user);
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleToggleVerified = async (userId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'users', userId), { verified: !currentStatus });
      setSnackbar({
        open: true,
        message: `Usuario ${!currentStatus ? 'verificado' : 'desverificado'} exitosamente`,
        severity: 'success',
      });
    } catch (error) {
      console.error('Error updating user:', error);
      setSnackbar({ open: true, message: 'Error al actualizar usuario', severity: 'error' });
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await deleteDoc(doc(db, 'users', selectedUser.id));
      setSnackbar({ open: true, message: 'Usuario eliminado exitosamente', severity: 'success' });
      handleCloseDialog();
    } catch (error) {
      console.error('Error deleting user:', error);
      setSnackbar({ open: true, message: 'Error al eliminar usuario', severity: 'error' });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return { bg: '#fee2e2', border: '#ef4444', text: '#dc2626' };
      case 'doctor':
        return { bg: '#dbeafe', border: '#0ea5e9', text: '#0369a1' };
      default:
        return { bg: '#f1f5f9', border: '#94a3b8', text: '#475569' };
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <AdminPanelSettings sx={{ fontSize: 18 }} />;
      case 'doctor':
        return <LocalHospital sx={{ fontSize: 18 }} />;
      default:
        return <Person sx={{ fontSize: 18 }} />;
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
      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              color: '#0f172a',
              fontWeight: 900,
              mb: 1,
              letterSpacing: '-1px',
            }}
          >
            Gestión de Usuarios
          </Typography>
          <Typography variant="h6" sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 1 }}>
            Administra todos los usuarios del sistema
            <Chip
              label={`${filteredUsers.length} Usuario${filteredUsers.length !== 1 ? 's' : ''}`}
              size="small"
              sx={{
                backgroundColor: '#e0f2fe',
                border: '2px solid #0ea5e9',
                color: '#0369a1',
                fontWeight: 800,
              }}
            />
          </Typography>
        </Box>

        {/* Filters */}
        <Card
          sx={{
            backgroundColor: 'white',
            backdropFilter: 'blur(20px)',
            border: '2px solid #e0f2fe',
            borderRadius: 4,
            p: 3,
            mb: 4,
          }}
        >
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                flexGrow: 1,
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
                '& .MuiInputBase-input::placeholder': {
                  color: '#64748b',
                  opacity: 1,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#0ea5e9' }} />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl
              sx={{
                minWidth: 200,
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
            >
              <InputLabel>Filtrar por Rol</InputLabel>
              <Select value={roleFilter} onChange={handleRoleFilterChange} label="Filtrar por Rol">
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="admin">Administrador</MenuItem>
                <MenuItem value="doctor">Doctor</MenuItem>
                <MenuItem value="patient">Paciente</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Card>

        {/* Desktop Table */}
        <Card
          sx={{
            backgroundColor: 'white',
            backdropFilter: 'blur(20px)',
            border: '2px solid #e0f2fe',
            borderRadius: 4,
            overflow: 'hidden',
            display: { xs: 'none', md: 'block' },
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: '#f0f9ff',
                    '& th': {
                      color: '#0f172a',
                      fontWeight: 800,
                      borderBottom: '3px solid #e0f2fe',
                    },
                  }}
                >
                  <TableCell>Nombre</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      align="center"
                      sx={{
                        color: '#64748b',
                        py: 8,
                        borderBottom: 'none',
                      }}
                    >
                      <CheckCircle sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                      <Typography variant="h6">No se encontraron usuarios</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user) => {
                      const roleColors = getRoleColor(user.role);
                      return (
                        <TableRow
                          key={user.id}
                          sx={{
                            '&:hover': {
                              backgroundColor: '#f0f9ff',
                            },
                            '& td': {
                              color: '#0f172a',
                              borderBottom: '1px solid #e0f2fe',
                            },
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar
                                sx={{
                                  width: 36,
                                  height: 36,
                                  background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
                                  fontSize: '0.9rem',
                                }}
                              >
                                {user.name.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ color: '#0f172a', fontWeight: 600 }}>
                                  {user.name} {user.lastName}
                                </Typography>
                                {user.phone && (
                                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                                    {user.phone}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{user.email}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={getRoleIcon(user.role)}
                              label={user.role}
                              size="small"
                              sx={{
                                backgroundColor: roleColors.bg,
                                border: `2px solid ${roleColors.border}`,
                                color: roleColors.text,
                                fontWeight: 700,
                                '& .MuiChip-icon': {
                                  color: roleColors.text,
                                },
                              }}
                            />
                            {user.role === 'doctor' && user.cssp?.profession && (
                              <Typography variant="caption" display="block" sx={{ color: '#64748b', mt: 0.5 }}>
                                {user.cssp.profession}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {user.role === 'doctor' && (
                              <Chip
                                label={user.verified ? 'Verificado' : 'Pendiente'}
                                size="small"
                                icon={user.verified ? <Verified /> : <Block />}
                                sx={{
                                  backgroundColor: user.verified
                                    ? '#dcfce7'
                                    : '#fef3c7',
                                  border: user.verified
                                    ? '2px solid #22c55e'
                                    : '2px solid #f59e0b',
                                  color: user.verified ? '#16a34a' : '#d97706',
                                  fontWeight: 700,
                                  '& .MuiChip-icon': {
                                    color: user.verified ? '#22c55e' : '#f59e0b',
                                  },
                                }}
                              />
                            )}
                          </TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                              {user.role === 'doctor' && (
                                <IconButton
                                  size="small"
                                  onClick={() => handleToggleVerified(user.id, user.verified || false)}
                                  sx={{
                                    color: user.verified ? '#f59e0b' : '#10b981',
                                    '&:hover': {
                                      backgroundColor: user.verified
                                        ? 'rgba(245, 158, 11, 0.1)'
                                        : 'rgba(16, 185, 129, 0.1)',
                                    },
                                  }}
                                  title={user.verified ? 'Desverificar' : 'Verificar'}
                                >
                                  {user.verified ? <Block /> : <Verified />}
                                </IconButton>
                              )}
                              <IconButton
                                size="small"
                                onClick={() => handleOpenDialog(user, 'edit')}
                                sx={{
                                  color: '#0ea5e9',
                                  '&:hover': {
                                    backgroundColor: '#e0f2fe',
                                  },
                                }}
                                title="Ver Detalles"
                              >
                                <Edit />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleOpenDialog(user, 'delete')}
                                sx={{
                                  color: '#ef4444',
                                  '&:hover': {
                                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                  },
                                }}
                                title="Eliminar"
                              >
                                <Delete />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            sx={{
              color: '#64748b',
              borderTop: '2px solid #e0f2fe',
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                color: '#64748b',
                fontWeight: 600,
              },
              '& .MuiTablePagination-select': {
                color: '#0f172a',
                fontWeight: 700,
              },
              '& .MuiTablePagination-actions button': {
                color: '#0ea5e9',
              },
            }}
          />
        </Card>

        {/* Mobile Card Layout */}
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <Stack spacing={2}>
            {filteredUsers.length === 0 ? (
              <Card
                sx={{
                  backgroundColor: 'white',
                  border: '2px solid #e0f2fe',
                  borderRadius: 4,
                  p: 6,
                  textAlign: 'center',
                }}
              >
                <CheckCircle sx={{ fontSize: 48, mb: 2, opacity: 0.5, color: '#64748b' }} />
                <Typography variant="h6" sx={{ color: '#64748b' }}>
                  No se encontraron usuarios
                </Typography>
              </Card>
            ) : (
              filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => {
                  const roleColors = getRoleColor(user.role);
                  return (
                    <Card
                      key={user.id}
                      sx={{
                        backgroundColor: 'white',
                        border: '2px solid #e0f2fe',
                        borderRadius: 4,
                        p: 3,
                        boxShadow: '0 4px 20px rgba(14, 165, 233, 0.08)',
                        '&:active': {
                          transform: 'scale(0.98)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Stack spacing={2}>
                        {/* User Header */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            sx={{
                              width: 48,
                              height: 48,
                              background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
                              fontSize: '1.2rem',
                              fontWeight: 700,
                            }}
                          >
                            {user.name.charAt(0)}
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body1" sx={{ color: '#0f172a', fontWeight: 700 }}>
                              {user.name} {user.lastName}
                            </Typography>
                            {user.phone && (
                              <Typography variant="caption" sx={{ color: '#64748b' }}>
                                {user.phone}
                              </Typography>
                            )}
                          </Box>
                        </Box>

                        {/* Email */}
                        <Box>
                          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                            Email
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#0f172a', fontWeight: 600 }}>
                            {user.email}
                          </Typography>
                        </Box>

                        {/* Role */}
                        <Box>
                          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                            Rol
                          </Typography>
                          <Box sx={{ mt: 0.5 }}>
                            <Chip
                              icon={getRoleIcon(user.role)}
                              label={user.role}
                              size="small"
                              sx={{
                                backgroundColor: roleColors.bg,
                                border: `2px solid ${roleColors.border}`,
                                color: roleColors.text,
                                fontWeight: 700,
                                '& .MuiChip-icon': {
                                  color: roleColors.text,
                                },
                              }}
                            />
                            {user.role === 'doctor' && user.cssp?.profession && (
                              <Typography variant="caption" display="block" sx={{ color: '#64748b', mt: 0.5 }}>
                                {user.cssp.profession}
                              </Typography>
                            )}
                          </Box>
                        </Box>

                        {/* Status - Only for doctors */}
                        {user.role === 'doctor' && (
                          <Box>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                              Estado
                            </Typography>
                            <Box sx={{ mt: 0.5 }}>
                              <Chip
                                label={user.verified ? 'Verificado' : 'Pendiente'}
                                size="small"
                                icon={user.verified ? <Verified /> : <Block />}
                                sx={{
                                  backgroundColor: user.verified ? '#dcfce7' : '#fef3c7',
                                  border: user.verified ? '2px solid #22c55e' : '2px solid #f59e0b',
                                  color: user.verified ? '#16a34a' : '#d97706',
                                  fontWeight: 700,
                                  '& .MuiChip-icon': {
                                    color: user.verified ? '#22c55e' : '#f59e0b',
                                  },
                                }}
                              />
                            </Box>
                          </Box>
                        )}

                        {/* Actions */}
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 1,
                            pt: 1,
                            borderTop: '1px solid #e0f2fe',
                          }}
                        >
                          {user.role === 'doctor' && (
                            <Button
                              fullWidth
                              variant="outlined"
                              size="small"
                              startIcon={user.verified ? <Block /> : <Verified />}
                              onClick={() => handleToggleVerified(user.id, user.verified || false)}
                              sx={{
                                color: user.verified ? '#f59e0b' : '#22c55e',
                                borderColor: user.verified ? '#f59e0b' : '#22c55e',
                                borderWidth: 2,
                                fontWeight: 700,
                                textTransform: 'none',
                                '&:hover': {
                                  borderWidth: 2,
                                  backgroundColor: user.verified ? '#fef3c7' : '#dcfce7',
                                  borderColor: user.verified ? '#f59e0b' : '#22c55e',
                                },
                              }}
                            >
                              {user.verified ? 'Desverificar' : 'Verificar'}
                            </Button>
                          )}
                          <Button
                            fullWidth
                            variant="outlined"
                            size="small"
                            startIcon={<Edit />}
                            onClick={() => handleOpenDialog(user, 'edit')}
                            sx={{
                              color: '#0ea5e9',
                              borderColor: '#0ea5e9',
                              borderWidth: 2,
                              fontWeight: 700,
                              textTransform: 'none',
                              '&:hover': {
                                borderWidth: 2,
                                backgroundColor: '#e0f2fe',
                                borderColor: '#0ea5e9',
                              },
                            }}
                          >
                            Detalles
                          </Button>
                          <Button
                            fullWidth
                            variant="outlined"
                            size="small"
                            startIcon={<Delete />}
                            onClick={() => handleOpenDialog(user, 'delete')}
                            sx={{
                              color: '#ef4444',
                              borderColor: '#ef4444',
                              borderWidth: 2,
                              fontWeight: 700,
                              textTransform: 'none',
                              '&:hover': {
                                borderWidth: 2,
                                backgroundColor: '#fee2e2',
                                borderColor: '#ef4444',
                              },
                            }}
                          >
                            Eliminar
                          </Button>
                        </Box>
                      </Stack>
                    </Card>
                  );
                })
            )}
          </Stack>

          {/* Mobile Pagination */}
          {filteredUsers.length > 0 && (
            <Card
              sx={{
                backgroundColor: 'white',
                border: '2px solid #e0f2fe',
                borderRadius: 4,
                mt: 2,
                p: 2,
              }}
            >
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={filteredUsers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Filas:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                sx={{
                  color: '#64748b',
                  '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                    color: '#64748b',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                  },
                  '& .MuiTablePagination-select': {
                    color: '#0f172a',
                    fontWeight: 700,
                  },
                  '& .MuiTablePagination-actions button': {
                    color: '#0ea5e9',
                  },
                }}
              />
            </Card>
          )}
        </Box>

        {/* Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
          slotProps={{
            paper: {
              sx: {
                backgroundColor: 'white',
                backgroundImage: 'none',
                borderRadius: 4,
                border: '3px solid #e0f2fe',
                boxShadow: '0 25px 80px rgba(14, 165, 233, 0.15)',
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
              {dialogType === 'delete' ? 'Confirmar Eliminación' : 'Detalles del Usuario'}
            </Typography>
            <IconButton
              onClick={handleCloseDialog}
              sx={{
                color: '#64748b',
                '&:hover': {
                  backgroundColor: '#f0f9ff',
                },
              }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ borderColor: '#e0f2fe' }}>
            {selectedUser && (
              <Box>
                {dialogType === 'delete' ? (
                  <Alert
                    severity="warning"
                    sx={{
                      backgroundColor: '#fef3c7',
                      color: '#d97706',
                      border: '2px solid #f59e0b',
                      fontWeight: 600,
                      '& .MuiAlert-icon': {
                        color: '#f59e0b',
                      },
                    }}
                  >
                    ¿Estás seguro de que deseas eliminar al usuario{' '}
                    <strong>{selectedUser.name}</strong>? Esta acción no se puede deshacer.
                  </Alert>
                ) : (
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="h6" sx={{ color: '#0ea5e9', fontWeight: 700, mb: 2 }}>
                        Información Personal
                      </Typography>
                      <Stack spacing={1.5}>
                        <Box>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>
                            Nombre Completo
                          </Typography>
                          <Typography variant="body1" sx={{ color: '#0f172a', fontWeight: 600 }}>
                            {selectedUser.name} {selectedUser.lastName}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>
                            Email
                          </Typography>
                          <Typography variant="body1" sx={{ color: '#0f172a', fontWeight: 600 }}>
                            {selectedUser.email}
                          </Typography>
                        </Box>
                        {selectedUser.phone && (
                          <Box>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                              Teléfono
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#0f172a', fontWeight: 600 }}>
                              {selectedUser.phone}
                            </Typography>
                          </Box>
                        )}
                        {selectedUser.address && (
                          <Box>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                              Dirección
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#0f172a', fontWeight: 600 }}>
                              {selectedUser.address}
                            </Typography>
                          </Box>
                        )}
                        {selectedUser.clinicAddress && (
                          <Box>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                              Dirección de Clínica
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#0f172a', fontWeight: 600 }}>
                              {selectedUser.clinicAddress}
                            </Typography>
                          </Box>
                        )}
                        <Box>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>
                            Rol
                          </Typography>
                          <Typography variant="body1" sx={{ color: '#0f172a', fontWeight: 600 }}>
                            {selectedUser.role}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>

                    {selectedUser.role === 'doctor' && selectedUser.cssp && (
                      <Box>
                        <Typography variant="h6" sx={{ color: '#10b981', fontWeight: 700, mb: 2 }}>
                          Información Profesional
                        </Typography>
                        <Stack spacing={1.5}>
                          <Box>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                              Profesión
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#0f172a', fontWeight: 600 }}>
                              {selectedUser.cssp.profession}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                              Junta
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#0f172a', fontWeight: 600 }}>
                              {selectedUser.cssp.board}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                              Número de Junta
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#0f172a', fontWeight: 600 }}>
                              {selectedUser.cssp.boardNumber}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                              Estado
                            </Typography>
                            <Chip
                              label={selectedUser.verified ? 'Verificado' : 'No Verificado'}
                              size="small"
                              sx={{
                                backgroundColor: selectedUser.verified
                                  ? '#dcfce7'
                                  : '#fee2e2',
                                border: selectedUser.verified
                                  ? '2px solid #22c55e'
                                  : '2px solid #ef4444',
                                color: selectedUser.verified ? '#16a34a' : '#dc2626',
                                fontWeight: 700,
                                mt: 1,
                              }}
                            />
                          </Box>
                        </Stack>
                      </Box>
                    )}
                  </Stack>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button
              onClick={handleCloseDialog}
              sx={{
                color: '#0f172a',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
              }}
            >
              Cancelar
            </Button>
            {dialogType === 'delete' && (
              <Button
                onClick={handleDeleteUser}
                variant="contained"
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 4,
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(239, 68, 68, 0.5)',
                  },
                }}
              >
                Eliminar
              </Button>
            )}
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
              backgroundColor: 'white',
              color: '#0f172a',
              fontWeight: 600,
              border:
                snackbar.severity === 'success'
                  ? '2px solid #22c55e'
                  : '2px solid #ef4444',
              boxShadow: '0 10px 40px rgba(14, 165, 233, 0.15)',
              '& .MuiAlert-icon': {
                color: snackbar.severity === 'success' ? '#22c55e' : '#ef4444',
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

export default Users;
