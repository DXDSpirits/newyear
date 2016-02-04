
var App = require('../app');
var PageView = require('../pageview');

App.Pages.Prologue = new (PageView.extend({
    events: {
        'click': 'gotoMap',
        'touchend .cover': 'play'
    },
    initPage: function() {},
    initPlayerOnce: _.once(function() {
        var width = $(window).width();
        var height = width * 1.6;
        if ($(window).height() < height) {
            height = $(window).height();
            width = parseInt(height / 1.6);
        }
        var zoom = 1;  // Math.min(1, $(window).height() / height)
        this.player = initProloguePlayer(width, height, zoom);
    }),
    setPrologueEnd: function(onPrologueEnd) {
        this.onPrologueEnd = onPrologueEnd;
    },
    gotoMap: function() {
        if (this.state == 'end') {
            location.hash = this.onPrologueEnd || '#map';
            this.onPrologueEnd = null;
        } else if (this.state == 'initial') {
            this.play();
        }
    },
    toggleState: function(state) {
        // initial / animating / end
        this.$('.cover').toggleClass('animated fadeOutUp', state != 'initial');
        this.$('.btn-start').toggleClass('invisible', state != 'end');
        this.state = state;
    },
    leave: function() {
        this.player && this.player.pause();
        _.delay(_.bind(function() {
            this.toggleState('initial');
            this.player && this.player.stop();
        }, this), 350);
        if (this.timers && this.timers.length > 0) {
            for (var i=0; i<this.timers.length; i++) {
                clearTimeout(this.timers[i]);
            }
        }
    },
    play: function() {
        this.timers = [];
        this.toggleState('animating');
        if (this.player) {
            this.timers.push(_.delay(_.bind(function() {
                this.player.play();
            }, this), 1000));
            this.timers.push(_.delay(_.bind(function() {
                this.player.pause();
                this.toggleState('end');
            }, this), 10000));
        } else {
            this.toggleState('end');
        }
    },
    render: function() {
        if (window.initProloguePlayer && window.anm) {
            this.initPlayerOnce();
        }
        this.toggleState('initial');
    }
}))({el: $('#view-prologue')});
