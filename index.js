/**
 * This library provides a simple framework for hosting a game using PlayCanvas.
 *
 * This module is not intended for use in high-load environments, but mostly as
 * an easy setup to get started with multi-player hosting using the PlayCanvas engine.
 *
 * To use the library, install it as a dependency in your node module using:
 *
 * npm install --save @nfactorial/playcanvas_server
 *
 * Once installed, require the module in your own library and instantiate an instance of
 * the GameServer object:
 *
 * var PlayCanvasServer = require('playcanvas_server');
 *
 * var gameServer = new PlayCanvasServer.GameServer();
 * gameServer.run();
 *
 * This will create a SockJs listener to which you may connect from your play-canvas client.
 *
 * See readme.md for further details on using this module.
 */

module.exports.Player = require('./lib/player');
module.exports.Session = require('./lib/session');
module.exports.GameServer = require('./lib/game_server');
module.exports.ScriptServer = require('./lib/script_server');
