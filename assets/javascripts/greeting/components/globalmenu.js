
var App = require('../app');

var globalMenu = new (Amour.View.extend({
    events: {
        'click .btn-share': 'share',
        'click .btn-prologue': 'prologue'
    },
    initView: function() {},
    share: function() {
        $('#global-guideview-share').removeClass('hidden');
    },
    prologue: function() {
        Amour.storage.set('on-prologue-end', location.hash.slice(1));
        App.router.navigate('prologue');
    },
    render: function() {}
}))({el: $('#global-menu')});

App.router.on('route', function(name) {
    if (name != 'index') {
        globalMenu.$el.toggleClass('hidden', name == 'prologue');
        globalMenu.$('.monkey').toggleClass('hidden', name == 'search' || name == 'prologue');
        if (globalMenu.$el.hasClass('open')) {
            globalMenu.$('.lantern').dropdown('toggle');
        }
    }
});
