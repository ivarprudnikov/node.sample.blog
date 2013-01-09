(function (exports) {

    "use strict";

    var mongoose = require('mongoose')
        , auth = require('../services/authentication')
        , gridfs = require('../services/gridfs')
        , flash = require('connect-flash')
        , Article = mongoose.model('Article');

    exports.init = function (app) {


        app.get('/article', auth.requireUSER, function(req, res){
          return Article.find(function(err, articleList) {

              var data = { title: 'Articles', articleList : articleList, user:req.user, messages:req.flash() };

              return res.format({
                  html: function(){
                      res.render('article', data);
                  },

                  json: function(){
                      res.send(data);
                  }

              });

          });

        });

        app.get('/article/:id', auth.requireUSER, function(req, res){
          return Article.findById(req.params.id, function(err, article) {
              if (!err) {
                  return res.send(article);
              }
          });
        });

        app.get("/article/file/:id", auth.requireUSER, function(req, res) {
            return gridfs.get(req.params.id, function(err, file) {
                if (err) return console.log("Error : " + err);
                res.header("Content-Type", file.contentType);
                res.header("Content-Disposition", "inline; filename=" + file.filename);
                return file.stream(true).pipe(res);
            });
        });

        app.delete("/article/file/:id", auth.requireUSER, function(req, res) {
            return Article.deleteFile(req.params.id, function(err, file) {
                if (err) return console.log("Error : " + err);
                return console.log("Deleted : " + file);
            });
        });

        app.put('/article/:id', auth.requireUSER, function(req, res){
          return Article.findById(req.params.id, function(err, article) {
              article.title = req.body.title;
              article.content = req.body.content;
              article.author = req.body.author;
              return article.save(function(err) {
                  if (!err) {
                      console.log("updated");
                  }
                  return res.send(article);
              });
          });
        });

        app.post('/article', auth.requireUSER, function(req, res){
            var article;
            article = new Article({
              title: req.body.title,
              content: req.body.content,
              author: req.body.author
            });
            if( req.files.file.length > 0 ){
                var opts = {
                    content_type: req.files.file.type
                };
                article.addFile(req.files.file, opts, function(err, result) {
                    if (!err) console.log('File added : ' + req.files.file.name);
                    else console.log('File was not added');
                });
            }
            article.save(function(err) {
              if (!err) return console.log("created");
            });
            return res.send(article);
        });

        app.delete('/article/:id', auth.requireUSER, function(req, res){
          return Article.findById(req.params.id, function(err, article) {
              return article.remove(function(err) {
                  if (!err) {
                      console.log("removed");
                      return res.send('')
                  }
              });
          });
        });

    };

}(exports));