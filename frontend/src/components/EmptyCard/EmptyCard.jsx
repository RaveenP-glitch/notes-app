import React from 'react'

const EmptyCard = ({ imgSrc, message }) => {
  return (
    <div className="flex flex-col items-center justify-center mt-20">
        <img src={imgSrc} alt="Empty" width={100} height={100}/>
        <p className="text-lg mt-10 text-slate-500">{message}</p>
    </div>
  )
}

export default EmptyCard