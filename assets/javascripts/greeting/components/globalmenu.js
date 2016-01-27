
var App = require('../app');

var globalMenu = new (Amour.View.extend({
    events: {},
    initView: function() {},
    render: function() {}
}))({el: $('#global-menu')});

App.router.on('route', function(name) {
    globalMenu.$el.toggleClass('hidden', name == 'prologue');
    if (globalMenu.$el.hasClass('open')) {
        globalMenu.$('.lantern').dropdown('toggle');
    }
});
