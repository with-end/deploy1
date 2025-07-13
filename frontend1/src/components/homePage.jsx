import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { removeSelectedBlog } from '../utils/selectedBlogSlice';
import { useDispatch, useSelector } from 'react-redux';
import { formateDate } from '../utils/formateDate';
import { handleSaveBlog } from '../pages/BlogPage';
import DisplayBlogs from '../pages/DisplayBlogs';
import usePagination from './pagination';


function homePage() {
  const {token , id : userId } = useSelector((state) => state.user) ;
 // const [blogs , setBlogs] = useState([]) ;
  const [page , setPage]= useState(1) ;
  const dispatch = useDispatch() ;
  const [tags , setTags] = useState([]) ;
  //const [hasMore , setHasMore] = useState(false) ;

  const { hasMore , blogs } = usePagination("blogs" , {} , page , 1) ;

  useEffect(() =>{
        setTags([]) ;
     blogs.map((blog) =>{
        setTags((prev) =>([...prev , ...blog.tags ])) ;
      } )
  }, [blogs]) ;



  // async function fetchBlogs(){
  //     let res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/blogs` , { params : { page , limit : 1}}) ;
  //     console.log(res.data.blogs) ;
  //     setBlogs((prev) => [...prev , ...res.data.blogs]) ;
  //     setHasMore(res.data.hasMore) ;
  // }
  

  // useEffect(() => {
  //   fetchBlogs() ;

  // }, [page]) ;


  return (
    <div className=" max-sm:w-full sm:w-[60%] mx-auto flex max-sm:flex-col-reverse justify-between max-sm:px-2">
         <div className="max-sm:w-full sm:w-[65%]">
            <DisplayBlogs blogs={blogs} />
            { hasMore && <button onClick={() => setPage((prev) => prev+1)} className="px-4 py-2 bg-blue-600 text-white rounded-full text-center"> Load more </button>}  
         </div>
         <div className="max-sm:border-b max-sm:pb-4 sm:w-[30%] sm:border-l sm:pl-5">
            <h1 className="my-4 text-xl font-semibold "> recommended topics</h1>
            <div className="flex flex-wrap gap-1">
               {
              tags?.length > 0 && tags.map((tag , index) => (
                  <Link to={`tag/${tag}`}> 
                     <div key={index} className="px-4 py-2 bg-slate-300 text-center rounded-full hover:bg-black hover:text-white ">
                       <p>{tag}</p>
                    </div>
                  </Link>
                  
              ))
              }
            </div>
           
         </div>
        
    </div>
  )
}

export default homePage
