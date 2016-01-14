
var App = require('./app');
require('./components/places-select');
require('./router');
require('./views/autoload');

window.App = App;
App.start();
