
var App = require('../app');

var shares = new (Amour.Collection.extend({
    url: Amour.APIRoot + 'greetings/share/'
}))();

(function tick() {
    shares.fetch({
        // success: setWxShare,
        global: false
    });
    _.delay(tick, 10000);
})();

function onWxShareSuccess() {
    shares.create({});
}

function onWxShareCancel() {}

function onMenuShare(title, desc, link, img_url) {
    wx.onMenuShareTimeline({
        title: desc + title,
        link: link,
        imgUrl: img_url,
        success: onWxShareSuccess,
        cancel: onWxShareCancel
    });
    wx.onMenuShareAppMessage({
        title: title,
        desc: desc,
        link: link,
        imgUrl: img_url,
        success: onWxShareSuccess,
        cancel: onWxShareCancel
    });
}

var shareText = '乡音无改，录制你的乡音祝福，送给大家';
function getPageTitle() {
    // var title = '【乡音祝福 - 八音盒】';
    var title = '【乡音祝福 - 八音盒】'
    if (App.pageRouter.history.active) {
        title = App.pageRouter.history.active.$('.header-navbar .navbar-title').text();
        title = '【' + title + '】';
    }
    return shareText + title;
}

function getShareText() {
    var count = shares.isEmpty() ? 3370 : _.max(shares.pluck('id')) + 1;
    var desc = '#新年祝福接力# 我是全国第' + count + '个分享乡音祝福的人。';
    // desc += shareText;
    return desc;
}

function setWxShare() {
    var radius = +location.query.radius || 0;
    var title = getPageTitle();
    var desc = getShareText();
    var img_url = 'http://up.img.8yinhe.cn/o_1aail0mdr13v4rbmhf5ptqkm2a.jpg';
    App.userGreeting.verify(function(exists) {
        var relay = exists ? App.user.id : (location.query.relay || '');
        var queryStr = Amour.encodeQueryString({
            radius: radius + 1,
            relay: relay
        });
        var link = [location.origin, '/?', queryStr, location.hash].join('');
        onMenuShare(title, desc, link, img_url);
    });
};

var setWxShareText = App.setWxShareText = function(text) {
    shareText = text || '乡音无改，录制你的乡音祝福，送给大家';
    setWxShare();
}

wx.ready(setWxShareText);

setWxShareText();
App.router.on('route', function(name) {
    if (name != 'index') {
        setWxShareText();
    }
});
