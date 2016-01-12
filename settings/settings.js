
var CONFIG = {
    ENV : 'production',

    TAT_STATIC : 'http://static.wedfairy.com/',

    API_ROOT : 'http://api.wedfairy.com/api/',

    CDN_URL : '/assets/',

    QINIU: {
        ACCESS_KEY: '',
        SECRET_KEY: '',
        BUCKET_NAME: ''
    },

    REDIS: {
        HOST: '127.0.0.1',
        PORT: 6379,
        USER: '',
        PWD: '',
        PASSWORD: ''
    }
};

try {
    var CONFIG_LOCAL = require('./settings_local');
    for (var prop in CONFIG_LOCAL) {
        CONFIG[prop] = CONFIG_LOCAL[prop];
    }
} catch (e) {}

module.exports = CONFIG;
