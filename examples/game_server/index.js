/**
 * This example fire demonstrates how to setup a game-server for use with PlayCanvas
 *
 * We log a message to the console when a user connects or disconnects with the server.
 *
 */
const PlayCanvasServer = require('../../index.js');
const GameServer = PlayCanvasServer.GameServer;

const server = new GameServer();

// Register listeners for the connect and disconnect events.
server.addListener(GameServer.Events.CONNECT, function(name, data) {
    console.log('Example server detected a client connection.');
});

server.addListener(GameServer.Events.DISCONNECT, function(name, data) {
    console.log('Example server detected a client disconnect.');
});

// Run the game server on the default port
server.run();
