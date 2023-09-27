import React, { useEffect, useState } from 'react'
import Avatar from '../avatar/Avatar'
import './Follower.scss'
import { useDispatch, useSelector } from 'react-redux'
import { followandunfollow } from '../../redux/slices/feedSlice';
import { useNavigate } from 'react-router-dom';

function Follower({user}) {
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const feedData=useSelector(state=>state.FeedReducer.feedData);
  const [isFollwing,setIsFollowing]=useState();
  useEffect(()=>{
    if(feedData.following.find(item =>item._id===user._id)){
        setIsFollowing(true);
    }
    else{
        setIsFollowing(false)
    }
  },[feedData,user._id])
  function handleFollow(){
    
    dispatch(followandunfollow({
        userIdToFollow:user._id,
    }));
  }

  return (
    <div className='follower'>
        <div className="user-info"  onClick={()=>navigate(`/profile/${user?._id}`)}>
        <Avatar src={user?.avatar?.url}/>
        <h4 className='name'>{user?.name}</h4>
        </div>
        
        <h5 className={isFollwing?'hover-link unfollow-link':'hover-link follow-link'} onClick={handleFollow}>{isFollwing?'unfollow':'follow'}</h5>
    </div>
  )
}

export default Follower