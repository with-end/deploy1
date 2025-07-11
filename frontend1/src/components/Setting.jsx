import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { updateData } from '../utils/userSlice';
import { Navigate, useNavigate } from 'react-router-dom';

function Setting() {
    const { token , showLikesBlog , showSavedBlog } = useSelector((state) => state.user) ;
    const [data , setData ] = useState({ showLikesBlog , showSavedBlog }) ;
    const dispatch = useDispatch() ;
    const navigate = useNavigate() ;
    

    async function handleSetting(){
        try{
            let res = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/changeSetting` , data , {
                     headers : {
                        Authorization : `Bearer ${token}` 
                     }
            }) ;
           
            toast.success(res.data.message) ;
            dispatch(updateData(data));

        }catch(err){
            console.log(err) ;
            toast.error(err?.response?.data?.message) ;
        }
    }


  return ( token ? 
   <div className="w-full h-[calc(100vh_-_70px)] px-2 flex  items-center">
      <div className="w-full max-w-[375px] flex flex-col justify-center gap-7   mx-auto my-auto">
       <div>
        <h1 className="text-xl font-semibold"> show Saved blogs ?</h1>
        <select name="" 
                id=""
                value ={data.showSavedBlog} 
                onChange={(e)=> setData((prev) => ({...prev , showSavedBlog : e.target.value == "true" ? true : false }))} 
                className="w-full mb-2 text-lg bg-slate-300">
            <option value="true" className="bg-white hover:bg-blue-400 hover:text-white ">true</option>
            <option value="false" className="bg-white hover:bg-blue-400 hover:text-white ">false</option>
        </select>
       </div>
       <div>
        <h1 className="text-xl font-semibold"> show Liked blogs ?</h1>
        <select name="" 
                id=""
                value ={data.showLikesBlog}
                onChange={(e) => setData((prev) => ({...prev , showLikesBlog : e.target.value == "true" ? true : false }) )}
                className="w-full text-lg bg-slate-300">
            <option value="true" className="bg-white hover:bg-blue-400 hover:text-white ">true</option>
            <option value="false" className="bg-white hover:bg-blue-400 hover:text-white" >false</option>
        </select>
       </div>
       <button className="bg-green-500 px-4 py-2 text-white w-[100px] mx-auto rounded-full"
               onClick={handleSetting}> update </button>
    </div>

   </div>  : <Navigate to="/signin" />
    
   
  )
}

export default Setting
