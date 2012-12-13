(function (exports) {

    "use strict";

    var mongoose = require('mongoose');

    exports.init = function (app) {

        app.get('/', function (req, res) {

            var response = {'title': 'My Blog'};

            return res.format({

                html: function(){
                    res.render('index', response);
                },

                json: function(){
                    res.send(response);
                }

            });

        });

    };

}(exports));