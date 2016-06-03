'use strict';

/**
 * This object contains methods and variables that are provided during each frame update.
 */
class UpdateArgs {
    constructor() {
        this.session = null;
        this.deltaTime = 0;
    }
}

module.exports = UpdateArgs;
