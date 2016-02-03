
var App = require('../app');

if (window.Audio) {
    var audio = new Audio();
    audio.loop = true;
    audio.autoplay = true;
    // audio.src = 'http://mm.8yinhe.cn/o_1aacb0b9rns617pi10klgri1ktma.mp3';
    audio.src = 'http://mm.8yinhe.cn/o_1aaikcosd1o39hak14bg11g5719a.mp3';
    var play = _.once(function() {
        audio.play();
    });
    $('body').one('touchstart touchend click', play);
    _.defer(play);
    App.router.on('route', function(name) {
        play();
        if (name == 'play' || name == 'record') {
            audio.pause();
        } else {
            audio.play();
        }
    });
}
