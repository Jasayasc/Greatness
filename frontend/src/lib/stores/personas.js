import { writable } from 'svelte/store';
import { personasAPI } from '../api/personas';

function createPersonasStore() {
  const { subscribe, set, update } = writable([]);

  return {
    subscribe,
    // Cargar solo activos
    loadAll: async () => {
      try {
        const personas = await personasAPI.getAll();
        set(personas);
      } catch (error) {
        console.error('Error cargando personas:', error);
      }
    },
    // Cargar todos con estado
    loadAllWithStatus: async () => {
      try {
        const personas = await personasAPI.getAllWithStatus();
        set(personas);
      } catch (error) {
        console.error('Error cargando personas:', error);
      }
    },
    add: async (persona) => {
      try {
        await personasAPI.create(persona);
        // Recargar lista
        const personas = await personasAPI.getAll();
        set(personas);
      } catch (error) {
        console.error('Error agregando persona:', error);
      }
    },
    remove: async (id) => {
      try {
        await personasAPI.delete(id);
        update(personas => personas.filter(p => p.id_persona !== id));
      } catch (error) {
        console.error('Error eliminando persona:', error);
      }
    }
  };
}

export const personas = createPersonasStore();
