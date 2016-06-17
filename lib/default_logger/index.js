'use strict';

class DefaultLogger {
    constructor() {
        //
    }

    info(message) {
        console.log(message);
    }

    warn(message) {
        console.log(message);
    }

    err(message) {
        console.log(message);
    }
}

module.exports = DefaultLogger;
