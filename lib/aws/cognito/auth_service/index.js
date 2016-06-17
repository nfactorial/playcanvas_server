'use strict';

const Account = require('../../../account');

const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const express = require('express');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');

const DefaultLogger = require('../../../default_logger');

const AWS = require('aws-sdk');

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

const FACEBOOK_CALLBACK_URL = process.env.FACEBOOK_CALLBACK_URL;

const AWS_ACCOUNT_ID = process.env.AWS_ACCOUNT_ID;
const AWS_REGION = process.env.AWS_REGION;
const AWS_IAM_ROLE_ARN = process.env.AWS_IAM_ROLE_ARN;
const AWS_COGNITO_IDENTITY_POOL_ID = process.env.AWS_COGNITO_IDENTITY_POOL_ID;

// TODO: This should be a database!
const accountMap = new Map();


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
function getCognitoId(log, account) {
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
            log.warn('credentials.get - Failed ' + err);
        } else {
            const tempCredentials = AWS.config.credentials.data.Credentials;

            account.cognitoIdentity = AWS.config.credentials.identityId;
            account.loggedIn = true;

            log.info('Cognito identity id: ' + account.cognitoIdentity);
        }
    });
}

/**
 * Implements the auth service for our server.
 */
class AuthService {
    constructor(logger) {
        this.log = logger || new DefaultLogger();
    }

    /**
     * This method configures the express server to handle user sign-in with facebook.
     * @param router The express router used by the application.
     */
    configure(router) {
        router.use(cookieParser());
        router.use(bodyParser());
        router.use(expressSession({
            secret: 'SECRET_SESSION_WORD',      // TODO: Retrieve from environment variables
            resave: false,
            saveUninitialized: false
        }));
        router.use(passport.initialize());
        router.use(passport.session());

        passport.use(new FacebookStrategy({
            clientID: FACEBOOK_APP_ID,
            clientSecret: FACEBOOK_APP_SECRET,
            callbackURL: FACEBOOK_CALLBACK_URL
        }, function(accessToken, refreshToken, profile, done) {
            process.nextTick(function() {
                let account = accountMap.get(profile.id);
                if (!account) {
                    account = new Account();

                    account.name = profile.displayName;
                    account.userName = profile.username;
                    //account.email = profile.emails[0].value;
                    account.facebookToken = accessToken;
                    account.provider = 'facebook';
                    account.providerId = profile.id;
                    account.facebookUser = profile._json;
                    account.loggedIn = false;

                    accountMap.set(account.providerId, account);
                }

                // NOTE: This is not scalable, we want accounts to be associated with the game session
                // So, once the game is over, they are gone. This will allow us to scale with the session servers.

                done(null, account);
            });
        }));

        passport.serializeUser(function(user, done) {
            done(null, user.providerId);
        });

        passport.deserializeUser(function(id, done) {
            const account = accountMap.get(id);

            done(null, account);
        });

        router.get('/auth/facebook', passport.authenticate('facebook'));

        router.get('/auth/facebook/callback', passport.authenticate('facebook', {
            successRedirect: 'success',
            failureRedirect: 'error'
        }));

        /*
         TODO: Getting these errors, need to correct express session configuration
         body-parser deprecated bodyParser: use individual json/urlencoded middlewares node_modules/@nfactorial/playcanvas_server/lib/aws/cognito/auth_service/index.js:82:16
         body-parser deprecated undefined extended: provide extended option node_modules/body-parser/index.js:105:29
         */
        router.get('/auth/facebook/success', function(req, res, next) {
            if (req.user) {
                // req.user contains our 'Account' instance

                getCognitoId(req.user.facebookToken);

                // TODO: Do *not* send the entire account object to the client

                const user = JSON.stringify({
                    name: req.user.name,
                    id: req.user.providerId
                });

                res.render('after-auth', {state: 'success', user: user });
            } else {
                res.render('after-auth', {state: 'success', user: 'unknown' });
            }
        });

        router.get('/auth/facebook/error', function(req, res, next) {
            res.render('after-auth', {state: 'failure', user: null });
        });
    }
}

module.exports = AuthService;
