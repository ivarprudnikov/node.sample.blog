/**
 * datasource.js
 *
 * Database config goes here
 * */

(function (exports) {

    "use strict";

    var mongoose = require('mongoose');

    exports.init = function (app) {

        // test only
        app.configure('test', function(){
            app.set('dbUri', 'mongodb://localhost/test_db');
            app.set('dbOptions', {});
        });

        // development only
        app.configure('development', function(){
            app.set('dbUri', 'mongodb://localhost/dev_db');
            app.set('dbOptions', {});
        });

        // production only
        app.configure('production', function(){
            app.set('dbUri', process.env.MONGOLAB_URI);
            app.set('dbOptions', { user : '' ,pass : '' });
        });

        console.log("Starting db connection to : " + app.settings.dbUri );

        mongoose.connect(app.settings.dbUri, app.settings.dbOptions);

    };

}(exports));