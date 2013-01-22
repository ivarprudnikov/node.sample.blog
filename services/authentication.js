/**
 * authentication.js
 *
 * Simple auth service
 * */

	"use strict";

var mongoose = require('mongoose')
    , Role = mongoose.model('Role')
    , passport = require('passport')
    , flash = require('connect-flash')
    , util = require('util')
    , vars = require('../conf/vars')
	, roleCompare = require('./roleCompare');

function Authentication(){}

// general authentication case
Authentication.prototype.ensureAuthenticated = function(req, res, next){
    if ( req.isAuthenticated() ) {
        return next();
    }
    req.flash('error', vars.errorNoAuthentication);
    res.redirect(vars.errorRedirect);
};

Authentication.prototype.require = function(ROLE){

    return function(req,res,next){

		var i, j, userRolesIds, hasOne = false;

        function finalAnswer(hasRole){
            if(hasRole == true) return next();

            req.flash('error', vars.errorNoRole );
            res.redirect(vars.errorRedirect);
        }

		function checkArrayOfRoles(arr){
			for (j = arr.length - 1; j >= 0; --j) {
				if(arr[j] === ROLE) return true;

				return false;
			}
		}

		function check(err,role){
			if ( role && ( role.authority === ROLE || roleCompare.getLowerRoles(ROLE,checkArrayOfRoles) ) )
				hasOne = true;

			if(i===0) return finalAnswer(hasOne);
		}

        function checkUserRole(usr){

            userRolesIds = usr.authorities;

            if (!userRolesIds || userRolesIds.length < 1) {
                req.flash('error', vars.errorNoRole );
                res.redirect(vars.errorRedirect);
                return false;
            }

			for (i = userRolesIds.length - 1; i >= 0; --i) {
				Role.findById(userRolesIds[i],check);
			}
        }

        if ( req.isAuthenticated() && req.user ) {
            checkUserRole(req.user);
        } else {
            req.flash('error', vars.errorNoAuthentication );
            res.redirect(vars.errorRedirect);
        }
    }
};

module.exports = exports = new Authentication;