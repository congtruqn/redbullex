var express = require('express');
var router = express.Router();
var path = require('path')
var dir = path.join(__dirname,"../bin")
var fs = require("fs-extra")
let cache = {}
function read() {
    cache = fs.readJSONSync(`${dir}/data.json`)
    if (!cache.privateSaleInfo) cache.privateSaleInfo = {
        contri: 39,
        contriMax: 100,
        min: 0.1,
        max: 1,
        price: 1 / 30000000,
        bnbTotal: 31,
        sy: 'MetaFloki',
        dateEnd: (new Date(2021, 10, 10, 7, 0, 0)).getTime()
    }
}
function save() {
    cache.index++
    fs.writeJSONSync(`${dir}/data.json`, cache)
}
read()

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
router.post('/privateSaleInfo', function (req, res, next) {
    cache.privateSaleInfo.time = cache.privateSaleInfo.dateEnd - Date.now()
    return res.send({
        code: 20000,
        data: cache.privateSaleInfo
    });
});
router.post('/info', function (req, res, next) {
    if (!req.body.wallet) return res.send({
        code: 30000
    });
    let info = cache[req.body.wallet] || {
        wallet: req.body.wallet
    }
    return res.send({
        code: 20000,
        data: info
    });
});
router.post('/updateInfo', function (req, res, next) {
    if (!req.body.wallet) return res.send({
        code: 30000
    });
    if (!cache[req.body.wallet]) cache[req.body.wallet] = {
        wallet: req.body.wallet
    }
    let amount = parseFloat(req.body.amount)
    let info = cache[req.body.wallet]
    if (req.body.amount) info.amount = amount
    if (req.body.tx) info.tx = req.body.tx
    cache.privateSaleInfo.contri++
    cache.privateSaleInfo.bnbTotal += amount
    setTimeout(save, 1000)
    return res.send({
        code: 20000,
        data: info
    });
});

module.exports = router;
