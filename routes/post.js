(function (exports) {

    "use strict";

    var mongoose = require('mongoose')
        , auth = require('../services/authentication')
        , gridfs = require('../services/gridfs')
        , flash = require('connect-flash')
        , Post = mongoose.model('Article');

    exports.init = function (app) {

        app.get('/post', function(req, res){
          return Post.find(function(err, posts) {
              var data = { title: 'Posts', posts : posts, user:req.user, messages:req.flash() };
              return res.format({
                  json: function(){
                      res.send(data);
                  }
              });
          });
        });

		app.get('/createPost', auth.require("ROLE_ADMIN"), function (req, res) {

			var response = {
				title : 'Create Post',
				user : req.user,
				messages : req.flash()
			};

			return res.format({

				html: function(){
					res.render('createPost', response);
				},

				json: function(){
					res.send(response);
				}

			});

		});

        app.get('/post/:id', function(req, res){
          return Post.findById(req.params.id, function(err, post) {
              if (!err) {
				  return res.format({
					  json: function(){
						  res.send(post);
					  }
				  });
              }
          });
        });

        app.get("/post/file/:id", function(req, res) {
            return gridfs.get(req.params.id, function(err, file) {
                if (err) return console.log("Error : " + err);
                res.header("Content-Type", file.contentType);
                res.header("Content-Disposition", "inline; filename=" + file.filename);
                return file.stream(true).pipe(res);
            });
        });

        app.delete("/post/file/:id", auth.require("ROLE_ADMIN"), function(req, res) {
            return Post.deleteFile(req.params.id, function(err, file) {
                if (err) return console.log("Error : " + err);
                return console.log("Deleted : " + file);
            });
        });

        app.put('/post/:id', auth.require("ROLE_ADMIN"), function(req, res){
          return Post.findById(req.params.id, function(err, post) {
			  post.title = req.body.title;
			  post.content = req.body.content;
			  post.author = req.body.author;
              return post.save(function(err) {
                  if (!err) {
                      console.log("updated");
                  }
                  return res.send(post);
              });
          });
        });

        app.post('/post', auth.require("ROLE_ADMIN"), function(req, res){
            var post;
			post = new Post({
              title: req.body.title,
              content: req.body.content,
              author: req.body.author
            });
            if( req.files.file.length > 0 ){
                var opts = {
                    content_type: req.files.file.type
                };
				post.addFile(req.files.file, opts, function(err, result) {
                    if (!err) console.log('File added : ' + req.files.file.name);
                    else console.log('File was not added');
                });
            }
			post.save(function(err) {
              if (!err) return console.log("created");
            });

			res.format({
				html: function(){
					res.redirect('/');
				},
				json: function(){
					res.send(post);
				}
			});
        });

        app.delete('/post/:id', auth.require("ROLE_ADMIN"), function(req, res){
          return Post.findById(req.params.id, function(err, post) {
              return post.remove(function(err) {
                  if (!err) {
                      console.log("removed");
                      return res.send('')
                  }
              });
          });
        });

    };

}(exports));