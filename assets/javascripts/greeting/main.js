
var App = require('./app');
require('./router');
require('./views/autoload');

window.App = App;
App.start();
