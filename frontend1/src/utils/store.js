import {configureStore} from "@reduxjs/toolkit"
import userSlice from './userSlice'
import selectedBlog from './selectedBlogSlice.js'
import CommentSlice from "./CommentSlice.js"

const store = configureStore({
    reducer : {
      user :  userSlice ,
      selectedBlog : selectedBlog ,
      comment : CommentSlice 
    }
})


export default store 