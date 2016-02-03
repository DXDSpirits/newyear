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
        'click .listen-again': 'playAudio',
        'click .disc-wrapper.playing': 'stopAudio',
        'click .like-btn': 'toggleLike'
    },
    template: App.getTemplate('play'),
    serializeData: function() {
        var data = this.model.toJSON();
        data.placeName = _.chain(data.places).pluck('name').uniq().value().join('');
        return data;
    },
    initModelView: function() {
        this.audio = new Audio();
        this.audio.addEventListener('ended', function() {
            this.stopAudio();
        }.bind(this), false);
        this.greetingLikes = new GreetingLikesCollection();
        this.listenTo(this.greetingLikes, 'reset add destroy', this.fillLikeCount);
    },
    playAudio: function() {
        this.audio.play();
        this.$(".wish-avatar").html('<i class="fa fa-pause"></i>');
        this.$(".disc-wrapper").removeClass('no-playing').addClass('playing');
    },
    stopAudio: function(e) {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.$(".wish-avatar").html('<i class="fa fa-play"></i>');
        this.$(".disc-wrapper").removeClass('playing').addClass('no-playing');
        if (e !== 'fetchingNext') {
            this.$('.listen-again').removeClass('invisible');
        }
    },
    // showListenAgain: function() {
    //     this.$('.listen-again').removeClass('invisible');
    // },
    toggleLike: function() {
        var self = this;
        this.verifyLike(function(liked, likeObj) {
            if (liked) {
                likeObj.destroy({ global: false, wait: true });
            } else {
                this.greetingLikes.create({
                    greeting: this.model.get('id')
                }, { global: false, wait: true });
            }
        }, this);
    },
    verifyLike: function(callback, context) {
        var ctx = context || this;
        App.user.getUserInfo(function() {
            var likeObj = this.greetingLikes.findWhere({
                owner_id: App.user.id
            });
            callback && callback.call(ctx, (likeObj != null), likeObj);
        }, function() {
            callback && callback.call(ctx, false);
        }, this);
    },
    fillLikeCount: function() {
        var fakeCount = +this.greetingLikes.length || '';
        this.$('.like-count').text(fakeCount);
        this.verifyLike(function(liked) {
            this.$('.like-btn').toggleClass('liked', liked);
        });
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
        this.greetingLikes.fetch({
            reset: true,
            data: { greeting: this.model.id }
        });
        var text = '我是全国第' + (this.model.id * 17) + '个送出乡音祝福的人。' + this.$('.wish-title').text();
        var avatar = (this.model.get('profile') || {}).avatar;
        App.setWxShare(text, avatar);
        return this;
    }
});


function calcTextLength(someArray) {
    if (!someArray) return;
    var count = 0;
    for (var i = 0; i < someArray.length; i++) {
        count += someArray[i].charCodeAt() < 256 ? 0.5 : 1;
    }
    return count * 14;
}

App.Pages.Play = new(PageView.extend({
    events: {
        'click .start-record': 'startRecord',
    },
    initPage: function() {
        this.greeting = new GreetingModel();
        this.playView = new PlayView({
            el: this.$('.play-wrapper'),
            model: this.greeting
        });
        this.swiper = new Hammer(this.$('.wrapper')[0]);
        this.swiper.on('swipeleft .desc-bg', _.bind(this.fetchNextWish, this));
        var self = this;
    },
    startRecord: function() {
        App.router.navigate('record');
    },
    leave: function() {
        this.playView.stopAudio();
    },
    render: function() {
        var greetingId = this.options.playId;
        this.greetingsCollection = App.Pages.Search.greetings;
        var greeting = this.greetingsCollection.get(greetingId);
        var self = this;
        if (greeting) {
            this.greeting.set(greeting.toJSON());
        } else {
            this.greeting.clear({ silent: true });
            this.greeting.set({ id: greetingId }, { silent: true });
            this.greeting.fetch();
        }
        this.index = 0;
    },
    fetchNextWish: function() {
        this.playView.stopAudio('fetchingNext');
        var self = this;
        var l = this.greetingsCollection.length;
        if(this.index < l - 1) {
            _.each(this.greetingsCollection.models, function(val, key) {
                if(val.toJSON().id == self.greeting.toJSON().id) {
                    self.index = key + 1;
                }
            });
            var $swiper = this.$('.disc-bg').clone()
                .addClass('animated bounceOutLeft')
                .insertAfter(this.$('.disc-bg'));
            this.$('.disc-bg').animate({opacity: 0}, 350);
            _.delay(function() {
                $swiper.remove();
            }, 1000);
            _.delay(function() {
                var next = self.greetingsCollection.at(self.index);
                // self.greeting.set(self.greetingsCollection.models[self.index].toJSON());
                App.router.navigate('play/' + next.id, {
                    replace: true
                });
            }, 350);
        }
    }
}))({
    el: $('#view-play')
});
