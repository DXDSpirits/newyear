
var App = require('../app');

var globalMenu = new (Amour.View.extend({
    events: {
        'click .btn-logout': 'logout'
    },
    initView: function() {
        this.$el.text('abc');
    },
    render: function() {}
}))({el: $('#global-menu')});
