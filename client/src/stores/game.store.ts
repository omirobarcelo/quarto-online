import { writable } from 'svelte/store';

function initGameState() {
  const { subscribe, set } = writable({ die: 1 });

  return {
    subscribe,
    set,
    restart: () => set({ die: 1 }),
    roll: () => set({ die: Math.floor(Math.random() * 6) + 1 })
  };
}

export const gameState = initGameState();
