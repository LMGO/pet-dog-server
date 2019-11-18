var user = {  
    insert:'INSERT INTO user(user_phone,user_code,user_name,user_sex,user_head) VALUES(?,?,?,?,?)', 
    queryAll:'SELECT * FROM user',  
    getUserById:'SELECT * FROM user WHERE user_phone = ? ',//根据账户名查找用户
  };
module.exports = user;
