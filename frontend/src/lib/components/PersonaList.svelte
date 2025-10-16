<script>
  import { personas } from '../stores/personas';
  import { onMount } from 'svelte';

  onMount(() => {
    personas.loadAll();
  });

  async function handleDelete(id) {
    if (confirm('¿Está seguro de eliminar este cliente?')) {
      await personas.remove(id);
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

<div class="persona-list">
  <h2>Clientes Activos</h2>
  
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
      {#each $personas as persona}
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

  {#if $personas.length === 0}
    <p class="no-data">No hay clientes activos en este momento</p>
  {/if}
</div>

<style>
  .persona-list {
    padding: 20px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    background: white;
  }

  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #4CAF50;
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
</style>
