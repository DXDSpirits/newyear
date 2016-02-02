
var App = require('../app');
var PageView = require('../pageview');

var uploadVoice = function(localId, callback, context) {
    var ctx = context || this;
    var saveVoiceToQiniu = function(serverId) {
        $.get('/qiniu/fetchwxvoice/' + serverId, function(data) {
            callback && callback.call(ctx, data.key, data.url);
        }).fail(function() {
            alert('上传录音有点问题，请检查您的网络设置或者联系小盒子客服~');
        });
    };
    wx.uploadVoice({
        localId: localId,
        isShowProgressTips: 1,
        success: function (res) {
            saveVoiceToQiniu(res.serverId);
        }
    });
};

var translateVoice = function(localId, callback, context) {
    var ctx = context || this;
    wx.translateVoice({
        localId: localId,
        isShowProgressTips: 1,
        success: function (res) {
            callback && callback.call(ctx, res.translateResult);
        }
    });
};

var GreetingModel = Amour.Model.extend({
    urlRoot: Amour.APIRoot + 'greetings/greeting/'
});

var InspirationCollection = Amour.Collection.extend({
    url: Amour.APIRoot + 'greetings/inspiration/'
});

var InspirationsView = Amour.CollectionView.extend({
    ModelView: Amour.ModelView.extend({
        tagName: 'li',
        template: '{{text}}'
    }),
    initCollectionView: function() {
        // this.listenTo();
    }
});

App.Pages.Record = new (PageView.extend({
    events: {
        'click .btn-record': 'startRecord',
        'hidden.bs.modal .modal-record': 'onModalRecordHidden',
        'hidden.bs.modal .modal-places': 'onModalPlacesHidden',
        'hidden.bs.modal .modal-translation': 'onModalTranslationHidden',
        'click .translation': 'onClickTranslation',
        'click .btn-play': 'play',
        'click .btn-save': 'saveRecord'
    },
    initPage: function() {
        this.greeting = new GreetingModel();
        this.inspirations = new InspirationCollection();
        this.inspirationsView = new InspirationsView({
            collection: this.inspirations,
            el: this.$('.modal-record .inspirations')
        });
        wx.onVoiceRecordEnd({
            complete: _.bind(function(res) {
                this.endRecord(res.localId);
            }, this)
        });
        wx.onVoicePlayEnd({
            success: _.bind(function (res) {
                this.stopVoice(res.localId);
            }, this)
        });
    },
    leave: function() {
        this.$('.modal').modal('hide');
        this.stopVoice();
    },
    onModalPlacesHidden: function() {
        var district = this.$('select[name="district"]').val();
        var city = this.$('select[name="city"]').val();
        var province = this.$('select[name="province"]').val();
        var placeName = _.chain([province, city, district]).map(function(placeId) {
            var place = App.places.findWhere({ id: +placeId });
            return place ? place.get('name') : '';
        }).uniq().value().join('');
        this.$('.user-place').text(placeName);
        this.inspirations.fetch({
            reset: true,
            data: { place: province }
        });
    },
    onModalRecordHidden: function() {
        if (Amour.isWeixin) {
            wx.stopRecord({
                success: function(res) {
                    this.endRecord(res.localId);
                }.bind(this)
            });
        } else {
            this.endRecord('');
        }
    },
    onModalTranslationHidden: function() {
        var translation = this.$('.modal-translation textarea[name=translation]').val() || '';
        this.$('.translation').text(translation);
    },
    onClickTranslation: function() {
        this.$('.modal-translation').modal('show');
        var translation = this.$('.translation').text();
        this.$('.modal-translation textarea[name=translation]').val(translation);
    },
    startRecord: function() {
        if (this.recording) return;
        this.stopVoice();
        this.$('.record-wrapper').addClass('recording');
        this.$('.record-seconds > span').text(0);
        this.$('.modal-record').modal('show');
        this.recording = true;
        (function tick(self) {
            if (!self.recording) return;
            self.$('.record-seconds > span').text(function() {
                return +$(this).text() + 1;
            });
            _.delay(tick, 1000, self);
        })(this);
        wx.startRecord();
    },
    endRecord: function(localId) {
        this.$('.record-wrapper').removeClass('recording');
        this.$('.modal-record').modal('hide');
        this.recording = false;
        translateVoice(localId, function(translateResult) {
            this.$('.translation').text(translateResult);
            this.showTranslationGuide();
        }, this);
        this.localId = localId;
    },
    saveRecord: function() {
        var selected = this.$('select[name="district"]').val() ||
                       this.$('select[name="city"]').val() ||
                       this.$('select[name="province"]').val();
        var translation = this.$('.translation').text();
        if (!selected) {
            alert('请选择省市');
            this.$('.modal-places').modal('show');
        } else if (!this.localId) {
            alert('请先录一段语音');
        } else {
            uploadVoice(this.localId, function(key, url) {
                this.greeting.save({
                    place_id: +selected,
                    description: translation,
                    key: key,
                    url: url
                }, {
                    success: _.bind(this.waitForPfop, this)
                });
            }, this);
        }
    },
    showTranslationGuide: function() {
        var offset = this.$('.translation').offset().top + 5;
        this.$('.guideview').removeClass('hidden').css('padding-top', offset);
    },
    waitForPfop: function() {
        $('#apploader').removeClass('invisible');
        var self = this;
        (function waiting() {
            self.greeting.fetch({
                cache: false,
                global: false,
                success: function(model) {
                    $('#apploader').addClass('invisible');
                    App.user.getUserInfo(function() {
                        App.router.navigate('map/' + App.user.id);
                        _.delay(function() {
                            $('#global-guideview-share').removeClass('hidden');
                        }, 350);
                    }, function() {
                        App.router.navigate('map');
                    });
                },
                error: function() {
                    $('#apploader').removeClass('invisible');
                    _.delay(waiting, 1000);
                }
            });
        })();
    },
    play: function() {
        if (!this.localId) {
            alert('请先录一段语音');
        } else if (!this.playing) {
            wx.playVoice({ localId: this.localId });
            this.playVoice();
        } else {
            wx.stopVoice({ localId: this.localId });
            this.stopVoice();
        }
    },
    playVoice: function() {
        this.$('.play-wrapper').addClass('playing');
        this.playing = true;
    },
    stopVoice: function() {
        this.$('.play-wrapper').removeClass('playing');
        this.playing = false;
    },
    render: function() {
        this.greeting.clear();
        this.$('.modal-places').modal('show');
        App.user.getUserInfo(function() {
            var profile = App.user.get('profile');
            Amour.loadBgImage(this.$('.user-avatar'), profile.avatar);
            this.$('.user-name').text(profile.name);
        }, null, this)
    }
}))({el: $('#view-record')});
