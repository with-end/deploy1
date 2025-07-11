import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../utils/userSlice';
import { Navigate } from 'react-router-dom';

function EditProfilepage() {
     const { id : userId , token , name , username , profilePic , bio , email } = useSelector((state) => state.user) ;
     const [userData , setUserData ] = useState({name , username , profilePic , bio}) ;
     const [initialData , setInitialData] = useState({name , username , profilePic , bio}) ;
     const [isButtonDisabled , setIsButtonDisabled] = useState(false) ;
     const dispatch = useDispatch() ;
     

     function handleChange(e){
         const {name , value , files } = e.target ;
         if(files){
            setUserData((prev) =>({...prev , [name] : files[0]}))
         }else setUserData((prev) => ({...prev , [name] : value }))
     }

     async function handleUpdate(){
      setIsButtonDisabled(true) ;
      const formData =new FormData() ;
            formData.set("name" , userData.name) ;
            formData.set("username" , userData.username) ;
            formData.set("bio" , userData.bio) ;
          if(userData.profilePic){
            formData.set("profilePic" , userData.profilePic) ;
          }

          try{
            let res =await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/users/${userId}` , formData , {
                headers:{
                  "Content-Type" : "multipart/form-data" ,
                  Authorization : `Bearer ${token}`
                }
            });
             
          
            toast.success(res.data.message) ;
            dispatch(login({...res.data.user , email , token , id : userId })) ;

          }catch(err){
             toast.error(err.response.data.message) ;
          }

     }

     useEffect(() =>{
       if(initialData){
         const isTrue = JSON.stringify(initialData) == JSON.stringify(userData) ;
         setIsButtonDisabled(isTrue) ;
       }
     }, [initialData, userData ])





  return ( token ?
    <div className="w-full px-2">
        <div className="  max-w-[310px] mx-auto my-12">
            <h1 className="text-center text-2xl font-medium"> edit profile </h1>
     <div className="flex flex-col gap-1 mt-3">
         <h1 className="text-bold text-xl">photo</h1>
         <div className="flex flex-col  items-center gap-3 ">
           <label htmlFor="image" >
            {userData?.profilePic ? (
                <img src={ typeof(userData?.profilePic) =="string" ? userData.profilePic  : URL.createObjectURL(userData.profilePic)} className="aspect-square rounded-full h-[150px] w-[150px] object-cover border-dashed border-black border " alt="" /> ) : (
                <div className ="bg-slate-500 aspect-square  text-lg rounded-full  flex justify-center items-center text-white w-[150px] h-[150px] ">
                    Select image
                </div>
                 )} 
           </label>
           <input type="file"
               name="profilePic"
               className="hidden"
               id ="image"
               onChange={handleChange}
           />
           <p className="text-red-700 font-semibold " onClick={() => setUserData((prev) => ({...prev , profilePic : null }))}> remove </p>
        </div>
      </div>
          {/* <br /> */}
          <div className="flex flex-col mt-5 gap-1">
              <label htmlFor="" className="text-bold text-xl">Name</label>
              <input type="text" 
                     placeholder= "name" 
                     name="name"
                     onChange={handleChange}
                     defaultValue = {userData.name}
                     className="pl-3 py-2 text-lg bg-slate-200 focus:outline-none border-solid border-2 border-black"
              />
          </div>
          <div className="flex flex-col mt-5 gap-1">
              <label htmlFor="" className="text-bold text-xl">Username</label>
              <input type="text"
                     placeholder= "username" 
                     name="username"
                     onChange={handleChange}
                     defaultValue = {userData.username}
                     className="pl-3 py-2 text-lg bg-slate-200 focus:outline-none border-solid border-2 border-black"
              />
          </div>
         <div className="flex flex-col mt-5 gap-1">
          <label htmlFor="" className="text-bold text-xl"  >Bio</label>
          <textarea type="text" 
                    placeholder ="bio"
                    name="bio"
                    onChange={handleChange}
                    defaultValue = {userData.bio}
                    className="w-full h-[140px] pl-3 py-2 text-lg bg-slate-200 resize-none focus:outline-none border-solid border-2 border-black"
          />
        </div>
        <br />
        <button className={ `px-4 py-2 text-white hover:cursor-pointer rounded-full ${ isButtonDisabled ? 'bg-green-300' : 'bg-green-500' } `} 
                disabled={isButtonDisabled}
                onClick={handleUpdate}> update </button>
  
   
        </div>
      
    </div> : <Navigate to="/signin"/> 
  )
}

export default EditProfilepage
