const API_URL = 'http://localhost:3000/api';

export const valoracionesAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/valoraciones`);
    if (!response.ok) throw new Error('Error al obtener valoraciones');
    return await response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/valoraciones/${id}`);
    if (!response.ok) throw new Error('Error al obtener valoración');
    return await response.json();
  },

  getEvolucion: async (id_persona) => {
    const response = await fetch(`${API_URL}/valoraciones/persona/${id_persona}/evolucion`);
    if (!response.ok) throw new Error('Error al obtener evolución');
    return await response.json();
  },

  create: async (valoracion) => {
    const response = await fetch(`${API_URL}/valoraciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(valoracion)
    });
    if (!response.ok) throw new Error('Error al crear valoración');
    return await response.json();
  }
};
