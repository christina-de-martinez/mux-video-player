import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
    console.log("Client connected");
    wss.clients.forEach((client) => {
        if (client.readyState === 1) {
            client.send(
                JSON.stringify({
                    type: "connectedClients",
                    connectedClients: wss.clients.size,
                })
            );
        }
    });

    ws.on("message", (message) => {
        console.log("Received message:", message.toString());

        try {
            const messageStr = message.toString();
            // validate that it's valid JSON
            const parsed = JSON.parse(messageStr);
            if (typeof parsed === "object" && parsed !== null && parsed.type) {
                // Broadcast the message to all connected clients
                wss.clients.forEach((client) => {
                    if (client !== ws && client.readyState === 1) {
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
        wss.clients.forEach((client) => {
            if (client.readyState === 1) {
                client.send(
                    JSON.stringify({
                        type: "connectedClients",
                        connectedClients: wss.clients.size,
                    })
                );
            }
        });
    });
});

console.log("WebSocket server is running");
