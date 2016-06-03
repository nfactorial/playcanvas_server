'use strict';

var chai = require('chai');
var expect = chai.expect;
const SessionManager = require('../../lib/session_manager');
const StateTree = require('@nfactorial/game_state_js').StateTree;

/**
 * Verify the SessionManager class behaves as expected.
 */
describe('session_manager', function() {
    it('Should be empty when constructed.', function() {
        const sessionManager = new SessionManager();

        expect(sessionManager.maximumSessions).to.equal(5);
        expect(sessionManager.sessions.length).to.equal(0);
        expect(sessionManager.timeout).to.be.null;
    });

    it('Should allow sessions to be created.', function() {
        const mockFactory = {};
        const mockInitArgs = {};
        const testData = require('./test_state_tree.json');
        const testTree = new StateTree(mockFactory, testData);

        const sessionManager = new SessionManager();

        expect(sessionManager.timeout).to.be.null;

        for (let loop = 0; loop < sessionManager.maximumSessions; ++loop) {
            const session = sessionManager.createSession(mockInitArgs, testTree);

            expect(session).not.to.be.null;
            expect(sessionManager.timeout).not.to.be.null;
        }

        // Session manager is now full, ensure it correctly fails
        // to create another session
        expect(sessionManager.createSession()).to.be.null;

        // Also check dispose works correctly so the session manager doesn't
        // continue to update.
        sessionManager.dispose();

        expect(sessionManager.sessions.length).to.equal(0);
        expect(sessionManager.timeout).to.be.null;
    });
});
