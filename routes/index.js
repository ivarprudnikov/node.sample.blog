(function (exports) {

    "use strict";

    var mongoose = require('mongoose')
        , flash = require('connect-flash')
        , auth = require('../services/authentication')
		, Post = mongoose.model('Article');

    exports.init = function (app) {

        app.get(['/','/index'], function (req, res) {

			var query = Post.find().sort({_id:-1}).skip(0).limit(5),
				data = {
					title : 'My Blog',
					posts : [],
					user : req.user,
					messages : req.flash()
				};

			query.exec(function(err, posts) {

				if (!err){
					data.posts = posts;
				}

				return res.format({
					html: function(){
						res.render('index', data);
					},
					json: function(){
						res.send(data);
					}
				});

			});

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