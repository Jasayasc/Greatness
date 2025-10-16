<script>
  import { onMount } from 'svelte';
  import { mensualidadesAPI } from '../api/mensualidades';

  let mensualidades = [];
  let loading = true;
  let filter = 'todas'; // 'todas', 'vencidas', 'pagadas', 'pendientes'

  onMount(async () => {
    await loadMensualidades();
  });

  async function loadMensualidades() {
    loading = true;
    try {
      mensualidades = await mensualidadesAPI.getAll();
    } catch (error) {
      console.error('Error cargando mensualidades:', error);
    } finally {
      loading = false;
    }
  }

  async function cambiarEstado(id, nuevoEstado) {
    try {
      await mensualidadesAPI.updateEstado(id, nuevoEstado);
      await loadMensualidades();
    } catch (error) {
      alert('Error al actualizar estado');
    }
  }

  $: mensualidadesFiltradas = mensualidades.filter(m => {
    if (filter === 'todas') return true;
    if (filter === 'vencidas') return m.estado_pago === 'VENCIDO';
    if (filter === 'pagadas') return m.estado_pago === 'PAGADO';
    if (filter === 'pendientes') return m.estado_pago === 'PENDIENTE';
    return true;
  });

  function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-CO');
  }

  function formatearValor(valor) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(valor);
  }
</script>

<div class="mensualidad-container">
  <h2>Gestión de Mensualidades</h2>

  <div class="filters">
    <button 
      class:active={filter === 'todas'} 
      on:click={() => filter = 'todas'}>
      Todas
    </button>
    <button 
      class:active={filter === 'pendientes'} 
      on:click={() => filter = 'pendientes'}>
      Pendientes
    </button>
    <button 
      class:active={filter === 'vencidas'} 
      on:click={() => filter = 'vencidas'}>
      Vencidas
    </button>
    <button 
      class:active={filter === 'pagadas'} 
      on:click={() => filter = 'pagadas'}>
      Pagadas
    </button>
  </div>

  {#if loading}
    <p>Cargando mensualidades...</p>
  {:else}
    <table>
      <thead>
        <tr>
          <th>Cliente</th>
          <th>Fecha Pago</th>
          <th>Vencimiento</th>
          <th>Valor</th>
          <th>Duración</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {#each mensualidadesFiltradas as mensualidad}
          <tr>
            <td>{mensualidad.nombre_completo}</td>
            <td>{formatearFecha(mensualidad.fecha_pago)}</td>
            <td>{formatearFecha(mensualidad.fecha_vencimiento)}</td>
            <td>{formatearValor(mensualidad.valor)}</td>
            <td>{mensualidad.duracion || 'N/A'}</td>
            <td>
              <span class="badge {mensualidad.estado_pago.toLowerCase()}">
                {mensualidad.estado_pago}
              </span>
            </td>
            <td>
              {#if mensualidad.estado_pago !== 'PAGADO'}
                <button 
                  class="btn-pagar"
                  on:click={() => cambiarEstado(mensualidad.id_mensualidad, 'PAGADO')}>
                  Marcar como Pagado
                </button>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>

    {#if mensualidadesFiltradas.length === 0}
      <p class="no-data">No hay mensualidades para mostrar</p>
    {/if}
  {/if}
</div>

<style>
  .mensualidad-container {
    padding: 20px;
  }

  .filters {
    margin: 20px 0;
    display: flex;
    gap: 10px;
  }

  .filters button {
    padding: 8px 16px;
    border: 1px solid #ddd;
    background: white;
    cursor: pointer;
    border-radius: 4px;
  }

  .filters button.active {
    background-color: #4CAF50;
    color: white;
    border-color: #4CAF50;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }

  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #333;
    color: white;
  }

  .badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
  }

  .badge.pagado {
    background-color: #4CAF50;
    color: white;
  }

  .badge.pendiente {
    background-color: #FFC107;
    color: #333;
  }

  .badge.vencido {
    background-color: #f44336;
    color: white;
  }

  .btn-pagar {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 6px 12px;
    cursor: pointer;
    border-radius: 4px;
  }

  .btn-pagar:hover {
    background-color: #45a049;
  }

  .no-data {
    text-align: center;
    padding: 40px;
    color: #999;
  }
</style>
