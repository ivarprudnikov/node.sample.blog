(function (exports) {

    "use strict";

    var passport = require('passport')
        , flash = require('connect-flash')
        , util = require('util')
        , def = require('../conf/vars');

    exports.init = function (app) {

        app.get('/login', function(req, res){
            if (req.user) res.redirect(def.vars.successRedirect);
            else res.render('login', { user: req.user, message: req.flash('error') });
        });

        app.post('/login'
            , passport.authenticate('local', { failureRedirect: def.vars.errorRedirect, failureFlash: true })
            , function(req, res) {
                res.redirect(def.vars.successRedirect);
        });

        app.get('/logout', function(req, res){
            req.logout();
            res.redirect(def.vars.logoutRedirect);
        });

    };

}(exports));