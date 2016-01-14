
var App = require('../app');
var PageView = require('../pageview');

App.Pages.Map = new (PageView.extend({
    events: {
        'click .btn-logout': 'logout'
    },
    initPage: function() {},
    leave: function() {},
    logout: function() {
        Amour.TokenAuth.clear();
        location.href = '/';
    },
    render: function() {}
}))({el: $('#view-map')});
