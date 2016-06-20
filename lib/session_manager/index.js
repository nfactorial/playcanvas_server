'use strict';
const Session = require('../session');
const UpdateArgs = require('../update_args');

const DEFAULT_MAXIMUM_SESSIONS = 5;

const TIMESTEP = 16;    // Delay between updates (in milliseconds)


/**
 * Controls the sessions running on the current server.
 * The maximum number of supported sessions is controlled via the
 * maximumSessions variable, which defaults to 5.
 */
class SessionManager {
    constructor() {
        this.maximumSessions = DEFAULT_MAXIMUM_SESSIONS;
        this.updateArgs = new UpdateArgs(); // TODO: Allow UpdateArgs type to be specified
        this.lastTime = Date.now();
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
                var self = this;
                this.lastTime = Date.now();

                this.timeout = setInterval(function() {
                    const now = Date.now();

                    self.updateArgs.deltaTime = (now - self.lastTime) / 1000;
                    self.lastTime = now;

                    for (const session of self.sessions) {
                        self.updateArgs.session = session;

                        session.onUpdate(self.updateArgs);
                    }
                }, TIMESTEP);
            }

            return newSession;
        }

        return null;
    }

    /**
     * Deletes a session from the session manager.
     * @param session {Session} The session to be deleted.
     */
    deleteSession(session) {
        // NOTE: May make sense to process this on the next event loop rather than immediately
        const index = this.sessions.indexOf(session);
        if (index >= 0) {
            const session = this.sessions[index];

            this.sessions.splice(index, 1);

            session.onDestroy();

            if (!this.sessions.length && this.timeout) {
                clearInterval(this.timeout);
                this.timeout = null;
            }
        }
    }
}

module.exports = SessionManager;
