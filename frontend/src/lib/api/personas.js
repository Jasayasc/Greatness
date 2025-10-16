const API_URL = 'http://localhost:3000/api';

export const personasAPI = {
  // Solo clientes activos
  getAll: async () => {
    const response = await fetch(`${API_URL}/personas`);
    if (!response.ok) throw new Error('Error al obtener personas');
    return await response.json();
  },

  // Todos los clientes con estado calculado
  getAllWithStatus: async () => {
    const response = await fetch(`${API_URL}/personas/all`);
    if (!response.ok) throw new Error('Error al obtener personas');
    return await response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/personas/${id}`);
    if (!response.ok) throw new Error('Error al obtener persona');
    return await response.json();
  },

  getWithDetails: async (id) => {
    const response = await fetch(`${API_URL}/personas/${id}/details`);
    if (!response.ok) throw new Error('Error al obtener detalles');
    return await response.json();
  },

  create: async (persona) => {
    const response = await fetch(`${API_URL}/personas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(persona)
    });
    if (!response.ok) throw new Error('Error al crear persona');
    return await response.json();
  },

  update: async (id, persona) => {
    const response = await fetch(`${API_URL}/personas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(persona)
    });
    if (!response.ok) throw new Error('Error al actualizar persona');
    return await response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/personas/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Error al eliminar persona');
    return await response.json();
  }
};
