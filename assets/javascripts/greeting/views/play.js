
var App = require('../app');
var PageView = require('../pageview');
require('./search');

var GreetingModel = Amour.Model.extend({
    urlRoot: Amour.APIRoot + 'greetings/greeting/'
});

var GreetingLikesCollection = Amour.Collection.extend({
    url: Amour.APIRoot + 'greetings/like/',
});

var PlayView = Amour.ModelView.extend({
    events: {
        'click .disc-wrapper.no-playing': 'playAudio',
        'click .listen-again'           : 'playAudio',
        'click .disc-wrapper.playing'   : 'stopAudio'
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
        'click .start-record': 'startRecord',
        'click .like-wrapper[data-toggle="like"]': 'toggleLike',
    },
    initPage: function() {
        this.greeting = new GreetingModel();
        this.playView = new PlayView({
            el: this.$('.play-wrapper'),
            model: this.greeting
        });
        this.greetingLikes = new GreetingLikesCollection();
    },
    toggleLike: function() {
        var self = this;
        this.verifyLike(function(liked, likeObj) {
            if (liked) {
                likeObj.destroy({
                    global: false,
                    wait: true
                });
            } else {
                this.greetingLikes.create({ greeting: this.greeting.get('id') }, {
                    global: false,
                    wait: true
                });
                ga('send', 'event', 'social', 'like');
            }
        }, this);
    },
    verifyLike: function(callback, context) {
        var ctx = context || this;
        var self = this;
        App.user.getUserInfo(function() {
            var likeObj = self.greetingLikes.findWhere({ owner_id: App.user.id });
            callback && callback.call(ctx, (likeObj != null), likeObj);
        }, function() {
            callback && callback.call(ctx, false);
        });
    },
    initLike: function(greetingId) {
        this.greetingLikes.fetch({
            reset: true,
            data: {
                greeting: greetingId
            },
            success: function(collection) {
            },
        });
        var self = this;
        var fillCount = function() {
            var fakeCount = +self.greetingLikes.length || '';
            self.$('.like-count').html(fakeCount);
            self.verifyLike(function(liked) {
                self.$('.like-wrapper[data-toggle="like"]').toggleClass('liked', liked);
            });
        };
        this.greetingLikes.on('reset add destroy', fillCount);
        fillCount();
        // $likeBtn.on('click', _.throttle(function() {
        //     greetingLikes.toggleLike();
        // }, 3000));
    },
    startRecord: function() {
        App.router.navigate('record');
    },
    leave: function() {
        this.playView.stopAudio();
    },
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
        this.initLike(greetingId);
    }
}))({el: $('#view-play')});
