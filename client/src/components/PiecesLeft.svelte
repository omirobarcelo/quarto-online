<script lang="ts">
  import { Piece } from '../data/piece.enum';
  import { gameState, ownTurn, pieceSelected, piecesLeft } from '../stores/game.store';
  import { sendState } from '../stores/websocket.store';

  const pieces = Object.values(Piece);

  $: selectable = $ownTurn && $pieceSelected == null;

  function selectPiece(piece: Piece) {
    if (selectable) {
      gameState.selectPiece(piece);
      sendState();
    }
  }
</script>

<style>
  .content {
    display: grid;
    grid-template-columns: repeat(2, 100px);
    gap: 0.25rem;
  }

  .cell {
    width: 100px;
    height: 100px;
  }

  .selectable.cell:hover {
    cursor: pointer;
    --tw-bg-opacity: 0.8;
  }

  .piece {
    width: 80%;
  }

  @media (min-width: 1280px) {
    .content {
      grid-template-columns: repeat(2, 150px);
      gap: 0.5rem;
    }

    .cell {
      width: 150px;
      height: 150px;
    }
  }
</style>

<div class="h-full overflow-auto justify-center content">
  {#each pieces as piece}
    <div class="bg-blue-50 border-2 border-blue-900 rounded cell" class:selectable>
      {#if $piecesLeft.includes(piece)}
        <div class="w-full h-full flex justify-center items-center" on:click={() => selectPiece(piece)}>
          <img class="piece" src={`/assets/pieces/${piece}.svg`} alt={piece.toUpperCase()} />
        </div>
      {/if}
    </div>
  {/each}
</div>
