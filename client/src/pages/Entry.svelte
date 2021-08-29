<script lang="ts">
  import Button from 'smelte/src/components/Button';
  import Snackbar from 'smelte/src/components/Snackbar';
  import TextField from 'smelte/src/components/TextField';
  import { fade, fly } from 'svelte/transition';

  import { createWS, create } from '../stores/websocket.store';

  let roomNum = '';
  let copiedFlag = false;

  $: createdRoomNum = $createWS ? $createWS.data.roomKey : '';

  function copy() {
    navigator.clipboard.writeText(`${window.location.host}/#${createdRoomNum}`).then(() => (copiedFlag = true));
  }

  function join(roomKey: string) {
    window.location.assign(`#${roomKey}`);
  }
</script>

<style>
  @font-face {
    font-family: 'Orbitron';
    src: url(/assets/fonts/Orbitron/Orbitron-VariableFont_wght.ttf),
      url(https://fonts.googleapis.com/css2?family=Orbitron&display=swap) format('truetype');
    font-weight: 400 900;
  }

  .title .text {
    line-height: 1;
    font-family: 'Orbitron', 'Roboto', sans-serif;
    font-size: 8rem;
    padding: 0 4rem;
  }

  .title .decoration {
    width: 40%;
    height: 1rem;
    margin-left: auto;
    background-color: #00ff00;
  }

  .h-72p {
    height: 72px;
  }
</style>

<div class="w-full h-full flex flex-col items-center">
  <div class="mt-32 title">
    <div class="text" in:fly={{ delay: 200, duration: 500, y: -100 }}>Quarto</div>
    <div class="decoration" in:fade={{ delay: 800 }} />
  </div>
  <div class="mt-16 flex justify-center items-center space-x-4 py-2 h-72p">
    {#if !$createWS}
      <Button light on:click={create}>Create Room</Button>
    {:else}
      <div class="flex justify-center items-center space-x-0.5">
        <p>Created room #{createdRoomNum}</p>
        <Button color="dark" icon="content_copy" text light flat on:click={copy} />
      </div>
      <Button light on:click={() => join(createdRoomNum)}>Enter Room</Button>
    {/if}
  </div>
  <div class="mt-2 flex justify-center items-center space-x-4 py-2">
    <TextField label="Room number" bind:value={roomNum} />
    <Button light disabled={!/^\d{4}$/.test(roomNum)} on:click={() => join(roomNum)}>Join Room</Button>
  </div>
</div>

<Snackbar top bind:value={copiedFlag}>
  <div>Copied to clipboard.</div>
</Snackbar>
