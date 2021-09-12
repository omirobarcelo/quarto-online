// @ts-ignore
import websocketStore from 'svelte-websocket-store';
import { derived, get } from 'svelte/store';

import type { WSCreateRes, WSData, WSJoinRes, WSReqStateRes, WSStateRes, WSWinRes } from '../data/websocket-data.class';
import { WSKind } from '../data/websocket-kind.enum';
import { finished, gameState, getPlayer, setPlayer } from './game.store';

const initialValue = { kind: WSKind.Init };
const wsStore = websocketStore('ws://localhost:3000/', initialValue);

export const createWS = derived(
  wsStore,
  ($wsStore: WSData, set) => {
    if ($wsStore.kind === WSKind.Create) {
      set($wsStore);
    }
  },
  undefined as WSCreateRes
);

export function create() {
  wsStore.set({ kind: WSKind.Create });
}

export const joinWS = derived(
  wsStore,
  ($wsStore: WSData, set) => {
    if ($wsStore.kind === WSKind.Join && !$wsStore.error) {
      set($wsStore);
    }
  },
  { kind: WSKind.Join, data: { success: false } } as WSJoinRes
);

joinWS.subscribe(({ data }) => {
  if (data.success) {
    requestState();
    setPlayer(data.player);
  }
});

export function join(roomKey: string) {
  wsStore.set({ kind: WSKind.Join, data: { roomKey } });
}

export const reqStateWS = derived(
  wsStore,
  ($wsStore: WSData, set) => {
    if ($wsStore.kind === WSKind.ReqState) {
      set($wsStore);
    }
  },
  undefined as WSReqStateRes
);

reqStateWS.subscribe((wsMsg) => {
  if (wsMsg) {
    sendState();
  }
});

export function requestState() {
  wsStore.set({ kind: WSKind.ReqState });
}

export const stateWS = derived(
  wsStore,
  ($wsStore: WSData, set) => {
    if ($wsStore.kind === WSKind.State) {
      set($wsStore);
    }
  },
  { kind: WSKind.State, data: null } as WSStateRes
);

stateWS.subscribe(({ data }) => {
  if (data) {
    gameState.set(data);
  }
});

export function sendState() {
  wsStore.set({ kind: WSKind.State, data: get(gameState) });
}

export const winDeclarationWS = derived(
  [wsStore, finished],
  ([$wsStore, $finished], set) => {
    if (($wsStore as WSData).kind === WSKind.Win && ($wsStore as WSWinRes).data.player !== getPlayer()) {
      set(true);
    }
    if ($finished) {
      set(false);
    }
  },
  false
);

export function declareWin() {
  wsStore.set({ kind: WSKind.Win });
}

export const errorWS = derived(
  wsStore,
  ($wsStore: WSData, set) => {
    if ($wsStore.error) {
      set($wsStore);
    }
  },
  undefined as WSData
);
