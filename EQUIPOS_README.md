# Módulo de Equipos - Cecyte Chef

## Descripción

El módulo de equipos permite gestionar todos los equipos participantes en los eventos gastronómicos del sistema Cecyte Chef. Cada equipo incluye información completa sobre participantes, acompañantes, recetas y eventos asociados.

## Características Principales

### 📊 Tabla de Equipos
- **Vista general**: Muestra todos los equipos con información clave
- **Ordenamiento**: Por ID, nombre, evento, entidad, estatus y anfitrión
- **Filtros**: Por estatus del equipo y entidad federativa
- **Búsqueda**: Texto libre en nombre, anfitrión, entidad y evento
- **Paginación**: 10 equipos por página

### 🔍 Información Mostrada
- **Datos del equipo**: Nombre, entidad federativa, estatus
- **Evento asociado**: Nombre, fechas y sede
- **Anfitrión**: Nombre, teléfono y correo
- **Participantes**: Cantidad total con roles
- **Acompañantes**: Cantidad total (asesores, coordinadores)

### 📋 Modal de Detalles
Al hacer clic en el botón de "Ver detalles" se abre un modal completo que muestra:

#### Información Básica
- Nombre del equipo
- Entidad federativa
- Estatus del equipo
- Fecha de creación

#### Información del Anfitrión
- Nombre completo
- Teléfono de contacto
- Correo electrónico

#### Evento Asociado
- Nombre del evento
- Sede del evento
- Fechas de inicio y fin

#### Lista de Participantes
- Nombre completo
- Rol en el equipo (Chef Principal, Sous Chef, etc.)
- Plantel educativo
- Especialidad culinaria
- Semestre actual

#### Lista de Acompañantes
- Nombre completo
- Rol (Asesor Académico, Coordinador, etc.)
- Puesto o cargo
- Información de contacto

#### Recetas del Equipo
- Tipo de receta (Plato Principal, Postre, etc.)
- Descripción detallada
- Observaciones especiales
- Información del creador

## API Endpoint

```
GET http://127.0.0.1:8000/api/equipos
```

### Respuesta de la API
La API devuelve un array de equipos con la siguiente estructura:

```json
{
  "data": [
    {
      "id": 1,
      "nombre_equipo": "Los Sabores del Norte",
      "evento_id": 1,
      "entidad_federativa": "Nuevo León",
      "estatus_del_equipo": "activo",
      "nombre_anfitrion": "María González",
      "telefono_anfitrion": "8181234567",
      "correo_anfitrion": "maria.gonzalez@email.com",
      "created_at": "2025-09-03T00:57:57.000000Z",
      "updated_at": "2025-09-03T00:57:57.000000Z",
      "evento": { ... },
      "participantes": [ ... ],
      "acompanantes": [ ... ],
      "recetas": [ ... ],
      "cedulas_registro": [ ... ]
    }
  ]
}
```

## Navegación

### Acceso desde el Dashboard
1. **Menú lateral**: Hacer clic en "Equipos" en el sidebar
2. **Acceso rápido**: Botón "Ir a Equipos" en la sección principal del dashboard

### Funcionalidades Disponibles
- ✅ **Ver equipos**: Lista completa con filtros
- ✅ **Ordenar**: Por cualquier columna
- ✅ **Filtrar**: Por estatus y entidad
- ✅ **Buscar**: Texto libre en múltiples campos
- ✅ **Ver detalles**: Modal completo con toda la información
- ✅ **Paginación**: Navegación entre páginas
- ✅ **Responsive**: Adaptado para móviles y desktop

## Estructura de Archivos

```
src/
├── components/
│   ├── EquiposTable.jsx      # Componente principal de la tabla
│   └── EquiposTable.css      # Estilos específicos del componente
└── Dashboard.jsx             # Dashboard principal (ya modificado)
```

## Tecnologías Utilizadas

- **React 19**: Hooks y estado funcional
- **Bootstrap 5**: Componentes UI y grid system
- **Bootstrap Icons**: Iconografía consistente
- **CSS personalizado**: Estilos específicos del módulo
- **API REST**: Comunicación con el backend

## Estado del Componente

### Estados Principales
- `equipos`: Array de equipos obtenidos de la API
- `loading`: Estado de carga
- `error`: Mensajes de error
- `filterText`: Texto de búsqueda
- `currentPage`: Página actual de paginación
- `sortField` y `sortDirection`: Ordenamiento de la tabla

### Estados de Filtros
- `statusFilter`: Filtro por estatus del equipo
- `entidadFilter`: Filtro por entidad federativa

### Estados del Modal
- `showDetailsModal`: Control de visibilidad del modal
- `selectedEquipo`: Equipo seleccionado para mostrar detalles

## Funciones Principales

### `fetchEquipos()`
Obtiene los equipos desde la API usando el servicio `apiService`

### `handleSort(field)`
Maneja el ordenamiento de las columnas de la tabla

### `handleShowDetails(equipo)`
Abre el modal con los detalles completos del equipo seleccionado

### `getStatusBadge(status)`
Genera badges visuales para los diferentes estatus de equipos

### `formatDate(dateString)`
Formatea las fechas para mostrar en formato legible

## Personalización

### Colores de Estatus
```css
.estatus-activo { background-color: #28a745; }
.estatus-inactivo { background-color: #6c757d; }
.estatus-suspendido { background-color: #ffc107; }
.estatus-eliminado { background-color: #dc3545; }
```

### Campos de Filtro
Los filtros se pueden personalizar agregando más opciones en:
- `statusFilter`: Agregar nuevos estatus
- `entidadFilter`: Agregar nuevas entidades federativas

### Columnas de la Tabla
Para agregar o modificar columnas, editar el array de encabezados en el JSX del componente.

## Consideraciones de Rendimiento

- **Paginación**: Solo se renderizan 10 equipos por página
- **Filtrado**: Se aplica en memoria para respuestas rápidas
- **Ordenamiento**: Optimizado para arrays de tamaño medio
- **Modal**: Se renderiza solo cuando es necesario

## Compatibilidad

- ✅ **Navegadores modernos**: Chrome, Firefox, Safari, Edge
- ✅ **Dispositivos móviles**: Responsive design
- ✅ **React 19**: Compatible con la versión más reciente
- ✅ **Bootstrap 5**: Framework CSS actualizado

## Próximas Mejoras

- [ ] **Exportación**: PDF y Excel de la tabla
- [ ] **Edición**: Modificar equipos desde la interfaz
- [ ] **Creación**: Formulario para nuevos equipos
- [ ] **Eliminación**: Soft delete de equipos
- [ ] **Búsqueda avanzada**: Filtros por fechas y rangos
- [ ] **Notificaciones**: Alertas en tiempo real
- [ ] **Auditoría**: Historial de cambios

## Soporte

Para reportar problemas o solicitar nuevas funcionalidades, contactar al equipo de desarrollo del proyecto Cecyte Chef.
