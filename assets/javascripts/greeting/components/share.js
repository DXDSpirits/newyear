
var App = require('../app');

if (window.wx) {
    wx.config(WX_CONFIG);
    var setWxShare = App.setWxShare = function(description) {
        var radius = 1 + (+window.location.query.radius || 0);
        var title = '【乡音祝福 - 八音盒】';
        var description = description || '乡音无改，录制你的乡音祝福，送给大家';
        var link = [location.origin, '/?radius=', radius, location.hash].join('');
        var img_url = '';
        wx.onMenuShareTimeline({
            title: description + title,
            link: link,
            imgUrl: img_url,
            success: function () {},
            cancel: function () {}
        });
        wx.onMenuShareAppMessage({
            title: title,
            desc: description,
            link: link,
            imgUrl: img_url,
            success: function () {},
            cancel: function () {}
        });
    };
    setWxShare();
    wx.ready(setWxShare);
    App.router.on('route', function(name) {
        if (name != 'index') {
            setWxShare();
        }
    });
}
