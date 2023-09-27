import React from 'react'
import { KEY_ACCESS_TOKEN, getItem } from '../utils/localStorage'
import { Navigate, Outlet } from 'react-router-dom';

function RequireUser() {
    const user=getItem(KEY_ACCESS_TOKEN);
  return (
    user ? <Outlet /> : <Navigate to="/signup" />
  )
}

export default RequireUser