<script>
  import { ownTurn, pieceSelected } from '../stores/game.store';
</script>

<style>
  .cell {
    width: 200px;
    height: 200px;
  }

  @media (min-width: 1280px) {
    .cell {
      width: 300px;
      height: 300px;
    }
  }
</style>

<div class="bg-blue-50 border-4 border-blue-900 rounded-lg cell">
  {#if $pieceSelected != null}
    <div class="w-full h-full flex justify-center items-center">
      {$pieceSelected}
    </div>
  {/if}
</div>

<p class="h-4 mt-2 text-lg">
  {#if $pieceSelected != null}
    {$ownTurn ? 'Your' : `Opponent's`} piece
  {/if}
</p>
