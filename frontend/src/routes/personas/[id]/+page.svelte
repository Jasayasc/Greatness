<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { personasAPI } from '$lib/api/personas';
  import { valoracionesAPI } from '$lib/api/valoraciones';
  import ValoracionForm from '$lib/components/ValoracionForm.svelte';

  let persona = null;
  let mensualidades = [];
  let valoraciones = [];
  let loading = true;
  let showValoracionForm = false;

  $: id = $page.params.id;

  onMount(async () => {
    await loadData();
  });

  async function loadData() {
    loading = true;
    try {
      const data = await personasAPI.getWithDetails(id);
      persona = data.persona;
      mensualidades = data.mensualidades;
      valoraciones = data.valoraciones;
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      loading = false;
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

  async function handleValoracionSuccess() {
    showValoracionForm = false;
    await loadData();
  }
</script>

<svelte:head>
  <title>{persona?.nombre_completo || 'Cliente'} - Greatness Gym</title>
</svelte:head>

{#if loading}
  <div class="loading">Cargando información...</div>
{:else if persona}
  <div class="container">
    <div class="header">
      <a href="/personas" class="back-link">← Volver a Clientes</a>
    </div>

    <div class="persona-info">
      <h1>{persona.nombre_completo}</h1>
      <div class="info-grid">
        <div class="info-item">
          <strong>Celular:</strong>
          <span>{persona.celular || 'No registrado'}</span>
        </div>
        <div class="info-item">
          <strong>Estado:</strong>
          <span class="badge {persona.estado.toLowerCase()}">{persona.estado}</span>
        </div>
        <div class="info-item">
          <strong>Fecha de Registro:</strong>
          <span>{formatearFecha(persona.fecha_registro)}</span>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-header">
        <h2>Mensualidades</h2>
      </div>
      {#if mensualidades.length > 0}
        <table>
          <thead>
            <tr>
              <th>Fecha Pago</th>
              <th>Vencimiento</th>
              <th>Valor</th>
              <th>Duración</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {#each mensualidades as mensualidad}
              <tr>
                <td>{formatearFecha(mensualidad.fecha_pago)}</td>
                <td>{formatearFecha(mensualidad.fecha_vencimiento)}</td>
                <td>{formatearValor(mensualidad.valor)}</td>
                <td>{mensualidad.duracion || 'N/A'}</td>
                <td>
                  <span class="badge {mensualidad.estado_pago.toLowerCase()}">
                    {mensualidad.estado_pago}
                  </span>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      {:else}
        <p class="no-data">No hay mensualidades registradas</p>
      {/if}
    </div>

    <div class="section">
      <div class="section-header">
        <h2>Valoraciones Físicas</h2>
        <button class="btn-primary" on:click={() => showValoracionForm = !showValoracionForm}>
          {showValoracionForm ? 'Cancelar' : '+ Nueva Valoración'}
        </button>
      </div>

      {#if showValoracionForm}
        <div class="form-container">
          <ValoracionForm id_persona={parseInt(id)} on:success={handleValoracionSuccess} />
        </div>
      {/if}

      {#if valoraciones.length > 0}
        <div class="valoraciones-grid">
          {#each valoraciones as valoracion}
            <div class="valoracion-card">
              <div class="valoracion-header">
                <strong>{formatearFecha(valoracion.fecha_valoracion)}</strong>
                <span class="edad">{valoracion.edad} años</span>
              </div>
              <div class="valoracion-body">
                <div class="metric">
                  <span class="label">Peso:</span>
                  <span class="value">{valoracion.peso} kg</span>
                </div>
                <div class="metric">
                  <span class="label">Estatura:</span>
                  <span class="value">{valoracion.estatura} cm</span>
                </div>
                <div class="metric">
                  <span class="label">IMC:</span>
                  <span class="value">{valoracion.imc}</span>
                </div>
                <div class="metric">
                  <span class="label">% Grasa:</span>
                  <span class="value">{valoracion.porcentaje_grasa}%</span>
                </div>
              </div>
              {#if valoracion.observaciones}
                <div class="observaciones">
                  <strong>Observaciones:</strong>
                  <p>{valoracion.observaciones}</p>
                </div>
              {/if}
            </div>
          {/each}
        </div>
      {:else}
        <p class="no-data">No hay valoraciones registradas</p>
      {/if}
    </div>
  </div>
{:else}
  <div class="error">Cliente no encontrado</div>
{/if}

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .header {
    margin-bottom: 20px;
  }

  .back-link {
    color: #2196F3;
    text-decoration: none;
    font-size: 16px;
  }

  .persona-info {
    background: white;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    margin-bottom: 30px;
  }

  .persona-info h1 {
    margin: 0 0 20px 0;
    color: #333;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
  }

  .info-item {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .section {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    margin-bottom: 30px;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .section h2 {
    margin: 0;
    color: #333;
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
    background-color: #f5f5f5;
    font-weight: bold;
  }

  .badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
  }

  .badge.activo {
    background-color: #4CAF50;
    color: white;
  }

  .badge.inactivo {
    background-color: #999;
    color: white;
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

  .valoraciones-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }

  .valoracion-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
  }

  .valoracion-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }

  .edad {
    color: #666;
    font-size: 14px;
  }

  .valoracion-body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .metric {
    display: flex;
    flex-direction: column;
  }

  .metric .label {
    font-size: 12px;
    color: #666;
  }

  .metric .value {
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }

  .observaciones {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #eee;
  }

  .observaciones p {
    margin: 5px 0 0 0;
    color: #666;
    font-size: 14px;
  }

  .btn-primary {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
  }

  .btn-primary:hover {
    background-color: #45a049;
  }

  .form-container {
    margin-bottom: 20px;
  }

  .no-data {
    text-align: center;
    color: #999;
    padding: 40px;
  }

  .loading, .error {
    text-align: center;
    padding: 60px;
    font-size: 18px;
  }

  .error {
    color: #f44336;
  }
</style>
