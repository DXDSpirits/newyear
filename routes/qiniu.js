var settings = require('../settings/settings.js');
var express = require('express');
var router = express.Router();

var wechat = require('../middlewares/wechat');
var qiniu = require('qiniu');

qiniu.conf.ACCESS_KEY = settings.QINIU.ACCESS_KEY;
qiniu.conf.SECRET_KEY = settings.QINIU.SECRET_KEY;

var putPolicy = new qiniu.rs.PutPolicy(settings.QINIU.BUCKET_NAME);
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

router.get('/fetchwxvoice/:serverid', function(req, res, next) {
    var serverid = req.params.serverid;
    var token = wechat.getAccessToken();
    var imageSrc = 'http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=' + token + '&media_id=' + serverid;
    client.fetch(imageSrc, 'tatmusic', 'wechat/' + serverid, function(error, result, response) {
        if (!error && /image/.test(result.mimeType)) {
            res.json({
                url: 'http://mm.8yinhe.cn/wechat/' + serverid
            });
        } else {
            res.status(400).json({});
        }
    });
});

module.exports = router;
