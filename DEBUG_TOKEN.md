# 🐛 Debug del Token - CecyteChef

## Problema
El token no se está guardando en el localStorage después del login exitoso.

## Solución Implementada

### 1. **Servicio de Autenticación Mejorado**
- ✅ Soporte para múltiples estructuras de respuesta de API
- ✅ Logging detallado en consola
- ✅ Verificación automática del localStorage
- ✅ Métodos de debug integrados

### 2. **Panel de Debug Visual**
- 🐛 Botón de debug en la esquina superior derecha
- 📊 Estado en tiempo real del localStorage
- 🔍 Verificación de autenticación
- 🗑️ Botón para limpiar storage

### 3. **Estructuras de Respuesta Soportadas**
El servicio ahora busca el token en estas estructuras:

```javascript
// Estructura 1: response.token
{ token: "jwt_token_here", user: {...} }

// Estructura 2: response.data.token
{ data: { token: "jwt_token_here", user: {...} } }

// Estructura 3: response.access_token
{ access_token: "jwt_token_here", user: {...} }

// Estructura 4: response.data.access_token
{ data: { access_token: "jwt_token_here", user: {...} } }

// Estructura 5: response.jwt
{ jwt: "jwt_token_here", user: {...} }

// Estructura 6: response.data.jwt
{ data: { jwt: "jwt_token_here", user: {...} } }
```

## 🔍 Cómo Debuggear

### Paso 1: Abrir Consola del Navegador
1. Presiona `F12` o `Ctrl+Shift+I`
2. Ve a la pestaña `Console`

### Paso 2: Intentar Login
1. Llena el formulario de login
2. Haz clic en "Iniciar Sesión"
3. Observa los logs en la consola

### Paso 3: Revisar Logs
Deberías ver algo como:
```
🚀 Iniciando proceso de login...
🔐 Intentando login con credenciales: {email: "tu@email.com"}
📡 Respuesta de la API: {token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."}
✅ Token encontrado en response.token
💾 Token guardado en localStorage
👤 Datos del usuario guardados en localStorage
🔍 Token verificado en localStorage: ✅ Guardado
✅ Login exitoso: {token: "..."}
🔍 Debug del localStorage:
  - authToken: ✅ Presente
  - user: ✅ Presente
🔐 Estado de autenticación: true
```

### Paso 4: Usar Panel de Debug
1. Haz clic en el botón 🐛 **Debug** (esquina superior derecha)
2. Verifica el estado del token y usuario
3. Usa los botones de verificación

## 🚨 Posibles Problemas

### 1. **Estructura de Respuesta Incorrecta**
Si ves: `⚠️ No se encontró token en la respuesta de la API`

**Solución:** Verifica la estructura de respuesta de tu API en la consola y ajusta el código según sea necesario.

### 2. **Error de CORS**
Si ves errores de red en la pestaña `Network`

**Solución:** Verifica que tu backend permita peticiones desde `http://localhost:3000`

### 3. **API No Responde**
Si ves: `❌ Error en login: [Error]`

**Solución:** Verifica que tu backend esté corriendo en `http://127.0.0.1:8000`

## 🛠️ Comandos de Debug

### En la Consola del Navegador:
```javascript
// Verificar estado del localStorage
authService.debugLocalStorage()

// Verificar autenticación
authService.isAuthenticated()

// Obtener token
authService.getToken()

// Limpiar storage
authService.clearAuthData()

// Verificar configuración de la API
import { API_CONFIG } from './src/config/env.js'
console.log('API Config:', API_CONFIG)
```

## 📋 Checklist de Verificación

- [ ] Backend corriendo en `http://127.0.0.1:8000`
- [ ] Endpoint `/api/login` responde correctamente
- [ ] Respuesta incluye token en alguna de las estructuras soportadas
- [ ] No hay errores de CORS
- [ ] Consola muestra logs de debug
- [ ] Panel de debug muestra estado correcto

## 🔧 Personalización

Si tu API usa una estructura diferente, puedes modificar el método `login` en `src/services/authService.js`:

```javascript
// Agregar tu estructura personalizada
else if (response.mi_campo_token) {
  token = response.mi_campo_token
  user = response.mi_campo_usuario
  console.log('✅ Token encontrado en response.mi_campo_token')
}
```

## 📞 Soporte

Si el problema persiste:
1. Revisa la consola para errores específicos
2. Verifica la respuesta de tu API en la pestaña Network
3. Compara la estructura de respuesta con las soportadas
4. Usa el panel de debug para verificar el estado
