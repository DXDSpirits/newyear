
var App = require('../app');
var PageView = require('../pageview');

App.Pages.About = new (PageView.extend({
    events: {},
    initPage: function() {},
    render: function() {}
}))({el: $('#view-about')});
