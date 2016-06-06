'use strict';

const UpdateArgsBase = require('@nfactorial/game_state_js').UpdateArgs;

/**
 * This object contains methods and variables that are provided during each frame update.
 */
class UpdateArgs extends UpdateArgsBase {
    constructor() {
        super();

        this.session = null;
    }
}

module.exports = UpdateArgs;
