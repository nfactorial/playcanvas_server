'use strict';

/**
 * Describes the users account, such as log-ing method and other associated information.
 */
class Account {
    constructor() {
        this.name = null;
        this.userName = null;
        this.facebookToken = null;
        this.facebookUser = null;
        this.email = null;
        this.provider = null;
        this.providerId = null;
        this.cognitoIdentity = null;
        this.loggedIn = false;
    }
}

module.exports = Account;
