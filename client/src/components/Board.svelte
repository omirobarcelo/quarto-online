<script lang="ts">
  import { board, gameState, ownTurn, pieceSelected } from '../stores/game.store';
  import { sendState } from '../stores/websocket.store';

  function placePiece(x: number, y: number) {
    gameState.playPiece(x, y);
    sendState();
  }
</script>

<style>
  .board {
    display: grid;
    grid-template-rows: repeat(4, 100px);
    grid-template-columns: repeat(4, 100px);
  }

  .cell {
    width: 100px;
    height: 100px;
  }

  .selectable.cell:hover {
    cursor: pointer;
    --tw-bg-opacity: 0.8;
  }

  @media (min-width: 1280px) {
    .board {
      grid-template-rows: repeat(4, 130px);
      grid-template-columns: repeat(4, 130px);
    }

    .cell {
      width: 130px;
      height: 130px;
    }
  }
</style>

<div class="border-8 rounded-xl border-black board">
  {#each $board as row, i}
    {#each row as piece, j}
      <div
        class="bg-blue-50 border border-black cell"
        class:bg-blue-300={(i + j) % 2 === 1}
        class:selectable={$ownTurn && $pieceSelected != null && piece == null}
      >
        {#if piece != null}
          <div class="w-full h-full flex justify-center items-center">
            {piece}
          </div>
        {:else}
          <div class="w-full h-full" on:click={() => placePiece(i, j)} />
        {/if}
      </div>
    {/each}
  {/each}
</div>
