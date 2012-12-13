(function (exports) {

    "use strict";

    var fs = require('fs');

    exports.init = function () {

        console.log('Initializing models from: ' + __dirname);
        fs.readdirSync(__dirname).forEach(function(file) {
            if ( file === "init.js" || file.substr(file.lastIndexOf('.') + 1) !== 'js' ) return;
            var name = file.substr(0, file.indexOf('.'));
            require('./' + name)();
        });

    };

}(exports));