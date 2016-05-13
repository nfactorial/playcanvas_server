'use strict';

/**
 * Base class for all game systems in the running application.
 *
 * A game system is a subset of processing for a game instance.
 *
 * Game systems exist for the duration of a game that is in progress, however
 * they are only considered active when they reside within the hierarchy of
 * an active game state.
 *
 * When a game state they reside within becomes active, the systems 'onActivate'
 * method will be invoked. This allows the system to prepare itself for processing.
 *
 * Whilst active, the systems onUpdate method will be invoked during each time step
 * of the running application.
 *
 * When the game switches to another branch in the state tree where the system is
 * not present, the system will then have its onDeactivate method invoked by the
 * framework. The onUpdate method will not be invoked whilst a system is considered
 * inactive.
 *
 * The onActivate method may be invoked again, if the title once again enters a branch
 * of the state tree where the game system is considered active.
 */
class GameSystem {
    constructor() {
    }

    /**
     * Called when the game system is being activated within the running application.
     * @param initArgs {ActivateArgs} Parameters describing the current game instance.
     */
    onActivate(activateArgs) {
        //
    }

    /**
     * Called when the game system is being de-activated within the running application.
     */
    onDeactivate() {
        //
    }

    /**
     * Each each game step when the system is considered active within the current state tree.
     * @param updateArgs {UpdateArgs} Information about the current frame being processed.
     */
    onUpdate(updateArgs) {
        //
    }
}

module.exports = GameSystem;
