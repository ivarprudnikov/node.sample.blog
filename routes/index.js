(function (exports) {

    "use strict";

    var mongoose = require('mongoose')
        , flash = require('connect-flash')
        , auth = require('../services/authentication');

    exports.init = function (app) {

        app.get('/', function (req, res) {

            var response = {'title': 'Blog', user: req.user, messages:req.flash()};

            return res.format({

                html: function(){
                    res.render('index', response);
                },

                json: function(){
                    res.send(response);
                }

            });

        });

        app.get('/account', auth.requireSUPERADMIN, function (req, res) {

            var response = {'title': 'Account', user: req.user, messages:req.flash()};

            return res.format({

                html: function(){
                    res.render('account', response);
                },

                json: function(){
                    res.send(response);
                }

            });

        });



    };

}(exports));