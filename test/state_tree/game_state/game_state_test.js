'use strict';

var chai = require('chai');
var expect = chai.expect;
var GameState = require('../../../lib/state_tree/game_state');

/**
 * Verify the GameState class behaves as expected.
 */
describe('game_state', function() {
    it('Should be empty when constructed.', function() {
        const gameState = new GameState();

        //expect(stateTree.pendingState).to.equal(null);
    });
});
