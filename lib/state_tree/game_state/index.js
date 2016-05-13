'use strict';

class GameState {
    constructor(name) {
        this.name = name;
        this.parent = null;
        this.children = [];
        this.systems = [];
    }

    /**
     * Determines if the immediate hierarchy of this game state contains the specified state.
     * @param name {String} Name of the state to be found
     * @returns {boolean} True if the specified state exists within the parent hierarchy otherwise false.
     */
    hasParent(name) {
        if (this.name === name) {
            return true;
        }

        if (this.parent) {
            return this.parent.hasParent(name);
        }

        return false;
    }

    /**
     * Called each step of the game server.
     * @param updateArgs {UpdateArgs} Variables describing the current game step.
     */
    onUpdate(updateArgs) {
        if (this.parent) {
            this.parent.onUpdate(updateArgs);
        }

        this.systems.forEach( e => { e.onUpdate(updateArgs); } );
    }

    /**
     * Called when the game has entered a state branch where we are enabled.
     * @param initArgs
     */
    onEnter(initArgs) {
        this.systems.forEach( e => { e.onEnter(initArgs); } );
    }

    /**
     * Called when the game has entered a state branch where we are *not* enabled.
     */
    onExit() {
        this.systems.forEach( e => { e.onExit(); } );
    }
}

module.exports = GameState;
