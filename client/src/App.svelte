<script lang="ts">
  import 'smelte/src/tailwind.css';

  import Button from "smelte/src/components/Button";

  import { myStore } from './stores/websocket.store.js';

  export let name: string;

  $: console.log($myStore);

  function handler() {
	  console.log('handled');
    $myStore = { data: 'some_data' };
  }
</script>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>

<main>
  <h1>Hello {name}!</h1>
  <p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>

  <div class="py-2">
	<Button light on:click={handler}>Button</Button>
  </div>

  <div>
    {$myStore}
  </div>
</main>
