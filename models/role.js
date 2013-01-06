(function (module) {

    "use strict";

    var mongoose = require('mongoose')
        , ObjectId = mongoose.Schema.ObjectId
        , RoleSchema;

    RoleSchema = new mongoose.Schema({
        id : ObjectId
        ,authority: { type: String, required: true, index: { unique: true } }
    });

    module.exports = mongoose.model('Role', RoleSchema)

}(module));