'use strict';
const Session = require('../session');

const DEFAULT_MAXIMUM_SESSIONS = 5;

/**
 * Controls the sessions running on the current server.
 * The maximum number of supported sessions is controlled via the
 * maximumSessions variable, which defaults to 5.
 */
class SessionManager {
    constructor() {
        this.maximumSessions = DEFAULT_MAXIMUM_SESSIONS;
        this.sessions = [];
        this.timeout = null;
    }

    /**
     * Called by the framework when the session manager is being destroyed.
     */
    dispose() {
        for (const session of this.sessions) {
            session.onDestroy();
        }

        this.sessions = [];

        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    }

    /**
     * Creates a new session if a slot is available.
     * @param initArgs {InitArgs} The InitArgs object to be supplied to the system objects with the state tree.
     * @param stateTree {StateTree} The new tree representing the sessions behaviour.
     * @returns {Session} The newly created session, if one could not be created this method returns null.
     */
    createSession(initArgs, stateTree) {
        if (this.sessions.length < this.maximumSessions) {
            const newSession = new Session();

            this.sessions.push(newSession);

            newSession.onInitialize(initArgs, stateTree);
            if (!this.timeout) {
                this.timeout = setTimeout(function() {
                    //
                }, 16);
            }

            return newSession;
        }

        return null;
    }
}

module.exports = SessionManager;
