# Sistema de Roles - CecyteChef

## Descripción

Se ha implementado un sistema de roles que permite mostrar diferentes vistas según el tipo de usuario que inicie sesión:

- **Administrador**: Ve el dashboard completo con todas las funcionalidades de administración
- **Usuario**: Ve un dashboard simplificado con funcionalidades limitadas

## Estructura del Sistema

### 1. Contexto de Autenticación (`src/contexts/AuthContext.jsx`)
- Maneja el estado global de autenticación
- Proporciona funciones para login, logout y verificación de roles
- Incluye funciones `isAdmin()` e `isUser()` para verificar roles

### 2. Componentes de Dashboard

#### Dashboard de Administrador (`src/components/Dashboard.jsx`)
- Vista completa con todas las funcionalidades
- Acceso a gestión de usuarios, buzón de asistencia, eventos, etc.
- Renombrado a `AdminDashboard` para mayor claridad

#### Dashboard de Usuario (`src/components/UserDashboard.jsx`)
- Vista simplificada para usuarios regulares
- Acceso limitado a información general
- Enfoque en consulta de datos, no en administración

### 3. Enrutamiento Basado en Roles (`src/components/RoleBasedRoute.jsx`)
- Determina qué dashboard mostrar según el rol del usuario
- Redirige automáticamente al dashboard apropiado

### 4. Rutas Protegidas (`src/components/ProtectedRoute.jsx`)
- Actualizado para usar el contexto de autenticación
- Verifica autenticación antes de mostrar contenido

## Cómo Funciona

1. **Login**: El usuario inicia sesión con sus credenciales
2. **Verificación de Rol**: El sistema verifica el rol del usuario desde los datos guardados
3. **Redirección**: Se muestra el dashboard apropiado según el rol:
   - `role: 'admin'` o `role: 'administrador'` → Dashboard de Administrador
   - `role: 'usuario'` → Dashboard de Usuario
   - Otros roles → Mensaje de error

## Estructura de Datos del Usuario

El sistema espera que el usuario tenga la siguiente estructura:

```javascript
{
  id: 1,
  name: "Nombre del Usuario",
  email: "usuario@example.com",
  role: "admin" | "administrador" | "usuario",
  email_verified_at: "2024-01-01T00:00:00.000Z",
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z"
}
```

## Funcionalidades por Rol

### Administrador
- ✅ Gestión completa de usuarios
- ✅ Buzón de asistencia
- ✅ Gestión de eventos
- ✅ Gestión de comités
- ✅ Gestión de equipos
- ✅ Gestión de participantes
- ✅ Gestión de restaurantes
- ✅ Gestión de hospedajes
- ✅ Gestión de lugares de interés
- ✅ Estadísticas completas

### Usuario Regular
- ✅ Ver información general del evento
- ✅ Consultar equipos (solo lectura)
- ✅ Consultar participantes (solo lectura)
- ✅ Ver restaurantes (solo lectura)
- ✅ Ver hospedajes (solo lectura)
- ✅ Ver lugares de interés (solo lectura)
- ✅ Ver su perfil personal
- ❌ Sin acceso a funciones de administración

## Pruebas del Sistema

Se incluye un archivo de utilidades para probar el sistema (`src/utils/testRoles.js`):

### En la Consola del Navegador:

```javascript
// Crear usuario administrador
testRoles.simulateLogin("admin")

// Crear usuario regular
testRoles.simulateLogin("usuario")

// Limpiar datos de prueba
testRoles.clearTestData()

// Ejecutar prueba completa
testRoles.testRoleSystem()
```

## Instalación y Uso

1. El sistema ya está integrado en la aplicación
2. No requiere configuración adicional
3. Los roles se determinan automáticamente desde los datos del usuario
4. El sistema es completamente transparente para el usuario final

## Personalización

Para agregar nuevos roles o modificar las funcionalidades:

1. **Nuevo Rol**: Agregar verificación en `AuthContext.jsx` y `RoleBasedRoute.jsx`
2. **Nuevo Dashboard**: Crear componente y agregarlo a `RoleBasedRoute.jsx`
3. **Modificar Funcionalidades**: Editar los componentes de dashboard correspondientes

## Notas Importantes

- El sistema es completamente funcional y no muestra nada hasta que se determine el rol
- Los usuarios no autenticados son redirigidos al login
- Los usuarios con roles no reconocidos ven un mensaje de error
- El sistema es robusto y maneja errores graciosamente
