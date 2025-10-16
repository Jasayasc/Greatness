<script>
  import { page } from '$app/stores';
  
  $: currentPath = $page.url.pathname;
</script>

<nav>
  <div class="nav-container">
    <div class="logo">
      <h2>🏋️ Greatness Gym</h2>
    </div>
    <ul class="nav-links">
      <li>
        <a href="/" class:active={currentPath === '/'}>
          Inicio
        </a>
      </li>
      <li>
        <a href="/personas" class:active={currentPath.startsWith('/personas')}>
          Clientes
        </a>
      </li>
      <li>
        <a href="/mensualidades" class:active={currentPath === '/mensualidades'}>
          Mensualidades
        </a>
      </li>
      <li>
        <a href="/valoraciones" class:active={currentPath === '/valoraciones'}>
          Valoraciones
        </a>
      </li>
    </ul>
  </div>
</nav>

<style>
  nav {
    background-color: #333;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .nav-container {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
  }

  .logo h2 {
    color: white;
    margin: 0;
    padding: 15px 0;
  }

  .nav-links {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 5px;
  }

  .nav-links a {
    color: white;
    text-decoration: none;
    padding: 20px 20px;
    display: block;
    transition: background-color 0.3s;
  }

  .nav-links a:hover {
    background-color: #555;
  }

  .nav-links a.active {
    background-color: #4CAF50;
  }

  @media (max-width: 768px) {
    .nav-container {
      flex-direction: column;
      padding: 10px;
    }

    .nav-links {
      flex-wrap: wrap;
      justify-content: center;
    }

    .nav-links a {
      padding: 10px 15px;
    }
  }
</style>
