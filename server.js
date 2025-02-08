import http from "http";
import app from "./app.js";
import { setupSocketServer } from "./socket/socketServer.js";

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

setupSocketServer(server); // ✅ Attach WebSockets

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
