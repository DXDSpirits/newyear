
var App = require('../app');

var globalMenu = new (Amour.View.extend({
    events: {
        'click .btn-logout': 'logout'
    },
    initView: function() {},
    render: function() {}
}))({el: $('#global-menu')});
