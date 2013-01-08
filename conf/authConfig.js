/**
 * config.js
 *
 * global app configuration
 * */

(function (exports) {

    "use strict";

    var mongoose = require('mongoose')
        , passport = require('passport')
        , LocalStrategy = require('passport-local').Strategy;

    exports.init = function () {

        var User = mongoose.model('User');

        console.log("Running authConfig.js");

        // what should be saved in session
        passport.serializeUser(function(user, done) {
            done(null, user.id);
        });
        // user retrieved based on id saved in session
        passport.deserializeUser(function(id, done) {
            User.findById(id, function (err, user) {
                done(err, user);
            });
        });
        passport.use(new LocalStrategy(
            function(username, password, done) {
                process.nextTick(function () {
                    User.findOne({username:username}, function(err, user) {

                        if (err) { return done(err); }

                        if (!user) { return done(null, false, { message: 'Invalid username or password' }); }

                        user.comparePassword(password, function(err, isMatch){
                            if (err) return done(err);
                            if (!isMatch) {
                                return done(null, false, { message: 'Invalid username or password' });
                            }
                            return done(null, user);
                        });

                    })
                });
            }
        ));

    };

}(exports));