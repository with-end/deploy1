import React from 'react'
import { Link } from 'react-router-dom';
import { formateDate } from '../utils/formateDate';
import { handleSaveBlog } from './BlogPage';
import { useDispatch, useSelector } from 'react-redux';
import { setSavedBlog } from '../utils/selectedBlogSlice';
import { useState } from 'react';
import { useEffect } from 'react';

function DisplayBlogs({blogs}) {
    
     const {token , id : userId } = useSelector((state) => state.user) ;
     const dispatch = useDispatch() ;

   
  return (
    <div>
     { blogs.length > 0 ? blogs?.map((blog) =>(
      <Link to={"/blog/" + blog.blogId} key={blog._id} >
        <div key={blog._id} className="w-full my-5 flex justify-between ">
          <div className="w-[60%] flex flex-col gap-3 max-sm:border-t ">
            <div>
                <img src="" alt="" />
                <p>{blog.creator.name}</p>
            </div>
            <h2 className="font-bold text-xl" > {blog.title} </h2>
            <h4 className="line-clamp-2"> {blog.desc} </h4>
            <div className="flex gap-3">
                <p>{formateDate(blog.createdAt)}</p>
                <div className="flex max-sm:gap-3 sm:gap-6 ">
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
                   <i className="fi fi-sr-bookmark text-lg" onClick={(e) => { e.preventDefault() ; handleSaveBlog(blog._id , token ) ; }}></i>   :
                   <i className="fi fi-br-bookmark text-lg" onClick={(e) => { e.preventDefault() ; handleSaveBlog(blog._id , token ) ; }}></i>     }
                   <p className="text-lg ">{blog.totalSaves.length}</p>
                 </div>
                </div>
            </div>
          </div>
          <div className="max-sm:w-[35%] sm:w-[25%] ">
            <img src={blog.image} className="max-sm:w-full max-sm:h-full sm:aspect-video" alt="" />
          </div>
       </div>
      </Link>
        )) : <div className="text-xl font-semibold mx-auto"> No blog is found </div> }
       
    </div>
  )
}

export default DisplayBlogs
