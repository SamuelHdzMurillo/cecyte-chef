class BuzonAsistenciaService {
  constructor() {
    this.baseURL = "https://chef-api.cecytebcs.edu.mx/public/api";
    this.endpoint = "buzon-asistencia";
  }

  // Crear un nuevo mensaje en el buzón de asistencia
  async crearMensaje(datos) {
    try {
      const url = `${this.baseURL}/${this.endpoint}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(datos),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error al crear mensaje en buzón de asistencia:", error);
      throw error;
    }
  }
}

// Crear una instancia del servicio
const buzonAsistenciaService = new BuzonAsistenciaService();

export default buzonAsistenciaService;
