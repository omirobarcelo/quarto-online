<script lang="ts">
  import 'smelte/src/tailwind.css';
  import { onDestroy } from 'svelte';

  import Entry from './pages/Entry.svelte';
  import Game from './pages/Game.svelte';

  let hash = window.location.hash;
  const updateHash = () => (hash = window.location.hash);
  window.addEventListener('hashchange', updateHash);
  onDestroy(() => window.removeEventListener('hashchange', updateHash));
</script>

<style>
  main {
    width: 100%;
    height: 100%;
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }
</style>

<main>
  {#if !hash}
    <Entry />
  {:else}
    <Game roomKey={hash.slice(1)} />
  {/if}
</main>
