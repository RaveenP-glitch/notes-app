import React from 'react'
import { getInitials } from '../../utils/helper'

const ProfileInfo = () => {
  return (
    <div className='flex items-center gap-5'>
        <div className='w-12 h-12 bg-slate-100 text-slate-950 rounded-full flex items-center justify-center text-xl font-medium'>{getInitials("John William")}</div>
        <div>
            <p className='text-sm font-medium'>John William</p>
            <button className='text-sm text-left font-medium text-slate-850 underline px-4 rounded-md'>Logout</button>
        </div>
    </div>

  )
}

export default ProfileInfo