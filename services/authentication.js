/**
 * authentication.js
 *
 * Simple auth service
 * */

	"use strict";

var mongoose = require('mongoose')
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

	if ('string' !== typeof ROLE) throw new Error('ROLE is required');

    return function(req,res,next){

		var i, j, idx, userRolesIds, userRoles = [];

        function failed(){
            req.flash('error', vars.errorNoRole );
            res.redirect(vars.errorRedirect);
        }

		function pushRoles(roleArr){

			userRoles = userRoles.concat(roleArr);

			if(idx === 0 && userRoles.length === 0) return failed();
			else if (idx===0){
				for (j = userRoles.length - 1; j >= 0; --j) {
					if(userRoles[j] === ROLE) return next();
				}
				return failed();
			}
		}

		function check(err,roles){

			if(err) next(err);

			if(!roles || roles.length < 1) return failed();

			for (i = roles.length - 1; i >= 0; --i) {
				idx = i;
				if(roles[idx].authority === ROLE)
					return next();
				else
					roleCompare.getLowerRoles( roles[idx].authority, pushRoles );
			}

		}

        function checkUserRole(usr){

            userRolesIds = usr.authorities;

            if (!userRolesIds || userRolesIds.length < 1) {
				return failed();
            }

			mongoose.model('Role').find({'_id':{$in:userRolesIds}},check);
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