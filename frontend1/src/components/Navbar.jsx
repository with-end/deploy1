import React, { useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import logo from '../../public/logo.svg'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../utils/userSlice';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import axios from 'axios'

function Navbar() {
  const {token , name , profilePic , username} = useSelector((state) => state.user ) ;
  const [showPopup , setShowPopup] = useState(false) ;
  const [searchQuery , setSearchQuery] = useState("") ;
  const [showSearchBar , setShowSearchBar] = useState(window.innerWidth > 640 ) ;
  const navigate = useNavigate() ;
  const dispatch = useDispatch() ;

 useEffect(() =>{
     let  prevWidth = window.innerWidth
  function handleResize(){
     const currWidth = window.innerWidth ;
     if( currWidth != prevWidth ){
           prevWidth = currWidth ;
       setShowSearchBar( window.innerWidth > 640) ;

     }
    
  }

  handleResize() ; // initially runs
  window.addEventListener("resize" , handleResize) ;

  return () => window.removeEventListener("resize" , handleResize) ;
 } , [])


  function handleLogout(){
     dispatch(logout()) ;
     setShowPopup(false) ;
     toast.success("User is logged out successfull ") ;
  }
 

  useEffect(() =>{
    

   
    if(window.location.pathname !="/search-blog"){
    
        setSearchQuery("") ; 
    } 

  } , [window.location.pathname])

 
  return (
     <>
       <div className="bg-white border-b  w-full h-14 max-sm:px-1 sm:px-10 flex justify-between items-center drop-shadow-lg relative ">
          <div className="flex gap-6 items-center">
             <Link to={"/"}>
              <div>
               <img src={logo} alt="" />
              </div>
             </Link>
          
             <div className="static">
               <i className="fi fi-br-search sm:absolute sm:translate-y-1/2 sm:ml-3 max-sm:mr-2" onClick={() => setShowSearchBar((prev) => !prev )}></i>
               <input type="text" 
                      placeholder="search" 
                      value={searchQuery} 
                      onChange={(e) => setSearchQuery(e.target.value)} 
                      onKeyDown={(e) => e.key === "Enter" ? navigate(`/search-blogs?search=${searchQuery.trim()}`) : null }
                      className={`max-sm:absolute max-sm:top-16 max-sm:w-[calc(100vw_-20px)] max-sm:left-1/2  max-sm:-translate-x-1/2 max-sm: bg-gray-300 focus:outline-none rounded-full p-2 pl-10 sm:w-[400px] text-lg ${ showSearchBar ? "block" : "hidden"}`} />
             </div>
          </div>
          <div className="flex gap-6 items-center">
              <Link to={"/add-blog"} className={`${token ? "block" : "hidden"}`}>
                 <div className="flex gap-2 items-center">
                  <i className="fi fi-rs-drawer-alt text-2xl"></i>
                  <span>write</span>
                </div>
              </Link>

            { token ?
            <div className="h-10 w-10 cursor-pointer " onClick={() => setShowPopup((prev) => !prev )}>
               <img src={ profilePic ? profilePic  : `https://api.dicebear.com/9.x/initials/svg?seed=${name}`} 
                    className="rounded-full w-full h-full object-cover " 
                    alt="" />
            </div>  :   
            <div  className="flex gap-2">
              <Link to={"/signup"}>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-full">Signup</button>
              </Link>
              <Link to={"/signin"}>
                  <button className="border-black border text-black px-4 py-2 rounded-full">Signin</button>
              </Link>
            </div>
           }
          </div>
          {showPopup ?  
           <div className="bg-gray-100  w-[110px] absolute right-7 top-12 drop-shadow-sm ">
             <Link to={`/@${username}`}>  <p className="popup">Profile</p>  </Link>
             <Link to={`/edit-profile`}>  <p className="popup">Edit Profile</p>  </Link> 
             <p className="popup" onClick={() => navigate("/setting")}>Setting</p>
             <p className="popup" onClick={handleLogout}>Logout</p>
          </div> : null }
       </div>
       <Outlet/>
     </>

  )
}

export default Navbar
