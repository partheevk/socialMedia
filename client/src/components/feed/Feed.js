import React, { useEffect } from 'react'
import './Feed.scss'
import Post from '../Post/Post'
import Follower from '../follower/Follower'
import { useDispatch, useSelector } from 'react-redux'
import {getFeedData} from '../../redux/slices/feedSlice'

function Feed() {
    const dispatch=useDispatch();
    const feedData=useSelector(state=>state.FeedReducer.feedData)
    useEffect(()=>{
        dispatch(getFeedData())
    },[dispatch])
  return (
    <div className='feed'>
        <div className="container">
            <div className="left-part">
                {feedData?.posts?.map(post=><Post key={post._id} post={post} />)}
            </div>
            <div className="right-part">
                <div className="following">
                    <h3 className='title'>you are following</h3>
                    {feedData?.following?.map(user=><Follower key={user._id} user={user}/>)}
                </div>
                <div className="suggestions">
                    <h3 className='title'>suggestions</h3>
                    {feedData?.suggestions?.map(user=><Follower key={user._id} user={user}/>)}
                </div>
            </div>
        </div>
    </div>
  )
}

export default Feed