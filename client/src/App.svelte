<script lang="ts">
  import 'smelte/src/tailwind.css';

  import Entry from './pages/Entry.svelte';

  import Button from 'smelte/src/components/Button';

  import { myStore, selfStore, self } from './stores/websocket.store';

  export let name: string;

  $: console.log($myStore);

  function create() {
    console.log('create');
    $myStore = { kind: 'create' };
  }

  function join() {
    console.log('join');
    $myStore = { kind: 'join', data: { roomKey: '6580' } };
  }

  function echo() {
    console.log('echo');
    $myStore = { kind: 'echo' };
  }

  // function self() {
  //   console.log('self');
  //   $myStore = { kind: 'self' };
  // }

  function leave() {
    console.log('leave');
    $myStore = { kind: 'leave' };
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
    <Button light on:click={create}>Create</Button>
    <Button light on:click={join}>Join</Button>
    <Button light on:click={echo}>Echo</Button>
    <Button light on:click={self}>Self</Button>
    <Button light on:click={leave}>Leave</Button>
  </div>

  <div>
    all: {$myStore.data}
  </div>
  <div>
    self: {$selfStore.data}
  </div>

  <Entry />
</main>
