import type { GameState } from './game-state.interface';
import { WSKind } from './websocket-kind.enum';

export abstract class WSData {
  kind: WSKind;
  data: any | undefined;
  error: { msg: string } | undefined;
}

export class WSCreateRes extends WSData {
  kind = WSKind.Create;
  data: { roomKey: string };
}

export class WSJoinRes extends WSData {
  kind = WSKind.Join;
  data: { success: boolean; player: number };
}

export class WSReqStateRes extends WSData {
  kind = WSKind.ReqState;
  data: undefined;
}

export class WSStateRes extends WSData {
  kind = WSKind.State;
  data: GameState | null;
}
