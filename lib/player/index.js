'use strict';

/**
 * Represents a user who can create and play in game sessions.
 */
class Player {
    /**
     * Prepares the player object for use by the server.
     * @param account {Account} The players account object.
     */
    constructor( account ) {
        if ( !account ) {
            throw new Error('Cannot create Player object without a valid account.');
        }

        this.name = null;
        this.account = account;
        this.keepAlive = Date.now();
        this.tags = new Map();
        this.playerType = Player.PlayerType.STANDARD;
    }

    /**
     * Adds a tag to the player object. A tag is a named blob of data, used to
     * remember certain information about operations being processed.
     *
     * @param tag {String} Name of the tag to be added.
     * @param timestamp {Number} Timestamp associated with the tag.
     * @param timeout {Number} Time (in milliseconds) before the tag is considered invalid.
     * @returns {boolean} True if the tag was added successfully otherwise false.
     */
    addTag(tag, timestamp, timeout) {
        if (!tag) {
            throw new Error('Player.addTag - No tag name was specified.');
        }

        if (this.tags.has(tag)) {
            return false;
        }

        this.tags.set( tag, { ts: timestamp, to: timeout } );
        return true;
    }

    /**
     * Removes a tag from the player object.
     * @param tag {String} Name of the tag to be removed.
     * @returns {boolean} True if the tag was removed successfully otherwise false.
     */
    removeTag(tag) {
        if (this.tags.has(tag)) {
            this.tags.delete(tag);
            return true;
        }

        return false;
    }
}

Player.PlayerType = {
    GUEST: 0,
    STANDARD: 1,
    ADMIN: 1000
};


module.exports = Player;
