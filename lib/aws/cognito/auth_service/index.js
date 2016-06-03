'use strict';

const Account = require('../../../account');

const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const AWS = require('aws-sdk');

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

const AWS_ACCOUNT_ID = process.env.AWS_ACCOUNT_ID;
const AWS_REGION = process.env.AWS_REGION;
const AWS_IAM_ROLE_ARN = process.env.AWS_IAM_ROLE_ARN;
const AWS_COGNITO_IDENTITY_POOL_ID = process.env.AWS_COGNITO_IDENTITY_POOL_ID;

var FACEBOOK_TOKEN = null;
var FACEBOOK_USER = null;

/**
 * This object wraps the authentication service that uses Amazon Cognito for user authentication.
 *
 * We currently expect some environment variables to be set, these variables are used to determine
 * how we access the Cognito service.
 *
 * AWS_ACCOUNT_ID
 *
 * AWS_IAM_ROLE_ARN
 *
 * AWS_COGNITO_IDENTITY_POOL_ID
 *
 * AWS_TOKEN
 *
 */
/*
class AuthService {
    constructor() {
        this.cognitoParams = {
            AccountId: AWS_ACCOUNT_ID,                      // AWS account Id
            RoleArn: AWS_IAM_ROLE_ARN,                      // IAM role that will be used by authentication
            IdentityPoolId: AWS_COGNITO_IDENTITY_POOL_ID,   // ID of the identity pool
            Logins: {
                'graph.facebook.com': FACEBOOK_TOKEN        // Token given by Facebook
            }
        };

        // Initialize the Credentials object
        AWS.config.region = AWS_REGION;
        AWS.config.credentials = new AWS.CognitoIdentityCredentials(this.cognitoParams);

        // Call to Amazon Cognito, get the credentials for our user
        AWS.config.credentials.get(err,data){…}
    }
}
*/

module.exports.configure = function(router) {
    router.use(passport.initialize());
    router.use(passport.session());

    passport.use(new FacebookStrategy({
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: CALLBACKURL
    }, function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            FACEBOOK_TOKEN = accessToken;
            FACEBOOK_USER = profile._json;

/**            var account = new Account();

            account.facebookToken = accessToken;
            account.facebookUser = profile._json;
            account.loggedIn = true;
*/
            // TODO: Add the user to the list of logged-in users

            // NOTE: This is not scalable, we want accounts to be associated with the game session
            // So, once the game is over, they are gone. This will allow us to scale with the session servers.

            profile.token = accessToken;
            var user = profile;

            done(null, user);
        });
    }));

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    router.get('/auth/facebook', passport.authenticate('facebook'));

    router.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/success',
        failureRedirect: '/error'
    }));

    router.get('/success', function(req, res, next) {
        console.log('FACEBOOK_TOKEN: ' + FACEBOOK_TOKEN);
        res.send('Logged in as ' + FACEBOOK_USER.name + ' (id: ' + FACEBOOK_USER.id + ').');
    });

    router.get('/error', function(req, res, next) {
        res.send('Unable to access Facebook servers. Please check internet connection or try again later.');
    });
};
