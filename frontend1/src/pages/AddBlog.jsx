import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux'
import { removeSelectedBlog } from '../utils/selectedBlogSlice';
import EditorJS from '@editorjs/editorjs';
import { useRef } from 'react';
import Header from '@editorjs/header'
import List from '@editorjs/list'
import CodeTool from '@editorjs/code'
import NestedList from '@editorjs/nested-list'
import Marker from '@editorjs/marker'
import Underline from '@editorjs/underline'
import Embed from '@editorjs/embed'
import ImageTool from '@editorjs/image'


function AddBlog() {
    //    const token =JSON.parse(localStorage.getIte("token"));
       const {token} = useSelector((slice) => slice.user) ;
       let { title , desc ,  image , content , draft , tags } = useSelector((state) => state.selectedBlog ) ;

       const [blogData , setBlogData] = useState({title : "" , desc : "" , image : null , content : "" , tags :[] , draft : false  }) ;
       const navigate = useNavigate() ;
       const {id} = useParams() ;
       

//       let title = "";
//       let desc = "";
//       let image = null;
//       let content = {} ;

     




    
       if(!id){
       title = undefined ;
       desc = undefined ;
       image = undefined ;
       content = undefined ;
       tags =[] ;
       draft = false ;

       }
      
       const dispatch = useDispatch() ;
       let e = useRef(null) ;
       const formData = new FormData() ;


    

       async function handlePost(){

              formData.set("title" , blogData.title) ;
              formData.set("desc" , blogData.desc) ;
              formData.set("image" , blogData.image) ;
              formData.set("content" , JSON.stringify(blogData.content)) ;
              formData.set("tags" , JSON.stringify(blogData.tags)) ;
              formData.set("draft" , draft) ;
             
              formData.delete("images") ;
              blogData.content.blocks.forEach((block) => { // filling all the images from content to the field images  
                if(block.type == "image"){
                     formData.append("images" , block.data.file.image) ;
                }
              }); 

             


        try{


            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/blogs`, formData ,
                {
                    headers :{
                        "Content-Type" : "multipart/form-data" ,
                        Authorization : `Bearer ${token}`
                    }
                }
            )
        
            toast.success(res.data.message) ;
            navigate("/") ;
            
          

        }catch(err){
            console.log(err) ;
            toast.error(err.response.data.message);
        }
       }

       
       async function handleUpdate(){
        try{
            
            const formData = new FormData() ;
            
            formData.set("title" , blogData.title);
            formData.set("desc" , blogData.desc) ;
            formData.set("image" , blogData.image) ;
            formData.set("content" , JSON.stringify(blogData.content)) ;
            formData.set("tags" , JSON.stringify(blogData.tags)) ;
            formData.set("draft" , blogData.draft) ;
            

            let existingImages =[] ; // stores the previous images which still exists in the editor 

           blogData.content.blocks.forEach((block) =>{
                if(block.type == "image" ){
                    if(block.data.file.image){
                         
                           formData.append("images" , block.data.file.image) ;
                    }
                    else{
                
                        existingImages.push({
                            imageId : block.data.file.imageId ,
                            url : block.data.file.url 
                        })
                    }
                  
                }
            });

            formData.append("existingImages" , JSON.stringify(existingImages)) ;

             for(let data of formData.entries()){  // user for printing all the things of the formdata on the browsers console
    
             }


            const res = await axios.patch(
                `${import.meta.env.VITE_BACKEND_URL}/blogs/${id}`, formData ,
                {
                    headers :{
                        "Content-Type" : "multipart/form-data" ,
                        Authorization : `Bearer ${token}`
                    }
                }
            )
    
            toast.success(res.data.message) ;
            navigate("/") ;
            
          

        }catch(err){
            toast.error(err.response.data.message);
        }
       }


        async function fetchBlogById(){
        try{
        //   let res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/blogs/${id}`) ;
        //   setBlogData({
        //     title :  res.data.blog.title ,
        //     desc :   res.data.blog.desc ,
        //     image :  res.data.blog.image 
        //   }) ;
         
        //   toast.success(res.data.message) ;

           setBlogData({
            title :  title ,
            desc :   desc ,
            image :  image ,
            content : content ,
            draft : draft ,
            tags : tags 
          }) ;

        }catch(err){
            toast.error(err) ;
        }
     
    }
    
   
    
    function initializeEditor(){
        
       e.current = new EditorJS({
           holder : "editor" ,
           placeholder : "enter the data here yar " ,
           data : content , // thing which is to show initially on the edirtor 
           tools : {
             header : {
                class : Header,
                inlineToolbar : true,
                config : {
                    placeholder : "here enter the heading " ,
                    levels : [2,3,4] ,
                    default : 3
                }
            
             },
             list : {
                class : List ,
                inlineToolbar : true 
             },
             code : CodeTool ,
             marker : Marker ,
             underline : Underline ,
             embed : {
                class : Embed ,
                inlineToolbar : true ,
                services : {
                    youtube : true 
                }
             },
             image : {
                class : ImageTool , 
                config : {
                    withCaption : true ,
                    uploader : {
                        uploadByFile :async (image) =>{
                            return {
                                success : 1 ,
                                file : {
                                    url : URL.createObjectURL(image) ,
                                    image ,
                                }
                            } ;
                        }
                    }
                }

                }
             
           },
           onChange : async ()=>{
             let data = await e.current.save() ;
             setBlogData((prev) => ({...prev , content : data})) ;
           }
       }) ;

    }

   function  deleteTag( index ){
       const updatedTags= blogData.tags.filter((tag , tagIndex) => index !=tagIndex ) ;
       setBlogData((prev) => ({...prev , tags : updatedTags}))
    }

    function handleKeyDown(e){
         const tag = e.target.value.trim().toLowerCase() ;
        if(e.code == "Enter"){
            if( blogData.tags.length > 5){ toast.error("max 6 tags can be added") ;}
            else if( blogData.tags.includes(tag)){ toast.error("duplicate tags can not be added") ;} 
            else{  setBlogData((prev) => ({...prev , tags : [...prev.tags , tag ]})) ; }
            e.target.value ="" ;
        
        }
    }



       useEffect(() =>{
       if(id){  fetchBlogById() ; }

        return () =>{
              if( window.location.pathname != `/edit/${id}` && 
              window.location.pathname != `/blog/${id}`
              ){
              dispatch(removeSelectedBlog()) ;
              
             }

            setBlogData((prev) => ({...prev , title : "" , desc : "" , image : null , content : {} , tags : [] , draft : false }))

        }
         
       } , [id]) ;




       useEffect(() =>{

       if(e.current === null){  
         initializeEditor() ;       } // so that editor is not redered many times otherwise it will create many editors in each redering 
    
        return ()=>{
           if(e.current && typeof e.current.destroy === "function"){
        
            e.current.destroy() ;  // destroyes the instance of editor from dom
            e.current = null ;  // at last it again gives the value of null to the variable
           }
        }
    } , [id]) ;



  return  token == null ? <Navigate to={"/signin"} /> :(
    <div className="max-sm:w-full max-sm:px-2 sm:w-[50%] sm:mx-auto">
     <div className="w-full lg:flex justify-between gap-3">
      <div className="flex flex-col gap-1 mt-3 lg:w-[50%]">
         <h1 className="text-bold text-3xl">Image</h1>
        <label htmlFor="image" >
            {blogData.image ? (
                <img src={ typeof(blogData.image) =="string" ? blogData.image  : URL.createObjectURL(blogData.image)} className="aspect-video object-cover" alt="" /> ) : (
                <div className ="bg-slate-500 aspect-video text-3xl  flex justify-center items-center text-white  ">
                    Select the image
                </div>
                )}
        </label>
        <input type="file"
               className="hidden"
               id ="image"
               onChange={(e) => setBlogData((prev) => ({...prev , image : e.target.files[0]}))}
        />
      
      </div>
      <div className="flex  flex-col justify-between lg:w-[50%] mt-3 ">
        <div className="flex flex-col mt-5 gap-1 lg:mt-0 ">
        <label htmlFor="" className="text-bold text-3xl">Title</label>
        <input type="text" placeholder= "enter title" 
               onChange={(e) => setBlogData((prev) => ({...prev , title : e.target.value}))}
               value = {blogData.title}
               className="pl-3 py-2 text-lg bg-slate-200 focus:outline-none border-solid border-2 border-black"
        />
        </div>
        <div className="flex flex-col mt-5 gap-1 lg:mt-0">
        <label htmlFor="" className="text-bold text-3xl">Tags</label>
        <input type="text" placeholder= "enter Tag" 
               onKeyDown={handleKeyDown}
               className="pl-3 py-2 text-lg bg-slate-200 focus:outline-none border-solid border-2 border-black"
        />
        <div className="flex justify-between">
             <p className="text-sm opacity-55"> * press enter or spacebar to add a tag</p>
             <p className="text-sm opacity-55"> {6 - blogData.tags.length } are remaining</p>
        </div>
        <div className="flex flex-wrap gap-1">
            {   
                blogData.tags.map(( tag , index ) =>(
                    <div key={index} className="flex justify-center items-center bg-gray-300 text-black px-6 py-1 rounded-full hover:bg-black hover:text-white">
                        <p>{tag}</p>
                        <i className="fi fi-sr-cross-circle mt-1 mx-1 cursor-pointer " onClick={()=> deleteTag(index)}></i>
                    </div>

                ))
            }
        </div>
        </div>
       </div>
     </div>
        <br />
      <div className="flex flex-col mt-5 gap-1">
        <label htmlFor="" className="text-bold text-3xl"  >Description</label>
        <textarea type="text" placeholder ="enter description"
               onChange={(e) => setBlogData((prev) => ({...prev , desc : e.target.value}))}
               value = {blogData.desc}
               className="w-full h-[140px] pl-3 py-2 text-lg bg-slate-200 resize-none focus:outline-none border-solid border-2 border-black"
        />
      </div>
      <br />
      <div className="flex flex-col mt-5 gap-1 lg:mt-0">
        <label htmlFor="" className="text-bold text-3xl">Draft</label>
         <select name="" 
                 id=""   
                 value={blogData.draft}
                 onChange={(e) => setBlogData((prev) => ({...prev , draft : e.target.value == "true" ? true : false  }))}
                 className="pl-3 py-2 text-lg bg-slate-200 focus:outline-none border-solid border-2 border-black">
            <option value="true">true</option>
            <option value="false">false</option>
         </select>
      </div>
        <br />
      <div className="flex flex-col gap-1 mt-3">
         <h1 className="text-bold text-3xl">Content</h1>
         <div id="editor" className="w-full pl-3 py-2 text-lg bg-slate-200 resize-none focus:outline-none border-solid border-2 border-black"></div>
      </div>
        <br />
      <button onClick={id ? handleUpdate : handlePost} className="bg-blue-600 py-3 px-6 mb-8 text-white rounded-sm"> { blogData.draft ? "save as draft" :( id ? "Update Blog" : "Post Blog" ) } </button>

    </div> );
  
  
  
}

export default AddBlog
