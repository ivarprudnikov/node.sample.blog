var express = require("express")
    , app = express()
    , appConfig = require("./conf/config")
    , datasource = require("./conf/datasource")
    , models = require('./models/init')
    , routes = require('./routes/init');

// Configure app
appConfig.init(app);

// Run database
datasource.init(app);

// Initialise models
models.init();

// Initialise routes
routes.init(app);

// Start app
app.listen(app.settings.portNo);

console.log("App listening on port " + app.settings.portNo );
