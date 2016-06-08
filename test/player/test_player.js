'use strict';

var chai = require('chai');
var expect = chai.expect;
var Player = require('../../lib/player');

/**
 * Verify the Player class behaves as expected.
 */
describe('player', function() {
    it('Should throw if no account is supplied.', function() {
        expect(function() {
            new Player();
        }).to.throw('Cannot create Player object without a valid account.');

        expect(function() {
            new Player(undefined);
        }).to.throw('Cannot create Player object without a valid account.');

        expect(function() {
            new Player(null);
        }).to.throw('Cannot create Player object without a valid account.');
    });

    it('Should construct with default settings.', function() {
        const testAccount = {};
        const player = new Player(testAccount);

        expect(player.name).to.be.null;
        expect(player.account).to.equal(testAccount);
        expect(player.tags.size).to.equal(0);
        expect(player.playerType).to.equal(Player.PlayerType.STANDARD);
    });

    it('Should throw if no tag is specified when calling addTag.', function() {
        const testAccount = {};
        const player = new Player(testAccount);

        expect(function() {
            player.addTag(null, Date.now(), 1000);
        }).to.throw('Player.addTag - No tag name was specified.');
    });

    it('Should allow tags to be added and removed.', function() {
        const tagName = 'TestTag';
        const tagName2 = 'TestTag2';

        const testAccount = {};
        const player = new Player(testAccount);

        // Test addTag API call
        expect(player.addTag(tagName)).to.be.true;
        expect(player.addTag(tagName)).to.be.false;
        expect(player.addTag(tagName2)).to.be.true;
        expect(player.addTag(tagName2)).to.be.false;

        // Test removeTag API call
        expect(player.removeTag(tagName)).to.be.true;
        expect(player.removeTag(tagName)).to.be.false;
        expect(player.removeTag(tagName2)).to.be.true;
        expect(player.removeTag(tagName2)).to.be.false;

        // Ensure re-adding tags works as expected
        expect(player.addTag(tagName)).to.be.true;
        expect(player.addTag(tagName)).to.be.false;
        expect(player.addTag(tagName2)).to.be.true;
        expect(player.addTag(tagName2)).to.be.false;
    });
});
