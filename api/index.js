var express = require('express');
var router = express.Router();

//获取每小时风险事件统计列表
router.get('/platform/risks/statistics', function (req, res, next) {
    res.json({status: 0, msg: null, data: {}});
});

//platform/risks/realtime
//platform/risks/history

module.exports = router;