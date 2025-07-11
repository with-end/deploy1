import axios from "axios";
import { useEffect, useState } from "react";


function usePagination( path ,queryParams={} , page=1  , limit=1 ){
         const [blogs , setBlogs ] = useState([]) ;
         const [hasMore , setHasMore] = useState(true) ;
      
     async function fetchBlogs(){

          let res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/${path}` , { params : {...queryParams , page , limit}}) ;
        
          setBlogs((prev) => [...prev , ...res.data.blogs]) ;
          setHasMore(res.data.hasMore) ;
      }
    
     useEffect(() =>{
        if( queryParams && queryParams.search ){
            setBlogs([]) ;
            fetchBlogs() ;
        }
     } , [ queryParams?.search ]) ;
    
    
      useEffect(() => {
        fetchBlogs() ;
    
      }, [page , path ]) ;
    



     
   return { hasMore , blogs };


}

export default usePagination ;