const Blog = require("../models/blogSchema.js") ; 
const User = require("../models/userSchema.js") ;
const Comment = require("../models/commentSchema.js") ; 
const {verifyJWT} = require("../utils/generateTokens.js") ; 
const  { uploadImage , deleteImageFromCloudinary } = require("../utils/uploadImage.js");
const fs = require("fs") ;
const ShortUniqueId = require("short-unique-id") ;
const { randomUUID } = new ShortUniqueId({length : 10}) ;



async  function createBlog( req , res ){ 
    
    try{
        
         const creator = req.user ;
         const { title , desc } = req.body ; 
         const draft = req.body.draft == "true" ? true : false ;
         const { image , images } = req.files ;
    
        
         const content = JSON.parse(req.body.content) ;
         const tags = JSON.parse(req.body.tags) ;
         
       if( !title || !desc || !content ) return res.status(400).json({
            message : "please fill all the fields "
       })

       const findUser = await User.findById(creator) ;

       if(!findUser){
          res.status(500).json({
            message: "You are not a valid User " 
          })
       }

        // image related
         let imageInd = 0;
         for(let i=0 ; i< content.blocks.length ; i++){
             const block = content.blocks[i];
             if(block.type == "image"){
                const { secure_url , public_id } = await uploadImage(
                    `data:${images[imageInd].mimetype};base64,${images[imageInd].buffer.toString("base64")}`
                ) ;

                block.data.file ={
                    url : secure_url ,
                    imageId : public_id
                }

                 imageInd++;
           }
          }


        
        const {secure_url , public_id } = await uploadImage( `data:${image[0].mimetype};base64,${image[0].buffer.toString("base64")}` ) ;
      //  fs.unlinkSync(image.path) ; // it deletes the image from the uploads folder after we have get the url and public id 

        let blogId = title.toLowerCase().split(" ").join("-") ; // combines all words of the  title with - 
              blogId = blogId + "-" + randomUUID()  ; // combines the random  unique id to 

        const blog = await Blog.create({ title , desc , draft , creator , image : secure_url , imageId : public_id ,blogId  , content , tags}) ; 
        await User.findByIdAndUpdate( creator , {$push : {blogs : blog._id}}); // appends the id of created blog in array{blogs} of user{creator}

        if(draft){
            return res.status(200).json({
                success : true ,
                message : "blog is saved as draft you can make it public by your profile"
            })
        }

        return res.status(200).json({
            message : "Blog is created successfully",
            blog ,
        })



    }catch(err){
        return res.status(500).json({
            message : err.message ,

        })
    }
}


async function getBlogs( req , res ){
    try{
        // const blogs = await Blog.find({ draft : false }).populate("creator") ; //to send all the things in id 
         const page = parseInt(req.query.page) ;
         const limit = parseInt(req.query.limit) ;
         const skip = (page - 1)*limit ;

         const blogs = await Blog.find({ draft : false }).populate({   // - is used to not send that specified thing 
               path : "creator",
               select : "-password"
         }).populate({
            path : "likes" ,
            select : "name email"
         }).sort({createdAt : -1})
           .skip(skip)
           .limit(limit);

           const totalBlogs = await Blog.countDocuments({draft : false}) ;
           const hasMore = skip + limit < totalBlogs  ;



        return res.status(200).json({
            message : "blogs are fetched successfully" ,
            blogs ,
            hasMore ,

        })
    }catch(err){
        return res.status(500).json({
            message : "blogs can not be fetched" ,
            err ,
        })
    }
}


async function getBlogById( req , res ){
    try{
        const id = req.params.blogId ;
        const blog = await Blog.findOne({blogId : id}).populate({
            path : "comments", //to populate the comments 
            populate : 
               { path : "user",  // to populate the user 
                select : "name email"
               } , 
            
            
        }).populate({
            path : "creator" ,
            select : "name email followers followings username"
        }).lean() ;   // now it returns only plan object not a javascript object ans doesn't sent the save and populate methods 



        async function populateReplies(comments){    // it populates the all replies or subcomments 
              for(const comment of comments){
                let populatedComment = await Comment.findById(comment._id).populate({
                                             path : "replies" ,
                                             populate : {
                                                path : "user" ,
                                                select : "name email"
                                             }
                                      }).lean() ;

                    comment.replies = populatedComment.replies  ;
                    if(comment?.replies?.length > 0){
                        await populateReplies(comment.replies) ;
                    }
              }

              return comments ;

            }



        blog.comments = await populateReplies(blog.comments) ;


        if(!blog){
            return res.status(404).json({
                message : "blog is not found" 
            })
        }


        return res.status(200).json({
            message : "blog is fetched successfull",
            blog ,
        })
    }catch(err){

        return res.status(500).json({
            message : "can not be fetched",
            err , 
        })
    }}


async function deleteBlog( req , res ){ 
   try{
    const creator = req.user ;
    const id = req.params.id ;

    const blog = await Blog.findById(id) ;

    if(!blog){
        return res.status(200).json({
        success : false ,
        message: "blog is not found "
        })
    }

    if(creator != blog.creator){
        return res.status(400).json({
            success : false ,
            message : "you are not authorized for this action"
        })
    }
    await deleteImageFromCloudinary(blog.imageId) ; // function to delete image from the cloudinary 
    await Blog.findByIdAndDelete(id) ;

    await User.findByIdAndUpdate(creator , {$pull : {blogs : id }}) ; // it removes id from the users blogs array 
    
    return res.status(200).json({
    success : true ,
     message : "blog is deleted " ,
     blog : blog 
   })

   }catch(err){
    return res.status(500).json({
        message : "could not delete the blog" ,
        err : err
    })
   }
} 

 
async function updateBlog( req , res ){
 try{
    const creator = req.user ;
   
    const { title , desc  } = req.body ;
    const draft = req.body.draft == "true" ? true : false ;
    const content = JSON.parse(req.body.content) ;
    const tags = JSON.parse(req.body.tags) ;
    const existingImages = JSON.parse(req.body.existingImages) ;
    const image = req.files ; 
    const blogId = req.params.id ;

   
    // const user = await User.findById(creator).select("-password") ;
    
    const blog = await Blog.findOne({blogId : blogId} ) ;

    if(!blog){
        return res.status(400).json({
            success : false ,
            message : "blog is not found"
        })
    }
   
   

    if(creator != blog.creator ){
        return res.status(400).json({
        success : false ,
        message : "You are not authorized for this action " 
        })
    }

     let imageToDelete = blog.content.blocks.
                       filter((block) => block.type == "image").
                       filter((block) => !existingImages.find(({url}) => url==block.data.file.url)).
                       map((block) => block.data.file.imageId) ;

                    

    if(imageToDelete.length > 0){
        await Promise.all(
            imageToDelete.map((id) => deleteImageFromCloudinary(id)) 
        )
    }
    
    
   if(req.files.images){
     let imageInd = 0;
     for(let i=0 ; i < content.blocks.length ; i++){
        const block = content.blocks[i] ;
        if(block.type == "image" && block.data.file.image){
            const { secure_url , public_id } = await uploadImage(
                `data:${req.files.images[imageInd].mimetype};base64,${req.files.images[imageInd].buffer.toString("base64")}`
            ) ;

            block.data.file ={
                url : secure_url ,
                imageId : public_id
            };

            imageInd++;
        }
     }
   }




    // const updatedBlog = await Blog.findByIdAndUpdate( blogId  , {title , desc , draft} , {new : true }) ;
   if(req.files.image){ // to update the image 
    await deleteImageFromCloudinary(blog.imageId) ; // deleting the previous image from cloudinary 
    const {secure_url , public_id} = await uploadImage(`data:${req.files.image[0].mimetype};base64,${req.files.image[0].buffer.toString("base64")}`) ; // uploading new image to cloudinary
    blog.image = secure_url ; // updating the image 
    blog.imageId = public_id ; // updating the imageId
    // fs.unlinkSync(image.path) ; // deleting it from servers memory or from uploads folder
   }


    blog.title = title || blog.title ;
    blog.desc = desc || blog.desc ;
    blog.draft = draft ;
    blog.content = content || blog.content ;
    blog.tags = tags || blog.tags ;

    await blog.save()  ;

    if(draft){
        return res.status(200).json({
            success : true ,
            message : "blog is updated as draft you make it public by profile page",
        }
        )
    }
    return res.status(200).json({
        success : true ,
        message : "blog is updated successfully" ,
        blog  : blog ,
    })

   }catch(err){
    
        res.status(500).json({
            message : "could not update the block",
            err ,
        })

   }
}


async function likeBlog( req , res ){

try{
 
    const userId = req.user ;
      
    const blogId = req.params.id ;
    
    const blog = await Blog.findById(blogId)  ;
    
    if(!blog){
        return res.status(400).json({
            success : false ,
            message : "blog is not found " 
        })
    }

   if(!blog.likes.includes(userId)){
        await Blog.findByIdAndUpdate(blogId , {$push : { likes : userId}}) ;
        await User.findByIdAndUpdate(userId , {$push : { likeBlogs : blogId}}) ;

       return res.status(200).json({
        success : true ,
        message : "blog is liked successfully" ,
        isLiked : true ,
       })


   }
   else{

       await Blog.findByIdAndUpdate( blogId, {$pull : {likes : userId }}) ;
       await User.findByIdAndUpdate( userId ,{$pull : {likeBlogs : blogId }}) ;

        return res.status(200).json({
        success : true ,
        message : "blog is disliked successfully",
        isLiked : false 
      })

   }



   }catch(err){
        console.log(err) ;
    return res.status(500).json({
        success : false ,
        message : "blog can not  be liked"
    })
}
}


async function saveBlog( req , res ){

try{
 
    const userId = req.user ;
      
    const blogId = req.params.id ;

     const blog = await Blog.findById(blogId)  ;
    
    if(!blog){
        return res.status(400).json({
            success : false ,
            message : "blog is not found " 
        })
    }
    
   
    if(!blog.totalSaves.includes(userId)){
        await Blog.findByIdAndUpdate(blogId , {$push : { totalSaves : userId}}) ;
        await User.findByIdAndUpdate(userId , {$push : { saveBlogs : blogId}}) ;

       return res.status(200).json({
        success : true ,
        message : "blog is saved successfully" ,
        isLiked : true ,
       })


   }
   else{

       await Blog.findByIdAndUpdate( blogId, {$pull : {totalSaves : userId }}) ;
       await User.findByIdAndUpdate( userId ,{$pull : {saveBlogs : blogId }}) ;

        return res.status(200).json({
        success : true ,
        message : "blog is unsaved successfully",
        isLiked : false 
      })

   }



   }catch(err){
        console.log(err) ;
    return res.status(500).json({
        success : false ,
        message : "blog can not  be saved"
    })
}
}


async function searchBlog( req , res ){

    try{
        const limit = parseInt(req.query.limit) ;
        const page = parseInt(req.query.page) ;
        const skip = ( page - 1 )*limit ;
         const { search , tag } = req.query;

        let query ;
        if( search ){
          query = {
            $or :[
                { title : { $regex : search , $options : "i"}} ,
                { desc  : { $regex : search , $options : "i"}}
            ] } ;

        }else{
            query = {tags : tag}
        }
         

       
        const blogs = await Blog.find( query , { draft : false }).skip(skip).limit(limit) ;

        const totalBlogs = await Blog.countDocuments( query , { draft : false }) ;
        const hasMore = skip + limit < totalBlogs ;

        if(blogs?.length == 0 ){
            return res.status(400).json({
                success : false , 
                message : "make sure you have typed all the words correctly" ,
                blogs : [] ,
                hasMore ,
            })
        }
        
        return res.status(200).json({
            success : true ,
            message : "blogs are fetched successsfully of your choice" ,
            blogs ,
            hasMore ,
        })

    }catch(err){
    
        return res.status(500).json({
            success : false ,
            message : "there is some problem while searching"
        })

    }
}


module.exports = {
    createBlog ,
    getBlogs ,
    getBlogById ,
    deleteBlog ,
    updateBlog ,
    likeBlog  ,
    saveBlog  ,
    searchBlog 
}
