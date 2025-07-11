require("dotenv").config() ;

module.exports ={
            CLOUDINARY_CLOUD_NAME : process.env.CLOUDINARY_CLOUD_NAME,
            CLOUDINARY_API_KEY  : process.env.CLOUDINARY_API_KEY ,
            CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

            DB_URL :   process.env.DB_URL,

            JWT_SECRET   :  process.env.JWT_SECRET,

            PORT : process.env.PORT ,

            EMAIL_HOST : process.env.EMAIL_HOST ,
            EMAIL_PORT : process.env.EMAIL_PORT ,
            EMAIL_USER : process.env.EMAIL_USER ,
            EMAIL_PASS : process.env.EMAIL_PASS ,
            
            FIREBASE_TYPE  : process.env.FIREBASE_TYPE , 
            FIREBASE_PROJECT_ID : process.env.FIREBASE_PROJECT_ID , 
            FIREBASE_PRIVATE_KEY_ID  : process.env.FIREBASE_PRIVATE_KEY_ID ,
            FIREBASE_PRIVATE_KEY  : process.env.FIREBASE_PRIVATE_KEY  ,
            FIREBASE_CLIENT_EMAIL  : process.env.FIREBASE_CLIENT_EMAIL,
            FIREBASE_CLIENT_ID  : process.env.FIREBASE_CLIENT_ID ,
            FIREBASE_AUTH_URI  : process.env.FIREBASE_AUTH_URI ,
            FIREBASE_TOKEN_URI  : process.env.FIREBASE_TOKEN_URI ,
            FIREBASE_AUTH_PROVIDER_X509_CERT_URL  : process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL ,
            FIREBASE_CLIENT_X509_CERT_URL  : process.env.FIREBASE_CLIENT_X509_CERT_URL ,
            FIREBASE_UNIVERSE_DOMAIN  : process.env.FIREBASE_UNIVERSE_DOMAIN ,

            FRONTEND_URL : process.env.FRONTEND_URL ,

}

 