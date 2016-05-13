'use strict';

class StateTree {
    constructor() {
        this.name = null;
        this.defaultState = null;
        this.pendingState = null;
    }

    /**
     * Prepares the state tree for use by the application using the supplied description.
     * @param desc {object} Description of the state tree layout.
     */
    initialize(desc) {
        if (!desc) {
            throw new Error('StateTree.initialize - No description was provided.');
        }

        this.name = desc.name;
    }

    update() {
        commitStateChange(this);

        commitStateChange(this);
    }
}

function findCommonAncestor(stateA, stateB) {
    if (!stateA) {
        throw new Error('findCommonAncestor - stateA was invalid.');
    }

    if (!stateB) {
        throw new Error('findCommonAncestor - stateB was invalid.');
    }

    // If they are the same state, we don't need to do anything further
    if (stateA === stateB) {
        return stateA;
    }

    // TODO: Determine common ancestor
}

function commitStateChange(stateTree) {
    if (stateTree.pendingState) {
        stateTree.pendingState = null;
    }
}

module.exports = StateTree;
