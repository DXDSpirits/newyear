
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

function getPageTitle() {
    var title = '【乡音祝福 - 八音盒】';
    if (App.pageRouter.history.active) {
        title = App.pageRouter.history.active.$('.header-navbar .navbar-title').text();
        title = '【' + title + '】';
    }
}

var setWxShare = App.setWxShare = function(description) {
    var radius = +window.location.query.radius || 0;
    var title = getPageTitle();
    var description = description || '乡音无改，录制你的乡音祝福，送给大家';
    var img_url = 'http://up.img.8yinhe.cn/o_1aail0mdr13v4rbmhf5ptqkm2a.jpg';
    App.user.getUserInfo(function() {
        var queryStr = Amour.encodeQueryString({
            radius: radius + 1,
            relay: App.user.id
        });
        var link = [location.origin, '/?', queryStr, location.hash].join('');
        onMenuShare(title, description, link, img_url);
    });
};

setWxShare();
wx.ready(setWxShare);

App.router.on('route', function(name) {
    if (name != 'index') {
        setWxShare();
    }
});
