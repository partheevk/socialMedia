import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import { axiosClient } from '../../utils/axiosClient';

import { likeandunlikepost } from './postsSlice';


export const getFeedData=createAsyncThunk('user/getFeedData',async()=>{
    try {
        
        const response=await axiosClient.get('/user/getFeedData');
        
        return response.result;
    } catch (error) {
        return Promise.reject(error);
    }
    
})

export const followandunfollow=createAsyncThunk('user/followandunfollow',async(body)=>{
    try {
        const response=await axiosClient.post('/user/follow',body);
        
        return response.result.user;
    } catch (error) {
        return Promise.reject(error);
    }
    
})



const FeedSlice=createSlice({
    name:'feedSlice',
    initialState:{
        feedData:{}
    },
    extraReducers: (builder)=>{
        builder.addCase(getFeedData.fulfilled,(state,action)=>{
            state.feedData=action.payload
        })
        .addCase(likeandunlikepost.fulfilled,(state,action)=>{
            const post=action.payload;
            const index=state?.feedData?.posts?.findIndex(item=>item._id===post._id);
            if(index !== undefined && index!==-1){
                state.feedData.posts[index]=post
            }
        })
        .addCase(followandunfollow.fulfilled,(state,action)=>{
            const user=action.payload;
            const index=state?.feedData?.following?.findIndex(item=>item._id===user._id);
            const sug=state?.feedData?.suggestions?.findIndex(item=>item._id===user._id);
            if(index!==undefined && index!==-1){
                state?.feedData?.following?.splice(index,1);
                state?.feedData?.suggestions?.push(user);
            }
            else if(index!==undefined){
                state?.feedData.following.push(user);
                state?.feedData.suggestions.splice(sug,1);
            }
            
        })
    }
})

export default FeedSlice.reducer;
