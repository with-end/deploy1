import { createSlice } from '@reduxjs/toolkit' 

const selectedBlogSlice = createSlice({
    name : "selectedBlogSlice" ,
    initialState : JSON.parse(localStorage.getItem("selectedBlog")) || {},
    reducers : {
        addSelectedBlog(state , action){
            localStorage.setItem("selectedBlog" ,JSON.stringify(action.payload)) ;
           return action.payload ; 
        } ,
        removeSelectedBlog(){
            localStorage.removeItem("selectedBlog") ;
            return {} ;
        },
        changeLikes(state , action){
            if(state.likes.includes(action.payload)){
               state.likes = state.likes.filter((like) => like != action.payload) ;
            }else{
               state.likes = [...state.likes , action.payload] ;
            }
        },
        setComments(state , action){
            state.comments = [...state.comments , action.payload] ;
        },
        setCommentLikes(state , action){
            let { commentId , userId } = action.payload ;

            function findComment(comments){
                let requireComment ;
                for(let comment of comments ){
                    if(comment._id == commentId ) return comment ;
                    else if(comment.replies && comment.replies.length > 0 ){
                        requireComment = findComment(comment.replies) ; 
                        if(requireComment) return requireComment ; 
                    }
                }
                return null  ;
            }
            const comment = findComment(state.comments) ;
         
            if(comment?.likes.includes(userId)){
                comment.likes = comment.likes.filter((like) => like !=userId)
            }else{
                comment.likes.push(userId);
            }
            return state;
        },
        setReplies(state , action){
            let newReply = action.payload ;

            function findParentComment(comments){
                let parentComment ;
                for(const comment of comments ){
                    if( comment._id == newReply.parentComment ){
                        parentComment = {...comment , replies :[...comment.replies , newReply ]}  ;
                        break;
                    }

                    if( comment.replies.length > 0 ){
                        parentComment = findParentComment(comment.replies) ;
                        if(parentComment){
                            parentComment = {...comment , replies : comment.replies.map((reply) => reply._id == parentComment._id ? parentComment : reply)}
                          break ;
                        }
                           
                    }
                }
                return  parentComment ;
            }

            

            let parentComment = findParentComment(state.comments) ;
        
            state.comments = state.comments.map((comment) => comment._id == parentComment._id ? parentComment : comment ) ;
        },
        updateComment( state , action ){
            function update(comments){
                return comments.map((comment) => comment._id == action.payload._id ? 
                                  {...comment , comment : action.payload.comment } :  comment.replies && comment.replies.length > 0 ? 
                                  {...comment , replies : update(comment.replies)} :  comment   

                ); 
            }

            state.comments = update(state.comments) ;
        },
        deleteCommentAndReply( state , action ){
             function deleteComment(comments){
                return comments.filter((comment) => comment._id != action.payload).
                                map((comment) => comment.replies && comment.replies.length > 0 ? 
                                                  {...comment , replies : deleteComment(comment.replies)} : comment)
             }

             state.comments = deleteComment(state.comments) ;
        },
        setSavedBlog( state , action){
             if(state.totalSaves.includes(action.payload)){
               state.totalSaves = state.totalSaves.filter((user) => user!= action.payload) ;
            }else{
               state.totalSaves = [...state.totalSaves , action.payload] ;
            }
        }
    }
}) ;

export const {addSelectedBlog , removeSelectedBlog ,changeLikes , setComments , setCommentLikes , setReplies , updateComment , deleteCommentAndReply , setSavedBlog } = selectedBlogSlice.actions ;
export default selectedBlogSlice.reducer ;