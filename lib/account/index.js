'use strict';

class Account {
    constructor() {
        this.facebookToken = null;
        this.facebookUser = null;
        this.cognitoIdentity = null;
        this.loggedIn = false;
    }
}

module.exports = Account;
