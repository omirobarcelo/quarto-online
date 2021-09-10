import { derived, writable } from 'svelte/store';

import type { GameState } from '../data/game-state.interface';
import { Piece } from '../data/piece.enum';

const INITIAL_STATE: GameState = {
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
    selectPiece: (piece: Piece) =>
      update((state) => ({
        ...state,
        pieceSelected: piece,
        piecesLeft: state.piecesLeft.filter((p) => p !== piece),
        turn: state.turn + 1
      })),
    playPiece: (x: number, y: number) =>
      update((state) => ({
        ...state,
        board: Object.assign([...state.board], {
          [x]: Object.assign([...state.board[x]], {
            [y]: state.pieceSelected
          })
        }),
        pieceSelected: null
      }))
  };
}

export const gameState = initGameState();

export const setPlayer = (player: number) => (_player = player);

// When first player joins, the game state is set before _player is set, causing $ownTurn to be false
// when the second player joins the state is broadcasted, also updating ownTurn
export const ownTurn = derived(gameState, ({ turn }) => turn % 2 === _player);

export const board = derived(gameState, ({ board }) => board);
export const piecesLeft = derived(gameState, ({ piecesLeft }) => piecesLeft);
export const pieceSelected = derived(gameState, ({ pieceSelected }) => pieceSelected);
