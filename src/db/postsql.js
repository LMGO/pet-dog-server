var post = {  
    insert:'INSERT INTO posting(posting_id,user_id,pet_id,posting_content,posting_time) VALUES(?,?,?,?,?)', 
  //   queryAll:'SELECT * FROM user',  
    getpostById:'SELECT * FROM posting WHERE user_id = ? ',//根据账户名查找用户
    delebypostId:'DELETE FROM posting WHERE posting_id = ?',
  //   updateUser:'UPDATE user SET user_code = ?,user_name = ? ,user_sex = ? WHERE user_id = ?',
  //   updateUserhead:'UPDATE user SET user_head = ? WHERE user_id = ?'
  };
module.exports = post;
