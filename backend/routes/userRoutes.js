const express = require("express") ;
const { createUser , getAllUsers , getUserById , deleteUser , updateUser ,Login , verifyEmail , googleAuth  , followCreator , changeSetting } = require("../controller/userController.js") ; 
const route = express.Router() ; 
const User = require("../models/userSchema.js") ; 
const verifyUser = require("../middleware/auth.js");
const upload = require("../utils/multer.js");




route.post( "/signup", createUser ) ;

route.post( "/signin" , Login) ; 

route.get("/users/:username" , getUserById ) ;

route.get("/users" , getAllUsers ) ;

route.delete( "/users/:id" ,verifyUser , deleteUser ) ;

route.patch("/users/:id" , verifyUser , upload.single("profilePic"), updateUser ) ; 

route.get("/verify-email/:verificationToken" , verifyEmail) ;  // verifying email 

route.post("/google-auth/" , googleAuth ) ; // for google authentication 

route.patch("/follow/:id" , verifyUser , followCreator ) ;

route.patch("/changeSetting" , verifyUser , changeSetting) ; // it sets the showLikes blogs and showSaved blogs

// save blog / bookmark blog

module.exports = route ;
