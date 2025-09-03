# Configuración de Variables de Entorno para CecyteChef

## Descripción
Este proyecto utiliza variables de entorno para manejar la configuración de la API y otros servicios de manera segura y flexible.

## Configuración Inicial

### 1. Crear archivo .env
En la raíz del proyecto, crea un archivo llamado `.env` con el siguiente contenido:

```bash
# URL base de la API
VITE_API_BASE_URL=http://127.0.0.1:8000/api

# Nombre de la aplicación
VITE_APP_NAME=CecyteChef

# Versión de la aplicación
VITE_APP_VERSION=1.0.0
```

### 2. Variables de Entorno Disponibles

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `VITE_API_BASE_URL` | URL base de la API | `http://127.0.0.1:8000/api` |
| `VITE_APP_NAME` | Nombre de la aplicación | `CecyteChef` |
| `VITE_APP_VERSION` | Versión de la aplicación | `1.0.0` |

## Estructura de Archivos

```
src/
├── config/
│   └── env.js          # Configuración de variables de entorno
├── services/
│   ├── apiService.js   # Servicio principal de API
│   └── authService.js  # Servicio de autenticación
└── Login.jsx           # Componente actualizado
```

## Uso en el Código

### Importar configuración
```javascript
import { API_CONFIG, buildApiUrl, getAuthHeaders } from '../config/env.js'
```

### Usar URL base
```javascript
const apiUrl = API_CONFIG.BASE_URL
// Resultado: http://127.0.0.1:8000/api
```

### Construir URLs completas
```javascript
import { buildApiUrl } from '../config/env.js'

const loginUrl = buildApiUrl('/login')
// Resultado: http://127.0.0.1:8000/api/login
```

### Obtener headers de autenticación
```javascript
import { getAuthHeaders } from '../config/env.js'

const headers = getAuthHeaders('mi-token-jwt')
// Incluye: Content-Type, Accept, Authorization: Bearer mi-token-jwt
```

## Servicios Disponibles

### ApiService
Servicio principal para hacer peticiones HTTP:

```javascript
import apiService from './services/apiService.js'

// GET request
const data = await apiService.get('/users')

// POST request
const response = await apiService.post('/login', {
  email: 'user@example.com',
  password: 'password123'
})

// Con token de autenticación
const profile = await apiService.get('/user/profile', 'mi-token-jwt')
```

### AuthService
Servicio específico para autenticación:

```javascript
import authService from './services/authService.js'

// Login
const response = await authService.login({
  email: 'user@example.com',
  password: 'password123'
})

// Verificar autenticación
if (authService.isAuthenticated()) {
  // Usuario está logueado
}

// Obtener token
const token = authService.getToken()

// Logout
await authService.logout()
```

## Configuración para Diferentes Entornos

### Desarrollo Local
```bash
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

### Producción
```bash
VITE_API_BASE_URL=https://tu-dominio.com/api
```

### Staging
```bash
VITE_API_BASE_URL=https://staging.tu-dominio.com/api
```

## Seguridad

- **NUNCA** commits el archivo `.env` al repositorio
- El archivo `.env.example` sirve como plantilla
- Las variables que empiezan con `VITE_` son visibles en el cliente
- Para variables sensibles del servidor, usar variables que NO empiecen con `VITE_`

## Troubleshooting

### Las variables no se cargan
1. Verifica que el archivo `.env` esté en la raíz del proyecto
2. Reinicia el servidor de desarrollo
3. Verifica que las variables empiecen con `VITE_`

### Error de CORS
1. Verifica que la URL de la API sea correcta
2. El proxy en `vite.config.js` puede ayudar en desarrollo
3. Asegúrate de que el backend permita peticiones desde tu dominio

### Problemas de autenticación
1. Verifica que el token se esté enviando correctamente
2. Revisa los headers de la petición
3. Verifica que el backend esté funcionando

## Comandos Útiles

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de producción
npm run preview
```
