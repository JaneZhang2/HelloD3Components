var express = require('express');
var router = express.Router();

//获取每小时风险事件统计列表
router.get('/platform/risks/statistics', function (req, res, next) {
    var currentHour = new Date().getTime(),
        result = {};
    for (var i = 0; i < 60 * 60 * 24 * 1000 * 4; i += 60 * 60 * 1000) {
        result[currentHour - i] = Math.random() * 1000;
    }

    res.json({status: 0, msg: null, data: result});
});

//获取当前小时风险事件列表
router.get('/platform/risks/realtime', function (req, res, next) {
    var data = {
        statistics: {
            count: 0,
            statuses: {
                '0': 0,
                '1': 0,
                '2': 0,
                '3': 0
            }
        }
    };

    res.json({status: 0, msg: null, data: result});
});

module.exports = router;