<script>
  import { onMount } from 'svelte';
  import { valoracionesAPI } from '$lib/api/valoraciones';

  let valoraciones = [];
  let loading = true;

  onMount(async () => {
    await loadValoraciones();
  });

  async function loadValoraciones() {
    loading = true;
    try {
      valoraciones = await valoracionesAPI.getAll();
    } catch (error) {
      console.error('Error cargando valoraciones:', error);
    } finally {
      loading = false;
    }
  }

  function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-CO');
  }
</script>

<svelte:head>
  <title>Valoraciones - Greatness Gym</title>
</svelte:head>

<div class="container">
  <h1>Historial de Valoraciones Físicas</h1>

  {#if loading}
    <p>Cargando valoraciones...</p>
  {:else if valoraciones.length > 0}
    <div class="valoraciones-grid">
      {#each valoraciones as valoracion}
        <div class="valoracion-card">
          <div class="card-header">
            <h3>{valoracion.nombre} {valoracion.apellido}</h3>
            <span class="fecha">{formatearFecha(valoracion.fecha_valoracion)}</span>
          </div>
          <div class="card-body">
            <div class="metric-row">
              <div class="metric">
                <span class="label">Edad</span>
                <span class="value">{valoracion.edad} años</span>
              </div>
              <div class="metric">
                <span class="label">Peso</span>
                <span class="value">{valoracion.peso} kg</span>
              </div>
            </div>
            <div class="metric-row">
              <div class="metric">
                <span class="label">Estatura</span>
                <span class="value">{valoracion.estatura} cm</span>
              </div>
              <div class="metric">
                <span class="label">IMC</span>
                <span class="value">{valoracion.imc}</span>
              </div>
            </div>
            <div class="metric-row">
              <div class="metric">
                <span class="label">% Grasa</span>
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
        </div>
      {/each}
    </div>
  {:else}
    <p class="no-data">No hay valoraciones registradas</p>
  {/if}
</div>

<style>
  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
  }

  h1 {
    margin-bottom: 30px;
    color: #333;
  }

  .valoraciones-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
  }

  .valoracion-card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    overflow: hidden;
  }

  .card-header {
    background-color: #4CAF50;
    color: white;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .card-header h3 {
    margin: 0;
    font-size: 18px;
  }

  .fecha {
    font-size: 14px;
  }

  .card-body {
    padding: 20px;
  }

  .metric-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 15px;
  }

  .metric {
    display: flex;
    flex-direction: column;
  }

  .metric .label {
    font-size: 12px;
    color: #666;
    margin-bottom: 5px;
  }

  .metric .value {
    font-size: 20px;
    font-weight: bold;
    color: #333;
  }

  .observaciones {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #eee;
  }

  .observaciones strong {
    color: #333;
  }

  .observaciones p {
    margin: 5px 0 0 0;
    color: #666;
    font-size: 14px;
  }

  .no-data {
    text-align: center;
    color: #999;
    padding: 60px;
    font-size: 18px;
  }
</style>
