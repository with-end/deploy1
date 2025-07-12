const User = require("../models/userSchema.js") ;
const bcrypt = require("bcrypt") ; 
const { generateJWT, verifyJWT}  = require("../utils/generateTokens.js") ;
const ShortUniqueId = require("short-unique-id") ;
const { randomUUID } = new ShortUniqueId({ length : 5 }) ;
const  transporter  = require("../utils/transporter.js");


const admin = require("firebase-admin") ;                   //                              <----|
const { getAuth } = require("firebase-admin/auth") ;         //                                  |
const Blog = require("../models/blogSchema.js");
const { deleteImageFromCloudinary, uploadImage } = require("../utils/uploadImage.js");
const { FIREBASE_TYPE, FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, FIREBASE_CLIENT_ID, FIREBASE_AUTH_URI, FIREBASE_TOKEN_URI, FIREBASE_AUTH_PROVIDER_X509_CERT_URL, FIREBASE_CLIENT_X509_CERT_URL , FIREBASE_UNIVERSE_DOMAIN, EMAIL_USER, FRONTEND_URL} = require("../config/dotenv.config.js");
admin.initializeApp({                                        //                                  | firebase configuration in the backend
  credential: admin.credential.cert({ 
    type: FIREBASE_TYPE,
    project_id: FIREBASE_PROJECT_ID,
    private_key_id: FIREBASE_PRIVATE_KEY_ID,
    private_key: FIREBASE_PRIVATE_KEY,
    client_email: FIREBASE_CLIENT_EMAIL,
    client_id: FIREBASE_CLIENT_ID,
    auth_uri: FIREBASE_AUTH_URI,
    token_uri: FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: FIREBASE_UNIVERSE_DOMAIN  ,
 })                                                           //                                 |
});                                                            //                           <----|

async function createUser(req , res){ 
 try{
    const {name , password ,email} = req.body ;
    

    if(!name){
        return res.json({
            "success" : false ,
            "message" : "enter the name"
        })
    }
   else if(!email){
        return res.json({
            "success" : false ,
            "message" : "enter the email"
        })
    }
   else if(! password){
        return res.json({
            "success" : false ,
            "message" : "enter the password"
        })
    }


    const checkForExistingUser = await User.findOne({email}) ; 

     if(checkForExistingUser?.googleAuth){
        return res.status(400).json({
            success : false ,
            message : "given email is registered with google , please try with CONTINUE WITH GOOGLE "
        })
     }


    if(checkForExistingUser){
       if(checkForExistingUser.verify){
            return res.status(400).json({
            success : false ,
            message : "given email Id already exist "
        })
       }else{

         let verificationToken = await generateJWT({
         email : checkForExistingUser.email ,
         id : checkForExistingUser._id 
   })
    
   // email logic
   const sendingEmail = transporter.sendMail({
         from : EMAIL_USER,
         to : checkForExistingUser.email  ,
         subject : "Email Verification" ,
         text : "Please verify your email" ,
         html : `<h1> Click on the link to verify your email </h1>
                 <a href="${FRONTEND_URL}/verify-email/${verificationToken}"> Verify Email </a>`
   })
    
    return res.status(200).json({
        success : true ,
        message : "please verify your account "

       })
       
    } }

    const hashPassword = await bcrypt.hash( password , 10)  // hashing the password and here 10 -> (salt rounds)
    const username = email.split("@")[0] + randomUUID() ;
     
    const newUser = await User.create({
          name ,
          email,
          password : hashPassword ,
          username 
    }) ;


   let verificationToken = await generateJWT({
       email : newUser.email ,
       id : newUser._id 
   })
    
   // email logic
   const sendingEmail = transporter.sendMail({
         from : EMAIL_USER,
         to : email  ,
         subject : "Email Verification" ,
         text : "Please verify your email" ,
         html : `<h1> Click on the link to verify your email </h1>
                 <a href="${FRONTEND_URL}/verify-email?verificationToken=${verificationToken}"> Verify Email </a>`
   })
    
    return res.status(200).json({
        success : true ,
        message : "Please check your email to verify your account "
    //   message : "user is successfully created",
    //     user : {
    //      id   : newUser._id ,
    //     name : newUser.name ,
    //     email : newUser.email ,
    //   //  token ,
    //   },
    
        
    })

}catch(err){
    console.log(err) ;
     return res.status(500).json({
         success  : false ,
         message : "user can not be created",
        
})
} 


}

async function Login(req , res ){

   try{
    const { password ,email} = req.body ;
    
    if(!email){
        return res.json({
            "success" : false ,
            "message" : "enter the email"
        })
    }
    else if(! password){
        return res.json({
            "success" : false ,
            "message" : "enter the password"
        })
    }


    const checkForExistingUser = await User.findOne({email}).select("+password") ;  // as password is not given by default 

    if(!checkForExistingUser){
        return res.status(400).json({
            success : false ,
            message : "User does not exist"
        })
    }
    
     if(checkForExistingUser.googleAuth){
        return res.status(400).json({
            success : false ,
            message : "given email is registered with google , please try with CONTINUE WITH GOOGLE "
        })
     }

     const checkForPass = await bcrypt.compare( password , checkForExistingUser.password) ; // for comparing the password with bcrypt password 


     if(!checkForExistingUser.verify){
        
       let verificationToken = await generateJWT({
       email : checkForExistingUser.email ,
       id : checkForExistingUser._id 
   })
    
   // email logic
   const sendingEmail = transporter.sendMail({
         from : EMAIL_USER,
         to : checkForExistingUser.email   ,
         subject : "Email Verification" ,
         text : "Please verify your email" ,
         html : `<h1> Click on the link to verify your email </h1>
                 <a href="${FRONTEND_URL}/verify-email/${verificationToken}"> Verify Email </a>`
   })
    

        return res.status(400).json({
            success : false ,
            message : "please verify your email"
        })
    }

   
     if(!checkForPass){
    return res.status(400).json({
           success : false ,
           message : "incorrect password"
         })
    }

     let token = await generateJWT({
       email : checkForExistingUser.email ,
       id : checkForExistingUser._id 
   })
    
   
    return res.status(200).json({
        success : true ,
        message : "user is Logged in successfully",
        user : { id   : checkForExistingUser._id ,
                 name : checkForExistingUser.name ,
                 email : checkForExistingUser.email,
                 profilePic : checkForExistingUser.profilePic ,
                 username : checkForExistingUser.username ,
                 bio : checkForExistingUser.bio ,
                 showLikesBlog : checkForExistingUser.showLikesBlog ,
                 showSavedBlog : checkForExistingUser.showSavedBlog ,
                 token , },
       
    })

}catch(err){
   
     return res.status(500).json({
         success  : false ,
         message : "user can not be logged in "
})
}   

}

async function googleAuth( req , res ){
    try{
          const  { accessToken } = req.body ;
          const response = await getAuth().verifyIdToken(accessToken) ;
          console.log(response) ;
          const { name , email } = response ;
          let user = await User.findOne({email : email}) ;

          if(user){     
            // already registered 
            if(user.googleAuth){

                     let token = await generateJWT({
                    email : user.email ,
                    id : user._id 
                    })
    
             return res.status(200).json({
             success : true ,
             message : "User is logged in successfully" ,
             user : {
              name : user.name ,
              email : user.email,
              id : user._id ,
              profilePic : user.profilePic ,
              token : token 
               }
             })

           }else{
               return res.status(400).json({
                success : false ,
                message : "this email already registered without google , please try through login form"
               })
            }
        
      }
          const username = email.split("@")[0] + randomUUID() ;

          let  newUser = await User.create({
                name ,
                email ,
                username ,
                googleAuth : true ,
                verify : true 
          }) ;

    let token = await generateJWT({
        email : newUser.email ,
        id : newUser._id 
        })
    
     return res.status(200).json({
        success : true ,
        message : "User is registered with google" ,
        user : {
            name : newUser.name ,
            email : newUser.email,
            id : newUser._id ,
            token : token 
        }
     })

    }catch(err){
       console.log(err) ; 
       return res.status(500).json({
        success : false ,
        message : "problem while authentication with google"
       })
    }
}

async function getUserById(req , res){
    try{
        const username = req.params.username ;

       
        const user = await User.findOne({ username}).populate("saveBlogs followers followings likeBlogs blogs").select("-password -__v -email -verify") ;
          
        if(!user){
             return res.status(200).json({
            "success" : false ,
            "message" : "No user is found",
             })

        }

        return res.status(200).json({
            "success" : true ,
            "message" : "user is fetched successfully",
             user 
        })

    }catch(err){
        console.log(err) ;
        return res.status(500).json({
            "success" : false ,
            "message" : "Please try again"
            
        })
        
    }
}

async function getAllUsers(req , res){
    try{

       const users = await User.find({}) ;

        return res.status(200).json({
            "success" : true ,
            "message" : "all user are fetched successfully",
            users ,
        })

    }catch(err){
        return res.status(500).json({
            "success" : false ,
            "message" : "users are not fetched",
            
        })
    }
}

async function deleteUser(req , res){
    try{
        const id = req.params.id ;

        const deletedUser = await User.findByIdAndDelete(id) ;

        if(!deletedUser){
            return res.status(200).json({
                success : false ,
                message : "user is not found "
            })
        }

        return res.status(200).json({
            success : true ,
            message : "user is removed successfully",
            deletedUser ,
        })
    }catch(err){
        return res.status(500).json({
            success : false ,
            message : "user can not be removed", 
        })
    }
}

async function updateUser(req , res){
    try{
        const userId = req.params.id ;

        const {name , username , bio } = req.body ;
        const profilePic = req.file ;

        const user = await User.findById(userId) ;
    

        if( user.username != username ){
             const findUser = await User.findOne({username}) ;
             if( findUser ){
                return res.status.json({
                    success : false ,
                    message : "given username already is present"
                }) ;
             
           
        }}

        user.username = username ;
        user.name = name ;
        user.bio = bio ;

             

        if(profilePic){
            if(user.profilePicId){
                await deleteImageFromCloudinary(user.profilePicId) ; // deleting the previous profile image from cludinary 
            }
              const { secure_url , public_id } = await uploadImage(`data:${profilePic.mimetype};base64,${profilePic.buffer.toString("base64")}`) ;
              user.profilePic = secure_url ;
              user.profilePicId = public_id ;
        }else if(user.profilePic){
               await deleteImageFromCloudinary(user.profilePicId) ; // deleting the previous profile image from cludinary 
               user.profilePic = null ;
               user.profilePicId = null ;
        }

        await user.save() ;

       

        return res.status(200).json({
            "success" : true,
            "message" : "user is updated successfully",
             "user" : {
                name : user.name ,
                username : user.username ,
                profilePic : user.profilePic ,
                bio : user.bio 
             }
        })

    }catch(err){
        console.log(err) ;
        return res.status(500).json({
            "success" : false ,
            "message" : "user is not updated", 
        })
    }
}

async function verifyEmail( req , res ){
   try{
    const { verificationToken } = req.params ;

    const verifyToken = await verifyJWT(verificationToken) ;

    if(!verifyToken){
        return res.status(400).json({
            success : false ,
            message : "invalid Token/epired email"
        })
    }

    const { id } = verifyToken ;
    const user = await User.findByIdAndUpdate( id , { verify : true } , {new : true }) ;
    
    if(!user){
        return res.status(400).json({
            success : false ,
            message : "user is not found"
        })

    }

    return res.status(200).json({
        success : true , 
        message : "user is verified"
    })

   }catch(err){
       console.log(err) ;
       return res.status(500).json({
        success : false ,
        message : "User can not be verified an error occured"
       })

   }
}

async function followCreator( req , res ){

try{
 
    const followerId = req.user ;
      
    const blogCreatorId = req.params.id ;

     const blogCreator = await User.findById( blogCreatorId)  ;
    
    if(!blogCreator){
        return res.status(400).json({
            success : false ,
            message : "blogCreator is not found " 
        })
    }
    
   
    if(!blogCreator.followers.includes(followerId)){
        await User.findByIdAndUpdate(blogCreatorId , {$push : { followers : followerId}}) ;
        await User.findByIdAndUpdate(followerId , {$push : {  followings : blogCreatorId}}) ;

       return res.status(200).json({
        success : true ,
        message : "blog Creator is followed successfully " ,
       })


   }
   else{
      
       await User.findByIdAndUpdate( blogCreatorId , {$pull : { followers : followerId }}) ;
       await User.findByIdAndUpdate( followerId , {$pull : { followings : blogCreatorId }}) ;
      
        return res.status(200).json({
        success : true ,
        message : "blog creator is unfollowed successfully",
      })

   }



   }catch(err){
        console.log(err) ;
    return res.status(500).json({
        success : false ,
        message : "there is some problem while following"
    })
}
}

async function changeSetting( req , res ){
    try{
        const userId = req.user ;
        const {showLikesBlog , showSavedBlog} = req.body ;

        const user = await User.findById(userId) ;

        if(!user){
            return res.status(500).json({
                success : false ,
                message : "user could not be found"
            })
        }

        await User.findByIdAndUpdate(userId , {showLikesBlog , showSavedBlog }) ;

        return res.status(200).json({
            success : true ,
            message : " setting is changed successfully"
        })
        
    }catch(err){
        console.log(err) ;
        return res.status(500).json({
            success : false ,
            message : "there is some problem while changing the setting"
        })
    }
}





module.exports = { createUser , getAllUsers ,getUserById ,deleteUser , updateUser , Login , verifyEmail , googleAuth , followCreator , changeSetting } ;