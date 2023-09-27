import React from 'react'
import { KEY_ACCESS_TOKEN, getItem } from '../utils/localStorage'
import { Navigate, Outlet } from 'react-router-dom'

function OnlyIfNotLogged() {
    const user=getItem(KEY_ACCESS_TOKEN)
  return (
    user ? <Navigate to="/"/>:<Outlet />
  )
}

export default OnlyIfNotLogged