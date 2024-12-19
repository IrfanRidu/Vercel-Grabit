import React from 'react'
import { useSelector } from 'react-redux'
import isAdmin from '../utils/isAdmin'
import Home from '../pages/Home'
// import { useNavigate } from 'react-router-dom'

const AdminPermision = ({children}) => {
    const user = useSelector(state => state.user)
    // const navigate =useNavigate()


  return (
    <>
        {
            isAdmin(user.role) ?  children : <Home/>
        }
    </>
  )
}

export default AdminPermision