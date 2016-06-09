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

The GameServer object uses express to manage the HTTP requests, you may
add your own routes to the express application via the 'expressServer'
variable of the GameServer instance.
 
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

Facebook Authentication
=======================
The game server makes use of passport.js and Facebook to allow support
for user sign-user with Facebook. It then connects to Cognito on AWS to
help manage user accounts. In-order to provide this support, you must
provide a number of environment variables to configure the Facebook
authentication.

The settings for these variables should not be stored in version
control for security reasons.

FACEBOOK_APP_ID
Set to the application ID assigned to your facebook application.

FACEBOOK_APP_SECRET
Set to the application secret code assigned to your Facebook application.
For security reasons, you should only use the app secret on the server
side and it should not be present anywhere else. 

FACEBOOK_CALLBACK_URL
The URL to be invoked by Facebook once sign-in has completed.

AWS_ACCOUNT_ID
The ID of the AWS account to be used by the server.

AWS_REGION
The region which contains your Cognito identity pool.

AWS_IAM_ROLE_ARN
The IAM role to be used by the server.

AWS_COGNITO_IDENTITY_POOL_ID;
The identifier associated with the cognito identity pool to be used.
This value can be obtained from Cognito within the AWS console.

When facebook completes the authentication process, it redirects the
browser to a 'success' page. This module renders a template HTML file
in response and sends it to the user. The template file should reside
in the projects './views' folder. During rendering the template file
will be supplied with a variable called 'user' which contains the JSON
description of the logged in user.

Facebook sign-in can be disabled by.... [TODO!]
