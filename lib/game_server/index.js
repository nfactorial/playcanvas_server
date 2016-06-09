'use strict';

const express = require('express');
const Http = require('http');
const SockJs = require('sockjs');
const Connection = require('../player/connection');
const SocketIO = require('socket.io');

const AuthService = require('../aws/cognito/auth_service');

const DEFAULT_PORT = 2000;
const DEFAULT_PREFIX = '/socket';
const DEFAULT_MAXIMUM_CONNECTIONS = 10;


/**
 * Represents the core game server that manages all users and session in progress.
 * This implementation is not intended for heavy load use, but only during development
 * when there are not many users.
 *
 * Once an instance of the GameServer object has been created, it must be started by
 * invoking the 'run' method.
 */
class GameServer {
    constructor() {
        this.app = null;
        this.port = DEFAULT_PORT;
        this.prefix = DEFAULT_PREFIX;
        this.httpServer = null;

        this.maximumConnections = DEFAULT_MAXIMUM_CONNECTIONS;
        this.connections = [];
        this.handlers = new Map();

        this.expressServer = express();
        this.expressServer.set('view engine', 'pug');

        AuthService.configure(this.expressServer);
    }

    /**
     * Starts the game server on the specified port.
     * @param port {Number=} The port number the server will listen on, if this is not specified the default will be used.
     */
    run(port) {
        this.port = port || DEFAULT_PORT;

        this.app = SockJs.createServer();

        this.app.on('connection', (socket) => {
            if (this.connections.length < this.maximumConnections) {
                const connection = new Connection( this, socket );
                this.connections.push( connection );
                this.fire( GameServer.Events.CONNECT, connection );
            } else {
                console.log('Connection denied, too many users');
                socket.close(1000, 'Server Full');
            }
        });

        this.httpServer = Http.createServer(this.expressServer);

        this.app.installHandlers(this.httpServer, {prefix: this.prefix});
        this.httpServer.listen(this.port, '0.0.0.0');

/*
        this.io = SocketIO(this.httpServer);
        this.io.on('connection', (socket) => {
            if (this.connections.length < this.maximumConnections) {
                const connection = new Connection(this, socket);
                this.connections.push(connection);
            } else {
                console.log('Connection denied, too many users.');
                socket.close(1000, 'Server full');
            }
        });
*/
    }

    /**
     * Registers a callback to be invoked when a particular event is raised.
     * @param name {String} Name of the event the callback wishes to listen for.
     * @param handler {function} The callback function to be invoked when the specified event is raised.
     */
    addListener(name, handler) {
        if (!this.handlers.has(name)) {
            this.handlers.set( name, [] );
        }

        this.handlers.get(name).push(handler);
    }

    /**
     * Removes a listener from a specified event.
     * @param name {String} Name of the event the listener wishes to be removed from.
     * @param handler {function} The callback function to be removed from the event.
     */
    removeListener(name, handler) {
        if (this.handlers.has(name)) {
            const listeners = this.handlers.get(name);

            const index = listeners.indexOf(handler);
            if (-1 !== index) {
                listeners.splice(index, 1);
            }
        }
    }

    /**
     * Raises an event within the game server, any listeners for this event will be notified.
     * @param name {String} Name of the event to be fired.
     * @param data {object} Data associated with the raised event.
     */
    fire(name, data) {
        if (this.handlers.has(name)) {
            this.handlers.get(name).forEach( e => {
                e(name, data);
            });
        }
    }

    /**
     * Removes a connection from the game server.
     * @param connection {Connection} The connection to be removed from the GameServer object.
     */
    removeConnection(connection) {
        if (!connection) {
            throw new Error('GameServer.removeConnection - No connection was specified.');
        }

        const index = this.connections.indexOf(connection);
        if (-1 === index) {
            console.log('GameServer.removeConnection - Specified connection could not be found.');
        } else {
            this.connections.splice(index, 1);
            this.fire(GameServer.Events.DISCONNECT, connection);
        }
    }
}

/**
 * List of events the game server may raise.
 * Interested code may subscribe or unsubscribe to these events
 * via the addListener and removeListener methods.
 */
GameServer.Events = {
    CONNECT: 'CONNECT',
    DISCONNECT: 'DISCONNECT'
};


module.exports = GameServer;
