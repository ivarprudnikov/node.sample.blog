/**
 * bootstrap.js
 *
 * Create new data here required
 * for app startup. Roles,Users,...
 * */

(function (exports) {

    "use strict";

    var mongoose = require('mongoose');

    exports.init = function (app) {

        var Article = mongoose.model('Article')
            , User = mongoose.model('User');

        var createDevUsers = function(){
            User.findOne({username:'funny'},function(err,user){
                if(err){
                    new User({username:'funny',password:'man'}).save(function(err){
                        if(err) throw err;
                        else console.log('User saved');
                    });
                } else {
                    console.log("user already exists");
                }
            });

        };

        console.log("Running bootstrap.js");

        app.configure(function(){

        });

        app.configure('test', function(){

        });

        app.configure('development', function(){
            createDevUsers();
        });

        app.configure('production', function(){

        });

    };


}(exports));