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

This module contains code for game state management however these
files may be extracted into the own indepenent module in the future.
