(function (module) {

    "use strict";

    var mongoose = require('mongoose')
        , gridfs = require('../services/gridfs')
        , ArticleSchema;

    ArticleSchema = new mongoose.Schema({
        title:{ 'type':String, required:true },
        content:{ 'type':String, required:true },
        author:{ 'type':String, required:true },
        files: [ mongoose.Schema.Mixed ]
    });

    ArticleSchema.methods.addFile = function(file, options, fn) {
        var application = this;
        return gridfs.put(file.path, file.filename, options, function(err, result) {
            application.files.push(result);
            return application.save(fn);
        });
    };

    ArticleSchema.methods.deleteFile = function(id, fn) {
        return gridfs.delete(id, function(err, deleted) {
            if (err) return fn(err);
            return fn(null, deleted);
        });
    };

    ArticleSchema.methods.getFile = function(id, fn) {
        return gridfs.get(id, function(err, file) {
            if (err) return fn(err);
            return fn(null, file);
        });
    };

    module.exports = mongoose.model('Article', ArticleSchema);

}(module));