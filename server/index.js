const { Server } = require('ws');

const DEV = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 3000;
const wss = new Server({ port: PORT });

const MAX_ROOMS = 10000;
const ROOM_SIZE = 2;
const KEY_LENGTH = 4;

/** @type {{ [roomKey: string]: Array<string> }} */
const rooms = {};

/** @type {{ [uid: string]: WebSocket }} */
const clientUidMap = {};

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
    console.log(data, data.kind);
    console.log('rooms', rooms);
    console.log('clients', Object.keys(clientUidMap));
    if (data.kind === 'self') {
      ws.send(JSON.stringify({ kind: 'self', data: 'received' }));
    } else {
      processMessage(ws, data);
    }
  });
  ws.on('close', () => {
    if (DEV) console.log(`Client ${ws.uid} disconnected`);
    cleanRoom(ws);
    delete clientUidMap[ws.uid];
  });
});

/**
 * Processess a message according to its kind
 * @param {WebSocket & { roomKey: string }} client 
 * @param {{ kind: string, data: any }} message 
 */
function processMessage(client, { kind, data }) {
  switch (kind) {
    case 'create':
      const roomKey = createRoom();
      client.roomKey = roomKey;
      sendData(client, 'create', { roomKey });
      break;
    case 'join':
      const success = joinRoom(client.uid, data?.roomKey);
      if (success) {
        client.roomKey = data.roomKey;
      } else {
        sendError(client, 'The room does not exist or is full.');
      }
      break;
    case 'echo':
      if (client.roomKey) {
        roomBroadcast(client.roomKey, 'echoed');
      }
      break;
    case 'leave':
      cleanRoom(client);
      break;
    default:
      sendError(client, `Sent message does not have a valid kind: ${kind}.`);
      break;
  }
}

/**
 * Generates a random 4-number key for the room and instantiates it
 * @returns The key for the room
 */
function createRoom() {
  // TODO handle max rooms created
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
 * Removes the client from the room and deletes the room if empty
 * @param {WebSocket & { roomKey: string }} client 
 */
function cleanRoom(client) {
  const roomKey = client.roomKey;
  if (roomKey != null) {
    delete client.roomKey;
    const room = rooms[roomKey];
    const idx = room.indexOf(client.uid);
    room.splice(idx, 1);
    if (room.length === 0) {
      delete rooms[roomKey];
    }
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
 * @param {any} data 
 */
function roomBroadcast(roomKey, data) {
  const room = rooms[roomKey];
  if (room) {
    room.forEach((clientUid) => {
      const client = clientUidMap[clientUid];
      if (client) {
        client.send(JSON.stringify({ data }))
      }
    });
  }
}

/**
 * Sends error to client
 * @param {WebSocket} client 
 * @param {string} errorMsg 
 */
function sendError(client, errorMsg) {
  client.send(JSON.stringify({ error: { msg: errorMsg } }));
}
