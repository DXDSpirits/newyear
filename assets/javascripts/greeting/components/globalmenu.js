
var App = require('../app');

var globalMenu = new (Amour.View.extend({
    events: {
        'click .btn-share': 'share',
        'click .btn-prologue': 'prologue',
        'click .money': 'moneyStopTada'
    },
    initView: function() {},
    moneyStopTada: function() {
        this.$('.money').removeClass('animated tada');
    },
    share: function() {
        $('#global-guideview-share').removeClass('hidden');
    },
    prologue: function() {
        App.Pages.Prologue.setPrologueEnd(location.hash);
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
