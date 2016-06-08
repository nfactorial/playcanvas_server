'use strict';

var chai = require('chai');
var expect = chai.expect;
const Session = require('../../lib/session');

/**
 * Mock class to aid in verifying the behavior of the session class.
 */
class MockStateTree {
    constructor() {
        this.initializeCalls = 0;
        this.destroyCalls = 0;
        this.updateCalls = 0;
    }

    onDestroy() {
        this.destroyCalls++;
    }

    onInitialize() {
        this.initializeCalls++;
    }

    onUpdate() {
        this.updateCalls++;
    }
}


/**
 * Verify the Session class behaves as expected.
 */
describe('session', function() {
    it('Should be empty when constructed', function() {
        const session = new Session();

        expect(session.isPrivate).to.be.true;
        expect(session.players.length).to.equal(0);
        expect(session.observers.length).to.equal(0);
        expect(session.stateTree).to.be.null;
    });

    it('Should pass the onInitialize calls the state tree', function() {
        const initArgs = {};
        const stateTree = new MockStateTree();
        const session = new Session();

        session.onInitialize(initArgs, stateTree);

        expect(session.stateTree).to.equal(stateTree);
        expect(stateTree.initializeCalls).to.equal(1);
        expect(stateTree.destroyCalls).to.equal(0);
        expect(stateTree.updateCalls).to.equal(0);
    });

    it('Should pass the onDestroy calls to the state tree', function() {
        const initArgs = {};
        const stateTree = new MockStateTree();
        const session = new Session();

        session.onInitialize(initArgs, stateTree);
        session.onDestroy();

        expect(session.stateTree).to.be.null;
        expect(stateTree.initializeCalls).to.equal(1);
        expect(stateTree.destroyCalls).to.equal(1);
        expect(stateTree.updateCalls).to.equal(0);
    });

    it('Should pass the onUpdate calls on to the state tree', function() {
        const initArgs = {};
        const updateArgs = {};
        const stateTree = new MockStateTree();
        const session = new Session();

        session.onInitialize(initArgs, stateTree);
        session.onUpdate(updateArgs);
        session.onUpdate(updateArgs);
        session.onUpdate(updateArgs);
        session.onDestroy();

        expect(session.stateTree).to.be.null;
        expect(stateTree.initializeCalls).to.equal(1);
        expect(stateTree.destroyCalls).to.equal(1);
        expect(stateTree.updateCalls).to.equal(3);
    });
});
