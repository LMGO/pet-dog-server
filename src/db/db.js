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
 
module.exports = pool;

