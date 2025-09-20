import apiService from './apiService.js'

class HospedajesService {
  // Obtener todos los hospedajes
  async getHospedajes() {
    try {
      const response = await apiService.get('/hospedajes')
      return response
    } catch (error) {
      console.error('Error al obtener hospedajes:', error)
      throw error
    }
  }

  // Obtener un hospedaje específico por ID
  async getHospedajeById(id) {
    try {
      const response = await apiService.get(`/hospedajes/${id}`)
      return response
    } catch (error) {
      console.error(`Error al obtener hospedaje ${id}:`, error)
      throw error
    }
  }
}

// Crear una instancia del servicio
const hospedajesService = new HospedajesService()

export default hospedajesService
