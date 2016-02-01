
var App = require('../app');

var globalMenu = new (Amour.View.extend({
    events: {
        'click .btn-share': 'share'
    },
    initView: function() {},
    share: function() {
        $('#global-guideview-share').removeClass('hidden');
    },
    render: function() {}
}))({el: $('#global-menu')});

App.router.on('route', function(name) {
    globalMenu.$el.toggleClass('hidden', name == 'prologue');
    globalMenu.$('.monkey').toggleClass('invisible', name == 'search' || name == 'prologue');
    if (globalMenu.$el.hasClass('open')) {
        globalMenu.$('.lantern').dropdown('toggle');
    }
});
