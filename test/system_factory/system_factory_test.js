'use strict';

var chai = require('chai');
var expect = chai.expect;
var SystemFactory = require('../../lib/system_factory');

/**
 * Verify the SystemFactory class behaves as expected.
 */
describe('system_factory', function() {
    it('Should be empty when constructed.', function() {
        const factory = new SystemFactory();

        expect(factory.registry.size).to.equal(0);
    });

    it('Should not allow invalid entries to be registered.', function() {
        const factory = new SystemFactory();

        expect(function() {
            factory.register(null, function() {} );
        }).to.throw('SystemFactory.register - No name was specified for system.');

        expect(function() {
            factory.register('test', null);
        }).to.throw('SystemFactory.register - No ctor method was specified for system');
    });

    it('Should allow valid entries to be registered.', function() {
        const factory = new SystemFactory();

        const testName = 'test';
        const testCtor = function() {};

        expect(function() {
            factory.register(testName, testCtor);
        }).not.to.throw();

        expect(factory.registry.has(testName)).to.equal(true);
    });

    it('Should not allow entries to be registered multiple times.', function() {
        const factory = new SystemFactory();

        const testName = 'test';
        const testCtor = function() {};

        expect(function() {
            factory.register(testName, testCtor);
        }).not.to.throw();

        expect(function() {
            factory.register(testName, testCtor);
        }).to.throw('SystemFactory.register - Specified system');

        expect(factory.registry.has(testName)).to.equal(true);
    });

    it('Should allow entries to be unregistered.', function() {
        const factory = new SystemFactory();

        const testName = 'test';
        const testCtor = function() {};

        expect(function() {
            factory.register(testName, testCtor);
        }).not.to.throw();

        expect(factory.registry.has(testName)).to.equal(true);

        expect(function() {
            factory.unregister(testName);
        }).not.to.throw();

        expect(factory.registry.has(testName)).to.equal(false);

        expect(function() {
            factory.register(testName, testCtor);
        }).not.to.throw();

        expect(factory.registry.has(testName)).to.equal(true);
    });
});
