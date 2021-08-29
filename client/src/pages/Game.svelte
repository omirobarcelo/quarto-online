<script lang="ts">
  export let roomKey: string;
</script>

<style>
  @font-face {
    font-family: 'Orbitron';
    src: url(/assets/fonts/Orbitron/Orbitron-VariableFont_wght.ttf),
      url(https://fonts.googleapis.com/css2?family=Orbitron&display=swap) format('truetype');
    font-weight: 400 900;
  }
</style>

<main class="flex flex-col justify-center items-center">
  <div>This is the Game {roomKey}</div>
</main>
