
var App = require('./app');

var pageRouter = App.pageRouter;

App.router = new (Backbone.Router.extend({
    navigate: function(fragment, options) {
        options = options || {};
        options.trigger = !(options.trigger === false);
        options.replace && pageRouter.pop();
        pageRouter.pushNext = true;
        Backbone.Router.prototype.navigate.call(this, fragment, options);
    },
    initialize: function(){
        this.route('*path', 'index');
        this.route('map', 'map');
        this.route('search(/place/:id)', 'search');
        this.route('play/:id', 'play');
        this.route('record', 'record');
    },
    index: function(path) {
        this.navigate('map', { replace: true });
    },
    map: function() {
        pageRouter.goTo('Map');
    },
    search: function(id) {
        pageRouter.goTo('Search', {placeId: id});
    },
    play: function(id) {
        pageRouter.goTo('Play', {playId: id});
    },
    record: function() {
        pageRouter.goTo('Record');
    }
}))();

App.router.on('route', function(name) {
    if (name != 'index') {
        ga('send', 'pageview', location.pathname + location.search  + location.hash);
    }
});
