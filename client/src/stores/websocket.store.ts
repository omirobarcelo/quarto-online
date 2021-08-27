// @ts-ignore
import websocketStore from 'svelte-websocket-store';
import { derived } from 'svelte/store';

const initialValue = { data: 'init' };
export const myStore = websocketStore('ws://localhost:3000/', initialValue);

interface WSData {
  kind: string;
  data: any;
}
export const selfStore = derived(
  myStore,
  ($myStore: WSData, set) => {
    if ($myStore.kind === 'self') {
      set($myStore);
    }
  },
  { kind: 'self', ...initialValue }
);

export function self() {
  console.log('self in store');
  myStore.set({ kind: 'self' });
}
