<script>
  import PersonaList from '$lib/components/PersonaList.svelte';
  import PersonaForm from '$lib/components/PersonaForm.svelte';
</script>

<main>
  <h1>🏋️ Greatness Fit Club</h1>
  
  <div class="dashboard">
    <div class="section">
      <PersonaForm on:success={() => alert('Cliente agregado exitosamente')} />
    </div>
    
    <div class="section">
      <PersonaList />
    </div>
  </div>
</main>

<style>
  main {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }

  h1 {
    text-align: center;
    color: #333;
    margin-bottom: 30px;
  }

  .dashboard {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 20px;
  }

  @media (max-width: 768px) {
    .dashboard {
      grid-template-columns: 1fr;
    }
  }
</style>
