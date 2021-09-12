<script lang="ts">
  import Button from 'smelte/src/components/Button';

  import Board from '../components/Board.svelte';
  import EndGameActions from '../components/EndGameActions.svelte';
  import EndGameDialog from '../components/EndGameDialog.svelte';
  import PiecesLeft from '../components/PiecesLeft.svelte';
  import SelectedPiece from '../components/SelectedPiece.svelte';
  import { WSKind } from '../data/websocket-kind.enum';
  import { finished,gameState } from '../stores/game.store';
  import { errorWS, join, sendState } from '../stores/websocket.store';

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

  .board-area {
    flex: 2;
  }

  .pieces-left-area {
    flex: 1;
  }

  .end-game-actions-area {
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
  <header class="w-full bg-blue-500 rounded flex justify-center items-center text-gray-50 text-lg font-medium header">
    Game {roomKey}
  </header>
  <div class="flex content">
    <div class="h-full p-2 flex flex-col items-center selected-piece-area">
      <div class="mt-4">
        <SelectedPiece></SelectedPiece>
      </div>
      <div class="w-full flex justify-center items-center end-game-actions-area">
        <EndGameActions></EndGameActions>
      </div>
    </div>
    <div class="h-full p-2 flex justify-center items-center board-area">
      <Board></Board>
    </div>
    <div class="h-full p-2 pieces-left-area">
      <PiecesLeft></PiecesLeft>
    </div>
  </div>

  {#if $finished}
    <EndGameDialog></EndGameDialog>
  {/if}
{/if}
