var user = {  
    insert:'INSERT INTO user(user_id,user_code) VALUES(?,?)', 
    queryAll:'SELECT * FROM user',  
    getUserById:'SELECT * FROM user WHERE user_id = ? ',
  };
module.exports = user;
