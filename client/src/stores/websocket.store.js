import websocketStore from "svelte-websocket-store";

const initialValue = { data: 'init' };
export const myStore = websocketStore("ws://localhost:3000/", initialValue);