const mongoose = require("mongoose") ;

const userSchema =new mongoose.Schema({
      name : {
        type : String ,
        required : true 
      } , 
      email : {
        type : String ,
        unique : true 
      },
      password :{
        type : String ,
        unique : true ,
        select : false ,  // field which is not to give  by default but if you want to get it => User.findOne({username : username}).select("+password")
      },
      username : {
        type : String ,
        unique : true ,
        required : true 
      },

      blogs : [
        {   type : mongoose.Schema.Types.ObjectId ,
            ref : "Blog"
        }
      ],
      verify : {   // field to veryfy the user 
        type : Boolean ,
        default : false ,
      
      },
      googleAuth : {
        type : Boolean ,
        default : false ,
    
      },
      profilePic : {
        type : String ,
        default : null 
      },
      profilePicId : {
        type : String ,
        default : null
      },
      bio : {
        type : String 
      },
      followers :[
         {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "User" 
      } ],
      followings :[
         {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "User"
      }],
      saveBlogs : [
        {
          type : mongoose.Schema.Types.ObjectId ,
          ref : "Blog"
        }
      ] ,
      likeBlogs : [
        {
          type : mongoose.Schema.Types.ObjectId ,
          ref : "Blog"
        }
      ] , 
      showLikesBlog : {
        type : Boolean ,
        default : true ,
      },
      showSavedBlog :{
        type : Boolean ,
        default : false
      }
} , { timestamps : true }) ; 

const User = mongoose.model("User" , userSchema) ;

module.exports = User ;