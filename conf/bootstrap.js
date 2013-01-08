/**
 * bootstrap.js
 *
 * Create new data here required
 * for app startup. Roles,Users,...
 * */

(function (exports) {

    "use strict";

    var mongoose = require('mongoose')
        , _ = require('underscore')
        , vars = require('./vars')
        , roles = vars.ROLES;

    exports.init = function (app) {

        var Article = mongoose.model('Article')
            , User = mongoose.model('User')
            , Role = mongoose.model('Role');

        var createDevRoles = function(cb){

            var x = roles.length;
            _.each(roles,function(v){
                Role.findOneAndRemove({authority:v},function(){
                    new Role({authority:v}).save(function(err){
                        if(err) throw err;
                        else console.log('Role ' + v + ' saved');
                        x--;
                        if(x==0)
                            return cb();
                    });
                });
            });

        };

        var createDevUsers = function(){
            var users = [{u:'admin',p:'admin',r:'ADMIN'},{u:'superadmin',p:'superadmin',r:'SUPERADMIN'}];
            _.each(users,function(v){
                User.findOneAndRemove({username:v.u},function(err,cb){
                    if(err) throw err;
                    var role = Role.findOne({authority:v.r},function(err,result){
                        var u = new User({username:v.u,password:v.p,authorities:[result._id]});
                        u.save(function(err){
                            if(err) throw err;
                            else console.log('User ' + v.u + ' saved');
                        });
                    });
                });
            });
        };

        console.log("Running bootstrap.js");

        app.configure(function(){

        });

        app.configure('test', function(){

        });

        app.configure('development', function(){
            createDevRoles( createDevUsers );
        });

        app.configure('production', function(){

        });

    };


}(exports));