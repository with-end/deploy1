const {verifyJWT} = require('../utils/generateTokens.js') ;



const verifyUser = async ( req , res , next ) =>{

  try{
          
      let token = req.headers.authorization.split(" ")[1] // split is used to remove bearer and only get token

      if(!token){
          return res.status(400).json({
            success : false ,
            message : "Please sign in" ,
          })
      }


      try{
        let user = await verifyJWT(token) ;
        if(!user){
            return res.status(400).json({
                success : false ,
                message : "Please sign in" 
            })

        } 

      req.user = user.id 
      next() ;
      }catch(err){
         return res.status(400).json({
          success : false ,
          message : "there is some problem while varification of token "
         })
      }
    
     }catch(err){
    res.status(400).json({
      success : false ,
      message : "I think token has not been sent " ,

    })
    }
     
}

module.exports = verifyUser;


