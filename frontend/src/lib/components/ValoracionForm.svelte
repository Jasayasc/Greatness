<script>
  import { valoracionesAPI } from '../api/valoraciones';
  import { createEventDispatcher } from 'svelte';

  export let id_persona;

  const dispatch = createEventDispatcher();

  let formData = {
    id_persona: id_persona,
    fecha_valoracion: new Date().toISOString().split('T')[0],
    edad: '',
    peso: '',
    estatura: '',
    imc: '',
    porcentaje_grasa: '',
    observaciones: '',
    medidas: []
  };

  const tiposMedidas = [
    'CUELLO', 'HOMBRO', 'PECTORAL', 'BRAZO_D', 'BRAZO_I', 
    'ANTE_D', 'ANTE_I', 'CINTURA', 'ABDOMEN', 'CADERA', 
    'MUSLO_D', 'MUSLO_I', 'PANTORRILLA_D', 'PANTORRILLA_I'
  ];

  let medidas = {};

  function calcularIMC() {
    if (formData.peso && formData.estatura) {
      const estaturaMetros = formData.estatura / 100;
      formData.imc = (formData.peso / (estaturaMetros * estaturaMetros)).toFixed(2);
    }
  }

  async function handleSubmit() {
    try {
      // Convertir medidas a array
      formData.medidas = Object.entries(medidas)
        .filter(([key, value]) => value)
        .map(([tipo_medida, valor]) => ({ tipo_medida, valor: parseFloat(valor) }));

      await valoracionesAPI.create(formData);
      dispatch('success');
      alert('Valoración guardada exitosamente');
    } catch (error) {
      alert('Error al guardar valoración');
      console.error(error);
    }
  }
</script>

<div class="valoracion-form">
  <h2>Nueva Valoración Física</h2>
  
  <form on:submit|preventDefault={handleSubmit}>
    <div class="form-row">
      <div class="form-group">
        <label>Fecha:</label>
        <input type="date" bind:value={formData.fecha_valoracion} required />
      </div>
      
      <div class="form-group">
        <label>Edad:</label>
        <input type="number" bind:value={formData.edad} required />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>Peso (kg):</label>
        <input 
          type="number" 
          step="0.1" 
          bind:value={formData.peso} 
          on:input={calcularIMC}
          required 
        />
      </div>
      
      <div class="form-group">
        <label>Estatura (cm):</label>
        <input 
          type="number" 
          step="0.1" 
          bind:value={formData.estatura}
          on:input={calcularIMC}
          required 
        />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>IMC:</label>
        <input type="number" step="0.01" bind:value={formData.imc} readonly />
      </div>
      
      <div class="form-group">
        <label>% Grasa:</label>
        <input type="number" step="0.1" bind:value={formData.porcentaje_grasa} />
      </div>
    </div>

    <h3>Medidas Corporales (cm)</h3>
    <div class="medidas-grid">
      {#each tiposMedidas as tipo}
        <div class="form-group">
          <label>{tipo.replace('_', ' ')}:</label>
          <input type="number" step="0.1" bind:value={medidas[tipo]} />
        </div>
      {/each}
    </div>

    <div class="form-group">
      <label>Observaciones:</label>
      <textarea bind:value={formData.observaciones} rows="4"></textarea>
    </div>

    <button type="submit">Guardar Valoración</button>
  </form>
</div>

<style>
  .valoracion-form {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
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

  input, textarea {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .medidas-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 15px;
  }

  h3 {
    margin-top: 20px;
    margin-bottom: 10px;
  }

  button {
    width: 100%;
    padding: 12px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }

  button:hover {
    background-color: #45a049;
  }
</style>
