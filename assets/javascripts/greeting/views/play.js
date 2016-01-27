
var App = require('../app');
var PageView = require('../pageview');
require('./search');

var GreetingModel = Amour.Model.extend({
    urlRoot: Amour.APIRoot + 'greetings/greeting/'
});

var PlayView = Amour.ModelView.extend({
    events: {
        'click .disc-wrapper.no-playing': 'playAudio',
        'click .listen-again': 'playAudio',
        'click .disc-wrapper.playing': 'stopAudio'
    },
    template: App.getTemplate('play'),
    initModelView: function() {
        this.audio = new Audio();
        this.audio.addEventListener('ended', function() {
            this.stopAudio();
        }.bind(this), false);
    },
    playAudio: function() {
        this.audio.play();
        this.$(".disc-wrapper").removeClass('no-playing').addClass('playing');
    },
    stopAudio: function() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.$(".disc-wrapper").removeClass('playing').addClass('no-playing');
    },
    descAnimation: function(w, l) {
        var self = this;
        (function tick() {
            self.$('.description').animate({
                'margin-left': w - l - 50
            }, l * 12, "linear");
            self.$('.description').animate({
                'margin-left': 50
            }, l * 12, "linear");
            self.timer = setTimeout(tick, 100);
        })();
    },
    renderDesc: function() {
        if (this.timer) clearTimeout(this.timer);
        var wrapperWidth = this.$el.closest('.wrapper').width() - 80;
        var descLength = calcTextLength(this.model.get('description'));
        if (descLength <= wrapperWidth) {
            this.$('.description').addClass('text-center').css("margin-left", 0);;
        } else {
            this.$('.description').removeClass('text-center').css("margin-left", 50);
            var self = this;
            _.delay(function() {
                self.descAnimation(wrapperWidth, descLength);
            }, 2000);
        }
    },
    render: function() {
        Amour.ModelView.prototype.render.call(this);
        this.audio.src = this.model.get('url');
        this.renderDesc();
        return this;
    }
});


function calcTextLength(someArray) {
    if(!someArray) return;
    var count = 0;
    for (var i=0; i<someArray.length; i++) {
        count += someArray[i].charCodeAt() < 256 ? 0.5 : 1;
    }
    return count * 14;
}

App.Pages.Play = new (PageView.extend({
    events: {
        'click .start-record': 'startRecord'
    },
    initPage: function() {
        this.greeting = new GreetingModel();
        this.playView = new PlayView({
            el: this.$('.audio-wrapper'),
            model: this.greeting
        });
    },
    startRecord: function() {
        App.router.navigate('record');
    },
    leave: function() {},
    render: function() {
        var greetingId = this.options.playId;
        var greeting = App.Pages.Search.greetings.get(greetingId);
        if (greeting) {
            this.greeting.set(greeting.toJSON());
        } else {
            this.greeting.clear({ silent: true });
            this.greeting.set({ id: greetingId }, { silent: true });
            this.greeting.fetch();
        }
    }
}))({el: $('#view-play')});
