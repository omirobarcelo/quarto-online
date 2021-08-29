// @ts-ignore
import websocketStore from 'svelte-websocket-store';
import { derived } from 'svelte/store';

export enum WSKind {
  Init = 'init',
  Self = 'self',
  Create = 'create',
  Join = 'join'
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

export function join(roomKey: string) {
  console.log('join');
  wsStore.set({ kind: WSKind.Join, data: { roomKey } });
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
