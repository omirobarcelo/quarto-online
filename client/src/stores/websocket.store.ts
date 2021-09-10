// @ts-ignore
import websocketStore from 'svelte-websocket-store';
import { derived, get } from 'svelte/store';

import type { WSCreateRes, WSData, WSJoinRes, WSReqStateRes, WSStateRes } from '../data/websocket-data.class';
import { WSKind } from '../data/websocket-kind.enum';
import { gameState, setPlayer } from './game.store';

const initialValue = { kind: WSKind.Init };
export const wsStore = websocketStore('ws://localhost:3000/', initialValue);

export const selfWS = derived(
  wsStore,
  ($wsStore: WSData, set) => {
    if ($wsStore.kind === WSKind.Self) {
      set($wsStore);
    }
  },
  { kind: WSKind.Self }
);

export function self() {
  wsStore.set({ kind: WSKind.Self });
}

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
  console.log('join');
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
    console.log('send state');
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
    console.log('set state');
    gameState.set(data);
  }
});

export function sendState() {
  wsStore.set({ kind: WSKind.State, data: get(gameState) });
}

export const winDeclarationWS = derived(
  wsStore,
  ($wsStore: WSData, set) => {
    if ($wsStore.kind === WSKind.Win) {
      set(true);
    }
  },
  false
);

export function declareWin() {
  wsStore.set({ kind: WSKind.Win });
}

export const concedeWS = derived(
  wsStore,
  ($wsStore: WSData, set) => {
    if ($wsStore.kind === WSKind.Concede) {
      set(true);
    }
  },
  false
);

export function concede() {
  wsStore.set({ kind: WSKind.Concede });
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
