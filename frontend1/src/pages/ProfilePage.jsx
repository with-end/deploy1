import axios from 'axios';
import React, { useEffect } from 'react'
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { formateDate } from '../utils/formateDate';
import { useSelector } from 'react-redux';
import { handleFollowCreator, handleSaveBlog } from './BlogPage';
import DisplayBlogs from './DisplayBlogs';


function ProfilePage() {
     
     const { username } = useParams() ;
     const { id : userId , token } = useSelector((state) => state.user) ;
     const [ userData , setUserData ] = useState() ;
     const location = useLocation() ;
     const navigate = useNavigate() ;
     

     useEffect(() =>{

      async function fetchUserDetails(){

         try{
           let res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/${username.split("@")[1]}`) ;

           toast.success(res?.data?.message) ;
          
           setUserData(res.data.user)

         }catch(err){
          toast.error(err?.response?.data?.message) ;
          console.log(err) ;
      }

       }

       fetchUserDetails() ;

     } , [username]) ;
    
     function renderComponent(){
         if( location.pathname == `/${username}`){
           return <DisplayBlogs blogs={userData.blogs.filter((blog) => !blog.draft)}/>
         }else if( location.pathname == `/${username}/liked-blogs`){
           return <>{ userData.showLikesBlog || userData._id == userId ? <DisplayBlogs blogs={userData.likeBlogs} /> : navigate(`/${username}`)}</>
         }else if( location.pathname == `/${username}/saved-blogs`){
           return <>{ userData.showSavedBlog || userData._id == userId ? <DisplayBlogs blogs={userData.saveBlogs} /> : navigate(`/${username}`)}</>
         }else{
           return <>{ userData._id == userId ? <DisplayBlogs blogs={userData.blogs.filter((blog) => blog.draft)}/> : navigate(`/${username}`) }</>
         }
     }


     

     
  return (
    <div className="flex justify-center">
     { userData ?  
      <div className="max-sm:w-full max-sm:px-2 sm:w-[80%] flex max-sm:flex-col-reverse  sm:justify-evenly ">
       <div className="max-sm:w-full sm:w-[50%] ">
        <div className="flex justify-between items-center sm:my-10 ">
          <p className="text-4xl font-bold max-sm:text-xl "> { userData.name } </p>
          <i className="fi fi-bs-menu-dots "></i> 
                          

        </div>
        <nav className="my-10">
           <ul className="flex gap-3">
            <li><Link to={`/${username}`} className={`${location.pathname == `/${username}` ?  "border-b-2 border-black " : ""  } `}>Home</Link></li>
            { (userData.showLikesBlog || userId == userData._id) &&  <li><Link to={`/${username}/liked-blogs`} className={`${location.pathname == `/${username}/liked-blogs` ?  "border-b-2 border-black " : ""  } `}>liked Blogs</Link></li>}
            { (userData.showSavedBlog || userId == userData._id) && <li><Link to={`/${username}/saved-blogs`} className={`${location.pathname == `/${username}/saved-blogs` ?  "border-b-2 border-black " : ""  } `}>saved Blogs</Link></li>}
            { userId == userData._id && <li><Link to={`/${username}/draft-blogs`} className={`${location.pathname == `/${username}/draft-blogs` ?  "border-b-2 border-black " : ""  } `}>draft Blogs</Link></li> }
           </ul>
        </nav>
        {/* <div>
          {
           userData.blogs.map((blog) =>(
      <Link to={"/blog/" + blog.blogId} >
        <div key={blog._id} className="w-full my-5 flex justify-between ">
          <div className="w-[60%] flex flex-col gap-3 ">
            <div>
                <img src="" alt="" />
                <p>{blog.creator.name}</p>
            </div>
            <h2 className="font-bold text-xl" > {blog.title} </h2>
            <h4 className="line-clamp-2"> {blog.desc} </h4>
            <div className="flex gap-3">
                <p>{formateDate(blog.createdAt)}</p>
                <div className="flex gap-6 ">
                 <div className="cursor-pointer flex gap-1" >
                    <i className="fi fi-br-social-network text-lg"></i>
                    <p className="text-lg "> {blog.likes.length} </p>
                 </div>
                 <div className="flex gap-1">
                   <i className="fi fi-br-comment-smile text-lg"></i>
                   <p className="text-lg"> {blog.comments.length} </p>
                 </div>
                 <div className="flex gap-1">
               {  blog.totalSaves.includes(userId)    ?
                   <i className="fi fi-sr-bookmark text-lg" onClick={(e) => { e.preventDefault() ; handleSaveBlog(blog._id , token ) }}></i>   :
                   <i className="fi fi-br-bookmark text-lg" onClick={(e) => { e.preventDefault() ; handleSaveBlog(blog._id , token ) }}></i>     }
                   <p className="text-lg ">2</p>
                 </div>
                </div>
            </div>
          </div>
          <div className="w-[25%] ">
            <img src={blog.image} className="aspect-video" alt="" />
          </div>
       </div>
      </Link>
        )) }
          
        </div> */}
        <div>{ renderComponent() } </div>
       </div>
       <div className="max-sm:w-full sm:w-[25%] sm:min-h-[calc(100vh_-_60px)] border-blue-700 sm:border-l sm:pl-10">
        <div className="my-10 ">
              <div className="h-20 w-20">
                 <img src={`https://api.dicebear.com/9.x/initials/svg?seed=${userData.name}`} className="rounded-full" alt="" />
              </div>
              <p className="text-base font-medium  mt-3"> {userData.name} </p>
              <p className="text-base text-slate-600"> {userData.followers.length} followers </p>
              <p className="text-sm text-slate-500 my-3 w-[200px] max-sm:hidden "> {userData.bio} </p>
              { userId == userData._id  ?
                <button className="px-4 py-2 bg-green-500 rounded-full text-white my-3"
                      > <Link to={"/edit-profile"}>  Edit Profile  </Link>
                </button>               :
                <button className="px-4 py-2 bg-green-500 rounded-full text-white my-3"
                      onClick={()=>{ handleFollowCreator( userData._id , token )}} > follow 
                </button>

              }
              <div>
                <h1 className="my-5 font-bold "> following </h1>
                <div>
                {  
                  userData.followings.map((user) => (
                   <div className="flex justify-between items-center my-4 ">
                    <Link to={`/@${user.username}`}>
                     <div className="flex items-center gap-2 hover:underline hover:cursor-pointer">
                     <div className="h-7 w-7">
                       <img src={`https://api.dicebear.com/9.x/initials/svg?seed=${user.name}`} className="rounded-full" alt="" />
                     </div>
                     <p> {user.name} </p>
                     </div>
                   </Link>
                    <div>
                     <i className="fi fi-bs-menu-dots "></i> 
                    </div>
                  </div>
                  ))
                }
                
                </div>
              </div>
        </div>
       </div>
      </div> : <span> loading... </span>
       
   
     }
     </div>
  )
}

export default ProfilePage
