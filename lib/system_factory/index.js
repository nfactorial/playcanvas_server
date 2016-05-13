'use strict';

/**
 * Manages the creation of game systems within a running title.
 *
 * A game system is an object that manages a subset of processing within the
 * game. Game states specify which systems they require for their behaviour.
 */
class SystemFactory {
    constructor() {
        this.registry = new Map();
    }

    /**
     * Adds a new system to the factory object.
     * @param name {String} Name to be associated with the system object.
     * @param ctor {Function} Constructor function for the system object being registered.
     */
    register(name, ctor) {
        if (!name) {
            throw new Error('SystemFactory.register - No name was specified for system.');
        }

        if (!ctor) {
            throw new Error('SystemFactory.register - No ctor method was specified for system \'' + name + '\'.');
        }

        if (this.registry.has(name)) {
            throw new Error('SystemFactory.register - Specified system \'' + name + '\' already exists.');
        }

        this.registry.set(name, ctor);
    }

    /**
     * Removes a previously registered system from the factory.
     * @param name {String} Name associated with the system to be unregistered.
     */
    unregister(name) {
        if (!name) {
            throw new Error('SystemFactory.unregister - Expected name but none was specified.');
        }

        if (this.registry.has(name)) {
            this.registry.delete( name );
        } else {
            throw new Error('SystemFactory.unregister - Specified system \'' + name + '\' could not be found.');
        }
    }

    /**
     * Creates an instance of a system associated with a specified name.
     * @param name {String} Name of the system object to be created.
     * @returns {GameSystem} Instance of the requested system, if one could not be found this method will throw.
     */
    create(name) {
        if (!name) {
            throw new Error('SystemFactory.create - Specified system \'' + name + '\' could not be found.');
        }

        return new this.registry.get(name)();
    }
}

module.exports = SystemFactory;
