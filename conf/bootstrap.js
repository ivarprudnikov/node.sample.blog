/**
 * bootstrap.js
 *
 * Create new data here required
 * for app startup. Roles,Users,...
 * */

(function (exports) {

    "use strict";

    var mongoose = require('mongoose')
        , Article = mongoose.model('Article')
        , User = mongoose.model('User');

    exports.init = function (app) {

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

    var createDevUsers = function(){
        new User({username:'funny',password:'man'}).save(function(err){
            if(err) throw err;
            else console.log('User saved');
        });
    };

}(exports));