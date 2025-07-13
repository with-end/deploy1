import React from 'react'
import { useParams, useSearchParams } from 'react-router-dom';
import DisplayBlogs from './DisplayBlogs';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import usePagination from '../components/pagination';

function SearchBlogs() {
    const [searchParams , setSearchParams] = useSearchParams() ;
    const {tag} = useParams();
    
    const [blogs , setBlogs ] = useState([]) ;
    const search = searchParams.get("search") ;
    const [hasMore , setHasMore] =useState(false) ;
    const [page , setPage] = useState(1) ;
    const [flag , setFlag] = useState(true) ;

 //   const { hasMore , blogs } = usePagination("search-blogs" , {search} , page , 1) ;
     useEffect(() =>{
         setBlogs([]) ;
     } , [search]) ;

     useEffect(() =>{

     async function handleSearch(){

      try{
        let res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/search-blogs` , {params : {page , limit : 1 , search , tag : tag?.toLowerCase().replace(" " ,"-")}}) ;
   
         setBlogs((prev) => [...prev , ...res.data.blogs]) ;
         setFlag(false) ;
         setHasMore(res.data.hasMore) ;
      }catch(err){
         setBlogs(err.response?.data?.blogs) ;
         setFlag(true) ;
         setHasMore(res.response.data.hasMore) ;
        console.log(err) ;
      }

    }

    if(tag || search){
       handleSearch() ;
    }

  } , [tag , search , page ]) ;


  return (
   
     <div className="w-full max-w-[500px] px-2 mx-auto ">
        <h1 className="text-3xl font-bold text-gray-600 my-10"> { flag ? <span>No Result fount for your search</span> : <span>results for your search : {search || tag}</span>  } </h1>
        <DisplayBlogs blogs={blogs} /> 
        { hasMore && <button onClick={()=> setPage((prev) => prev+1 )} className="bg-blue-500 text-white  px-4 py-2 rounded-full "> Load More </button>}
    </div>
  )
}

export default SearchBlogs
