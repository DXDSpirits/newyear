
var App = require('../app');
var PageView = require('../pageview');
require('./search');

var greetings = App.Pages.Search.greetings;

var GreetingModel = Amour.Model.extend({
    urlRoot: Amour.APIRoot + 'greetings/greeting/'
});

var PlayView = Amour.ModelView.extend({
    template: $("#play-template").html(),
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
        'click .disc-wrapper.no-playing' : 'playAudio',
        'click .listen-againlisten-again': 'playAudio',
        'click .disc-wrapper.playing'    : 'pauseAudio',
        'click .start-record'            : 'startRecord',
    },
    initPage: function() {
        this.greeting = new GreetingModel();
        this.playView = new PlayView({
            el: this.$('.audio-wrapper'),
            model: this.greeting
        });
        this.audio = new Audio();
        var self = this;
        this.audio.addEventListener('ended', function() {
            self.$(".disc-wrapper").removeClass('playing').addClass('no-playing');
        }, false);
    },
    leave: function() {},
    render: function() {
        var w = $(".wrapper").width();
        var greetingId = this.options.playId;
        var g = this.greeting.get(greetingId);

        if (g) {
            this.greeting.set(g.toJSON());
            var descLength = calcTextLength(this.greeting.description);
            if(descLength <= w) {
                this.$('.description').addClass('text-center');
            }else {
                this.$('.description').css("margin-left", 50);
                setTimeout(function() {
                    descAnimation(w, descLength);
                }, 2000);
            }

            this.audio.src = this.greeting.url;
        } else {
            var self = this;
            this.greeting.set({ id: greetingId }, { silent: true });
            this.greeting.fetch({
                success: function(model) {
                    var descLength = calcTextLength(model.toJSON().description);
                    if(descLength <= w) {
                        this.$('.description').addClass('text-center');
                    }else {
                        this.$('.description').css("margin-left", 50);
                        setTimeout(function() {
                            descAnimation(w, descLength);
                        }, 2000);
                    }
                    self.audio.src = model.toJSON().url;
                }
            });
        }
    },
    playAudio: function() {
        this.audio.play();
        this.$(".disc-wrapper").removeClass('no-playing').addClass('playing');
    },
    pauseAudio: function() {
        this.audio.pause();
        this.$(".disc-wrapper").removeClass('playing').addClass('no-playing');
    },
    startRecord: function() {
        location.href = '/#record';
    }
}))({el: $('#view-play')});

function descAnimation(w, l) {
    setInterval(function() {
        $('.description').animate({
            'margin-left': w - l - 50
        }, l * 12, "linear");

        $('.description').animate({
            'margin-left': 50
        }, l * 12, "linear");
    });
}


