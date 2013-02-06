(function (exports) {

    "use strict";

    var mongoose = require('mongoose')
        , auth = require('../services/authentication')
        , gridfs = require('../services/gridfs')
        , flash = require('connect-flash');

    exports.init = function (app) {

		app.get("/file/show/:id", function(req, res) {

			return gridfs.get(req.params.id, function(err, file) {
				if (err)
					return res.status(404).sendfile('./public/img/404.png');

				res.set({
					'Content-Type': file.contentType,
					'Content-Length': file.length,
					'Content-Disposition': "inline; filename=" + file.filename
				})
				return file.stream(true).pipe(res);
			});
		});

		app.post("/file/delete/:id", auth.require("ROLE_ADMIN"), function(req, res) {
			return Post.deleteFile(req.params.id, function(err, file) {
				if (err) return console.log("Error : " + err);
				return console.log("Deleted : " + file);
			});
		});

    };

}(exports));