(function (exports) {

    "use strict";

    var mongoose = require('mongoose')
        , flash = require('connect-flash')
        , auth = require('../services/authentication')
		, Post = mongoose.model('Post');

    exports.init = function (app) {

        app.get(['/','/index'], function (req, res) {

			var queryFind = Post.find().sort({_id:-1}),
				queryCount = Post.count(),
				data = {
					title : 'My Blog',
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
						res.render('index', data);
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

        app.get('/account', auth.require("ROLE_ADMIN"), function (req, res) {

            var response = {
				title : 'Account',
				user : req.user,
				messages : req.flash()
			};

            return res.format({

                html: function(){
                    res.render('account', response);
                },

                json: function(){
                    res.send(response);
                }

            });

        });

    };

}(exports));