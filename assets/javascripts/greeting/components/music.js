
(function dispatchMusic() {
    var src = 'http://mm.8yinhe.cn/o_1aacb0b9rns617pi10klgri1ktma.mp3';
    if (window.Audio) {
        var audio = new Audio();
        audio.loop = true;
        audio.autoplay = true;
        audio.src = src;
        var play = function() { audio.play(); };
        var pause = function() { audio.pause(); }
        $('body').one('touchstart touchend click', play);
        _.defer(play);
    }
})();
