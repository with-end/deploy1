const express = require("express") ;
const { getBlogs , getBlogById , createBlog , deleteBlog , updateBlog , likeBlog  , saveBlog , searchBlog } = require("../controller/blogController.js")
const route = express.Router() ; 
const verifyUser = require("../middleware/auth.js") ; 
const { deleteComment, addComment, editComment, likeComment , addNestedComment } = require("../controller/commentController.js");
const upload = require("../utils/multer.js");


route.get( "/Blogs" , getBlogs ) ;


route.get( "/Blogs/:blogId" , getBlogById) ;


route.post( "/Blogs", verifyUser , upload.fields([{name : "image" } , {name : "images"}])  , createBlog );


route.delete( "/Blogs/:id" ,verifyUser , deleteBlog ); 


route.post("/Blogs/like/:id" , verifyUser , likeBlog) ;


route.patch( "/Blogs/:id" ,verifyUser , upload.fields([{name : "image"} , {name : "images"}]) , updateBlog );   // upload.fields used for multiple images from multiply key_name


route.post( "/Blogs/comment/:id" ,verifyUser , addComment ); 


route.delete( "/Blogs/comment/:id" , verifyUser , deleteComment ) ;


route.patch( "/Blogs/edit-comment/:id" ,verifyUser , editComment); 


route.post("/Blogs/like-comment/:id" , verifyUser , likeComment ) ;

route.post("/Blogs/comment/:parentCommentId/:id" , verifyUser , addNestedComment) ;

route.patch("/save-blog/:id" ,verifyUser , saveBlog ) ;

route.get("/search-blogs" , searchBlog) ;


module.exports = route ;
