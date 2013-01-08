(function (exports) {

    "use strict";

    var passport = require('passport')
        , flash = require('connect-flash')
        , util = require('util')
        , vars = require('../conf/vars');

    exports.init = function (app) {

        app.get('/login', function(req, res){
            if (req.user) res.redirect(vars.successRedirect);
            else res.render('login', { user: req.user, message: req.flash('error') });
        });

        app.post('/login'
            , passport.authenticate('local', { failureRedirect: vars.errorRedirect, failureFlash: true })
            , function(req, res) {
                res.redirect(vars.successRedirect);
        });

        app.get('/logout', function(req, res){
            req.logout();
            res.redirect(vars.logoutRedirect);
        });

    };

}(exports));