var express = require('express');
var router = express.Router();
var fs=require("fs")
const multer = require('multer');
var userSQL = require('../db/usersql'); 
var postSQL = require('../db/postsql'); 
const pool = require('../db/db'); 


//发表帖子
router.post('/newpost', async (req,res)=>{
    //传一张
      console.log(req.body)
      let posting_id = req.body.posting_id
      let user_id = req.body.user_id
      let posting_type = req.body.posting_type
      let posting_content = req.body.posting_content
      let posting_time = req.body.posting_time
      console.log(req.body.user_id)
          pool.getConnection(async (err,conn)=>{
            if (err) {
              conn.release();
              res.send(JSON.stringify({
                status: 0,
                message: '服务器异常'
              }));
            }
               //插入newpost
            conn.query(postSQL.insert,[posting_id,user_id,posting_type,posting_content,posting_time],async (err, vals)=>{
              console.log(vals)
              if (err) {
                conn.release();
                res.send(JSON.stringify({
                    status: 1,
                    message: '发表失败'
                }));
                throw err;
               }
              else if(vals.affectedRows!=0) {//数据库有变化
                conn.release();
                res.send(JSON.stringify({
                    status: 2,
                    message: '发表成功'
                }));
                }
                else {//数据库无变化
                  conn.release();
                   res.send(JSON.stringify({
                     status: 3,
                     message: '发表成功'
                   }));
                }
            })

    })
})

//获取我发布的帖子
router.get('/mypost',async(req,res)=>{
    console.log(req.query.user_id)
    let user_id = req.query.user_id
    pool.getConnection(async (err,conn)=>{
        if (err) {
          conn.release();
              res.send(JSON.stringify({
                status: 0,
                message: '服务器异常'
              }));
              throw err;
        }
        //查找mypost
        conn.query(postSQL.getpostById,[user_id],async (qerr, vals)=>{
          if (qerr) {
            conn.release();
            res.send(JSON.stringify({
                status: 1,
                message: '获取失败'
            }));
            throw err;
           }
          else  {
            conn.release();
            res.send(JSON.stringify({
                status: 2,
                message: '获取成功',
                mypostlist:vals
            }));
            }
        })

    })

})



module.exports = router;