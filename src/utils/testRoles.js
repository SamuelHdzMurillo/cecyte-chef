// Utilidad para probar diferentes roles de usuario
// Este archivo es solo para desarrollo y testing

export const createTestUser = (role = 'usuario') => {
  const baseUser = {
    id: 1,
    name: 'Usuario de Prueba',
    email: 'test@example.com',
    email_verified_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  switch (role) {
    case 'admin':
    case 'administrador':
      return {
        ...baseUser,
        name: 'Administrador de Prueba',
        email: 'admin@example.com',
        role: 'admin'
      }
    
    case 'usuario':
    default:
      return {
        ...baseUser,
        role: 'usuario'
      }
  }
}

export const simulateLogin = (role = 'usuario') => {
  const testUser = createTestUser(role)
  
  // Simular el proceso de login guardando en localStorage
  localStorage.setItem('user', JSON.stringify(testUser))
  localStorage.setItem('authToken', 'test-token-' + Date.now())
  
  console.log('🧪 Usuario de prueba creado:', testUser)
  return testUser
}

export const clearTestData = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('authToken')
  console.log('🧹 Datos de prueba eliminados')
}

// Función para probar el sistema de roles
export const testRoleSystem = () => {
  console.log('🧪 Iniciando prueba del sistema de roles...')
  
  // Probar con usuario admin
  console.log('\n1. Probando con usuario ADMIN:')
  simulateLogin('admin')
  console.log('   - Usuario admin creado')
  console.log('   - Recarga la página para ver el dashboard de administrador')
  
  // Esperar un poco y probar con usuario regular
  setTimeout(() => {
    console.log('\n2. Probando con usuario REGULAR:')
    simulateLogin('usuario')
    console.log('   - Usuario regular creado')
    console.log('   - Recarga la página para ver el dashboard de usuario')
  }, 2000)
  
  // Limpiar después de 10 segundos
  setTimeout(() => {
    console.log('\n3. Limpiando datos de prueba...')
    clearTestData()
    console.log('   - Datos limpiados')
    console.log('   - Recarga la página para volver al login')
  }, 10000)
}

// Exportar funciones para uso en consola del navegador
if (typeof window !== 'undefined') {
  window.testRoles = {
    createTestUser,
    simulateLogin,
    clearTestData,
    testRoleSystem
  }
  
  console.log('🧪 Funciones de prueba disponibles en window.testRoles:')
  console.log('   - testRoles.simulateLogin("admin") - Crear usuario admin')
  console.log('   - testRoles.simulateLogin("usuario") - Crear usuario regular')
  console.log('   - testRoles.clearTestData() - Limpiar datos de prueba')
  console.log('   - testRoles.testRoleSystem() - Ejecutar prueba completa')
}
