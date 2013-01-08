/**
 * config.js
 *
 * global app configuration
 * */

(function (exports) {

    "use strict";

    var express = require("express")
        , path = require('path')
        , passport = require('passport')
        , flash = require('connect-flash')
        , vars = require('./vars');

    exports.init = function (app) {

        console.log("Running config.js");

        app.configure(function () {
            app.set('appRoot', path.resolve( __dirname, ".." ) );
            app.set('views', path.join(app.settings.appRoot, "views"));
            app.set('view engine', 'jade');
            app.use(express.static(path.join(app.settings.appRoot, "public")));
            app.use(express.logger());
            app.use(express.favicon());
            app.use(express.cookieParser());
            app.use(express.bodyParser());
            app.use(express.methodOverride());
            app.use(express.session({ secret: 'keyboard cat' }));
            app.use(flash());
            app.use(passport.initialize());
            app.use(passport.session());
            app.use(app.router);
        });

        console.log("app root : " + app.settings.appRoot );

        // test only
        app.configure('test', function(){
            app.set('portNo',3000);
        });

        // development only
        app.configure('development', function(){
            app.set('portNo',3000);
            app.use(express.errorHandler());
        });

        // production only
        app.configure('production', function(){
            app.set('portNo',3000);
        });

    };

}(exports));