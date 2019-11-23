var user = {  
    insert:'INSERT INTO user(user_id,user_code,user_name,user_sex,user_head) VALUES(?,?,?,?,?)', 
    queryAll:'SELECT * FROM user',  
    getUserById:'SELECT * FROM user WHERE user_id = ? ',//根据账户名查找用户
    updateUser:'UPDATE user SET user_code = ?,user_name = ? ,user_sex = ? WHERE user_id = ?',
    updateUserhead:'UPDATE user SET user_head = ? WHERE user_id = ?'
  };
module.exports = user;
