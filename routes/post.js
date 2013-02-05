(function (exports) {

    "use strict";

    var mongoose = require('mongoose')
        , auth = require('../services/authentication')
        , gridfs = require('../services/gridfs')
        , flash = require('connect-flash')
        , Post = mongoose.model('Post');

    exports.init = function (app) {

        app.get(['/post','/post/list'], function(req, res){
			var queryFind = Post.find().sort({_id:-1}),
				queryCount = Post.count(),
				data = {
					title : 'Post list',
					posts : [],
					postsCount : 0,
					user : req.user,
					messages : req.flash(),
					skip : parseInt(req.query.skip,10) > 0 ? parseInt(req.query.skip,10) : 0,
					limit : Math.min( parseInt(req.query.limit,10) > 0 ? parseInt(req.query.limit,10) : 5, 10),
					hasMore : false
				};

			function returnResponse(){
				return res.format({
					html: function(){
						res.render('post/list', data);
					},
					json: function(){
						res.send(data);
					}
				});
			}

			function handleCount(err,count){
				if (err === null) {
					data.postsCount = count;
				}
				if (err === null && count > data.skip) {
					data.hasMore = (count - data.skip - data.limit) > 0;
					queryFind.skip(data.skip).limit(data.limit).exec(function(err, posts) {
						if ( err === null ){
							data.posts = posts;
						}
						returnResponse();
					});
				} else {
					returnResponse();
				}
			}

			queryCount.exec(handleCount);
        });

		app.get('/post/create', auth.require("ROLE_ADMIN"), function (req, res) {

			var data = {
				title : 'Post create',
				user : req.user,
				messages : req.flash()
			};

			return res.format({
				html: function(){
					res.render('post/create', data);
				},
				json: function(){
					res.send(data);
				}
			});

		});

        app.get('/post/show/:id', function(req, res){

			var queryFind = Post.findById(req.params.id)
				, data = {
					title : 'Post show',
					user : req.user,
					messages : req.flash(),
					post : null
				};

			function returnResponse(){
				return res.format({
					html: function(){
						res.render('post/show', data);
					},
					json: function(){
						res.send(data);
					}
				});
			}

			function handleQuery(err,post){
				if (err === null) {
					data.post = post;
				}
				returnResponse();
			}

			queryFind.exec(handleQuery);

        });

		app.get('/post/edit/:id', auth.require("ROLE_ADMIN"), function(req, res){

			var queryFind = Post.findById(req.params.id)
				, data = {
					title : 'Post edit',
					user : req.user,
					messages : req.flash(),
					post : null
				};

			function returnResponse(){
				return res.format({
					html: function(){
						res.render('post/edit', data);
					},
					json: function(){
						res.send(data);
					}
				});
			}

			function handleQuery(err,post){
				if (err === null) {
					data.post = post;
				}
				returnResponse();
			}

			queryFind.exec(handleQuery);

		});

        app.post('/post/update/:id', auth.require("ROLE_ADMIN"), function(req, res){

			var queryFind = Post.findById(req.params.id)
				, data = {
					user : req.user,
					messages : req.flash(),
					success : false,
					msg : 'Item updated',
					err : 'Could not update item'
				};

			function returnResponse(){
				return res.format({
					html: function(){
						if(data.success){
							req.flash( 'info', data.msg );
							res.redirect('post');
						} else {
							req.flash( 'error', data.err )
							res.redirect('post/show/'+req.params.id);
						}
					},
					json: function(){
						res.send(data);
					}
				});
			}

			function handleQuery(err,post){
				if (err === null) {
					post.title = req.body.title;
					post.content = req.body.content;
					post.author = req.body.author;
					post.save(function(err) {
						if (!err) {
							console.log("updated");
							data.success = true;
						}
						returnResponse();
					});
				} else
					returnResponse();
			}

			queryFind.exec(handleQuery);
        });

        app.post('/post/save', auth.require("ROLE_ADMIN"), function(req, res){
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
					res.redirect('/post');
				},
				json: function(){
					res.send(post);
				}
			});
        });

        app.post('/post/delete/:id', auth.require("ROLE_ADMIN"), function(req, res){
          return Post.findById(req.params.id, function(err, post) {
              return post.remove(function(err) {
                  if (!err) {
                      console.log("removed");
                      return res.send('')
                  }
              });
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

		app.post("/post/file/:id", auth.require("ROLE_ADMIN"), function(req, res) {
			return Post.deleteFile(req.params.id, function(err, file) {
				if (err) return console.log("Error : " + err);
				return console.log("Deleted : " + file);
			});
		});

    };

}(exports));