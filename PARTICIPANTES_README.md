# Módulo de Participantes - Cecyte Chef

## Descripción
Este módulo permite gestionar y visualizar la información de todos los participantes del sistema Cecyte Chef. Los participantes son estudiantes que forman parte de equipos culinarios en diferentes eventos.

## Características Principales

### 📊 Tabla de Participantes
- **Vista general**: Muestra todos los participantes con información clave
- **Filtros avanzados**: Por rol, plantel y búsqueda por texto
- **Paginación**: Navegación eficiente entre grandes volúmenes de datos
- **Estadísticas**: Cards informativos con métricas importantes
- **Responsive**: Diseño adaptativo para dispositivos móviles

### 🔍 Funcionalidades de Búsqueda y Filtrado
- **Búsqueda por texto**: Nombre, matrícula o correo electrónico
- **Filtro por rol**: Chef Principal, Sous Chef, etc.
- **Filtro por plantel**: Instituto específico o CCT
- **Filtros combinados**: Múltiples criterios simultáneos
- **Limpieza de filtros**: Botón para resetear todos los filtros

### 📱 Vista de Detalle
- **Información completa**: Todos los datos del participante
- **Información personal**: Nombre, matrícula, rol, semestre, especialidad
- **Información de contacto**: Teléfono y correo electrónico
- **Información académica**: Plantel y CCT
- **Información médica**: Tipo de sangre, seguro, alergias, medicamentos
- **Información del equipo**: Datos del equipo al que pertenece
- **Foto de credencial**: Visualización de la imagen del participante

## Estructura de Datos

### Campos del Participante
```json
{
  "id": 1,
  "equipo_id": 1,
  "nombre_participante": "Juan Pérez",
  "rol_participante": "Chef Principal",
  "talla_participante": "M",
  "telefono_participante": "8181111111",
  "matricula_participante": "2024001",
  "correo_participante": "juan.perez@email.com",
  "plantel_participante": "Instituto Culinario del Norte",
  "plantelcct": "19DCT0001A",
  "medicamentos": "Ninguno",
  "foto_credencial": "juan_perez.jpg",
  "semestre_participante": "6to",
  "especialidad_participante": "Cocina Internacional",
  "seguro_facultativo": true,
  "tipo_sangre_participante": "O+",
  "alergico": false,
  "alergias": null,
  "created_at": "2025-09-03T00:57:57.000000Z",
  "updated_at": "2025-09-03T00:57:57.000000Z",
  "equipo": {
    "id": 1,
    "nombre_equipo": "Los Sabores del Norte",
    "evento_id": 1,
    "entidad_federativa": "Nuevo León",
    "estatus_del_equipo": "activo",
    "nombre_anfitrion": "María González",
    "telefono_anfitrion": "8181234567",
    "correo_anfitrion": "maria.gonzalez@email.com"
  }
}
```

## Navegación

### Rutas Disponibles
- **Lista de participantes**: `/dashboard` → Sección "Participantes"
- **Detalle del participante**: `/dashboard/participantes/:id`

### Flujo de Navegación
1. **Dashboard** → Click en "Participantes" en el sidebar
2. **Tabla de participantes** → Click en el botón "Ver detalle" (👁️)
3. **Detalle del participante** → Botón "Volver" para regresar a la lista

## Componentes

### ParticipantesTable.jsx
- **Propósito**: Tabla principal con lista de participantes
- **Funcionalidades**: Filtrado, búsqueda, paginación, navegación al detalle
- **Estados**: Loading, error, filtros activos, página actual

### ParticipanteDetalle.jsx
- **Propósito**: Vista detallada de un participante específico
- **Funcionalidades**: Muestra toda la información, botón de edición (futuro)
- **Estados**: Loading, error, datos del participante

### ParticipantesTable.css
- **Propósito**: Estilos para la tabla de participantes
- **Características**: Diseño moderno, responsive, hover effects

### ParticipanteDetalle.css
- **Propósito**: Estilos para la vista de detalle
- **Características**: Layout de cards, colores temáticos, responsive

## API Endpoints

### Obtener Todos los Participantes
```
GET /api/participantes
```

### Obtener Participante Específico
```
GET /api/participantes/:id
```

## Estadísticas Mostradas

### Cards Informativos
1. **Total Participantes**: Número total de participantes registrados
2. **Con Seguro**: Participantes que tienen seguro facultativo
3. **Con Alergias**: Participantes que reportan alergias
4. **Equipos Activos**: Número de equipos únicos con participantes

## Filtros Disponibles

### Búsqueda por Texto
- Nombre del participante
- Número de matrícula
- Correo electrónico

### Filtro por Rol
- Chef Principal
- Sous Chef
- Ayudante de Cocina
- Otros roles específicos

### Filtro por Plantel
- Nombre del instituto
- Código CCT

## Responsive Design

### Breakpoints
- **Desktop**: Layout completo con sidebar colapsable
- **Tablet**: Layout adaptado con filtros apilados
- **Mobile**: Layout vertical optimizado para pantallas pequeñas

### Adaptaciones Móviles
- Filtros apilados verticalmente
- Tabla con scroll horizontal
- Botones de tamaño optimizado
- Navegación simplificada

## Futuras Mejoras

### Funcionalidades Planificadas
- [ ] **Edición de participantes**: Formulario para modificar datos
- [ ] **Creación de participantes**: Formulario para agregar nuevos
- [ ] **Eliminación de participantes**: Confirmación y soft delete
- [ ] **Exportación de datos**: CSV, PDF, Excel
- [ ] **Importación masiva**: Carga de participantes desde archivo
- [ ] **Filtros avanzados**: Por fecha, estado, evento
- [ ] **Búsqueda global**: En todo el sistema
- [ ] **Notificaciones**: Alertas de cambios importantes

### Mejoras de UX
- [ ] **Drag & Drop**: Para reordenar participantes
- [ ] **Selección múltiple**: Operaciones en lote
- [ ] **Vistas personalizadas**: Guardar filtros favoritos
- [ ] **Temas visuales**: Modo oscuro/claro
- [ ] **Accesibilidad**: Mejoras para lectores de pantalla

## Dependencias

### React
- `useState`: Manejo de estado local
- `useEffect`: Efectos secundarios y llamadas API
- `useNavigate`: Navegación programática

### Bootstrap
- Sistema de grid responsive
- Componentes de UI (cards, badges, botones)
- Utilidades de espaciado y tipografía

### Bootstrap Icons
- Iconos para mejorar la experiencia visual
- Consistencia en el diseño

## Instalación y Configuración

### Requisitos
- Node.js 16+
- React 18+
- Bootstrap 5+
- Bootstrap Icons

### Configuración
1. Asegurar que la API esté funcionando en `http://127.0.0.1:8000`
2. Verificar que el endpoint `/api/participantes` esté disponible
3. Configurar CORS si es necesario
4. Verificar autenticación y autorización

## Troubleshooting

### Problemas Comunes
1. **Error de carga**: Verificar conectividad con la API
2. **Filtros no funcionan**: Verificar que los datos tengan el formato correcto
3. **Navegación falla**: Verificar que las rutas estén configuradas
4. **Estilos no se aplican**: Verificar que los archivos CSS estén importados

### Debug
- Revisar la consola del navegador
- Verificar las llamadas a la API en Network tab
- Comprobar que los componentes se rendericen correctamente

## Contribución

### Estándares de Código
- Usar hooks de React funcionales
- Mantener componentes pequeños y enfocados
- Seguir convenciones de nomenclatura
- Documentar funciones complejas
- Usar TypeScript en futuras versiones

### Testing
- Componentes unitarios con Jest/React Testing Library
- Testing de integración para flujos completos
- Testing de accesibilidad
- Testing de responsive design
