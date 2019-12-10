var postpic = {  
    insert:'INSERT INTO  postingpic(posting_id,posting_pic) VALUES(?,?)',  
    getpicById:'SELECT posting_pic FROM postingpic WHERE posting_id = ?'
  };
module.exports = postpic;
