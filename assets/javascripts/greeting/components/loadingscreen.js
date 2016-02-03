
var $loadingscreen = $('#global-loading-screen');
var loadingEnd = function() {
    $loadingscreen.animate({opacity: 0}, 1500, function() {
        $(this).css({opacity: 1}).addClass('hidden');
        Amour.LoadingScreenFinished = true;
        Amour.trigger('LoadingScreenFinished');
    });
};

var onceImagesLoaded = _.once(function() {
    if (Amour.imagesLoaded) {
        loadingEnd();
    } else {
        Amour.on('ImagesLoaded', loadingEnd);
    }
});

_.delay(onceImagesLoaded, 10000);
$(window).load(onceImagesLoaded);
