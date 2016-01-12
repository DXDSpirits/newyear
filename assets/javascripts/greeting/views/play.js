
var App = require('../app');
var PageView = require('../pageview');

App.Pages.Play = new (PageView.extend({
    events: {},
    initPage: function() {},
    leave: function() {},
    render: function() {}
}))({el: $('#view-play')});
