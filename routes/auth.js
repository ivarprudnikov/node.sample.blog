(function (exports) {

    "use strict";

    var authentication = require('../services/authentication')
        , passport = require('passport')
        , flash = require('connect-flash')
        , util = require('util');

    exports.init = function (app) {

        authentication.init(app);

        app.get('/login', function(req, res){
            res.render('login', { user: req.user, message: req.flash('error') });
        });

        app.post('/login',
            passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
            function(req, res) {
                res.redirect('/');
        });

        app.get('/logout', function(req, res){
            req.logout();
            res.redirect('/');
        });

    };

}(exports));