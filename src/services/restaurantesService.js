import apiService from './apiService.js'

class RestaurantesService {
  // Obtener todos los restaurantes
  async getRestaurantes() {
    try {
      const response = await apiService.get('/restaurantes')
      return response
    } catch (error) {
      console.error('Error al obtener restaurantes:', error)
      throw error
    }
  }

  // Obtener un restaurante específico por ID
  async getRestauranteById(id) {
    try {
      const response = await apiService.get(`/restaurantes/${id}`)
      return response
    } catch (error) {
      console.error(`Error al obtener restaurante ${id}:`, error)
      throw error
    }
  }
}

// Crear una instancia del servicio
const restaurantesService = new RestaurantesService()

export default restaurantesService
