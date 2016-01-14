
var App = require('../app');
var PageView = require('../pageview');

var GreetingModel = Amour.Model.extend({
    url: Amour.APIRoot + 'greetings/greeting/'
});

App.Pages.Record = new (PageView.extend({
    events: {
        'click .btn-record': 'record'
    },
    initPage: function() {},
    leave: function() {},
    record: function() {
        if (!this.recording) {
            this.startRecord();
        } else {
            this.endRecord();
        }
    },
    startRecord: function() {
        this.$('.btn-record').text('停止录音').addClass('btn-success').removeClass('btn-primary');
        this.recording = true;
        wx.startRecord();
    },
    endRecord: function() {
        var self = this;
        wx.stopRecord({
            success: function (res) {
                self.$('.btn-record').text('开始录音').removeClass('btn-success').addClass('btn-primary');
                self.recording = false;
                self.uploadVoiceToWx(res.localId);
            }
        });
    },
    uploadVoiceToWx: function(localId) {
        var self = this;
        wx.uploadVoice({
            localId: localId,
            isShowProgressTips: 1,
            success: function (res) {
                self.saveVoiceToQiniu(res.serverId);
            }
        });
    },
    saveVoiceToQiniu: function(serverId) {
        var selected = this.$('select[name="district"]').val() ||
                       this.$('select[name="city"]').val() ||
                       this.$('select[name="province"]').val();
        var greeting = new GreetingModel({
            place_id: selected
        });
        $.get('/qiniu/fetchwxvoice/' + serverId, function(data) {
            greeting.save({
                url: data.url
            }, {
                success: function() {
                    alert('上传成功');
                }
            });
        }).fail(function() {
            alert('上传录音有点问题，请检查您的网络设置或者联系小盒子客服~');
        });
    },
    playVoice: function(localId) {
        wx.playVoice({
            localId: localId
        });
    },
    render: function() {}
}))({el: $('#view-record')});
