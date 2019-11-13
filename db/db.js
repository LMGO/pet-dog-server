const mysql = require('mysql');


var pool  = mysql.createPool({
  connectionLimit : 10,
  host     : '127.0.0.1',
  user     : 'root',
  password : 'password',
  database : 'dbc',
  port     :  3306,
  // charset  : "utf8"
});
 

// function  query(sql, values, callback) {
//   console.log("db pool");
//   pool.getConnection(function (err, connection) {
//       if(err){
//         callback(err,null,null);
//         throw err;
//       }else{
//         console.log("get connection ");
//         //Use the connection
//         connection.query(sql, values,function (err, results, fields) {
//             console.log(JSON.stringify(results));
//             //每次查询都会 回调
//             callback(err, results);
//             //只是释放链接，在缓冲池了，没有被销毁
//             connection.release();
//             if(err) throw error;
  
//         });
//       }
      
     
//   });
// }
module.exports = pool;

