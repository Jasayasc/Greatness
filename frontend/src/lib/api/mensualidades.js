const API_URL = 'http://localhost:3000/api';

export const mensualidadesAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/mensualidades`);
    if (!response.ok) throw new Error('Error al obtener mensualidades');
    return await response.json();
  },

  getVencidas: async () => {
    const response = await fetch(`${API_URL}/mensualidades/vencidas`);
    if (!response.ok) throw new Error('Error al obtener mensualidades vencidas');
    return await response.json();
  },

  create: async (mensualidad) => {
    const response = await fetch(`${API_URL}/mensualidades`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mensualidad)
    });
    if (!response.ok) throw new Error('Error al crear mensualidad');
    return await response.json();
  },

  updateEstado: async (id, estado_pago) => {
    const response = await fetch(`${API_URL}/mensualidades/${id}/estado`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado_pago })
    });
    if (!response.ok) throw new Error('Error al actualizar estado');
    return await response.json();
  }
};
