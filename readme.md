## Build status

| [Linux][lin-link] |
| :---------------: |
| ![lin-badge]      |

[lin-badge]: https://travis-ci.org/nfactorial/playcanvas_server.svg?branch=master "Travis build status"
[lin-link]:  https://travis-ci.org/nfactorial/playcanvas_server "Travis build status"

PlayCanvas Server
=================
Node server code for PlayCanvas title development.
The server code in this module is not intended for production
deployment but, rather, to quickly get up and running with a server
for early testing.

```
git clone https://github.com/nfactorial/playcanvas_server
npm install
```

To run the unit tests you must have mocha installed:

```
npm install -g mocha
```

Once mocha is installed, the unit tests can be run with:

```
npm run test
```

This library makes use of the game state module also available via
npm.

Usage
=====
To use this library, install it into your project using npm:
```
npm install --save @nfactorial/playcanvas_server
```
Then, inside your main entry file, require the module, create
an instance of the GameServer object and then invoke the run method:
```
const GameServer = require('@nfactorial/playcanvas_server').GameServer;

const game = new GameServer();

game.run();
```
By default, the game server will listen on port 2000. You may change
this by supplying the port number as a parameter to the run method.
 
Script Server
=============
During development it is useful for your PlayCanvas scripts to be
supplied from your local machine. Allowing you to iterate quickly on
script development, to simplify setup for this the module supplies
a simply configured script server that can be taken advantage of.

To create a script server, require the module, create an instance of
the ScriptServer object and then invoke the run method:
```
const ScriptServer = require('@nfactorial/playcanvas_server').ScriptServer;

const scripts = new ScriptServer();

scripts.run(__dirname, '/development');
```
The PlayCanvas editor expects scripts to be supplied on port 9000 and
the ScriptServer object defaults to this port number. The first
parameter supplied to the run method specifies the root directory on
the local machine and the second parameter specifies the sub-folder
where the script files located. Scripts also reside within a 'scripts'
folder. For example, if we specify '/development' (as we have in the
above example) the file 'myscript.js' would be located at
'./development/scripts/myscript.js'.

Script servers should only be used when running locally.
