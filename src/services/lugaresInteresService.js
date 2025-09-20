import apiService from './apiService.js'

class LugaresInteresService {
  // Obtener todos los lugares de interés
  async getLugaresInteres() {
    try {
      const response = await apiService.get('/lugares-interes')
      return response
    } catch (error) {
      console.error('Error al obtener lugares de interés:', error)
      throw error
    }
  }

  // Obtener un lugar de interés específico por ID
  async getLugarInteresById(id) {
    try {
      const response = await apiService.get(`/lugares-interes/${id}`)
      return response
    } catch (error) {
      console.error(`Error al obtener lugar de interés ${id}:`, error)
      throw error
    }
  }
}

// Crear una instancia del servicio
const lugaresInteresService = new LugaresInteresService()

export default lugaresInteresService
