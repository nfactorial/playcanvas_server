'use strict';

const GameState = require('@nfactorial/game_state_js');


/**
 * Manages a single instance of a game session.
 *
 * Game sessions may be public or private.
 * A public session allows other users to observe a session in play.
 * A private session cannot be observed.
 *
 * Currently sessions are all run inside a single node server, however
 * this is not scalable to large (thousands+) numbers of sessions.
 * Eventually sessions should be hosted by external servers to the main
 * node application. Allowing us to scale horizontally at will.
 */
class Session {
    constructor() {
        this.isPrivate = true;
        this.startTime = Date.now();
        this.players = [];
        this.observers = [];
        this.stateTree =null;
    }

    /**
     * Called by the framework just before the session is about to be enabled.
     * @param initArgs {InitArgs} The InitArgs object to be supplied to the system objects with the state tree.
     * @param stateTree {StateTree} The state tree representing the currently running game.
     */
    onInitialize(initArgs, stateTree) {
        if (stateTree) {
            this.stateTree = stateTree;
            this.stateTree.onInitialize(initArgs);
        }
    }

    /**
     * Called by the framework when the session has been terminated.
     */
    onDestroy() {
        if (this.stateTree) {
            this.stateTree.onDestroy();
        }
    }

    /**
     * Called each frame when it's time to perform any processing.
     * @param updateArgs {UpdateArgs} Per-frame methods and variables.
     */
    onUpdate(updateArgs) {
        if(this.stateTree) {
            this.stateTree.onUpdate(updateArgs);
        }
    }

    /**
     * Attempts to add a player to the session.
     *
     * To join a session, a player must supply a token that allows
     * them access to the session.
     *
     * @param player {Player} The player who wishes to join the session.
     * @param accessToken {Number} Security key that identifies the user to the session.
     * @returns {boolean} True if the player joined the session successfully otherwise false.
     */
    addPlayer(player, accessToken) {
        return false;
    }

    /**
     * Attempts to add a player who wishes to observe the session.
     * @param player {Player} The player who wishes to join the session.
     * @param accessToken {Number} Security key that identifies the user to the session.
     * @returns {boolean} True if the player joined the session successfully otherwise false.
     */
    addObserver(player, accessToken) {
        if (!this.isPrivate) {
            //
        }

        return false;
    }
}

module.exports = Session;
