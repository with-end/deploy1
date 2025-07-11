import React from 'react'
import {useState} from 'react' ;
import toast from 'react-hot-toast';
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
import {useDispatch} from 'react-redux'
import { login } from '../utils/userSlice';
import Input from '../components/input.jsx'
import googleIcon from '../assets/googleIcon.svg'
import { googleAuth } from '../utils/firebase.js';



function Authe(props) {
   const [userData , setUserData] = useState({name : "" , email : "" , password : "" }) ; 


   const dispatch = useDispatch() ;
   const navigate = useNavigate() ;


   async function handleAuthForm(e){
    e.preventDefault() ;
           
    

    try{
      
        // const data = await fetch(`http://localhost:3000/Api/v1/${props.type}` ,{ // fetching data by using fetch
        //       method : "POST" ,
        //       body : JSON.stringify(userData) ,
        //       headers : {
        //         "Content-Type" : "application/json"
        //       }

        // });

        
        // const res = await data.json() ;

        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/${props.type}` , userData) ;

        if( props.type == "signup"){
           toast.success(res.data.message) ;
           navigate("/signin") ;
        }else{
            dispatch(login(res.data.user)) ; 
            toast.success(res.data.message) ;
            navigate("/") ;
        }

       
        // localStorage.setItem("user" , JSON.stringify(res.data.user)) ;
        // localStorage.setItem("token" ,JSON.stringify(res.data.token)) ;

       

    }catch(err){
      console.log(err) ;
      toast.error(err.response.data.message) ;
    }finally{ // always runs either error or there is no error 

       setUserData({
         name :"" ,
         email : "" ,
         password : ""   // to set empty all fields after the form is submitted
      })


    }

  }

   async function handleGoogleAuth(){
       try{
           let data =await googleAuth() ;
           
           const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/google-auth` , { accessToken : data.accessToken }) ;

        
           toast.success(res.data.message) ;
           dispatch(login(res.data.user)) ;
           navigate("/") ;

       }catch(err){
           console.log(err) ;
           toast.error(err.response.data.message) ;
       }
   }







  return (
  <div className="flex flex-col justify-center h-[calc(100vh_-_60px)]  w-full px-2">
    <div className=" w-full max-w-[400px]  bg-slate-200 mx-auto  flex flex-col items-center justify-center gap-7 px-8 ">
       <h1 className="text-3xl "> {props.type == "signup" ? "Sign up" : "Sign In"} </h1>
       <form className="w-[100%] flex flex-col items-center gap-10" 
             onSubmit={handleAuthForm}
       > 
      {  props.type === "signup" && 

             <Input type={"text"} 
             placeholder={"Enter the name here"} 
             setUserData={setUserData} 
             field={"name"} 
             value={userData.name}
             icon={"fi-bs-id-card-clip-alt"} />



            // <input type="text" className=" w-full h-8 p-2 text-white bg-gray-500 rounded-md" placeholder="enter your name"
            //        onChange={(e)=>{
            //         setUserData(prev => ({...prev , name : e.target.value }))
            //        }}
            // />
                  
      }
            {/* <input type="email" className=" w-full h-8 p-2 text-white bg-gray-500 rounded-md" placeholder="enter your email"
                    onChange={(e)=>{
                    setUserData(prev => ({...prev , email : e.target.value }))
                   }}
            /> */}

             <Input type={"email"}
                    placeholder={"Enter the email here"}
                    setUserData={setUserData} 
                    field={"email"}
                    value={userData.email}
                    icon={"fi-rr-at"} />

             <Input type={"password"}
                    placeholder={"Enter the password here"} 
                    setUserData={setUserData} 
                    field={"password"} 
                    value={userData.password}
                    icon={"fi-rr-lock"}/>


            {/* <input type="password" className=" w-full h-8 p-2 text-white bg-gray-500 rounded-md" placeholder="enter your password"
                    onChange={(e)=>{
                    setUserData(prev => ({...prev , password : e.target.value }))
                   }}
            /> */}


            <button className="w-[100px] h-[50px] text-white  p-2 rounded-md text-xl bg-green-500 ">
               { props.type == "signup" ? "Resister" : "Login"} </button>

          
       </form>
         <p className="text-xl font-medium">or</p>
         <div className="bg-white  h-[50px] w-full rounded-3xl px-2 flex justify-center items-center hover:text-white hover:bg-blue-400 hover:cursor-pointer gap-2"
              onClick={handleGoogleAuth}>
            <p className="text-lg font-semibold"> Continue with </p>
            <img src={googleIcon} alt="" width="50px" height="50px" />
        </div>
      { props.type == "signup" ? <p>Already have an account <Link className="text-blue-500 text-[20px] mb-5" to={"/signin"}>Sign in</Link> </p> : <p>Don't have an account <Link className="text-blue-500 text-[20px] mb-5"  to={"/signup"}>Sign up</Link></p>}
      
      
      
      
    </div>
  </div>
  )
}

export default Authe
