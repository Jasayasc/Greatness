<script>
  import { personas } from '../stores/personas';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let formData = {
    nombre: '',
    apellido: '',
    celular: ''
  };

  async function handleSubmit() {
    try {
      await personas.add(formData);
      dispatch('success');
      formData = { nombre: '', apellido: '', celular: '' };
    } catch (error) {
      alert('Error al guardar persona');
    }
  }
</script>

<div class="form-container">
  <h2>Nuevo Cliente</h2>
  
  <form on:submit|preventDefault={handleSubmit}>
    <div class="form-group">
      <label for="nombre">Nombre:</label>
      <input 
        type="text" 
        id="nombre" 
        bind:value={formData.nombre} 
        required 
      />
    </div>

    <div class="form-group">
      <label for="apellido">Apellido:</label>
      <input 
        type="text" 
        id="apellido" 
        bind:value={formData.apellido} 
        required 
      />
    </div>

    <div class="form-group">
      <label for="celular">Celular:</label>
      <input 
        type="tel" 
        id="celular" 
        bind:value={formData.celular} 
      />
    </div>

    <button type="submit">Guardar Cliente</button>
  </form>
</div>

<style>
  .form-container {
    max-width: 500px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
  }

  .form-group {
    margin-bottom: 15px;
  }

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  button {
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    width: 100%;
  }

  button:hover {
    background-color: #45a049;
  }
</style>
