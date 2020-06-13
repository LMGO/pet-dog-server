const mysql = require('mysql');


var pool  = mysql.createPool({
  connectionLimit : 10,
  // host     : '127.0.0.1',
  host     : '10.100.82.252',
  user     : 'root',
  password : 'z123456',
  database : 'backend',
  // password : 'password',
  // database : 'dbc',
  port     :  3306,
  // charset  : "utf8"
});
 
module.exports = pool;

