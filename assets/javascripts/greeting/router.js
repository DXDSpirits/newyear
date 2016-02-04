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
        this.route('prologue', 'prologue');
        this.route('map(/:id)', 'map');
        this.route('search(/place/:id)', 'search');
        this.route('play/:id', 'play');
        this.route('record', 'record');
        this.route('about', 'about');
        this.route('relay', 'relay');
    },
    index: function(path) {
        this.navigate('map', { replace: true });
    },
    prologue: function() {
        pageRouter.goTo('Prologue');
    },
    map: function(id) {
        pageRouter.goTo('Map', {greetingId: id});
    },
    search: function(id) {
        pageRouter.goTo('Search', {placeId: id});
    },
    play: function(id) {
        pageRouter.goTo('Play', {playId: id});
    },
    record: function() {
        pageRouter.goTo('Record');
    },
    about: function() {
        pageRouter.goTo('About');
    },
    relay: function() {
        pageRouter.goTo('Relay');
    }
}))();

App.router.on('route', function(name) {
    if (name != 'index') {
        ga('send', 'pageview', location.pathname + location.search  + location.hash);
    }
});
