import type { Piece } from './piece.enum';

export interface GameState {
  turn: number;
  /** 4x4 matrix, null indicates empty space */
  board: (Piece | null)[][];
  piecesLeft: Piece[];
  pieceSelected: Piece | null;
  finished: boolean;
}
