<script>
  import { onMount } from 'svelte';
  import { mensualidadesAPI } from '$lib/api/mensualidades';
  import { personasAPI } from '$lib/api/personas';

  let mensualidades = [];
  let personas = [];
  let loading = true;
  let showForm = false;
  let showRenovacionModal = false;
  let mensualidadARenovar = null;

  let formData = {
    id_persona: '',
    fecha_pago: new Date().toISOString().split('T')[0],
    fecha_vencimiento: '',
    valor: '',
    duracion: '',
    observaciones: ''
  };

  let renovacionData = {
    fecha_pago: new Date().toISOString().split('T')[0],
    observaciones: ''
  };

  onMount(async () => {
    await loadData();
  });

  async function loadData() {
    loading = true;
    try {
      mensualidades = await mensualidadesAPI.getAll();
      personas = await personasAPI.getAllWithStatus(); // Cargar TODOS los clientes
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      loading = false;
    }
  }

  async function handleSubmit() {
    try {
      await mensualidadesAPI.create(formData);
      alert('Mensualidad registrada exitosamente');
      showForm = false;
      formData = {
        id_persona: '',
        fecha_pago: new Date().toISOString().split('T')[0],
        fecha_vencimiento: '',
        valor: '',
        duracion: '',
        observaciones: ''
      };
      await loadData();
    } catch (error) {
      alert('Error al registrar mensualidad');
    }
  }

  function abrirRenovacion(mensualidad) {
    mensualidadARenovar = mensualidad;
    renovacionData = {
      fecha_pago: new Date().toISOString().split('T')[0],
      observaciones: `Renovación de mensualidad`
    };
    showRenovacionModal = true;
  }

  async function renovarMensualidad() {
    try {
      // Marcar la mensualidad actual como pagada
      await mensualidadesAPI.updateEstado(mensualidadARenovar.id_mensualidad, 'PAGADO');
      
      // Calcular nueva fecha de vencimiento
      const fechaPago = new Date(renovacionData.fecha_pago);
      const meses = parseInt(mensualidadARenovar.duracion) || 1;
      const nuevaFechaVencimiento = new Date(fechaPago);
      nuevaFechaVencimiento.setMonth(nuevaFechaVencimiento.getMonth() + meses);

      // Crear nueva mensualidad
      const nuevaMensualidad = {
        id_persona: mensualidadARenovar.id_persona,
        fecha_pago: renovacionData.fecha_pago,
        fecha_vencimiento: nuevaFechaVencimiento.toISOString().split('T')[0],
        valor: mensualidadARenovar.valor,
        duracion: mensualidadARenovar.duracion,
        observaciones: renovacionData.observaciones
      };

      await mensualidadesAPI.create(nuevaMensualidad);
      
      alert('Mensualidad renovada exitosamente');
      showRenovacionModal = false;
      mensualidadARenovar = null;
      await loadData();
    } catch (error) {
      alert('Error al renovar mensualidad');
      console.error(error);
    }
  }

  async function marcarComoPagado(id) {
    try {
      await mensualidadesAPI.updateEstado(id, 'PAGADO');
      await loadData();
    } catch (error) {
      alert('Error al actualizar estado');
    }
  }

  function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-CO');
  }

  function formatearValor(valor) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(valor);
  }

  function calcularVencimiento() {
    if (formData.fecha_pago && formData.duracion) {
      const fecha = new Date(formData.fecha_pago);
      const meses = parseInt(formData.duracion);
      if (!isNaN(meses)) {
        fecha.setMonth(fecha.getMonth() + meses);
        formData.fecha_vencimiento = fecha.toISOString().split('T')[0];
      }
    }
  }

  function isVencida(mensualidad) {
    const hoy = new Date();
    const vencimiento = new Date(mensualidad.fecha_vencimiento);
    return vencimiento < hoy && mensualidad.estado_pago !== 'PAGADO';
  }
</script>

<svelte:head>
  <title>Mensualidades - Greatness Gym</title>
</svelte:head>

<div class="container">
  <div class="header">
    <h1>Gestión de Mensualidades</h1>
    <button class="btn-primary" on:click={() => showForm = !showForm}>
      {showForm ? 'Cancelar' : '+ Nueva Mensualidad'}
    </button>
  </div>

  {#if showForm}
    <div class="form-section">
      <h2>Registrar Nueva Mensualidad</h2>
      <form on:submit|preventDefault={handleSubmit}>
        <div class="form-row">
          <div class="form-group">
            <label>Cliente:</label>
            <select bind:value={formData.id_persona} required>
              <option value="">Seleccione un cliente</option>
              {#each personas as persona}
                <option value={persona.id_persona}>
                  {persona.nombre_completo} - {persona.estado_calculado}
                </option>
              {/each}
            </select>
          </div>

          <div class="form-group">
            <label>Valor:</label>
            <input type="number" bind:value={formData.valor} required placeholder="80000" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Fecha de Pago:</label>
            <input type="date" bind:value={formData.fecha_pago} required />
          </div>

          <div class="form-group">
            <label>Duración (meses):</label>
            <input 
              type="number" 
              bind:value={formData.duracion} 
              on:input={calcularVencimiento}
              placeholder="1"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label>Fecha de Vencimiento:</label>
          <input type="date" bind:value={formData.fecha_vencimiento} required />
        </div>

        <div class="form-group">
          <label>Observaciones:</label>
          <textarea bind:value={formData.observaciones} rows="3"></textarea>
        </div>

        <button type="submit" class="btn-submit">Registrar Mensualidad</button>
      </form>
    </div>
  {/if}

  {#if loading}
    <p>Cargando mensualidades...</p>
  {:else}
    <div class="table-section">
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
          {#each mensualidades as mensualidad}
            <tr class:vencida={isVencida(mensualidad)}>
              <td>{mensualidad.nombre_completo}</td>
              <td>{formatearFecha(mensualidad.fecha_pago)}</td>
              <td>{formatearFecha(mensualidad.fecha_vencimiento)}</td>
              <td>{formatearValor(mensualidad.valor)}</td>
              <td>{mensualidad.duracion || 'N/A'} {mensualidad.duracion ? 'mes(es)' : ''}</td>
              <td>
                <span class="badge {mensualidad.estado_pago.toLowerCase()}">
                  {mensualidad.estado_pago}
                </span>
              </td>
              <td>
                {#if isVencida(mensualidad) || mensualidad.estado_pago === 'PENDIENTE'}
                  <button 
                    class="btn-renovar"
                    on:click={() => abrirRenovacion(mensualidad)}>
                    Renovar
                  </button>
                {:else if mensualidad.estado_pago !== 'PAGADO'}
                  <button 
                    class="btn-pagar"
                    on:click={() => marcarComoPagado(mensualidad.id_mensualidad)}>
                    Marcar Pagado
                  </button>
                {:else}
                  <span class="text-success">✓ Pagado</span>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<!-- Modal de Renovación -->
{#if showRenovacionModal && mensualidadARenovar}
  <div class="modal-overlay" on:click={() => showRenovacionModal = false}>
    <div class="modal" on:click|stopPropagation>
      <div class="modal-header">
        <h2>Renovar Mensualidad</h2>
        <button class="close-btn" on:click={() => showRenovacionModal = false}>×</button>
      </div>
      <div class="modal-body">
        <p><strong>Cliente:</strong> {mensualidadARenovar.nombre_completo}</p>
        <p><strong>Valor:</strong> {formatearValor(mensualidadARenovar.valor)}</p>
        <p><strong>Duración:</strong> {mensualidadARenovar.duracion || 1} mes(es)</p>
        
        <div class="form-group">
          <label>Fecha de Pago:</label>
          <input type="date" bind:value={renovacionData.fecha_pago} />
        </div>

        <div class="form-group">
          <label>Observaciones:</label>
          <textarea bind:value={renovacionData.observaciones} rows="3"></textarea>
        </div>

        <div class="info-box">
          <p>Esta acción marcará la mensualidad actual como pagada y creará una nueva mensualidad con:</p>
          <ul>
            <li>Mismo valor: {formatearValor(mensualidadARenovar.valor)}</li>
            <li>Misma duración: {mensualidadARenovar.duracion || 1} mes(es)</li>
            <li>Nueva fecha de vencimiento calculada automáticamente</li>
          </ul>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-cancel" on:click={() => showRenovacionModal = false}>Cancelar</button>
        <button class="btn-confirm" on:click={renovarMensualidad}>Confirmar Renovación</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }

  h1 {
    margin: 0;
    color: #333;
  }

  .btn-primary {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }

  .form-section {
    background: white;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    margin-bottom: 30px;
  }

  .form-section h2 {
    margin-top: 0;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 15px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  label {
    margin-bottom: 5px;
    font-weight: bold;
  }

  input, select, textarea {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .btn-submit {
    width: 100%;
    padding: 12px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 10px;
  }

  .table-section {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
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

  tr.vencida {
    background-color: #ffebee;
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

  .btn-pagar, .btn-renovar {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 6px 12px;
    cursor: pointer;
    border-radius: 4px;
  }

  .btn-renovar {
    background-color: #2196F3;
  }

  .btn-renovar:hover {
    background-color: #1976D2;
  }

  .text-success {
    color: #4CAF50;
    font-weight: bold;
  }

  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal {
    background: white;
    border-radius: 8px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #ddd;
  }

  .modal-header h2 {
    margin: 0;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 28px;
    cursor: pointer;
    color: #666;
  }

  .modal-body {
    padding: 20px;
  }

  .info-box {
    background-color: #e3f2fd;
    border-left: 4px solid #2196F3;
    padding: 15px;
    margin-top: 15px;
  }

  .info-box ul {
    margin: 10px 0 0 20px;
  }

  .modal-footer {
    padding: 20px;
    border-top: 1px solid #ddd;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  .btn-cancel {
    padding: 10px 20px;
    background-color: #9E9E9E;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .btn-confirm {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .btn-confirm:hover {
    background-color: #45a049;
  }
</style>
