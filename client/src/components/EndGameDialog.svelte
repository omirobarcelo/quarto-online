<script>
  import Button from 'smelte/src/components/Button';

  import { gameState, ownTurn } from '../stores/game.store';
  import { sendState } from '../stores/websocket.store';

  function restart() {
    gameState.restart();
    sendState();
  }
</script>

<style>
  .backdrop {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9999;

    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .dialog {
    height: 65%;
  }

  @media (min-height: 768px) {
    .dialog {
      height: 50%;
    }
  }
</style>

<div class="backdrop">
  <div class="w-2/3 bg-white rounded-lg flex flex-col justify-center items-center p-12 xl:p-16 dialog">
    <h2 class="mb-10 xl:mb-12 text-5xl font-bold">You {$ownTurn ? 'win!' : 'lose...'}</h2>
    <Button light on:click={restart} class="mb-4">Restart</Button>
    <Button light href="/">Go Back</Button>
  </div>
</div>
