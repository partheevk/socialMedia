import React, { useState } from 'react'
import './Login.scss'
import { Link, useNavigate } from 'react-router-dom'
import  {axiosClient} from '../../utils/axiosClient';
import { KEY_ACCESS_TOKEN, setItem } from '../../utils/localStorage';


function Login() {

    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const navigate=useNavigate();

    async function handleSubmit(e){
        e.preventDefault();
        try {
          const response=await axiosClient.post('/auth/login',{
            email,
            password
        });
        
        setItem(KEY_ACCESS_TOKEN,response.result.accessToken);
        navigate('/')
        

        } catch (eror) {
          
        }
        
    }

  return (
    <div className="Login">
      <div className="login-box">
        <h2 className="heading">Login</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input type="email" className="email" id="email" onChange={(e)=>setEmail(e.target.value)} />

          <label htmlFor="password">password</label>
          <input type="password" className="password" id="password" onChange={(e)=>setPassword(e.target.value)} />
          <button className='submit'>submit</button>
        </form>
        <p className='subHeading'>wanna sign up? <Link to="/signup">sign up</Link> </p>
      </div>
    </div>
  )
}

export default Login