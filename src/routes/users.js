var express = require('express');
var router = express.Router();
var userSQL = require('../db/usersql');  
const pool = require('../db/db'); 
const host = "http://10.100.162.231:8083/"//主机地址，为预定义头像准备
//注册操作
router.get('/reg', async function (req, res, fields) {
  console.log(req.query);
  let user_phone = req.query.user_phone;
  let user_code = req.query.user_code;
  let user_sex=req.query.user_sex;
  let user_name=req.query.user_name;
  //从连接池获取连接
   pool.getConnection( function (err, conn) {
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
       //根据用户账号查找
        conn.query(userSQL.getUserById,[user_phone], function (err, vals, fields) {
        console.log(vals)
        if (err) {
         throw err;
        }
        else if(vals[0]==null) {//用户不存在，则注册用户
                let user_head = host+"static/images/1.jpg";//系统预定义用户头像
                conn.query(userSQL.insert,[user_phone, user_code, user_name, user_sex, user_head], function (err,vals1,fields){
                if (err) {
                  throw err;
                }
                  conn.release();//释放连接
                  res.send(JSON.stringify({
                    code: '0x000000000',
                    status: 1,
                    remark: '注册用户',
                    message: '用户注册成功',
                    data: vals
                  }));
                
              })           
         } 
         else if(vals[0].user_phone === user_phone){//用户账号已存在
          conn.release();
          res.send(JSON.stringify({
            code: '0x000000000',
            status: 2,
            remark: '检查账号是否存在',
            message: '账号已注册，请登录',
            data: vals
          }));
        }
        else{
           //释放连接
            conn.release();
            res.send(JSON.stringify({
              code: '0x000000000',
              status: 3,
              remark: '',
              message: '注册失败',
              data: vals
           }))
         }
       
      });
    }
  });
});

//登录操作
router.get('/login', async function (req, res, fields) {
  console.log(req.query);
  let user_phone = req.query.user_phone;
  let user_code = req.query.user_code;
  //从连接池获取连接
  // var sql = "select * from user where user_phone = '"+user_phone+"' and user_code = '"+user_code+"'";
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
      conn.query("select * from user where user_phone = ? and user_code = ?",[user_phone,user_code], function (err, vals, fields) {
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
             status: 2,//可用作判断依据和前端路由拦截
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
