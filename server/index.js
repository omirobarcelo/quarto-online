const { Server } = require('ws');

const DEV = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 3000;
const wss = new Server({ port: PORT });

const MAX_ROOMS = 10000;
const ROOM_SIZE = 2;
const KEY_LENGTH = 4;

/** @type {{ [roomKey: string]: Array<string> }} */
const rooms = {};

/** @type {{ [uid: string]: WebSocket & { uid: string; roomKey: string | undefined; player: number | undefined }} */
const clientUidMap = {};

/** @type Array<string> */
let emptyRooms = [];

// Daily empty room cleanup
// Necessary to do it in 2 steps (mark and remove) because if the current empty rooms are removed,
// if the cleanup happens in between a client creates a room and joins it, the newly created room
// would be removed
if (!DEV) {
  setInterval(() => {
    unmarkEmptyRooms();
    removeEmptyRooms();
    markEmptyRooms();
  }, 24 * 60 * 60 * 1000);
}

wss.getUniqueID = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return s4() + s4() + '-' + s4();
};

wss.on('connection', (ws) => {
  ws.uid = wss.getUniqueID();
  clientUidMap[ws.uid] = ws;
  if (DEV) console.log(`Client ${ws.uid} connected`);
  ws.on('message', (data) => {
    data = JSON.parse(data);
    if (DEV) console.log(`Preprocessing ${data.kind}:\n${JSON.stringify(data.data, undefined, 2)}`);
    processMessage(ws, data);
  });
  ws.on('close', () => {
    if (DEV) console.log(`Client ${ws.uid} disconnected`);
    cleanRoom(ws);
    delete clientUidMap[ws.uid];
  });
});

/**
 * Processess a message according to its kind
 * @param {WebSocket & { uid: string; roomKey: string | undefined; player: number | undefined }} client
 * @param {{ kind: string, data: any }} message
 */
function processMessage(client, { kind, data }) {
  switch (kind) {
    case 'create':
      const roomKey = createRoom();
      if (roomKey) {
        sendData(client, 'create', { roomKey });
      } else {
        sendError(client, 'create', 'Maximum number of rooms created.');
      }
      break;
    case 'join':
      const success = joinRoom(client.uid, data?.roomKey);
      if (success) {
        client.roomKey = data.roomKey;
        const room = rooms[client.roomKey];
        client.player = room.length === 1 ? 0 : (clientUidMap[room[0]].player + 1) % ROOM_SIZE;
        sendData(client, 'join', { success: true, player: client.player });
      } else {
        sendError(client, 'join', 'The room does not exist or is full.');
      }
      break;
    case 'req-state':
      if (client.roomKey) {
        const room = rooms[client.roomKey];
        // If room only has one client, the current client owns the state
        // so it does not need to request it
        if (room.length > 1) {
          sendData(clientUidMap[room[0]], 'req-state', {});
        }
      }
      break;
    case 'state':
      if (client.roomKey) {
        roomBroadcast(client.roomKey, 'state', data);
      }
      break;
    case 'win':
      if (client.roomKey) {
        roomBroadcast(client.roomKey, 'win', { player: client.player });
      }
      break;
    case 'leave':
      cleanRoom(client);
      break;
    default:
      sendError(client, kind, `Sent message does not have a valid kind: ${kind}.`);
      break;
  }
}

/**
 * Generates a random 4-number key for the room and instantiates it
 * @returns The key for the room
 */
function createRoom() {
  // TODO handle max rooms created error
  if (Object.keys(rooms).length >= MAX_ROOMS) {
    return undefined;
  }
  let roomKey = '';
  do {
    const roomNum = Math.floor(Math.random() * MAX_ROOMS);
    roomKey = roomNum.toString(10).padStart(KEY_LENGTH, '0');
  } while (Object.keys(rooms).includes(roomKey));
  rooms[roomKey] = [];
  return roomKey;
}

/**
 * Joins a room
 * @param {string} uid
 * @param {string} roomKey
 * @returns true if successful join, false otherwise
 */
function joinRoom(uid, roomKey) {
  // TODO handle specific error
  const room = rooms[roomKey];
  if (room && room.length < ROOM_SIZE) {
    room.push(uid);
    return true;
  }
  return false;
}

/**
 * Removes the client from the room
 * @param {WebSocket & { roomKey: string }} client
 */
function cleanRoom(client) {
  const roomKey = client.roomKey;
  if (roomKey != null) {
    delete client.roomKey;
    const room = rooms[roomKey];
    const idx = room.indexOf(client.uid);
    room.splice(idx, 1);
  }
}

/**
 * Sends data to client
 * @param {WebSocket} client
 * @param {string} kind
 * @param {any} data
 */
function sendData(client, kind, data) {
  client.send(JSON.stringify({ kind, data }));
}

/**
 * Broadcasts data to entire room
 * @param {string} roomKey
 * @param {string} kind
 * @param {any} data
 */
function roomBroadcast(roomKey, kind, data) {
  const room = rooms[roomKey];
  if (room) {
    room.forEach((clientUid) => {
      const client = clientUidMap[clientUid];
      if (client) {
        client.send(JSON.stringify({ kind, data }));
      }
    });
  }
}

/**
 * Sends error to client
 * @param {WebSocket} client
 * @param {string} kind
 * @param {string} errorMsg
 */
function sendError(client, kind, errorMsg) {
  client.send(JSON.stringify({ kind, error: { msg: errorMsg } }));
}

/**
 * Removes occupied rooms that were marked as empty
 */
function unmarkEmptyRooms() {
  const currentEmptyRooms = [];
  emptyRooms.forEach((roomKey) => {
    const room = rooms[roomKey];
    if (room?.length === 0) {
      currentEmptyRooms.push(roomKey);
    }
  });
  emptyRooms = [...currentEmptyRooms];
}

/**
 * Deletes empty rooms
 */
function removeEmptyRooms() {
  emptyRooms.forEach((roomKey) => delete rooms[roomKey]);
}

/**
 * Marks empty rooms
 */
function markEmptyRooms() {
  emptyRooms = [];
  Object.entries(rooms).forEach(([roomKey, room]) => {
    if (room.length === 0) {
      emptyRooms.push(roomKey);
    }
  });
}
