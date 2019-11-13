var express = require('express');
var router = express.Router();
var userSql = require('../db/usersql');  
const pool = require('../db/db'); 

//注册操作
router.get('reg', async function (req, res, fields) {
  let user_id = req.query.user_id;
  let user_code = req.query.user_code;
  //从连接池获取连接
  var sql = "select * from user where user_id = '"+user_id+"' and user_code = '"+user_code+"'";
  await pool.getConnection( function (err, conn) {
    if (err) {
      conn.release();
      res.send(JSON.stringify({
        code: '0x000000000',
        status: 0,
        remark: '服务器异常',
        message: null,
        data: null
      }));
    } else {
      conn.query(sql, function (err, vals, fields) {
        console.log(vals)
        if (err) {
         throw err;
        }
        else if(vals[0]==null) {
            //释放连接
            conn.release();
            res.send(JSON.stringify({
              code: '0x000000000',
              status: 1,
              remark: '获取用户列表',
              message: '用户名或密码错误',
              data: vals
            }));
         }else{
           //释放连接
           conn.release();
             res.send(JSON.stringify({
             code: '0x000000000',
             status: 2,
             remark: '获取用户列表',
             message: '登录成功',
             data: vals
           }))
         }
       
      });
    }
  });
});
//登录操作
 router.get('/login', async function (req, res, fields) {
  let user_id = req.query.user_id;
  let user_code = req.query.user_code;
  //从连接池获取连接
  // var sql = "select * from user where user_id = '"+user_id+"' and user_code = '"+user_code+"'";
  await pool.getConnection( function (err, conn) {
    if (err) {
      conn.release();
      res.send(JSON.stringify({
        code: '0x000000000',
        status: 0,
        remark: '服务器异常',
        message: null,
        data: null
      }));
    } else {
      conn.query("select * from user where user_id = ? and user_code = ?",[user_id,user_code], function (err, vals, fields) {
        console.log(vals)
        if (err) {
         throw err;
        }
        else if(vals[0]==null) {
            //释放连接
            conn.release();
            res.send(JSON.stringify({
              code: '0x000000000',
              status: 1,
              remark: '获取用户列表',
              message: '用户名或密码错误',
              data: vals
            }));
         }else{
           //释放连接
           conn.release();
             res.send(JSON.stringify({
             code: '0x000000000',
             status: 2,
             remark: '获取用户列表',
             message: '登录成功',
             data: vals
           }))
         }
       
      });
    }
  });
});

module.exports = router;
