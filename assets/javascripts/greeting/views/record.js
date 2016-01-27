
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

App.Pages.Record = new (PageView.extend({
    events: {
        'click .btn-record': 'record',
        'hidden.bs.modal .modal-record': 'record',
        'click .btn-play': 'play',
        'click .btn-save': 'saveRecord'
    },
    initPage: function() {
        this.greeting = new GreetingModel();
        var self = this;
        wx.onVoiceRecordEnd({
            complete: function(res) {
                self.endRecord(res.localId);
            }
        });
        wx.onVoicePlayEnd({
            success: function (res) {
                self.stopVoice(res.localId);
            }
        });
    },
    leave: function() {
        this.$('.modal').modal('hide');
    },
    record: function() {
        if (!this.recording) {
            this.startRecord();
            wx.startRecord();
        } else {
            if (Amour.isWeixin) {
                wx.stopRecord({
                    success: function(res) {
                        this.endRecord(res.localId);
                    }.bind(this)
                });
            } else {
                this.endRecord('');
            }
        }
    },
    startRecord: function() {
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
    },
    endRecord: function(localId) {
        this.$('.record-wrapper').removeClass('recording');
        this.$('.modal-record').modal('hide');
        this.recording = false;
        translateVoice(localId, function(translateResult) {
            this.$('input[name="translation"]').val(translateResult);
        }, this);
        this.localId = localId;
    },
    saveRecord: function() {
        var selected = this.$('select[name="district"]').val() ||
                       this.$('select[name="city"]').val() ||
                       this.$('select[name="province"]').val();
        var translation = this.$('input[name="translation"]').val();
        if (!this.localId) {
            alert('请先录一段语音');
        } else if (!selected) {
            alert('请选择省市');
            this.$('.modal-places').modal('show');
        } else {
            uploadVoice(this.localId, function(key, url) {
                this.greeting.save({
                    place_id: selected,
                    description: translation,
                    key: key,
                    url: url
                }, {
                    success: _.bind(this.waitForPfop, this)
                });
            }, this);
        }
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
                    App.router.navigate('play/' + model.id);
                },
                error: function() {
                    $('#apploader').removeClass('invisible');
                    _.delay(waiting, 1000);
                }
            });
        })();
    },
    play: function() {
        if (!this.playing) {
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
    }
}))({el: $('#view-record')});
