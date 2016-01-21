var App = require('../app');
var PageView = require('../pageview');

App.Pages.MapData = new Backbone.Model.extend({
    promptColor: function() {
        alert("fuck");
        //var cssColor = prompt("Please enter a CSS color:");
        //this.set({color: cssColor});
    }
});
