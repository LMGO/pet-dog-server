const mysql = require('mysql');


var pool  = mysql.createPool({
  connectionLimit : 10,
  host     : '',
  user     : 'root',
  password : 'z123456',
  database : 'backend',
  port     :  3306,
  // charset  : "utf8"
});
 
module.exports = pool;

