
var pageView = Amour.View.extend({
    disablePage: function() {
        this.undelegateEvents();
        this.go = function() {};
        this.refresh = function() {};
        this.showPage = function() {};
    },
    initView: function() {
        if (!this.el) {
            this.disablePage();
            return;
        }
        this.views = {};
        _.bindAll(this, 'showPage', 'go', 'refresh', 'render', 'reset');
        var $el = this.$el;
        this.$('.wrapper').on('webkitAnimationEnd', function(e) {
            var animationName = e.originalEvent.animationName;
            if (animationName == "slideouttoleft" || animationName == "slideouttoright") {
                $el.trigger('pageClose');
            } else if (animationName == "slideinfromright" || animationName == "slideinfromleft") {
                $el.trigger('pageOpen');
            }
        });
        this.$el.toggleClass('__header-navbar__', this.$('.header-navbar').length > 0);
        this.$el.toggleClass('__footer-navbar__', this.$('.footer-navbar').length > 0);
        if (this.initPage) this.initPage();
    },
    leave: function() {},
    go: function(options) {
        this.options = options || {};
        this.reset();
        var render = this.render;
        var pageOpen = _.once(function() {
            render();
        });
        _.delay(pageOpen, 1000);
        this.$el.one('pageOpen', pageOpen);
        this.showPage();
    },
    refresh: function(options) {
        this.options = options || {};
        this.reset();
        this.render();
    },
    reset: function() {},
    showPage: function(options) {
        var options = options || this.options || {};
        if (this.$el && this.$el.hasClass('view-hidden')) {
            var $curPage = $('.view:not(".view-hidden")');
            var closeCurPage = _.once(function() {
                $curPage.removeClass('view-prev').removeClass('view-prev-reverse')
                        .addClass('view-hidden');
                $curPage.find('input, textarea').blur();
            });
            $curPage.addClass('view-prev');
            if (options.reverse) $curPage.addClass('view-prev-reverse');
            _.delay(closeCurPage, 1000);
            $curPage.one('pageClose', closeCurPage);

            $('head title').text(this.$('.header-navbar .navbar-title').text());
            var $nextPage = this.$el;
            var openNextPage = _.once(function() {
                $nextPage.removeClass('view-next').removeClass('view-next-reverse');
                $nextPage.find('input, textarea').blur();
                window.scrollTo(0, 0);
            });
            $nextPage.removeClass('view-hidden');
            $nextPage.addClass('view-next');
            if (options.reverse) $nextPage.addClass('view-next-reverse');
            _.delay(openNextPage, 1000);
            $nextPage.one('pageOpen', openNextPage);
        }
    }
});

module.exports = pageView;
