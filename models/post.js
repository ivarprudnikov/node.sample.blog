(function (module) {

    "use strict";

    var mongoose = require('mongoose')
        , gridfs = require('../services/gridfs')
        , PostSchema;

	PostSchema = new mongoose.Schema({
        title:{ 'type':String, required:true },
        content:{ 'type':String, required:true },
        author:{ 'type':String, required:true },
        files: [ mongoose.Schema.Mixed ]
    });

	PostSchema.methods.addFile = function(file, options, fn) {
        var application = this;
        return gridfs.put(file.path, file.filename, options, function(err, result) {
            application.files.push(result);
            return application.save(fn);
        });
    };

	PostSchema.methods.deleteFile = function(id, fn) {
        return gridfs.delete(id, function(err, deleted) {
            if (err) return fn(err);
            return fn(null, deleted);
        });
    };

	PostSchema.methods.getFile = function(id, fn) {
        return gridfs.get(id, function(err, file) {
            if (err) return fn(err);
            return fn(null, file);
        });
    };

    module.exports = mongoose.model('Post', PostSchema);

}(module));