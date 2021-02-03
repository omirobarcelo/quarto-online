const { Server } = require("ws");

const PORT = process.env.PORT || 3000;
const wss = new Server({ port: PORT });

wss.on("connection", (ws) => {
  console.log("Client connected");
  ws.send("something");
  ws.on("close", () => console.log("Client disconnected"));
});
