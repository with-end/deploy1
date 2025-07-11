import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name : "userSlice" ,
    initialState : JSON.parse(localStorage.getItem("user")) || { token : null } ,
    reducers : {
        login(state , action){
        //    state.name = action.payload.name ;
        //    state.email = action.payload.email ;
        //    state.token = action.payload.token ;   or second method to give value => return action.payload ;
        localStorage.setItem("user" , JSON.stringify(action.payload)) ;
        return action.payload ;
        } ,
        logout(state , action){
            localStorage.removeItem("user") ;
            return {
                token : null 
            }
        } ,

        updateData(state , action){
            const data = action.payload ;
            let user = JSON.parse(localStorage.getItem("user")) ;
            user.showLikesBlog = data.showLikesBlog ;
            user.showSavedBlog = data.showSavedBlog ;
            localStorage.setItem("user" , JSON.stringify(user)) ;
            return {...state , ...data } ;

        }
        
    } ,
}) ;

export const { login , logout , updateData  } = userSlice.actions ;
export default userSlice.reducer ;