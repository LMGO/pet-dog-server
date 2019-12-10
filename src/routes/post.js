var express = require('express');
var router = express.Router();
var fs=require("fs")
const multer = require('multer');
var userSQL = require('../db/usersql'); 
var postSQL = require('../db/postsql'); 
var postpicSQL = require('../db/postpicsql'); 
const pool = require('../db/db'); 


//发表帖子主体内容
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

//帖子图片上传
//multer文件的硬盘存储模式
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'src/public/images/postpic/');//帖子图片路径
  },
})
var upload = multer({
  storage: storage
}).array('file');;

//帖子图片
router.post('/postingpic', async (req,res)=>{
  upload(req,res,function(err){
    if(err instanceof multer.MulterError){
      res.send(JSON.stringify({
        remark: '服务器异常',
        status: 0,
        message: null,
        data: null
      }));
      throw err;
  }else{
      //循环处理
      let posting_id=req.body.posting_id
      console.log(posting_id)
      let resto;
      req.files.forEach(function(i){
        var oldPath = "src/public/images/postpic/"+i.filename;
        var newPath = "src/public/images/postpic/"+i.filename +Date.now()+".jpg";
        let dest = "/images/postpic/"+i.filename+Date.now()+posting_id+".jpg";
        
        let posting_pic=dest
        console.log(dest)
        fs.rename(oldPath,newPath,(err,data)=>{
            if(err){
              res.send(JSON.stringify({
                status: 1,
                message: '图片上传成功 修改失败'
              }));
            }else {
                   //更改图片名为newPatH保存到数据库
          pool.getConnection(async (err,conn)=>{
            if (err) {
              conn.release();
              res.send(JSON.stringify({
                status: 0,
                remark: '服务器异常',
                message: null,
                data: null
              }));
            }
            conn.query(postpicSQL.insert,[posting_id, posting_pic],async (err, vals)=>{
              // console.log(vals)
              resto = vals.affectedRows;
              if (err) {
                throw err;
              }
              else if(vals.affectedRows!=0) {//数据库有变化
                  conn.release();
                  // res.status(200).send(JSON.stringify({
                  //   status: 2,
                  //   message: '帖子图片添加成功'
                  // }));
                }
                else {//数据库无变化
                  conn.release();
                  // res.status(500).send(JSON.stringify({
                  //   code: '0x000000000',
                  //   status: 1,
                  //   message: '帖子图片添加异常'
                  // }));
                }
                })
            })
          }
        })
      })
      if(resto!=0){
        res.status(200).send(JSON.stringify({
          status: 2,
          message: '帖子图片添加成功'
        }));
      }
      else{
        res.status(500).send(JSON.stringify({
          code: '0x000000000',
          status: 0,
          message: '帖子图片添加异常'
        }));
      }
    }

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
        }else{   
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
      }

    })
  
})

//获取所有的帖子
router.get('/userpost',async(req,res)=>{
  pool.getConnection(async (err,conn)=>{
      if (err) {
        conn.release();
            res.send(JSON.stringify({
              status: 0,
              message: '服务器异常'
            }));
            throw err;
      }else{   
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
    }

  })

})
module.exports = router;