
var App = require('../app');
var PageView = require('../pageview');

var GreetingsCollection = Amour.Model.extend({
    url: Amour.APIRoot + 'greetings/greeting/'
});

App.Pages.Search = new (PageView.extend({
    events: {},
    initPage: function() {
        this.greetings = new GreetingsCollection();
    },
    leave: function() {},
    render: function() {
        this.greetings.fetch({
            reset: true
        });
    }
}))({el: $('#view-search')});
