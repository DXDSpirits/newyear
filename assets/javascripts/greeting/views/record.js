
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

var GreetingModel = Amour.Model.extend({
    urlRoot: Amour.APIRoot + 'greetings/greeting/'
});

App.Pages.Record = new (PageView.extend({
    events: {
        'click .btn-record': 'record',
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
    leave: function() {},
    record: function() {
        if (!this.recording) {
            this.startRecord();
            wx.startRecord();
        } else {
            self = this;
            wx.stopRecord({
                success: function(res) {
                    self.endRecord(res.localId);
                }
            });
        }
    },
    startRecord: function() {
        this.$('.btn-record').text('停止录音').addClass('btn-success').removeClass('btn-primary');
        this.$('.recording-tip').removeClass('invisible').find('>span').text(0);
        this.recording = true;
        (function tick(self) {
            if (!self.recording) return;
            self.$('.recording-tip > span').text(function() {
                return +$(this).text() + 1;
            });
            _.delay(tick, 1000, self);
        })(this);
    },
    endRecord: function(localId) {
        this.$('.btn-record').text('开始录音').removeClass('btn-success').addClass('btn-primary');
        this.$('.recording-tip').addClass('invisible').find('>span').text(0);
        this.recording = false;
        this.voiceReady(localId);
    },
    voiceReady: function(localId) {
        this.localId = localId;
        var selected = this.$('select[name="district"]').val() ||
                       this.$('select[name="city"]').val() ||
                       this.$('select[name="province"]').val();
        this.greeting.set({
            place_id: selected
        });
        this.$('.play-buttons').removeClass('invisible');
    },
    saveRecord: function() {
        uploadVoice(this.localId, function(key, url) {
            this.greeting.save({ key: key, url: url }, {
                success: _.bind(this.waiting, this)
            });
        }, this);
    },
    waiting: function() {
        $('#apploader').removeClass('invisible');
        var self = this;
        this.greeting.fetch({
            cache: false,
            global: false,
            success: function(model) {
                $('#apploader').addClass('invisible');
                App.router.navigate('play/' + model.id);
            },
            error: function() {
                _.delay(function() {
                    self.waiting();
                }, 1000);
            }
        });
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
        this.$('.btn-play').text('停止').addClass('btn-success').removeClass('btn-primary');
        this.playing = true;
    },
    stopVoice: function(localId) {
        this.$('.btn-play').text('试听').removeClass('btn-success').addClass('btn-primary');
        this.playing = false;
    },
    render: function() {
        this.greeting.clear();
    }
}))({el: $('#view-record')});
