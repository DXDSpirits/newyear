
var App = require('../app');
var PageView = require('../pageview');

App.Pages.Search = new (PageView.extend({
    events: {},
    initPage: function() {},
    leave: function() {},
    render: function() {}
}))({el: $('#view-search')});
