
var App = require('../app');
var PageView = require('../pageview');

App.Pages.Record = new (PageView.extend({
    events: {
        'touchstart .btn-record': 'startRecord',
        'touchend .btn-record': 'endRecord'
    },
    initPage: function() {},
    leave: function() {},
    startRecord: function() {
        this.recording = true;
        wx.startRecord();
    },
    endRecord: function() {
        if (this.recording) {
            var self = this;
            wx.stopRecord({
                success: function (res) {
                    var localId = res.localId;
                    self.recording = false;
                    self.playVoice(localId);
                }
            });
        }
    },
    playVoice: function(localId) {
        wx.playVoice({
            localId: localId
        });
    },
    render: function() {}
}))({el: $('#view-record')});
