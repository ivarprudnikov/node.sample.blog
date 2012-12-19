/**
 * authentication.js
 *
 * Simple auth service
 * */


var mongoose = require('mongoose')
    , passport = require('passport')
    , flash = require('connect-flash')
    , util = require('util')
    , vars = require('../conf/vars');

function Authentication(){};

Authentication.prototype.ensureAuthenticated = function(req, res, next){
    if ( req.isAuthenticated()) { return next(); }
    res.redirect(vars.vars.errorRedirect)
};

exports = new Authentication();