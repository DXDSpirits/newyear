
var App = require('../app');

function onMenuShare(title, description, link, img_url) {
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
}

if (window.wx) {
    wx.config(WX_CONFIG);
    var setWxShare = App.setWxShare = function(description, img_url) {
        var radius = 1 + (+window.location.query.radius || 0);
        var title = '【乡音祝福 - 八音盒】';
        if (App.pageRouter.history.active) {
            title = App.pageRouter.history.active.$('.header-navbar .navbar-title').text();
            title = '【' + title + '】';
        }
        var description = description || '乡音无改，录制你的乡音祝福，送给大家';
        var link = [location.origin, '/?radius=', radius, location.hash].join('');
        if (img_url) {
            onMenuShare(title, description, link, img_url);
        } else {
            App.user.getUserInfo(function() {
                var profile = App.user.get('profile') || {};
                var img_url = profile.avatar || '';
                onMenuShare(title, description, link, img_url);
            });
        }
    };
    setWxShare();
    wx.ready(setWxShare);
    App.router.on('route', function(name) {
        if (name != 'index') {
            setWxShare();
        }
    });
}
