'use strict';

var chai = require('chai');
var expect = chai.expect;
var StateTree = require('../../lib/state_tree');

/**
 * Verify the StateTree class behaves as expected.
 */
describe('state_tree', function() {
    it('Should be empty when constructed.', function() {
        const stateTree = new StateTree();

        expect(stateTree.name).to.be.null;
        expect(stateTree.defaultState).to.be.null;
        expect(stateTree.pendingState).to.be.null;
    });
});
