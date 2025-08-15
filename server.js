import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });
let globalAverageLatitude = null;

const broadcastClientCount = () => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(
                JSON.stringify({
                    type: "connectedClients",
                    connectedClients: wss.clients.size,
                })
            );
        }
    });
};

const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
        if (ws.isAlive === false) {
            return ws.terminate();
        }

        ws.isAlive = false;
        ws.ping();
    });
}, 30000);

wss.on("close", () => {
    clearInterval(interval);
});

wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.isAlive = true;

    ws.on("pong", () => {
        ws.isAlive = true;
    });

    if (globalAverageLatitude !== null) {
        ws.send(
            JSON.stringify({
                type: "globalAverageLatitude",
                averageLatitude: globalAverageLatitude,
            })
        );
    }

    // Broadcast updated client count to all clients
    broadcastClientCount();

    ws.on("message", (message) => {
        console.log("Received message:", message.toString());

        try {
            const messageStr = message.toString();
            const parsed = JSON.parse(messageStr);
            if (typeof parsed === "object" && parsed !== null && parsed.type) {
                if (parsed.type === "heartbeat") {
                    ws.send(JSON.stringify({ type: "heartbeat_ack" }));
                    return;
                }
                if (
                    parsed.type === "globalAverageLatitude" &&
                    parsed.averageLatitude !== undefined
                ) {
                    globalAverageLatitude = parsed.averageLatitude;
                    console.log(
                        "Updated global average latitude:",
                        globalAverageLatitude
                    );
                }

                // Broadcast the message to all connected clients
                wss.clients.forEach((client) => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(messageStr);
                    }
                });
            } else {
                console.warn(
                    "Received invalid message format (missing type):",
                    parsed
                );
            }
        } catch (error) {
            console.error("Received invalid JSON message:", error);
            console.error("Raw message:", message.toString());
        }
    });

    ws.on("close", () => {
        console.log("Client disconnected");
        broadcastClientCount();
    });

    ws.on("error", (error) => {
        console.error("WebSocket error:", error);
    });
});

console.log("WebSocket server is running");
