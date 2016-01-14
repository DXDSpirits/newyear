
var CONFIG = {
    ENV : 'production',

    TAT_STATIC : 'http://static.wedfairy.com/',

    AUTH_API_ROOT : 'http://api.wedfairy.com/api/',
    API_ROOT : 'http://greeting.wedfairy.com/api/',

    CDN_URL : '/assets/',

    QINIU: {
        ACCESS_KEY: '',
        SECRET_KEY: '',
        BUCKET_NAME: ''
    }
};

try {
    var CONFIG_LOCAL = require('./settings_local');
    for (var prop in CONFIG_LOCAL) {
        CONFIG[prop] = CONFIG_LOCAL[prop];
    }
} catch (e) {}

module.exports = CONFIG;
