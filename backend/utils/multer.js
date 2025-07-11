const multer = require("multer") ;
const path = require("path") ;

// const storage = multer.diskStorage({     // this uploads your image to the your project 
//       destination: "uploads/" ,
//       filename : function(req , file , cb ){
//         cb(null , Date.now() + path.extname(file.originalname)) ;
//       }
// });


const  storage = multer.memoryStorage() ;


const upload = multer({
     storage ,
})

module.exports = upload ;