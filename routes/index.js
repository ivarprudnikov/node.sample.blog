(function (exports) {

    "use strict";

    var mongoose = require('mongoose');

    exports.init = function (app) {

        app.get('/', function (req, res) {

            var response = {'title': 'Blog', user: req.user};

            return res.format({

                html: function(){
                    res.render('index', response);
                },

                json: function(){
                    res.send(response);
                }

            });

        });

        app.get('/account', function (req, res) {

            var response = {'title': 'Account', user: req.user};

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