/**
 * authentication.js
 *
 * Simple auth service
 * */

var mongoose = require('mongoose')
    , Role = mongoose.model('Role')
    , passport = require('passport')
    , flash = require('connect-flash')
    , util = require('util')
    , vars = require('../conf/vars');

function Authentication(){}

// general authentication case
Authentication.prototype.ensureAuthenticated = function(req, res, next){

    if ( req.isAuthenticated() ) {
        return next();
    }

    req.flash('error', vars.errorNoAuthentication);
    res.redirect(vars.errorRedirect);

};

// register `requireROLE` functions
vars.ROLES.forEach( function(ROLE){

    var fnVerb = 'require' + ROLE; // eg: requireADMIN

    Authentication.prototype[fnVerb] = function(req, res, next){

        function checkUserRole(usr){

            var userRolesIds = usr.authorities
                , hasOne = false;

            if (!userRolesIds || userRolesIds.length < 1) {
                req.flash('error', vars.errorNoRole );
                res.redirect(vars.errorRedirect);
                return false;
            }

            var x = userRolesIds.length;

            function finalAnswer(){
                if(hasOne) return next();

                req.flash('error', vars.errorNoRole );
                res.redirect(vars.errorRedirect);
            }

            userRolesIds.forEach(function(id){
                Role.findById(id,function(err,role){
                    if ( role && role.authority == ROLE ) hasOne = true;
                    --x;
                    if(x==0) return finalAnswer();
                });
            });
        }

        if ( req.isAuthenticated() && req.user ) {
            checkUserRole(req.user);
        } else {
            req.flash('error', vars.errorNoAuthentication );
            res.redirect(vars.errorRedirect);
        }

    };

});

module.exports = exports = new Authentication;