const mongoose = require("mongoose") ; 
  
const blogSchema = new mongoose.Schema({
      title : {
        type : String ,
        trim : true ,
        required : true 
      },
     desc : String ,
     content : {
        type : Object ,
        required : true 
     },
     blogId :{
        type : String ,
        required : true ,
        unique : true 
     },
     draft : {
        type : Boolean ,
        default : false 
     } ,
     image : {
      type : String ,
      required : true 
     },
     imageId :{  // stores the public id of image and it is used to  indentify particuler image for many puposes like deletion of image from cloud storage 
      type : String ,
      required : true ,
     },
    creator : {
      type : mongoose.Schema.Types.ObjectId , // connecting with user schema or its type is of objectId 
      ref : "User",   // tells that id belongs to user collection 
      required : true 
    },
    likes : [
      {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "User"
      }
    ] ,
  comments :[
      {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "Comment"
      }
  ],
  totalSaves : [
    {
      type : mongoose.Schema.Types.ObjectId , 
      ref : "User"
    }
  ],
  tags : [String] ,   
  },
     { timestamps : true }        // have to explain 
);

const Blog = mongoose.model("Blog" , blogSchema) ;

module.exports = Blog ;