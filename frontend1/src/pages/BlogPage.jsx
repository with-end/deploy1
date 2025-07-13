import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useParams } from 'react-router-dom';
import { addSelectedBlog, changeLikes, removeSelectedBlog, setSavedBlog } from '../utils/selectedBlogSlice';
import Comment1 from '../components/Comment1';
import { setIsOpen } from '../utils/CommentSlice';
import { formateDate } from '../utils/formateDate';


   export async function handleSaveBlog(blogId , token){
       try{
        
        let res = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/save-blog/${blogId}` , {} , {
           headers : {
            Authorization : `Bearer ${token}`
           }
        }) ;

          toast.success(res.data.message) ;

       }catch(err){
          console.log(err) ;
          toast.error(err.response.data.message) ; 
       }
    }

   export async function handleFollowCreator( blogCreatorId , token ){
         try{
        let res = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/follow/${blogCreatorId}` , {} , {
           headers : {
            Authorization : `Bearer ${token}`
           }
        }) ;

          toast.success(res.data.message) ;

       }catch(err){
          console.log(err) ;
          toast.error(err.response.data.message) ; 
       }
   }


function BlogPage() {
    const {id} = useParams() ; 
    const [blogData , setBlogData] = useState(null) ;
    const dispatch = useDispatch()
    // const user = JSON.parse(localStorage.getItem("user")) ;
    const {token , email , id : userId , profilePic} = useSelector((state) => state.user) ; // here id is renamed to userId 
    const [isLike , setLike] = useState(false) ;
    const [isSaved , setIsSaved] = useState(false) ;
    const {likes , comments , content , totalSaves } = useSelector((state) => state.selectedBlog);
    const { isOpen } = useSelector((state) => state.comment) ;
    const location = useLocation() ;

    

    async function fetchBlogById(){
        try{
          let { data : {blog}} = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/blogs/${id}`) ;
          setBlogData(blog) ;
          if(blog.totalSaves.includes(userId)){ setIsSaved((prev) => !prev)} // if user has saved the blog it becomes true
          if(blog.likes.includes(userId)){ setLike((prev) => !prev)} // if user has liked blog then isLike becomes true ;
          dispatch(addSelectedBlog(blog)) ;
  

        }catch(err){
            toast.error(err) ;
            
        }
     
    }

    async function handleLike(){
      if(token){
             setLike((prev) => !prev) ;
             let res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/blogs/like/${blogData._id}` , {} , {
                 headers : {
                  Authorization : `Bearer ${token}`
                 }
             });
             dispatch(changeLikes(userId)) ;
             toast.success(res.data.message) ;
      }else{
        toast.error("please sign in first then try to like") ;
      }
    }

   
     useEffect(() =>{
     fetchBlogById() ;

     return ()=> {
      
      if(window.location.pathname != `/edit/${id}` ){ // to delete the current blog from localStorage  (video likes) 
          
           dispatch(removeSelectedBlog()) ;
          
             dispatch(setIsOpen(false)) ;
      }
     
     }

    } , []) ;

    
  return <div> {blogData ? <div className="w-full px-3  sm:max-w-[700px] sm:mx-auto"> 
     <h1 className="mt-7 font-bold  sm:text-5xl capitalize max-sm:text-3xl"> {blogData.title} </h1>
     <div className="flex items-center max-sm:my-7 sm:my-12 gap-4 h ">
      <Link to={`/@${blogData.creator.username}`}>
       <div className="h-10 w-10 " >
            <img src={ profilePic ? profilePic  : `https://api.dicebear.com/9.x/initials/svg?seed=${blogData.creator.name}`} 
                 className="rounded-full w-full h-full object-cover hover:cursor-pointer " 
                 alt="" />
       </div>
      </Link>
       <div className=" flex  flex-col ">
         <div className=" flex items-center gap-2">
          <Link to={`/@${blogData.creator.username}`}>
            <h2 className=" text-xl hover:cursor-pointer hover:underline "> {blogData.creator.name}  </h2> 
          </Link>
            <p  className="max-sm:hidden text-lg text-green-700" onClick={ () => handleFollowCreator(blogData.creator._id , token )}>
               { blogData.creator.followers.includes(userId) ? "following"  : "follow" } 
            </p>
         </div>
         <div className="flex gap-3 "> 
           <span> min read 6</span>
           <span> { formateDate(blogData.createdAt)} </span>
         </div>
           
       </div>
     </div>

   
     <img src={blogData.image} className="max-sm:w-screen max-sm: object-cover sm:aspect-video " alt="" />

    { token && blogData.creator.email == email  && 
     <button className="bg-green-700 text-2xl text-white my-5 px-4">
      <Link to={"/edit/" + blogData.blogId}> Edit  </Link>
    </button>   }
    <br />
    <div className="flex gap-6 ">
         <div className="cursor-pointer flex gap-1" >
          { isLike ? ( <i onClick ={handleLike} className="fi fi-sr-thumbs-up text-3xl max-sm:text-xl  text-blue-700 pt-1"></i>
          )    : (     <i onClick ={handleLike} className="fi fi-br-social-network text-3xl max-sm:text-xl text-blue-700 pt-1"></i>
          )}
           <p className="text-3xl max-sm:text-xl "> {likes?.length} </p>
         </div>
         <div className="flex gap-1">
            <i onClick={() => dispatch(setIsOpen())} className="fi fi-br-comment-smile text-3xl max-sm:text-xl"></i>
            <p className="text-3xl max-sm:text-xl"> {comments?.length} </p>
         </div>
         <div className="flex gap-1">
      {  isSaved  ?
           <i className="fi fi-sr-bookmark text-3xl max-sm:text-xl mt-1 " onClick={(e) =>{ setIsSaved((prev) =>!prev) ; handleSaveBlog(blogData._id , token ) ; dispatch(setSavedBlog(userId)) ; }} ></i>    :
           <i className="fi fi-br-bookmark text-3xl max-sm:text-xl mt-1 " onClick={(e) =>{ setIsSaved((prev) =>!prev) ; handleSaveBlog(blogData._id , token ) ; dispatch(setSavedBlog(userId)) ;}} ></i>    }
           <p className="text-3xl max-sm:text-xl "> {totalSaves.length} </p>
         </div>
    </div>

    <div>
     {  content?.blocks?.map((block) =>{
          if(block.type == "paragraph"){ 
            return ( 
              <p dangerouslySetInnerHTML ={{__html : block.data.text}} className="my-4"></p>
            )
          }else if(block.type == "header"){
              if(block.data.level == 2){
                return ( <h2 dangerouslySetInnerHTML ={{__html : block.data.text}} className="text-xl font-bold my-4"></h2>   )
              }
              else if(block.data.level == 3){
                return ( <h3 dangerouslySetInnerHTML ={{__html : block.data.text}} className="text-2xl font-bold my-4"></h3> )
              }
              else if(block.data.level == 4 ){
                return ( <h4 dangerouslySetInnerHTML ={{__html : block.data.text}} className="text-3xl font-bold my-4"></h4> )
              }
          }else if(block.type == "image"){
                return (
                  <div className="my-4">
                    <img src={block.data.file.url} alt="" />
                  </div>
                )
          }
}) }
    </div>

   { isOpen && <Comment1/> }
  
     </div> : <div> loading... </div> }  </div>

  }

export default BlogPage
