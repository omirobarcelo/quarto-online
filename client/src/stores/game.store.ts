import { derived, writable } from 'svelte/store';

import type { GameState } from '../data/game-state.interface';
import { Piece } from '../data/piece.enum';

const INITIAL_STATE: GameState = {
  die: 1,
  turn: 0,
  board: [
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null]
  ],
  piecesLeft: Object.values(Piece),
  pieceSelected: null
};

let _player: number;

function initGameState() {
  const { subscribe, set, update } = writable(INITIAL_STATE);

  return {
    subscribe,
    set,
    restart: () => set(INITIAL_STATE),
    roll: () => update((state) => ({ ...state, die: Math.floor(Math.random() * 6) + 1, turn: state.turn + 1 }))
  };
}

export const gameState = initGameState();

export const setPlayer = (player: number) => (_player = player);

// When first player joins, the game state is set before _player is set, causing $ownTurn to be false
// when the second player joins the state is broadcasted, also updating ownTurn
export const ownTurn = derived(gameState, ({ turn }) => turn % 2 === _player);
