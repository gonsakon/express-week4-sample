var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(200).json({
    "name":"洧杰"
  })
});
router.get('/login', function(req, res, next) {
  res.status(200).json({
    "name":"login"
  })
});

module.exports = router;
