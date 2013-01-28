(function (exports) {

    "use strict";

    var mongoose = require('mongoose')
        , flash = require('connect-flash')
        , auth = require('../services/authentication')
		, Post = mongoose.model('Article');

    exports.init = function (app) {

        app.get('/', function (req, res) {

			return Post.find(function(err, posts) {

				var data = {
					title : 'My Blog',
					posts : [],
					user : req.user,
					messages : req.flash()
				};

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