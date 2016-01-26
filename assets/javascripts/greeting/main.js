
var App = require('./app');
require('./router');
require('./components/autoload');
require('./views/autoload');

window.App = App;
App.start();
