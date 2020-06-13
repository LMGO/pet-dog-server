var express = require('express');
var router = express.Router();
var fs=require("fs")

const multer = require('multer');
// const upload = multer({ dest: 'src/public/images/ue/' });
// const path = require('path')
// const multer = require('multer')
var userSQL = require('../db/usersql');  
const pool = require('../db/db'); 



//注册操作
router.get('/reg', async function (req, res, fields) {
  let user_id = req.query.user_id;
  console.log(req.query.user_id)
  console.log(req.query)
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
        conn.query(userSQL.getUserById,[user_id], function (err, vals, fields) {
        if (err) {
         throw err;
        }
        else if(vals[0]==null) {//用户不存在，则注册用户
               let user_head = "/images/default1.jpg";
              //  let user_head = host+"/images/1.jpg";//由于项目在本地，ip地址容易变，所以系统预定义用户头像时采用字符串存进数据库，前端拼接IP和端口
                conn.query(userSQL.insert,[user_id, user_code, user_name, user_sex, user_head], function (err,vals1,fields){
                if (err) {
                  throw err;
                }
                  conn.release();//释放连接
                  res.send(JSON.stringify({
                    code: '0x000000000',
                    status: 1,
                    remark: '注册用户',
                    message: '用户注册成功',
                    data: vals1
                  }));
                
              })           
         } 
         else if(vals[0].user_id === user_id){//用户账号已存在
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
  let user_id = req.query.user_id;
  let user_code = req.query.user_code;
  //从连接池获取连接
  // var sql = "select * from user where user_id = '"+user_id+"' and user_code = '"+user_code+"'";
  await pool.getConnection( function (err, conn){
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
        console.log(vals[0])
        if (err) {
         throw err;
        }
        else if(vals[0]===undefined) {
            //释放连接
            conn.release();
            res.send(JSON.stringify({
              code: '0x000000000',
              status: 1,
              remark: '查询用户',
              message: '用户名或密码错误',
              data: vals
            }));
         }else{
           //释放连接
           conn.release();
             res.send(JSON.stringify({
             code: '0x000000000',
             status: 2,//可用作判断依据和前端路由拦截
             remark: '用户登录',
             message: '登录成功',
             data: vals
           }))
         }
       
      });
    }
  });
});

//更改个人基本信息（密码，昵称，性别,签名）
router.post('/update',function(req, res, fields){
  let user_id = req.body.user_id;
  let user_code = req.body.user_code;
  let user_name = req.body.user_name;
  let user_sex = req.body.user_sex;
  let user_sign = req.body.user_sign
  pool.getConnection( async function(err,conn){
      if (err) {
        conn.release();
        res.send(JSON.stringify({
          code: '0x000000000',
          status: 0,
          remark: '服务器异常',
          message: null,
          data: null
        }));
      }
      conn.query(userSQL.updateUser,[user_name, user_code, user_sign, user_sex,user_id],function (err, vals, fields){
        console.log(vals.changedRows)
        if (err) {
          throw err;
         }
         else if(vals.changedRows===1) {//数据库有变化
             conn.release();
             res.send(JSON.stringify({
               code: '0x000000000',
               status: 1,
               message: '更新用户信息成功'
             }));
          }
          else {//数据库无变化
            conn.release();
             res.send(JSON.stringify({
               code: '0x000000000',
               status: 2,
               remark: '更新用户信息',
               message: '更新用户信息失败'
             }));
          }

      })
  })
})

//更改头像，传入一张图片
   //multer文件的硬盘存储模式
   var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // //先创建路径在保存
        // createFileDirectory(uploadPath);
        //指定文件保存路径
        cb(null, 'src/public/images/ue/');
    },
   
    // filename: function(req, file, cb) {
    //     console.log(file)
    //         // 将保存文件名设置为 时间戳 + 文件原始名，比如 151342376785-123.jpg
    //     cb(null, Date.now() + '-' + file.originalname);

    // }
  })
  var upload = multer({
    storage: storage
  });
  // var createFileDirectory = function(path) {
  //   try {
  //       //检测文件夹是否存在，不存在抛出错误
  //       fs.accessSync(path);
  //   } catch (error) {
  //       //创建文件夹
  //       fs.mkdirSync(path);
  //   }
  // }

//修改头像
router.post('/updateUserhead',upload.single('file'), async (req,res)=>{
  //传一张
    let avatar = req.file
    console.log(avatar)
    console.log(req.body.user_id)
    if (avatar) {
      // var file = req.files;
	    var oldPath = "src/public/images/ue/"+avatar.filename;
   	 var newPath = "src/public/images/ue/"+avatar.filename+Date.now()+req.body.user_id+".jpg";
     let headdest = "/images/ue/"+avatar.filename+Date.now()+req.body.user_id+".jpg";
      let user_id=req.body.user_id
      let user_head=headdest
     console.log(headdest)
	   fs.rename(oldPath,newPath,(err,data)=>{
		  if(err){
        console.log("修改名称失败");
        res.send("上传成功 修改失败");
      }else {
        //更改图片名为newPath成功并修改数据库中头像字段
        pool.getConnection(async (err,conn)=>{
          if (err) {
            conn.release();
            res.send(JSON.stringify({
              code: '0x000000000',
              status: 0,
              remark: '服务器异常',
              message: null,
              data: null
            }));
          }
          //根据传入的user_id查询数据库更新头像
          conn.query(userSQL.updateUserhead,[user_head, user_id],function (err, vals, fields){
            console.log(vals.changedRows)
            if (err) {
              throw err;
             }
             else if(vals.changedRows===1) {//数据库有变化
                 conn.release();
                 res.send(JSON.stringify({
                   code: '0x000000000',
                   status: 1,
                   remark: '更新用户头像',
                   message: '更新用户头像成功',
                   data:user_head
                 }));
              }
              else {//数据库无变化
                conn.release();
                 res.send(JSON.stringify({
                   code: '0x000000000',
                   status: 2,
                   remark: '更新用户头像',
                   message: '更新用户头像失败'
                 }));
              }
    
          })
      })
      }
	})
  }
  // res.status(200).send('上传成功');

	// var file = req.files[0];
	// var oldPath = "src/public/images/ue/"+file.filename;
	// var newPath = "src/public/images/ue/"+file.filename +".jpg";
	// let filedest = "/images/ue/"+file.filename +".jpg";
	// fs.rename(oldPath,newPath,(err,data)=>{
	// 	if(err){
	// 		console.log("修改名称失败");
	// 		res.send("上传成功 修改失败");
	// 	}else {
	// 		console.log("修改成功");
	// 		res.send("上传加修改名称成功");
	// 	}
	// })
})
module.exports = router;
