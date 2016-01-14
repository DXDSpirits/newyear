
var App = require('../app');
var PageView = require('../pageview');

var PlacesCollection = Amour.Model.extend({
    url: Amour.APIRoot + 'greetings/place/'
});

var GreetingsCollection = Amour.Model.extend({
    url: Amour.APIRoot + 'greetings/greeting/'
});

App.Pages.Search = new (PageView.extend({
    events: {},
    initPage: function() {
        this.places = new PlacesCollection();
        this.greetings = new GreetingsCollection();
    },
    leave: function() {},
    render: function() {
        this.places.fetch({
            reset: true
        });
        this.greetings.fetch({
            reset: true
        });
    }
}))({el: $('#view-search')});
