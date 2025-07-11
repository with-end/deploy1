import { createSlice } from '@reduxjs/toolkit' 

const CommentSlice = createSlice({
    name : "CommentSlice" ,
    initialState : {
        isOpen : false 
    },
    reducers : {
        setIsOpen(state , action){
            state.isOpen = action.payload ===false ? false : !state.isOpen ;
        }
    }
}) ;

export const {setIsOpen} = CommentSlice.actions ;
export default CommentSlice.reducer;
