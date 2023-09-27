import React, { useState } from 'react'
import './Signup.scss'
import { Link, useNavigate } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient';
import { KEY_ACCESS_TOKEN, setItem } from '../../utils/localStorage';

function Signup() {

  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const navigate=useNavigate();

  async function handleSubmit(e){
      e.preventDefault();
      try {
        const result=await axiosClient.post('/auth/signup',{
          name,
          email,
          password
      });

      
      navigate('/login')

      } catch (e) {
        
      }
      
      
  }

  return (
    <div className="Signup">
      <div className="signup-box">
        <h2 className="heading">Signup</h2>
        <form action="" onSubmit={handleSubmit}>
        <label htmlFor="name">name</label>
          <input type="name" className="name" id="name" onChange={(e)=>setName(e.target.value)} />

          <label htmlFor="email">Email</label>
          <input type="email" className="email" id="email" onChange={(e)=>setEmail(e.target.value)} />

          <label htmlFor="password">password</label>
          <input type="password" className="password" id="password" onChange={(e)=>setPassword(e.target.value)} />
          <button className='submit'>submit</button>
        </form>
        <p className='subHeading'>Already have a account? <Link to="/login">login</Link> </p>
      </div>
    </div>
  )
}

export default Signup