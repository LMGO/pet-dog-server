var express = require('express');
var router = express.Router();
var userSQL = require('../db/usersql');
const pool = require('../db/db'); 


router.get('/', function (req, res, fields) {
  // var sql = 'SELECT * from user';
  //从连接池获取连接
  pool.getConnection(function (err, conn) {
    if (err) {
      res.send(JSON.stringify({
        code: '0x000000000',
        status: 0,
        remark: '服务器异常',
        message: null,
        data: null
      }));
    } else {
      conn.query(userSQL.queryAll, function (qerr, vals, fields) {
        if (qerr) {
          res.send(JSON.stringify({
            code: '0x000000000',
            status: 0,
            remark: '获取用户列表',
            message: '请求失败',
            data: null
          }));
        }
        //释放连接
        conn.release();
        res.send(JSON.stringify({
          code: '0x000000000',
          status: 1,
          remark: '获取用户列表',
          message: '请求成功',
          data: vals
        }));
      });
    }
  });
});

module.exports = router;
