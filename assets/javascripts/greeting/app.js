
if (window.wx && window.WX_CONFIG) {
    wx.config(WX_CONFIG);
}

moment.lang('zh-cn');

var lazyResize = _.debounce(function() {
    $('.views-wrapper').height($(window).height());
}, 300);
$(window).resize(lazyResize);
lazyResize();

$('body').on('click', '[data-route]', function(e) {
    var route = $(e.currentTarget).data('route');
    if (route == 'return') {
        window.history.back();
    } else if (route == 'preview') {
        App.previewStory(App.story.get('name'));
    } else {
        App.router.navigate(route);
    }
});

$('body').on('click', '.guideview', function() {
    $(this).animate({opacity: 0}, 500, function() {
        $(this).css({opacity: 1}).addClass('hidden');
    });
});

/*
 * App
 */

var App = {
    Models: {},
    Views: {},
    Pages: {}
};

/*
 * Page Router
 */

App.pageRouter = new(function(pages) {
    this.pages = pages;
    this.history = {
        active: null,
        stack: []
    };
    this.goTo = function(pageName, options) {
        var next = this.pages[pageName];
        var prev = _.last(this.history.stack);
        (options || (options = {})).caller = options.caller || this.history.active;
        if (next && next == prev) {
            this.history.active.leave();
            if (this.pushNext) {
                this.history.stack.push(this.history.active);
            } else {
                this.history.stack.length -= 1;
                options.reverse = true;
            }
            next.go(options);
            this.history.active = next;
        } else if (next && next != this.history.active) {
            if (this.history.active) {
                this.history.active.leave();
                this.history.stack.push(this.history.active);
            }
            next.go(options);
            this.history.active = next;
        } else if (next && next == this.history.active) {
            next.refresh(options);
        }
        this.pushNext = false;
    };
    this.clearHistory = function() {
        this.history.stack.length = 0;
    };
    this.refreshActivePage = function() {
        this.history.active.refresh();
    };
    this.goBack = function() {
        if (this.history.stack.length > 0) {
            var prev = this.history.stack.pop();
            this.history.active = prev;
            this.history.active.showPage({
                reverse: true
            });
        }
    };
    this.pop = function() {
        if (this.history.stack.length > 0) {
            var prev = this.history.stack.pop();
            this.history.active = prev;
        }
    };
})(App.Pages);

/*
 * Utilities
 */

App.openUrl = function(url, options) {
    options || (options = {});
    $('#apploader-closing').removeClass('invisible');
    _.delay(function() {
        if (options.replace) {
            location.replace(url);
        } else {
            location.href = url;
        }
    }, 300);
};

App.getTemplate = function(name) {
    return $('#template-' + name).html();
};

App.rediectWechatAuth = function() {
    var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?';
    var state = btoa(JSON.stringify({
        platform: 'composer',
        origin: 'http://greeting.wedfairy.com'
    }));
    var query = {
        appid: 'wxc7cc3f069aaa80d6',
        redirect_uri: 'http://api.wedfairy.com/api/users/wechat-auth/',
        response_type: 'code',
        scope: 'snsapi_userinfo',
        state: state
    };
    App.openUrl(url + Amour.encodeQueryString(query) + '#wechat_redirect');
};

/*
 * Ajax events
 */

var timeout = 1000;
var timeout_stop, timeout_error;

Amour.ajax.on('start', function() {
    clearTimeout(timeout_stop);
    clearTimeout(timeout_error);
    $('#apploader').removeClass('invisible');
});

Amour.ajax.on('stop', function() {
    timeout_stop = setTimeout(function() {
        $('#apploader').addClass('invisible');
        timeout = 1000;
    }, timeout);
});

Amour.ajax.on('error', function() {
    $('#apploader .ajax-error').removeClass('hidden');
    timeout_error = setTimeout(function() {
        $('#apploader .ajax-error').addClass('hidden');
    }, (timeout = 2000));
});

Amour.ajax.on('unauthorized', function() {
    Amour.storage.set('redirect-on-login', location.href);
    App.rediectWechatAuth();
});

Amour.ajax.on('forbidden', function() {
    App.rediectWechatAuth();
});

/*
 * Initializations
 */

App.vent = new Amour.EventAggregator();

/*
 * Authorizations
 */

if (!Amour.TokenAuth.get()) {
    Amour.storage.set('redirect-on-login', location.href);
    App.rediectWechatAuth();
}

App.user = new Amour.Models.User();

App.userGreeting = new (Amour.Model.extend({
    urlRoot: Amour.APIRoot + 'greetings/greeting/',
    verify: function(callback, context) {
        var ctx = context || this;
        var success = _.bind(function() {
            callback && callback.call(ctx, true, this);
        }, this)
        var error = _.bind(function() {
            callback && callback.call(ctx, false);
        }, this)
        if (this.isNew()) {
            App.user.getUserInfo(function() {
                App.userGreeting.fetch({
                    global: false,
                    url: Amour.APIRoot + 'greetings/usergreeting/' + App.user.id + '/',
                    success: success,
                    error: error
                });
            }, error, this);
        } else {
            success();
        }
    }
}))();

App.userGreeting.verify();

/*
 * Start application
 */
App.start = function() {
    Amour.trigger('GreetingAppReady');
    Backbone.history.start();
};

module.exports = App;
