// @ts-ignore
import websocketStore from 'svelte-websocket-store';
import { derived, get } from 'svelte/store';

import { gameState } from './game.store';

export enum WSKind {
  Init = 'init',
  Self = 'self',
  Create = 'create',
  Join = 'join',
  ReqState = 'req-state',
  State = 'state'
}

abstract class WSData {
  kind: WSKind;
  data: any | undefined;
  error: { msg: string } | undefined;
}

class WSCreateRes extends WSData {
  kind = WSKind.Create;
  data: { roomKey: string };
}

class WSJoinRes extends WSData {
  kind = WSKind.Join;
  data: { success: boolean };
}

class WSReqStateRes extends WSData {
  kind = WSKind.ReqState;
  data: undefined;
}

class WSStateRes extends WSData {
  kind = WSKind.State;
  data: { die: number } | null;
}

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

export const errorWS = derived(
  wsStore,
  ($wsStore: WSData, set) => {
    if ($wsStore.error) {
      set($wsStore);
    }
  },
  undefined as WSData
);
