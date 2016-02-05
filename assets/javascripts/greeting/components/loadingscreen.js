
var $loadingscreen = $('#global-loading-screen');
var loadingEnd = _.once(function() {
    downloadFontface();
    $loadingscreen.animate({opacity: 0}, 1500, function() {
        $(this).css({opacity: 1}).addClass('hidden');
        Amour.LoadingScreenFinished = true;
        Amour.trigger('LoadingScreenFinished');
    });
});

_.delay(loadingEnd, 10000);
$(window).load(function() {
    _.delay(function() {
        if (Amour.imagesLoaded) {
            loadingEnd();
        } else {
            Amour.on('ImagesLoaded', loadingEnd);
        }
    }, 2000);
});

function downloadFontface() {
    var style = '@font-face { font-family: "qkbysjt"; font-weight: normal; font-style: normal; src: url("http://cdn.greeting.wedfairy.com/assets/fonts/qkbysjt-full-webfont.eot"); src: url("http://cdn.greeting.wedfairy.com/assets/fonts/qkbysjt-full-webfont.eot?#iefix") format("embedded-opentype"), url("http://cdn.greeting.wedfairy.com/assets/fonts/qkbysjt-full-webfont.woff") format("woff"), url("http://cdn.greeting.wedfairy.com/assets/fonts/qkbysjt-full-webfont.ttf") format("truetype"), url("http://cdn.greeting.wedfairy.com/assets/fonts/qkbysjt-full-webfont.svg#FZQKBYSJW--GB1-0") format("svg") }';
    var onload = _.after(2, function() {
        _.defer(function() {
            $('head').append($('<style></style>').text(style));
        });
    });
    $.ajax({
        url: 'http://cdn.greeting.wedfairy.com/assets/fonts/qkbysjt-full-webfont.ttf',
        global: false, success: onload
    });
    $.ajax({
        url: 'http://cdn.greeting.wedfairy.com/assets/fonts/qkbysjt-full-webfont.woff',
        global: false, success: onload
    });
}
