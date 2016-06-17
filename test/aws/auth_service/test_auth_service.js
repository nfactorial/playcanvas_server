'use strict';

// Configure environment variables with some test value to allow testing to take place
process.env.FACEBOOK_APP_ID = 'FACEBOOK_APP_ID';
process.env.FACEBOOK_APP_SECRET = 'FACEBOOK_APP_SECRET';
process.env.FACEBOOK_CALLBACK_URL = 'http://localhost';

process.env.AWS_ACCOUNT_ID = 'AWS_ACCOUNT_ID';
process.env.AWS_REGION = 'AWS_REGION';
process.env.AWS_IAM_ROLE_ARN = 'IAM_ROLE_ARN';
process.env.AWS_COGNITO_IDENTITY_POOL_ID = 'COGNITO_IDENTITY_POOL';

var chai = require('chai');
var expect = chai.expect;
const express = require('express');

const AuthService = require('../../../lib/aws/cognito/auth_service');

/**
 * Verify the Session class behaves as expected.
 */
describe('aws/auth_service', function() {
    it('Should be empty when constructed', function() {
        const server = express();
        const authService = new AuthService();

        authService.configure(server);
    });
});
