const express = require('express');

const ws = require('ws');
const wss = new ws.Server(
    {
        port: 5000,
    },
    () => console.log('WebSocket server started on port', '5000')
);

wss.on('connection', (ws) => {
    /*ws.id = Date.now();*/

    ws.on('message', (message) => {
        message = JSON.parse(message);
        switch (message.event) {
            case 'message':
                broadcastMessage(message);
                break;
            case 'connection':
                broadcastMessage(message);
                break;
        }
    });
});

function broadcastMessage(message /*, id*/) {
    wss.clients.forEach((client) => {
        // if (client.id === id) {
        // }
        client.send(JSON.stringify(message));
    });
}
