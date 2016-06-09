'use strict';

const Account = require('../../../account');

const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const AWS = require('aws-sdk');

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

const FACEBOOK_CALLBACK_URL = process.env.FACEBOOK_CALLBACK_URL;

const AWS_ACCOUNT_ID = process.env.AWS_ACCOUNT_ID;
const AWS_REGION = process.env.AWS_REGION;
const AWS_IAM_ROLE_ARN = process.env.AWS_IAM_ROLE_ARN;
const AWS_COGNITO_IDENTITY_POOL_ID = process.env.AWS_COGNITO_IDENTITY_POOL_ID;

var USER_ACCOUNT = null;

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

/**
 * Retrieves the Congnito identity from a specified facebook token.
 * @param account {Account} The account whose Cognito identity is to be retrieved.
 */
function getCognitoId(account) {
    var params = {
        AccountId: AWS_ACCOUNT_ID,
        RoleArn: AWS_IAM_ROLE_ARN,
        IdentityPoolId: AWS_COGNITO_IDENTITY_POOL_ID,
        Logins: {
            'graph.facebook.com': account.facebookToken
        }
    };

    // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityCredentials.html
    AWS.config.region = AWS_REGION;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials(params);
    AWS.config.credentials.get(function(err) {
        if (err) {
            console.log('credentials.get - Failed ' + err);
        } else {
            const tempCredentials = AWS.config.credentials.data.Credentials;

            account.cognitoIdentity = AWS.config.credentials.identityId;
            account.loggedIn = true;

            console.log('Cognito identity id: ' + account.cognitoIdentity);
        }
    });
}

/**
 * This method configures the express server to handle user sign-in with facebook.
 * @param router The express router used by the application.
 */
module.exports.configure = function(router) {
    router.use(passport.initialize());
    router.use(passport.session());

    passport.use(new FacebookStrategy({
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: FACEBOOK_CALLBACK_URL
    }, function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            var account = new Account();

            account.facebookToken = accessToken;
            account.facebookUser = profile._json;
            account.loggedIn = false;

            // TODO: Add the user to the list of logged-in users

            USER_ACCOUNT = account;

            // NOTE: This is not scalable, we want accounts to be associated with the game session
            // So, once the game is over, they are gone. This will allow us to scale with the session servers.

            profile.token = accessToken;

            done(null, profile);
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
        successRedirect: 'success',
        failureRedirect: 'error'
    }));

    router.get('auth/facebook/success', function(req, res, next) {
        console.log('FACEBOOK_TOKEN: ' + USER_ACCOUNT.facebookToken);
        console.log('req.user = ');
        console.log(req.user);
        console.log('req.authResponse = ');
        console.log(req.authResponse);
        console.log('req = ');
        console.log(req);

        getCognitoId(USER_ACCOUNT);

        res.render('after-auth', {state: 'success', user: req.user ? req.user : null });
    });

    router.get('auth/facebook/error', function(req, res, next) {
        res.render('after-auth', {state: 'failure', user: null });
    });
};
