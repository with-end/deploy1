import axios from 'axios';
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

function VerifyUser() {
    const [searchParams] = useSearchParams() ;
    const  verificationToken  = searchParams.get("verificationToken") ;
    const navigate = useNavigate() ;

    useEffect(() =>{

        async function verifyUser(){
            try{
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/verify-email/${verificationToken}`) ;
              
                toast.success(res.data.message) ;
               
            }catch(err){
                toast.error(err.response.data.message) ;
            }finally{
                navigate("/signin") ;
            }
        }

        verifyUser() ;

    } , [verificationToken])

  return (
    <div>
      verifyUser
    </div>
  )
}

export default VerifyUser
