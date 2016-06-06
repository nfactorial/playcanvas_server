'use strict';

/**
 * Describes the users account, such as log-ing method and other associated information.
 */
class Account {
    constructor() {
        this.facebookToken = null;
        this.facebookUser = null;
        this.cognitoIdentity = null;
        this.loggedIn = false;
    }
}

module.exports = Account;
