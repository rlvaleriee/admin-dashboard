# Panel de Administración - Sistema de Citas Médicas

Panel administrativo moderno para gestionar usuarios y verificar perfiles de doctores en el sistema de citas médicas.

## 🚀 Características Implementadas

### ✅ Autenticación y Seguridad
- Sistema de login con Firebase Authentication
- Protección de rutas basada en roles (solo administradores)
- Hook personalizado `useAuth` para gestionar estado de autenticación
- Manejo de sesiones persistentes

### 📊 Dashboard Principal
- Estadísticas en tiempo real:
  - Total de usuarios en el sistema
  - Total de médicos registrados
  - Médicos verificados
  - Médicos pendientes de verificación
- Tarjetas estadísticas con iconos visuales
- Actualización automática con Firestore onSnapshot
- Métricas de tasa de verificación

### 👨‍⚕️ Gestión de Médicos Pendientes
- Vista de tarjetas con información de médicos no verificados
- Visualización de:
  - Nombre del médico
  - Especialidad
  - Número de licencia
  - Email de contacto
- Acciones disponibles:
  - Verificar médico (actualiza estado a verificado)
  - Rechazar solicitud
  - Ver detalles completos en modal
- Notificaciones de éxito/error con Snackbar
- Actualización en tiempo real de la lista

### 👥 Gestión de Usuarios
- Tabla completa con todos los usuarios del sistema
- Filtros:
  - Búsqueda por nombre o email
  - Filtro por rol (admin, doctor, paciente)
- Paginación configurable (5, 10, 25, 50 filas)
- Acciones por usuario:
  - Ver detalles
  - Verificar/desverificar (para doctores)
  - Editar información
  - Eliminar usuario
- Chips de estado visual (verificado/pendiente)
- Confirmaciones antes de acciones destructivas

### 🎨 Interfaz de Usuario
- Diseño responsivo con Material-UI v7
- Navegación superior (NavBar) con:
  - Logo del panel
  - Links a secciones principales
  - Menú hamburguesa para móviles
  - Información del usuario logueado
  - Botón de logout
- Tema personalizado con colores consistentes
- Animaciones y transiciones suaves
- Estados de carga con spinners

## 🛠️ Tecnologías Utilizadas

- **React 19.1.1** - Biblioteca de UI
- **TypeScript 5.9.3** - Tipado estático
- **Vite 7.1.7** - Build tool y dev server
- **Material-UI 7.3.4** - Componentes de interfaz
- **Firebase 12.5.0** - Backend y autenticación
- **React Router DOM 6.30.1** - Navegación
- **React Hook Form 7.65.0** - Manejo de formularios

## 📁 Estructura del Proyecto

```
admin-dashboard/
├── src/
│   ├── components/
│   │   ├── NavBar.tsx           # Barra de navegación
│   │   └── ProtectedRoute.tsx   # HOC para proteger rutas
│   ├── hooks/
│   │   └── useAuth.ts           # Hook personalizado de autenticación
│   ├── pages/
│   │   ├── Dashboard.tsx        # Panel principal con estadísticas
│   │   ├── DoctorsPending.tsx   # Gestión de médicos pendientes
│   │   ├── Login.tsx            # Página de inicio de sesión
│   │   └── Users.tsx            # Gestión de usuarios
│   ├── firebase/
│   │   └── firebaseClient.ts    # Configuración de Firebase
│   ├── App.tsx                  # Configuración de rutas
│   └── main.tsx                 # Punto de entrada
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🗄️ Estructura de Firestore

### Colección: `users`

```typescript
{
  id: string;              // ID del documento (UID de Firebase Auth)
  name: string;            // Nombre completo
  email: string;           // Correo electrónico
  role: string;            // "admin" | "doctor" | "patient"
  verified?: boolean;      // Estado de verificación (para doctores)
  specialty?: string;      // Especialidad médica (para doctores)
  licenseNumber?: string;  // Número de licencia (para doctores)
  phone?: string;          // Teléfono de contacto (opcional)
  createdAt?: Timestamp;   // Fecha de creación (opcional)
}
```

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 18+ instalado
- Cuenta de Firebase configurada

### Pasos de instalación

1. Clonar el repositorio:
```bash
cd admin-dashboard
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar Firebase:
   - Crear proyecto en Firebase Console
   - Habilitar Authentication (Email/Password)
   - Crear base de datos Firestore
   - Copiar credenciales en `src/firebase/firebaseClient.ts`

4. Ejecutar en desarrollo:
```bash
npm run dev
```

5. Compilar para producción:
```bash
npm run build
```

## 🔐 Roles y Permisos

### Administrador (admin)
- Acceso completo al panel
- Ver todas las estadísticas
- Gestionar todos los usuarios
- Verificar/rechazar médicos
- Eliminar usuarios

### Doctor (doctor)
- No tiene acceso al panel administrativo
- Perfil sujeto a verificación

### Paciente (patient)
- No tiene acceso al panel administrativo

## 📱 Rutas Disponibles

| Ruta | Descripción | Protegida |
|------|-------------|-----------|
| `/login` | Página de inicio de sesión | No |
| `/dashboard` | Panel principal con estadísticas | Sí |
| `/doctors-pending` | Lista de médicos pendientes | Sí |
| `/users` | Gestión completa de usuarios | Sí |
| `/` | Redirecciona a `/dashboard` | Sí |

## 🎯 Funcionalidades Adicionales Sugeridas

Para futuras mejoras, considera implementar:

1. **Exportación de datos** - Exportar listas a CSV/Excel
2. **Filtros avanzados** - Filtros por fecha, estado, etc.
3. **Historial de cambios** - Auditoría de acciones
4. **Notificaciones push** - Alertas en tiempo real
5. **Reportes avanzados** - Gráficos y análisis
6. **Gestión de citas** - Ver y gestionar citas desde el admin
7. **Chat interno** - Comunicación con médicos
8. **Configuración del sistema** - Panel de ajustes

## 🐛 Solución de Problemas

### Error: "Cannot find module '@mui/material/Grid2'"
- Este proyecto usa MUI v7 con la nueva API de Grid
- Usar `<Grid size={{ xs: 12 }}>` en lugar de `<Grid item xs={12}>`

### Error: "auth/invalid-credential"
- Verificar que el usuario existe en Firebase Authentication
- Verificar que tiene el rol "admin" en Firestore

### Error: TypeScript "Cannot find namespace 'JSX'"
- Usar `import type { ReactElement } from 'react'`
- Usar `ReactElement` en lugar de `JSX.Element`

## 📝 Notas de Desarrollo

- El proyecto usa la nueva API de MUI Grid (v7) sin la prop `item`
- TypeScript está configurado con `verbatimModuleSyntax` habilitado
- Los imports de tipos deben usar `import type`
- Todas las páginas principales incluyen NavBar integrado
- Los estados de carga son consistentes en toda la app

## 👥 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es parte de un sistema académico para USO - Desarrollo de aplicaciones para dispositivos móviles.

## 🎓 Créditos

Desarrollado para la materia de Desarrollo de Aplicaciones para Dispositivos Móviles - USO
