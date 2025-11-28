import React from 'react'
import { getInitials } from '../../utils/helper'

const ProfileInfo = ({userInfo, onLogout}) => {
  const initials = getInitials(userInfo?.fullName);
  
  return (
    <div className='flex items-center gap-5'>
        <div className='w-12 h-12 bg-slate-100 text-slate-950 rounded-full flex items-center justify-center text-xl font-medium'>
          {initials || "U"}
        </div>
        <div>
            <p className='text-sm font-medium'>{userInfo?.fullName || "User"}</p>
            <button className='text-sm text-left font-medium text-slate-850 underline px-4 rounded-md hover:text-slate-700 cursor-pointer' onClick={onLogout}>Logout</button>
        </div>
    </div>
  )
}

export default ProfileInfo