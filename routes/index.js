(function (exports) {

    "use strict";

    var mongoose = require('mongoose')
        , flash = require('connect-flash')
        , auth = require('../services/authentication')
		, Article = mongoose.model('Article');

    exports.init = function (app) {

        app.get('/', function (req, res) {

			return Article.find(function(err, articleList) {

				var data = {
					title : 'Articles',
					articleList : [],
					user : req.user,
					messages : req.flash()
				};
				if (!err){
					data.articleList = articleList;
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