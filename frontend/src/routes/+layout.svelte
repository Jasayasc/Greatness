<script>
  import Navigation from '$lib/components/Navigation.svelte';
</script>

<div class="app">
  <Navigation />
  <main>
    <slot />
  </main>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background-color: #f5f5f5;
  }

  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  main {
    flex: 1;
  }

  :global(*) {
    box-sizing: border-box;
  }
</style>
