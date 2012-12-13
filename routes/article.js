(function (exports) {

    "use strict";

    var mongoose = require('mongoose')
        , gridfs = require('../services/gridfs')
        , Article = mongoose.model('Article');

    exports.init = function (app) {


        app.get('/article', function(req, res){
          return Article.find(function(err, articleList) {
              return res.format({

                  html: function(){
                      res.render('article', {
                          'title': 'Articles'
                          ,'articleList' : articleList
                      });
                  },

                  json: function(){
                      res.send(articleList);
                  }

              });

          });

        });

        app.get('/article/:id', function(req, res){
          return Article.findById(req.params.id, function(err, article) {
              if (!err) {
                  return res.send(article);
              }
          });
        });

        app.get("/article/file/:id", function(req, res) {
            return gridfs.get(req.params.id, function(err, file) {
                if (err) return console.log("Error : " + err);
                res.header("Content-Type", file.contentType);
                res.header("Content-Disposition", "inline; filename=" + file.filename);
                return file.stream(true).pipe(res);
            });
        });

        app.delete("/article/file/:id", function(req, res) {
            return Article.deleteFile(req.params.id, function(err, file) {
                if (err) return console.log("Error : " + err);
                return console.log("Deleted : " + file);
            });
        });

        app.put('/article/:id', function(req, res){
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

        app.post('/article', function(req, res){
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

        app.delete('/article/:id', function(req, res){
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