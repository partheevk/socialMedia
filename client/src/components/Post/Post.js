import React from 'react'
import Avatar from '../avatar/Avatar'
import './Post.scss'

import {AiOutlineHeart,AiFillHeart} from 'react-icons/ai' 
import { useDispatch } from 'react-redux'
import { likeandunlikepost } from '../../redux/slices/postsSlice'
import { useNavigate } from 'react-router-dom'
import { showToast } from '../../redux/slices/appConfigureSlice'
import { TOAST_SUCCESS } from '../../App'

function Post({post}) {
  const dispatch=useDispatch();
  const navigate=useNavigate();
  function handleLike(){
    
    dispatch(likeandunlikepost({
      postId:post._id
    }));
    dispatch(showToast({
      type:TOAST_SUCCESS,
      message:"liked or unliked"
    }))

  }
  return (
    <div className='post'>
        <div className="heading" >
            <div className='hov' onClick={()=>navigate(`/profile/${post?.owner?._id}`)}>
            <Avatar src={post?.owner?.avatar?.url} />
            </div>
            <h4 className='hov' onClick={()=>navigate(`/profile/${post?.owner?._id}`)}>{post?.owner?.name}</h4>
        </div>
        <div className="content">
            <img src={post?.image?.url} alt="error" />
        </div>
        <div className="footer">
            <div className="like" onClick={handleLike}>
                
                {post?.isLiked?<AiFillHeart className='icon' style={{color:'red'}} />:<AiOutlineHeart className='icon' />}
               
               <h4>{`${post?.likesCount} likes`}</h4>
            </div>
            
            <p className='caption'>{post?.caption}</p>
            <h6 className='time'>{post?.timeAgo}</h6>
            
        </div>
    </div>
  )
}

export default Post