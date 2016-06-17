'use strict';

var express = require('express');

const DEFAULT_PORT = 51000;

/**
 * Implements a simple server that supplies script files to the PlayCanvas client.
 * By default the server listens on port 51000 however, this can be changed by
 * passing the desired port number to the run method.
 *
 * To run the server, create an instance of the object and call the run() method.
 */
class ScriptServer {
    constructor() {
        this.port = DEFAULT_PORT;
        this.app = null;
    }

    /**
     * Runs the script server instance.
     * @param appRoot {String} Root folder of the application.
     * @param scriptFolder {String=} Name of folder containing the script files to be served.
     * @param port {Number=} Port number the script server should listen on, if not specified the default port is used.
     */
    run(appRoot, scriptFolder, port) {
        if (!appRoot) {
            throw new Error('Cannot serve script files without an application root.');
        }

        this.port = port || DEFAULT_PORT;

        this.app = express();
        if (scriptFolder) {
            this.app.use(scriptFolder, express.static(appRoot + scriptFolder));
        } else {
            this.app.use('/', express.static(appRoot));
        }

        const self = this;
        this.app.listen(this.port, function() {
            console.log('Script server listening on port ' + self.port);
        });
    }
}

module.exports = ScriptServer;
