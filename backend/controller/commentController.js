const Comment = require("../models/commentSchema.js") ;
const Blog = require("../models/blogSchema.js") ;





async function addComment( req , res ){

try{
    
    const creator = req.user ;
   
    const id = req.params.id ;
    
    const comment = req.body.comment ; 
    
    if(!comment){
        return res.status(400).json({
            success : false ,
            message: "please enter the comment"
        })
    }
   
    const blog = await Blog.findById(id)  ;
   
    if(!blog){
        return res.status(400).json({
            success : false ,
            message : "blog is not found " 
        })
    }
// creating the comment 
    const  newComment = await Comment.create({
           blog : id ,
           user : creator ,
           comment : comment 
    }).then((comment) =>{
        return comment.populate({
            path : "user" ,
            select : "name email"
        })
    }); 
     
    await Blog.findByIdAndUpdate( id , {$push : { comments : newComment._id }}) ; 

    return res.status(200).json({
        success : true ,
        message : "comment is added successfully",
        newComment 
    })
    

   }catch(err){
    return res.status(500).json({
        success : false ,
        message : "comment can not be added"
    })
}
}

async function deleteComment( req , res ){

try{
    
    const userId = req.user ;
   
    const commentId = req.params.id ;
    
    const comment = await Comment.findById(commentId).populate({
          path : "blog",
          select : "creator"
    })  ;

       
    if(!comment){
        return res.status(400).json({
            success : false ,
            message : "comment is not found " 
        })
    }

    if( userId != comment.blog.creator && userId !=comment.user ){
        return res.status(400).json({
            success : false ,
            message : "you are not authorized to delete"
        })
    }

    async function deleteCommentAndReplies(commentId){
          let comment = await Comment.findById(commentId) ;
          for(const replyId of comment.replies ){
             await deleteCommentAndReplies(replyId) ;
          }

          await Comment.findByIdAndDelete(commentId) ;
    }

    await deleteCommentAndReplies(commentId) ;  // removing the comment from parent or blog 
    if(!comment.parentComment){
      await Blog.findByIdAndUpdate(comment.blog._id , {$pull : { comments : commentId }}) ;
    }else{
      await Comment.findByIdAndUpdate(comment.parentComment , {$pull : { replies : commentId}}) ;
    }

    await Comment.findByIdAndDelete(commentId) ;

    
   

    return res.status(200).json({
        success : true ,
        message : "comment is deleted successfully"
    })
    

   }catch(err){
        console.log(err) ;
        return res.status(500).json({
        success : false ,
        message : "comment can not be deleted"
    })
}
}

async function editComment( req , res ){

try{
    
    const userId = req.user ;
   
    const commentId = req.params.id ;
    
    const updatedComment = req.body.updatedCommentContent ; 

    const comment = await Comment.findById(commentId) ;
   
    if(!comment){
        return res.status(400).json({
            success : false ,
            message : "comment is not found " 
        })
    }

     if( comment.user != userId){
        return res.status(400).json({
            success : false ,
            message : "you are not authorized to edit this comment"
        })
     }

    const updateComment = await Comment.findByIdAndUpdate(commentId , {comment : updatedComment } , { new : true }).
                                        then((comment) => {
                                                return comment.populate({
                                                       path : "user" ,
                                                       select : "name email"
                                                 })
                                                         }) ;

     return res.status(200).json({
        success : true ,
        message : "comment is edited successfully",
        comment : updateComment
    })
    

   }catch(err){
    return res.status(500).json({
        success : false ,
        message : "comment can not be edited ", 
        err 
    })
}
}


async function likeComment( req , res ){

try{
 
    const userId = req.user ;
      
    const commentId = req.params.id ;
    
    const comment = await Comment.findById(commentId)  ;
    
    if(!comment){
        return res.status(400).json({
            success : false ,
            message : "comment can not be found  " 
        })
    }

   if(!comment.likes.includes(userId)){
        await Comment.findByIdAndUpdate(commentId , {$push : { likes : userId}}) ;

       return res.status(200).json({
        success : true ,
        message : "comment is liked successfully"
       })

   }
   else{

       await Comment.findByIdAndUpdate(commentId , {$pull : {likes : userId }}) ;

        return res.status(200).json({
        success : true ,
        message : "comment is disliked successfully"
      })

   }



   }catch(err){
    return res.status(500).json({
        success : false ,
        message : "comment can not  be liked"
    })
}
}

async function addNestedComment( req , res ){
    try{
        const userId = req.user ;
        const { parentCommentId , id : blogId} = req.params ;
        const comment = await Comment.findById(parentCommentId) ;
        const { reply } = req.body ;
        const blog = await Blog.findById(blogId) ;
        
        if(!comment){
            return res.status(400).json({
                message : "parent comment can't be found"
            })
        }
         if(!blog){
            return res.status(400).json({
                message : "blog can't be found"
            })
        }


        const newReply = await Comment.create({
            blog : blogId ,
            comment : reply ,
            parentComment : parentCommentId ,
            user : userId 
        }).then((reply) =>{
            return reply.populate({
                path : "user" ,
                select : "name email"
            })
        })

      

       await Comment.findByIdAndUpdate(parentCommentId , { $push : { replies : newReply._id  }})

       return res.status(200).json({
        success : true ,
        message : "Reply is added successfully",
        newReply 
       })

    }catch(err){
       
        return res.status(500).json({
            success : false ,
            message : "Reply couldn't be added",
            
        })

    }
}




module.exports = {deleteComment , addComment , editComment ,likeComment , addNestedComment }