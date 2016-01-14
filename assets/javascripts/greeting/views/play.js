
var App = require('../app');
var PageView = require('../pageview');

var GreetingModel = Amour.Model.extend({
    urlRoot: Amour.APIRoot + 'greetings/greeting/'
});

var PlayView = Amour.ModelView.extend({
    template: '<audio src={{url}} controls></audio>'
});

App.Pages.Play = new (PageView.extend({
    events: {},
    initPage: function() {
        this.greeting = new GreetingModel();
        this.playView = new PlayView({
            el: this.$('.audio-wrapper'),
            model: this.greeting
        })
    },
    leave: function() {},
    render: function() {
        var greetingId = this.options.playId;
        this.greeting.set({ id: greetingId }, { silent: true });
        this.greeting.fetch();
    }
}))({el: $('#view-play')});
