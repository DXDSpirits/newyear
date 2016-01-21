var App = require('../app');

App.MapData = new (Amour.Model.extend({
    urlRoot: 'http://greeting.wedfairy.com/api/greetings/place/'
    // urlRoot: function () {
    //     return this.defaultUrl
    // }
}))();
