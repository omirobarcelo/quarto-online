<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import Button from 'smelte/src/components/Button';

  let visible = true;
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
</style>

<main class="flex flex-col justify-center items-center">
    <!-- <label>
        <input type="checkbox" bind:checked={visible}>
        visible
    </label> -->
    <!-- {#if visible} -->
  <div class="title">
    <div class="text" transition:fly={{ delay: 200, duration: 500, y: -100 }}>Quarto</div>
    <div class="decoration" transition:fade={{ delay: 800 }} />
  </div>
  <!-- {/if} -->
  <div class="py-2">
    <Button light>Join</Button>
  </div>
</main>
