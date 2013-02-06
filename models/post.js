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
        var post = this;
        return gridfs.put(file.path, file.filename, options, function(err, result) {
			post.files.unshift(result);
            return post.save(fn);
        });
    };

	PostSchema.methods.deleteFile = function(id, fn) {
		var j, file, idx, post = this;
		if(!post.files) return fn(null,null);
		for (j = post.files.length - 1; j >= 0; --j) {
			if(post.files[j].fileId === id){
				idx = j;
				file = post.files[j];
			}
		}
		if(!file) return fn(null,null);

        return gridfs.delete(id, function(err, deleted) {
            if (err) return fn(err);

			post.files.splice(idx,1);
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