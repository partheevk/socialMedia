import React, { useEffect, useState } from 'react'
import './Profile.scss'
import Post from '../Post/Post'
import userImg from '../../assests/user.png'
import { useNavigate, useParams } from 'react-router-dom'
import CreatePost from '../createPost/CreatePost'
import { useDispatch, useSelector } from 'react-redux'
import { getUserProfile } from '../../redux/slices/postsSlice'
import { followandunfollow, getFeedData } from '../../redux/slices/feedSlice'
import { showToast } from '../../redux/slices/appConfigureSlice'
import { TOAST_SUCCESS } from '../../App'

function Profile() {
    const navigate=useNavigate();
    const params=useParams();
    const dispatch=useDispatch();
    const userProfile=useSelector(state=>state.postReducer.userProfile);
    const myProfile=useSelector(state=>state.appConfigReducer.myProfile);
    const feedData=useSelector(state=>state.FeedReducer.feedData);
    const [isMyProfile,setIsMyProfile]=useState(false);
    const[isFollwing,setIsFollowing]=useState(false);

    useEffect(()=>{
        dispatch(getFeedData());
    },[dispatch])
    
    useEffect(()=>{
        dispatch(getUserProfile({
            userId:params.userId
        }))
        setIsMyProfile(myProfile?._id===params.userId);
        if(feedData.following?.find(item =>item._id===params.userId)){
            setIsFollowing(true);
        }
        else{
            setIsFollowing(false);
        }
    },[myProfile,params.userId,feedData,dispatch])

    function handleFollow(){
        dispatch(followandunfollow({
            userIdToFollow:params.userId,
        }));
        dispatch(showToast({
            type:TOAST_SUCCESS,
            message:"followed/unfollowed"
          }))
    }
    

  return (
    <div className='profile'>
        <div className="container">
            <div className="left-part">
                {
                    isMyProfile && 
                    <CreatePost />
                }
                {
                    userProfile?.posts?.map(post => <Post key={post._id} post={post}/>)
                }
                
            </div>
            <div className="right-part">
                <div className="profile-card">
                    <img className='user-img' src={userProfile?.avatar?.url || userImg} alt="" />
                    <h3 className='user-name'>{userProfile?.name}</h3>
                    <p className='bio'>{userProfile?.bio}</p>
                    <div className="follower-info">
                        <h4>{userProfile?.posts?.length} posts</h4>
                        <h4>{userProfile?.followers?.length} followers</h4>
                        <h4>{userProfile?.following?.length} following</h4>
                    </div>
                    {
                        !isMyProfile && 
                        <button className={isFollwing?'unfollow btn-primary':'follow btn-primary'} onClick={handleFollow}>{isFollwing?'unfollow':'follow'}</button>
                    }
                    {
                        isMyProfile &&
                        <button  className='update-profile btn-secondary' onClick={()=>{navigate('/updateprofile')}}>edit profile</button>
                    }
                    
                    
                </div>
            </div>
        </div>
    </div>
  )
}

export default Profile