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

        const split = message.toString().split("}");
        let messageWithConnectedClients = message.toString();
        if (split[0]?.length) {
            messageWithConnectedClients =
                split[0] + ',"connectedClients":' + wss.clients.size + "}";
        } else {
            console.warn("Message format is incorrect:", message.toString());
        }

        // Broadcast the message to all connected clients
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === 1) {
                client.send(messageWithConnectedClients); // Ensure the message is sent as a string
            }
        });
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
