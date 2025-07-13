const express = require("express") ;
const cors = require("cors") ;
const  app = express() ;
const dbConnect = require("./config/dbConnect.js") ;
const cloudinaryConfig = require("./config/cloudinaryConfig.js") ;
const User = require("./models/userSchema.js") ;
const userRoute = require("./routes/userRoutes.js") ;
const blogRoute = require("./routes/blogRoutes.js") ;
const dotenv = require("dotenv") ;
const { PORT, FRONTEND_URL } = require("./config/dotenv.config.js");
dotenv.config() ; // we can also do like that => require("dotenv").config() ;



app.use(express.json()) ;
app.use(cors({

    origin : FRONTEND_URL // origin which can support the server 
}));

app.get("/" , (req , res) =>{ res.send("Backend is live now updated")}) ;

app.use("/Api/v1" , userRoute) ;
app.use("/Api/v1" , blogRoute) ;



app.listen( PORT , () =>{
    console.log("my server is started yar "); 
    dbConnect(); 
    cloudinaryConfig() ; 
})