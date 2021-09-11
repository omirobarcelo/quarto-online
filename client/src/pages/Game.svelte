<script lang="ts">
  import Button from 'smelte/src/components/Button';
import PiecesLeft from '../components/PiecesLeft.svelte';

  import { WSKind } from '../data/websocket-kind.enum';
  import { gameState, ownTurn } from '../stores/game.store';
  import {
    concede,
    concedeWS,
    declareWin,
    errorWS,
    join,
    sendState,
    winDeclarationWS
  } from '../stores/websocket.store';

  export let roomKey: string;

  join(roomKey);

  function restart() {
    gameState.restart();
    sendState();
  }
</script>

<style>
  @font-face {
    font-family: 'Orbitron';
    src: url(/assets/fonts/Orbitron/Orbitron-VariableFont_wght.ttf),
      url(https://fonts.googleapis.com/css2?family=Orbitron&display=swap) format('truetype');
    font-weight: 400 900;
  }

  .header {
    height: 5%;
  }

  .content {
    height: 95%;
  }

  .selected-piece-area {
    flex: 1;
  }

  .game-area {
    flex: 2;
  }

  .pieces-left-area {
    flex: 1;
  }
</style>

{#if $errorWS?.kind === WSKind.Join}
  <div class="mt-32">
    <h4>There seems to have been some error</h4>
    <p class="mt-8">{$errorWS.error.msg}</p>
    <Button light class="mt-4" href="/">Go Back</Button>
  </div>
{:else}
  <!-- <div class="flex flex-col justify-center items-center">
    <div>This is the Game {roomKey}</div>
    <div>Game state: {JSON.stringify($gameState, undefined, 2)}</div>
    <Button on:click={restart} disabled={!$ownTurn}>Restart</Button>
    <Button on:click={declareWin} disabled={!$ownTurn}>Win</Button>
    <Button on:click={concede} disabled={!$winDeclarationWS}>Concede</Button>

    {#if $concedeWS}
      <div>You win!</div>
    {/if}
  </div> -->
  <header class="w-full bg-blue-500 rounded flex justify-center items-center text-gray-50 text-lg font-medium header">
    Game {roomKey}
  </header>
  <div class="flex content">
    <div class="bg-gray-500 h-full p-2 selected-piece-area"></div>
    <div class="bg-blue-200 h-full p-2 game-area"></div>
    <div class="h-full p-2 pieces-left-area">
      <PiecesLeft></PiecesLeft>
    </div>
  </div>
{/if}
