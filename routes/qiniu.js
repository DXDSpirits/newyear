var settings = require('../settings/settings.js');
var express = require('express');
var router = express.Router();

var wechat = require('../middlewares/wechat');
var qiniu = require('qiniu');

qiniu.conf.ACCESS_KEY = settings.QINIU.ACCESS_KEY;
qiniu.conf.SECRET_KEY = settings.QINIU.SECRET_KEY;

var bucketName = settings.QINIU.BUCKET_NAME;
var putPolicy = new qiniu.rs.PutPolicy(bucketName);
var client = new qiniu.rs.Client();


router.get('/uptoken', function(req, res, next) {
    var token = putPolicy.token();
    res.header("Cache-Control", "max-age=0, private, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
    if (token) {
        res.json({
            uptoken: token
        });
    }
});


router.get('/pfopwxvoice/:key', function(req, res, next) {
    var key = req.params.key;
    var fops = 'avthumb/mp3|saveas/' + qiniu.util.urlsafeBase64Encode(bucketName + ':' + key + '.mp3');
    var responseSuccess = function(persistentId) {
        res.json({
            persistentId: persistentId
        });
    };
    var responseError = function(msg) {
        res.status(400).json({
            detail: msg
        });
    };
    qiniu.fop.pfop(bucketName, key, fops, {
        pipeline: 'wechataudio',
        notifyURL: settings.API_ROOT + 'greetings/pfop-notify/'
    }, function(error, result, _response) {
        if (!error && result.persistentId) {
            responseSuccess(result.persistentId);
        } else {
            responseError('Audio pfop failed');
        }
    });
});


router.get('/fetchwxvoice/:serverid', function(req, res, next) {
    var serverid = req.params.serverid;
    var key = 'wechat/' + serverid;
    var token = wechat.getAccessToken();
    var mediaSrc = 'http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=' + token + '&media_id=' + serverid;
    var responseSuccess = function() {
        res.json({
            key: key,
            url: 'http://mm.8yinhe.cn/' + key
        });
    };
    var responseError = function(msg) {
        res.status(400).json({
            detail: msg
        });
    };
    client.fetch(mediaSrc, bucketName, key, function(error, result, _response) {
        if (!error && /audio/.test(result.mimeType)) {
            responseSuccess();
        } else {
            responseError('Media fetch failed');
        }
    });
});

module.exports = router;
