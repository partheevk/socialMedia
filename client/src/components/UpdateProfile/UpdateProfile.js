import React, { useEffect, useState } from 'react'
import {  showToast, updateMyProfile } from '../../redux/slices/appConfigureSlice';
import './UpdateProfile.scss'
import { useDispatch, useSelector } from 'react-redux';
import dummyimg from '../../assests/user.png'
import { axiosClient } from '../../utils/axiosClient';
import { TOAST_SUCCESS } from '../../App';
import { KEY_ACCESS_TOKEN, removeItem } from '../../utils/localStorage';

function UpdateProfile() {
  const myProfile=useSelector(state => state.appConfigReducer.myProfile);
  const [name,setName]=useState('');
  const [bio,setBio]=useState('');
  const [userImg,setimg]=useState('');
  const dispatch=useDispatch();
  

  useEffect(() => {
    setName(myProfile?.name || '');
    setBio(myProfile?.bio || '');
    setimg(myProfile?.avatar?.url);
  }, [myProfile]);
  
  function handleImgChange(e){
        
        const file=e.target.files[0];
        const fileReader=new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload=()=>{
            if(fileReader.readyState === fileReader.DONE){
                setimg(fileReader.result);
            }
        }
  }
  function handleSubmit(e){
    e.preventDefault();
    
    dispatch(updateMyProfile({
        name,
        bio,
        userImg
    }));
    dispatch(showToast({
        type:TOAST_SUCCESS,
        message:"posted successfully"
      }))
  }

  async function handleDelete(){
        try {
            await axiosClient.delete('/user/');
            removeItem(KEY_ACCESS_TOKEN);
            
            dispatch(showToast({
                type:TOAST_SUCCESS,
                message:"user deleted successfully"
              }))
            
        } catch (error) {
            
        }
        

  }

  return (
    <div className='updateProfile'>
        <div className="container">
            <div className="left-part">
                <div className="input-user-img">
                    <label htmlFor="inputImg" className='labelImg'>
                        <img src={userImg?userImg:dummyimg} alt={name} />
                    </label>
                    <input className='inputImg' id='inputImg' type="file" accept='image/*' onChange={handleImgChange} />
                </div>
            </div>
            <div className="right-part">
                <form onSubmit={handleSubmit}>
                    <input value={name} type="text" placeholder=' your name' onChange={(e)=>setName(e.target.value)} />
                    <input value={bio} type="text" placeholder='your bio' onChange={(e)=>setBio(e.target.value)} />

                    <input type='submit' className='btn-primary' onClick={handleSubmit}/>
                </form>
                <button className='delete-account btn-primary' onClick={handleDelete}>delete account</button>
            </div>
        </div>
    </div>
  )
}

export default UpdateProfile