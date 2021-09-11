<script>
  import Button from 'smelte/src/components/Button';

  import { gameState, ownTurn } from '../stores/game.store';
  import { declareWin, sendState, winDeclarationWS } from '../stores/websocket.store';

  function finish() {
    gameState.finish();
    sendState();
  }
</script>

<style>
  .content {
    width: 100%;
  }

  @media (min-width: 1280px) {
    .content {
      width: 60%;
    }
  }
</style>

<div class="flex flex-col justify-center items-center space-y-4 content">
  <Button light block on:click={declareWin} disabled={!$ownTurn}>Win</Button>
  <Button light block on:click={finish} disabled={!$winDeclarationWS}>Concede</Button>
</div>
