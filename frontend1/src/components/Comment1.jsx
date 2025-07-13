import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setIsOpen } from '../utils/CommentSlice';
import axios from 'axios';
import toast from 'react-hot-toast';
import { deleteCommentAndReply, setCommentLikes, setComments, setReplies, updateComment } from '../utils/selectedBlogSlice';
import {formateDate} from '../utils/formateDate.js' ;


function Comment1() {
    const dispatch= useDispatch() ;
    const [comment , setComment] = useState("");
    const { _id : blogId , comments , creator} = useSelector((state) => state.selectedBlog) ;
    const { token , id : userId} = useSelector((state) => state.user) ;
    const [ activeReply , setActiveReply ] = useState(null) ;
    const [popOpen , setPopOpen] = useState(null) ;
    const [currEditComment , setCurrEditComment] = useState(null) ;
  
  async function handleComment(){
     try{
      let res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/blogs/comment/${blogId}`, { comment } ,
                { headers : {
                   "content-Type" : "application/json" ,
                   Authorization : `Bearer ${token}`
                }}
          ) ;

            toast.success(res.data.message) ;
            dispatch(setComments(res.data.newComment)) ;
            setComment("") ;
         

     }catch(err){
           toast.error(err.response.data.message) ;
  } }





  return (
    <div className="bg-white h-screen fixed right-0 top-0 max-sm:w-full max-sm:px-2 sm:w-[400px] border drop-shadow-2xl p-4 overflow-y-scroll">
        <div className="flex justify-between items-center ">
          <h1 className="fond-bold text-xl">Comment ({comments.length})</h1>
          <i onClick={() => dispatch(setIsOpen(false))} className="fi fi-br-cross text-xl "></i>
        </div>
        <div>
          <textarea type="text"  value={comment}  placeholder="comment..." className=" resize-none h-[100px] drop-shadow-lg focus:outline-none w-full px-3 py-3 text-lg my-3 "
                 onChange={(e) => setComment(e.target.value)}
          />
          <button onClick={handleComment} className="bg-green-500 my-1 py-3 px-5 text-white "> add </button>
        </div>
        <div>
          <DisplayComment   comments={comments} 
                            userId={userId} 
                            blogId={blogId} 
                            token={token} 
                            activeReply={activeReply}
                            setActiveReply={setActiveReply}
                            popOpen={popOpen}
                            setPopOpen={setPopOpen}
                            currEditComment={currEditComment}
                            setCurrEditComment={setCurrEditComment}
                            creatorId={creator._id}
                          
                            /> 
        </div>
    </div>
  )
}


 function DisplayComment({comments , userId , blogId , token ,activeReply , setActiveReply , popOpen , setPopOpen , setCurrEditComment , currEditComment , creatorId}){
         const [ reply , setReply ] = useState("") ;
         const dispatch = useDispatch() ;
         const [updatedCommentContent , setUpdatedCommentContent ] = useState("") ;
        
      

  
  async function  handleCommentLike(commentId){
      
      try{
           let res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/blogs/like-comment/${commentId}` , {} , {
              headers :{
                Authorization : `Bearer ${token}`
              }
           }) ;
         
           toast.success(res.data.message) ;
           dispatch(setCommentLikes({commentId , userId})) ;

      }catch(err){
           toast.error(err.response.data.message) ;
      }
  }
         
        function handleActiveReply(id){
       setActiveReply((prev) => prev == id ? null : id) ;
   }

  async function handleReply(parentCommentId){
     try{
      let res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/blogs/comment/${parentCommentId}/${blogId}`, { reply } ,
                { headers : {
                   "content-Type" : "application/json" ,
                   Authorization : `Bearer ${token}`
                }}
          ) ;

            toast.success(res.data.message) ;
      
            dispatch(setReplies(res.data.newReply)) ;
            setReply("") ;
          
     }catch(err){
           toast.error(err.response.data.message) ;
  } }


  
  async function handleCommentUpdate(commentId){
     try{
         let res = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/blogs/edit-comment/${commentId}`, { updatedCommentContent } ,
                { headers : {
                   "content-Type" : "application/json" ,
                    Authorization : `Bearer ${token}`
                }}
          ) ;

            toast.success(res.data.message) ;
   
            dispatch(updateComment(res.data.comment)) ;
            setUpdatedCommentContent("") ;
            setCurrEditComment(null) ;
    
          
     }catch(err){
           toast.error(err.response.data.message) ;
  } }



  async function handleCommentDelete(commentId){
     try{
         let res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/blogs/comment/${commentId}`,
                { headers : {
                   "content-Type" : "application/json" ,
                    Authorization : `Bearer ${token}`
                }}
          ) ;

            toast.success(res.data.message) ;
         
            dispatch(deleteCommentAndReply(commentId)) ;
             
     }catch(err){
           toast.error(err.response.data.message) ;
  } }

  

  return <>
  { comments.map((commen) =>( 
        <> <hr />
          <div className="flex flex-col gap-2 my-4">
             {   currEditComment == commen._id   ? 
                <div>
                     <textarea type="text"  
                               defaultValue={commen.comment}  
                               placeholder="Reply..." 
                               className=" resize-none h-[100px] drop-shadow-lg focus:outline-none w-full px-3 py-3 text-lg my-3 "
                               onChange={(e) => setUpdatedCommentContent(e.target.value)}
                    />
                    <div className="flex gap-3 ">
                      <button className="px-4 py-2 bg-red-600 rounded-sm"   onClick={() => handleCommentUpdate(commen._id)}> Edit </button>
                      <button className="px-4 py-2 bg-green-600 rounded-sm" onClick={() => setCurrEditComment(null)}> cancel </button>
                    </div>
                </div> :
                <div>
                  <div className="flex justify-between w-full ">
                      <div className="flex gap-2">
                        <div className="h-10 w-10">
                           <img src={`https://api.dicebear.com/9.x/initials/svg?seed=${commen.user.name}`} className="rounded-full" alt="" />
                        </div>
                        <div>
                          <p className="capitalize font-medium"> {commen.user.name} </p>
                          <p> {formateDate(commen.createdAt)} </p>
                        </div>
                      </div>
                      <div>
                         { commen.user._id == userId || userId == creatorId ? 
                         
                            ( popOpen == commen._id ? 
                                  <div className="bg-slate-400 w-[100px] cursor-pointer  "> 
                                     <i onClick={() => setPopOpen((prev) => prev == commen._id ? null : commen._id )} className="fi fi-br-cross text-lg relative left-20"></i>
                                     <ul className=" list-disc list-inside ">
                                    { 
                                       commen.user._id == userId ?
                                    
                                       <li className="text-lg px-3 py-1 hover:bg-blue-600"
                                           onClick={() =>{
                                            // handle update
                                            setCurrEditComment(commen._id)
                                            setPopOpen(null) ;
                                           }}>edit</li>        : "" }
                                       <li className="text-lg px-3 py-1 hover:bg-blue-600"
                                            onClick={() =>{
                                              handleCommentDelete(commen._id)
                                              setPopOpen(null) ;
                                            }}>delete</li>
                                     </ul>
                                  </div>  : 
                                 <i className="fi fi-bs-menu-dots "
                                 onClick={() => setPopOpen(commen._id)}></i> 
                            )  : ""    
                         }
                      </div>
                    
                  </div>
                  <div>
                     <p className="text-lg font-medium">{commen.comment}</p>
                  </div>
                  <div className="flex justify-between ">
                     <div className="flex gap-4 ">
                       <div className="cursor-pointer flex gap-1" >
                          { commen.likes.includes(userId) ? ( <i onClick={() => handleCommentLike(commen._id)} className="fi fi-sr-thumbs-up text-lg  text-blue-700 pt-[2px]"></i>
                          )    : ( <i onClick={() => handleCommentLike(commen._id)} className="fi fi-br-social-network text-lg text-blue-700 pt-[2px]"></i>
                          )}
                          <p className="text-lg "> {commen.likes.length} </p>
                       </div>
                       <div className="flex gap-1">
                         <i className="fi fi-br-comment-smile text-lg pt-[1px]"></i>
                         <p className="text-lg "> {commen?.replies?.length} </p>
                       </div>
                    
                   </div>
                   <p onClick={() => handleActiveReply(commen._id)} className=" hover:underline "> reply </p>
                 </div>
              { activeReply === commen._id && 
                <div>
                   <textarea type="text"  value={reply}  placeholder="Reply..." className=" resize-none h-[100px] drop-shadow-lg focus:outline-none w-full px-3 py-3 text-lg my-3 "
                             onChange={(e) => setReply(e.target.value)}
                   />
                  <button onClick={() => handleReply(commen._id)} className="bg-green-500 my-1 py-3 px-5 text-white "> add </button>
                </div> 
             }
                </div>
             }
               { commen.replies?.length > 0 && 
                                <div className="pl-4 border-l">
                                   <DisplayComment  
                                   comments={commen.replies} 
                                   userId={userId}  
                                   blogId={blogId} 
                                   token={token}
                                   activeReply={activeReply}
                                   setActiveReply={setActiveReply}
                                   popOpen={popOpen}
                                   setPopOpen={setPopOpen}
                                   currEditComment={currEditComment}
                                   setCurrEditComment={setCurrEditComment}
                                   creatorId={creatorId}
                                  
                                   />  
                                </div>
               }
         </div> 
       </>
               ))
          }
    </>
  
 }

export default Comment1

