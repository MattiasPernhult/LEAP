var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var passport = require('passport');

var configAuth = require('./auth');
var mongoService = require('../services/mongo_service');

module.exports = function() {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        mongoService.findUserById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new GoogleStrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL,
    },
    function(token, refreshToken, profile, done) {

        process.nextTick(function() {
            mongoService.findOne({'google.id': profile.id}, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (user) {
                    return done(null, user);
                }

                mongoService.saveGoogleUser(profile, token, function(err, newUser) {
                    if (err) {
                        throw err;
                    }
                    return done(null, newUser);
                });
            });
        });
    }));

};
