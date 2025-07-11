const mongoose = require("mongoose") ;

const commentSchema = new mongoose.Schema({
      comment : {
        type : String ,
        required : true 
      },
      blog : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "Blog"
      },
      user : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "User"
      },
     likes : [
     {
      type : mongoose.Schema.Types.ObjectId ,
      ref : "User"
     }
     ]   ,
     replies : [
      {
        type : mongoose.Schema.Types.ObjectId ,   // <-------|
        ref : "Comment"                          //          |
      }                                           //         |
     ],                                           //         |   these two are for the nested comment 
     parentComment : {                            //         |
      type : mongoose.Schema.Types.ObjectId ,    //          |
      ref : "Comment" ,                         // <---------|
      default : null                                          
     }
    },
    { timestamps : true } 
    ) ; 

const Comment = mongoose.model("Comment" , commentSchema ) ;

module.exports = Comment ;