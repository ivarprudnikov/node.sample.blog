

(function($, _, Backbone){

    // Article Model
    // ----------

    window.Article = Backbone.Model.extend({
        idAttribute: "_id",

        defaults: function() {
            return {
                title : 'change me ...',
                content:  'write something ...',
                author: 'me ...'
            };
        }

    });

    // Article Collection
    // ---------------

    window.ArticleList = Backbone.Collection.extend({

        // Reference to this collection's model.
        model: Article,

        url: '/article'

    });

    // Create our global collection of **Todos**.
    window.Articles = new ArticleList;

    // Article View
    // --------------

    window.ArticleView = Backbone.View.extend({

        className: ".article",

        template: _.template($('#article-template').html()),

        events: {
        },

        initialize: function() {
            this.model.bind('change', this.render, this);
            this.model.bind('destroy', this.remove, this);
        },

        render: function() {
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        },

        // Switch this view into `"editing"` mode, displaying the input field.
        edit: function() {
            $(this.el).addClass("editing");
        },

        // Close the `"editing"` mode, saving changes to the todo.
        close: function() {
            this.model.save({title: 'modified'});
            $(this.el).removeClass("editing");
        },

        // Remove this view from the DOM.
        remove: function() {
            $(this.el).remove();
        },

        // Remove the item, destroy the model.
        clear: function() {
            this.model.destroy();
        }

    });

    // The Application
    // ---------------

    // Our overall **AppView** is the top-level piece of UI.
    window.AppView = Backbone.View.extend({

        // Instead of generating a new element, bind to the existing skeleton of
        // the App already present in the HTML.
        el: $("#app-view"),

        // Delegated events for creating new items, and clearing completed ones.
        events: {

        },

        initialize: function() {
            _.bindAll(this, "addOne", "addAll");
            Articles.bind('add',   this.addOne, this);
            Articles.bind('reset', this.addAll, this);
            Articles.bind('all',   this.render, this);
            Articles.fetch();
        },

        render: function() {

        },

        addOne: function(article) {
            var view = new ArticleView({model: article});
            this.$("#article-list").append( view.render().el );
        },

        addAll: function() {
            Articles.each(this.addOne);
        }

    });

    window.App = new AppView;

})(jQuery, _, Backbone);