<script>
  import { onMount } from 'svelte';
  import { personasAPI } from '$lib/api/personas';
  import PersonaForm from '$lib/components/PersonaForm.svelte';
  
  let personas = [];
  let loading = true;
  let showForm = false;
  
  onMount(async () => {
    await loadPersonas();
  });

  async function loadPersonas() {
    loading = true;
    try {
      personas = await personasAPI.getAllWithStatus(); // Obtener todos
    } catch (error) {
      console.error('Error cargando personas:', error);
    } finally {
      loading = false;
    }
  }

  async function handleSuccess() {
    alert('Cliente agregado exitosamente');
    showForm = false;
    await loadPersonas();
  }

  async function handleDelete(id) {
    if (confirm('¿Está seguro de eliminar este cliente?')) {
      try {
        await personasAPI.delete(id);
        await loadPersonas();
      } catch (error) {
        alert('Error al eliminar cliente');
      }
    }
  }

  function formatearFecha(fecha) {
    if (!fecha) return 'Sin mensualidad';
    return new Date(fecha).toLocaleDateString('es-CO');
  }

  function getDiasRestantes(fecha) {
    if (!fecha) return null;
    const hoy = new Date();
    const vencimiento = new Date(fecha);
    const diferencia = Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24));
    return diferencia;
  }

  function getColorVencimiento(dias) {
    if (dias === null) return 'gray';
    if (dias < 0) return 'red';
    if (dias <= 7) return 'orange';
    return 'green';
  }
</script>

<svelte:head>
  <title>Clientes - Greatness Gym</title>
</svelte:head>

<div class="container">
  <div class="header">
    <h1>Gestión de Clientes</h1>
    <button class="btn-primary" on:click={() => showForm = !showForm}>
      {showForm ? 'Cancelar' : '+ Nuevo Cliente'}
    </button>
  </div>

  {#if showForm}
    <div class="form-section">
      <PersonaForm on:success={handleSuccess} />
    </div>
  {/if}

  {#if loading}
    <p>Cargando clientes...</p>
  {:else}
    <div class="table-section">
      <h2>Todos los Clientes</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre Completo</th>
            <th>Celular</th>
            <th>Fecha Vencimiento</th>
            <th>Días Restantes</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {#each personas as persona}
            {@const dias = getDiasRestantes(persona.fecha_vencimiento)}
            <tr>
              <td>{persona.id_persona}</td>
              <td>{persona.nombre_completo}</td>
              <td>{persona.celular || 'N/A'}</td>
              <td>{formatearFecha(persona.fecha_vencimiento)}</td>
              <td>
                {#if dias !== null}
                  <span class="dias {getColorVencimiento(dias)}">
                    {dias > 0 ? `${dias} días` : dias === 0 ? 'Hoy vence' : `Vencido hace ${Math.abs(dias)} días`}
                  </span>
                {:else}
                  <span class="dias gray">-</span>
                {/if}
              </td>
              <td>
                <span class="badge {persona.estado_calculado?.toLowerCase().replace(' ', '-') || 'inactivo'}">
                  {persona.estado_calculado || 'INACTIVO'}
                </span>
              </td>
              <td>
                <a href="/personas/{persona.id_persona}" class="btn-ver">Ver</a>
                <button on:click={() => handleDelete(persona.id_persona)} class="btn-delete">Eliminar</button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>

      {#if personas.length === 0}
        <p class="no-data">No hay clientes registrados</p>
      {/if}
    </div>
  {/if}
</div>

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
    color: #333;
    margin: 0;
  }

  h2 {
    margin-bottom: 15px;
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

  .btn-primary:hover {
    background-color: #45a049;
  }

  .form-section {
    margin-bottom: 30px;
    animation: slideDown 0.3s ease-out;
  }

  .table-section {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
    font-weight: bold;
  }

  .badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
    text-transform: uppercase;
  }

  .badge.activo {
    background-color: #4CAF50;
    color: white;
  }

  .badge.inactivo {
    background-color: #f44336;
    color: white;
  }

  .badge.sin-mensualidad {
    background-color: #9E9E9E;
    color: white;
  }

  .dias {
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: bold;
    font-size: 12px;
  }

  .dias.green {
    background-color: #4CAF50;
    color: white;
  }

  .dias.orange {
    background-color: #FF9800;
    color: white;
  }

  .dias.red {
    background-color: #f44336;
    color: white;
  }

  .dias.gray {
    background-color: #9E9E9E;
    color: white;
  }

  .btn-ver {
    background-color: #2196F3;
    color: white;
    text-decoration: none;
    padding: 6px 12px;
    border-radius: 4px;
    margin-right: 8px;
    display: inline-block;
  }

  .btn-delete {
    background-color: #f44336;
    color: white;
    border: none;
    padding: 6px 12px;
    cursor: pointer;
    border-radius: 4px;
  }

  .btn-delete:hover {
    background-color: #d32f2f;
  }

  .no-data {
    text-align: center;
    padding: 40px;
    color: #999;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
