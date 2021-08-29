// @ts-ignore
import websocketStore from 'svelte-websocket-store';
import { derived } from 'svelte/store';

enum WSKind {
  Init = 'init',
  Self = 'self',
  Create = 'create'
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
  ($myStore: WSData, set) => {
    if ($myStore.kind === WSKind.Self) {
      set($myStore);
    }
  },
  { kind: WSKind.Self }
);

export function self() {
  wsStore.set({ kind: WSKind.Self });
}

export const createWS = derived(
  wsStore,
  ($myStore: WSData, set) => {
    if ($myStore.kind === WSKind.Create) {
      set($myStore);
    }
  },
  undefined as WSCreateRes
);

export function create() {
  wsStore.set({ kind: WSKind.Create });
}
